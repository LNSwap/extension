import { useEffect, useState } from 'react';

import { BreakpointToken, token } from 'leaf-styles/tokens';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}

export function useViewportMinWidth(viewport: BreakpointToken) {
  return useMediaQuery(`(min-width: ${token(`breakpoints.${viewport}`)})`);
}
