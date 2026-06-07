import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import {useAuth} from '../../context/AuthContext';
import AccountSignupPrompt from './AccountSignupPrompt';

const DISMISSED_KEY = 'fideta_account_prompt_dismissed_at';
const SESSION_SEEN_KEY = 'fideta_account_prompt_seen_session';
const PAGE_VIEW_KEY = 'fideta_account_prompt_page_views';
const DISMISS_COOLDOWN_DAYS = 14;

function isSuppressedPath(pathname) {
  return (
    pathname.startsWith('/connexion') ||
    pathname.startsWith('/compte') ||
    pathname.startsWith('/update-password') ||
    pathname.startsWith('/scan')
  );
}

function wasDismissedRecently() {
  if (typeof window === 'undefined') return true;

  const raw = window.localStorage.getItem(DISMISSED_KEY);
  if (!raw) return false;

  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp)) return false;

  const cooldownMs = DISMISS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp < cooldownMs;
}

export default function AccountEngagementPrompt() {
  const {isLoggedIn, loading} = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const openedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (loading || isLoggedIn) return undefined;
    if (isSuppressedPath(location.pathname)) return undefined;
    if (window.sessionStorage.getItem(SESSION_SEEN_KEY) === '1') return undefined;
    if (wasDismissedRecently()) return undefined;

    const currentViews = Number(window.sessionStorage.getItem(PAGE_VIEW_KEY) || '0');
    const nextViews = Number.isFinite(currentViews) ? currentViews + 1 : 1;
    window.sessionStorage.setItem(PAGE_VIEW_KEY, String(nextViews));

    function openPrompt() {
      if (openedRef.current) return;
      openedRef.current = true;
      window.sessionStorage.setItem(SESSION_SEEN_KEY, '1');
      setOpen(true);
    }

    let scrollTriggered = false;
    const delay = nextViews >= 2 ? 9000 : 28000;
    const timer = window.setTimeout(openPrompt, delay);

    function handleScroll() {
      if (scrollTriggered) return;

      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0) return;

      const progress = window.scrollY / documentHeight;
      if (progress >= 0.45 && nextViews >= 2) {
        scrollTriggered = true;
        window.clearTimeout(timer);
        openPrompt();
      }
    }

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, isLoggedIn, location.pathname]);

  function handleClose() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    }
    setOpen(false);
  }

  return (
    <AccountSignupPrompt
      open={open}
      variant="engagement"
      onClose={handleClose}
    />
  );
}
