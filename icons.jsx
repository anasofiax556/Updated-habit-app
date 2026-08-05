// Lightweight inline SVG icons drawn as outlines — feminine, simple, original.
const Stroke = ({children, size=22, stroke=1.8, color='currentColor'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const Icon = {
  // tab bar — bloom (flower), spark, ring (friends), face
  Bloom: (p)=> <Stroke {...p}><circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="6" rx="2.4" ry="3.4"/><ellipse cx="18" cy="12" rx="3.4" ry="2.4"/><ellipse cx="12" cy="18" rx="2.4" ry="3.4"/><ellipse cx="6" cy="12" rx="3.4" ry="2.4"/></Stroke>,
  Spark: (p)=> <Stroke {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="2.2"/></Stroke>,
  Ring: (p)=> <Stroke {...p}><circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 19c0-3 2.5-5 5-5s5 2 5 5M11 19c0-3 2.5-5 5-5s5 2 5 5"/></Stroke>,
  Face: (p)=> <Stroke {...p}><circle cx="12" cy="9" r="4"/><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/></Stroke>,
  // utility
  Plus: (p)=> <Stroke {...p}><path d="M12 5v14M5 12h14"/></Stroke>,
  Back: (p)=> <Stroke {...p}><path d="M15 6l-6 6 6 6"/></Stroke>,
  Forward: (p)=> <Stroke {...p}><path d="M9 6l6 6-6 6"/></Stroke>,
  X: (p)=> <Stroke {...p}><path d="M6 6l12 12M18 6L6 18"/></Stroke>,
  Check: (p)=> <Stroke {...p}><path d="M5 12l5 5 9-11"/></Stroke>,
  Search: (p)=> <Stroke {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-4-4"/></Stroke>,
  Flame: (p)=> <Stroke {...p}><path d="M12 3s4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-3s-1 5 3 5"/></Stroke>,
  Lock: (p)=> <Stroke {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/></Stroke>,
  Globe: (p)=> <Stroke {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></Stroke>,
  Clock: (p)=> <Stroke {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Stroke>,
  Calendar: (p)=> <Stroke {...p}><rect x="4" y="6" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 11h16"/></Stroke>,
  Settings: (p)=> <Stroke {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Stroke>,
  Share: (p)=> <Stroke {...p}><path d="M7 17l10-12M5 21h14"/><circle cx="17" cy="5" r="2"/></Stroke>,
  Heart: (p)=> <Stroke {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></Stroke>,
  Trophy: (p)=> <Stroke {...p}><path d="M7 4h10v5a5 5 0 1 1-10 0V4z"/><path d="M5 6H3v2a3 3 0 0 0 3 3M19 6h2v2a3 3 0 0 1-3 3M9 21h6M12 16v5"/></Stroke>,
  Users: (p)=> <Stroke {...p}><circle cx="9" cy="9" r="3.5"/><path d="M2.5 20c.5-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5"/><circle cx="17" cy="7.5" r="2.5"/><path d="M16 14c2.5.3 4.5 2.5 5 6"/></Stroke>,
  // category glyphs
  Run: (p)=> <Stroke {...p}><circle cx="15" cy="5" r="2"/><path d="M5 19l3-5 3 2 2 4M8 14l-2-4 4-2 3 3 3-1"/></Stroke>,
  Book: (p)=> <Stroke {...p}><path d="M4 5a2 2 0 0 1 2-2h6v17H6a2 2 0 0 1-2-2V5zM20 5a2 2 0 0 0-2-2h-6v17h6a2 2 0 0 0 2-2V5z"/></Stroke>,
  Phone: (p)=> <Stroke {...p}><rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/></Stroke>,
  Leaf: (p)=> <Stroke {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l8-8"/></Stroke>,
  Brush: (p)=> <Stroke {...p}><path d="M14 4l6 6-9 9-3 .5L8 16l9-9"/><path d="M4 20s2-1 4-1"/></Stroke>,
  Water: (p)=> <Stroke {...p}><path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/></Stroke>,
  Moon: (p)=> <Stroke {...p}><path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/></Stroke>,
  Note: (p)=> <Stroke {...p}><path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/></Stroke>,
  Money: (p)=> <Stroke {...p}><rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="12" cy="13" r="2.5"/></Stroke>,
};

window.Icon = Icon;
window.Stroke = Stroke;
