// Three screens do not need a routing library. The current screen lives in
// the URL hash so the browser's back button and page reloads work.

import { useCallback, useEffect, useState } from 'react';

export const ROUTES = ['home', 'household', 'plan'];

export function parseHash(hash) {
  const name = String(hash || '').replace(/^#\/?/, '');
  return ROUTES.includes(name) ? name : 'home';
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next) => {
    window.location.hash = `/${next}`;
    window.scrollTo(0, 0);
  }, []);

  return [route, navigate];
}
