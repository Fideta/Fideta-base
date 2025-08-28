import React, {useEffect, useRef, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import {usePluginData} from '@docusaurus/useGlobalData';

/**
 * Scanner plein écran style "Yuka"
 * - DÉMARRAGE AUTO du scan (sans clic)
 * - EAN -> fiche via produits-frontmatter (eanToPermalink)
 * - Fallback Pagefind puis /search
 * - Feedback universel: vibration (si dispo) + bip court (AudioContext)
 *   (le bip ne sera audible qu'après une interaction utilisateur sur iOS)
 *
 * Dépendances: `@zxing/browser @zxing/library`
 * Route: /scan
 */

function ScanInner() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const readerRef = useRef(null);
  const zxbRef = useRef(null); // module @zxing/browser
  const audioRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false); // lib chargée + devices listés
  const autoStartedRef = useRef(false);

  // Index EAN -> permalink depuis le plugin produits-frontmatter
  let eanIndex = {};
  try {
    const pluginData = usePluginData('produits-frontmatter');
    eanIndex = pluginData?.eanToPermalink || {};
  } catch {}

  const isURL = (txt) => /^https?:\/\/\S+$/i.test(String(txt).trim());
  const isEAN = (txt) => /^\d{8,14}$/.test(String(txt).trim());

  // ====== Haptique / Audio ======
  function primeAudio() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioRef.current = audioRef.current || new Ctx();
      audioRef.current.resume?.();
    } catch {}
  }

  function hapticOrBeep() {
    // Vibration (Android & co.)
    try { navigator.vibrate?.(150); } catch {}

    // Beep court (fallback universel). Sur iOS, audible seulement après un geste utilisateur.
    try {
      const ctx = audioRef.current;
      if (!ctx || (ctx.state && ctx.state !== 'running')) return; // ne tente pas si pas "primé"
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880;
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.start(t); osc.stop(t + 0.13);
    } catch {}
  }

  // ====== Fallback recherche via Pagefind ======
  async function searchWithPagefind(q) {
    try {
      const pf = window.pagefind;
      if (!pf || typeof pf.search !== 'function') return null;
      const res = await pf.search(String(q));
      for (const r of res.results || []) {
        const d = await r.data();
        if (d.url && d.url.includes('/produits/')) return d.url;
      }
    } catch {}
    return null;
  }

  async function handleDecoded(text) {
    const val = String(text).trim();

    if (isURL(val)) {
      hapticOrBeep();
      window.location.href = val;
      return;
    }
    if (isEAN(val)) {
      let target = eanIndex[val];
      if (!target) target = await searchWithPagefind(val);
      hapticOrBeep();
      window.location.href = target || `/search?q=${encodeURIComponent(val)}`;
      return;
    }
    hapticOrBeep();
    window.location.href = `/search?q=${encodeURIComponent(val)}`;
  }

  // ====== Chargement dynamique de ZXing + devices ======
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const zxb = await import('@zxing/browser');
        const zxl = await import('@zxing/library');
        if (!mounted) return;
        zxbRef.current = { zxb, zxl };

        // Pré-autorisation pour obtenir les labels et caméras "rear"
        try {
          const tmp = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
          tmp.getTracks().forEach(t => t.stop());
        } catch {}

        const list = await zxb.BrowserMultiFormatReader.listVideoInputDevices();
        if (!mounted) return;
        setDevices(list);
        const back = list.find(d => /back|rear|arrière/i.test(d.label));
        setDeviceId((back || list[0])?.deviceId || '');
        setReady(true);
      } catch (e) {
        console.error(e);
        setError('Impossible de charger le module de scan.');
      }
    })();

    return () => {
      mounted = false;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== Démarrage AUTO quand prêt ======
  useEffect(() => {
    if (ready && deviceId && !scanning && !autoStartedRef.current) {
      autoStartedRef.current = true;
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, deviceId]);

  // ====== Démarrage / arrêt ======
  async function start() {
    setError('');
    if (!deviceId) {
      setError('Aucune caméra détectée.');
      return;
    }
    try {
      setScanning(true);

      const { zxb, zxl } = zxbRef.current || {};
      if (!zxb || !zxl) throw new Error('ZXing non chargé');
      const {BrowserMultiFormatReader} = zxb;
      const {BarcodeFormat, DecodeHintType} = zxl;

      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
      ]);
      readerRef.current = new BrowserMultiFormatReader(hints);

      await readerRef.current.decodeFromVideoDevice(
        deviceId || undefined,
        videoRef.current,
        (res, err, controls) => {
          if (res) {
            controls?.stop?.();
            stop();
            handleDecoded(res.getText());
          }
          if (err && err.name === 'NotFoundException') return;
        }
      );
      streamRef.current = videoRef.current?.srcObject;
    } catch (e) {
      console.error(e);
      setScanning(false);
      setError(e?.message || 'Erreur pendant le scan.');
    }
  }

  function stop() {
    try { readerRef.current?.reset(); } catch {}
    const stream = streamRef.current || videoRef.current?.srcObject;
    if (stream) {
      try { stream.getTracks().forEach(t => t.stop()); } catch {}
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setScanning(false);
  }

  async function switchCamera() {
    if (!devices.length) return;
    const idx = devices.findIndex(d => d.deviceId === deviceId);
    const next = devices[(idx + 1) % devices.length];
    setDeviceId(next.deviceId);
    if (scanning) {
      stop();
      start();
    }
  }

  return (
    <>
      <Head>
        <title>Scanner | Fideta</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      {/* Cache le FAB global sur cette page */}
      <style>{`.navbar .fab-scan { display: none !important; }`}</style>

      <div className="scan-fullscreen" onClick={primeAudio}>
        <video
          ref={videoRef}
          className="scan-video"
          muted
          autoPlay
          playsInline
        />

        {/* Cadre de visée + masque */}
        <div className="scan-frame" aria-hidden />

        {/* Bandeau d'actions */}
        <div className="scan-ui">
          {!scanning ? (
            <div className="scan-hint">Autorise l’accès à la caméra si demandé…</div>
          ) : (
            <div className="scan-actions">
              {devices.length > 1 && (
                <button className="scan-icon" onClick={switchCamera} aria-label="Changer de caméra">🔁</button>
              )}
              <button className="scan-icon" onClick={stop} aria-label="Arrêter le scan">✕</button>
            </div>
          )}
          {error && <p className="scan-error">{error}</p>}
        </div>
      </div>

      <style>{`
        /* Fullscreen layout */
        .scan-fullscreen{ position: fixed; inset: 0; background:#000; z-index: 9999; }
        .scan-video{ position:absolute; inset:0; width:100vw; height:100vh; object-fit:cover; }

        /* Cadre central avec masque autour (façon Yuka) */
        .scan-frame{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
          width:min(84vw, 560px); height:min(36vh, 300px); border-radius:16px; border:2px solid rgba(255,255,255,.95);
          box-shadow: 0 0 0 9999px rgba(0,0,0,.45); }

        /* UI overlay */
        .scan-ui{ position:absolute; left:0; right:0; bottom: clamp(16px, 4vh, 48px);
          display:flex; flex-direction:column; align-items:center; gap:12px; padding: 0 16px; color:#fff; }

        .scan-hint{ background:rgba(0,0,0,.55); color:#fff; border:1px solid rgba(255,255,255,.4);
          padding:12px 16px; border-radius:12px; font-weight:600; }

        .scan-actions{ display:flex; gap:12px; }
        .scan-icon{ width:44px; height:44px; border-radius:999px; border:1px solid rgba(255,255,255,.4);
          background:rgba(0,0,0,.55); color:#fff; font-size:18px; display:grid; place-items:center; }

        .scan-error{ color:#ffb4b4; text-shadow:0 1px 2px rgba(0,0,0,.4); }

        @media (min-width: 997px){ .scan-fullscreen{ max-width: 480px; margin: 40px auto; position: relative; height: 85vh; border-radius: 16px; overflow:hidden; } }
      `}</style>
    </>
  );
}

export default function ScanPage() {
  return (
    <BrowserOnly fallback={<p>Chargement du module de scan…</p>}>
      {() => <ScanInner />}
    </BrowserOnly>
  );
}
