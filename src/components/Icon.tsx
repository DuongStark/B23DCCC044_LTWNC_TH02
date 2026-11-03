type IconName = 'pulse' | 'search' | 'play' | 'pause' | 'plus' | 'sun' | 'moon' | 'arrow' | 'clock' | 'back' | 'next' | 'trash' | 'list';
const paths: Record<IconName, string> = {
  pulse: 'M2 12h5l3-8 5 16 3-11 2 3h2',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  play: 'M8 5l12 7-12 7V5z',
  pause: 'M8 5v14 M16 5v14',
  plus: 'M12 5v14 M5 12h14',
  sun: 'M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10z',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  clock: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  back: 'M5 5v14 M19 5l-11 7 11 7V5z',
  next: 'M19 5v14 M5 5l11 7-11 7V5z',
  trash: 'M3 6h18 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
  list: 'M9 6h12 M9 12h12 M9 18h12 M3 6h1 M3 12h1 M3 18h1',
};
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
