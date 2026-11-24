import React, { useMemo, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

function normalize(text) {
  return String(text ?? '').normalize('NFD').replace(/\p{M}/gu, '')
    .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function indexItems(items, type) {
  return (items || []).map(item => ({
    title: item.title,
    slug: item.slug,
    type,
    image: ['/img/default-product.jpg', '/img/principes/default-principe.jpg'].includes(item.image)
      ? null : item.image,
    name: normalize(item.title),
    aliases: normalize([item.id, item.synonyms || ''].join(' ')),
    description: normalize(item.synopsis),
  }));
}

function matchRank(item, query, words) {
  if (item.name === query) return 1;
  if (item.name.startsWith(query)) return 2;
  if (words.every(word => item.name.includes(word))) return 3;
  if (words.every(word => item.aliases.includes(word))) return 4;
  if (words.every(word => item.description.includes(word))) return 5;
  return 0;
}

export default function HomeSearch({ ingredients, products }) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const input = useRef(null);
  const panel = useRef(null);
  const history = useHistory();
  const searchUrl = useBaseUrl('/search');
  const allResults = searchUrl + '?' + new URLSearchParams({ q: value.trim() });
  const query = normalize(value);
  const visible = open && query.length >= 2;
  const index = useMemo(() => [
    ...indexItems(ingredients, 'Ingrédient'),
    ...indexItems(products, 'Produit'),
  ], [ingredients, products]);
  const matches = useMemo(() => {
    if (query.length < 2) return [];
    const words = query.split(' ');
    return index.map(item => ({ item, rank: matchRank(item, query, words) }))
      .filter(hit => hit.rank)
      .sort((a, b) => a.rank - b.rank || a.item.title.localeCompare(b.item.title, 'fr'))
      .slice(0, 5);
  }, [index, query]);

  function handleKeys(event) {
    if (event.key === 'Escape' && visible) {
      event.preventDefault();
      input.current.focus();
      setOpen(false);
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    if (query.length < 2) return;
    event.preventDefault();
    if (!visible) {
      setOpen(true);
      return;
    }
    const links = Array.from(panel.current.querySelectorAll('a'));
    const current = links.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') {
      links[(current + 1) % links.length].focus();
    } else if (current === 0) {
      input.current.focus();
    } else {
      links[current < 0 ? links.length - 1 : current - 1].focus();
    }
  }

  return (
    <div className={styles.wrapper} onKeyDown={handleKeys}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <form className={styles.homeSearch} action={searchUrl} role="search"
        onSubmit={event => {
          event.preventDefault();
          if (value.trim()) history.push(allResults);
        }}>
        <input ref={input} type="search" name="q" value={value} autoComplete="off"
          aria-label="Rechercher sur Fideta" aria-controls={visible ? 'home-search-results' : undefined}
          placeholder="Rechercher un produit, un ingrédient…" required
          onFocus={() => setOpen(true)}
          onChange={event => { setValue(event.target.value); setOpen(true); }} />
        <button type="submit" aria-label="Voir tous les résultats">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" />
          </svg>
        </button>
      </form>
      {visible && (
        <nav className={styles.panel} id="home-search-results" ref={panel} aria-label="Suggestions de fiches">
          {matches.map(({ item }) => (
            <Link key={item.slug} className={styles.result} to={item.slug}>
              <span className={styles.title}>{item.title}</span>
              <small>{item.type}</small>
              {item.image && (
                <img className={styles.thumbnail} src={item.image} alt="" width={32} height={32}
                  decoding="async" onError={event => { event.currentTarget.hidden = true; }} />
              )}
            </Link>
          ))}
          {!matches.length && <span className={styles.empty}>Aucune fiche suggérée.</span>}
          <Link className={styles.more} to={allResults}>Voir tous les résultats pour « {value.trim()} »</Link>
        </nav>
      )}
    </div>
  );
}
