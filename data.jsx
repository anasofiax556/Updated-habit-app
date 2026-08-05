// Categories + seeded challenge data + people.
const CATEGORIES = [
  { id:'fitness',  label:'movement',     hint:'fitness, walks, yoga',     icon:'Run',   color:'#F4B89C' }, // peach
  { id:'reading',  label:'reading',      hint:'books, articles, study',   icon:'Book',  color:'#C9B6E8' }, // lilac
  { id:'detox',    label:'screen detox', hint:'less scroll, more life',    icon:'Phone', color:'#A6CFE6' }, // sky
  { id:'eating',   label:'eat well',     hint:'cooking, hydration, no sugar', icon:'Leaf', color:'#7FB28A' }, // green
  { id:'art',      label:'art',          hint:'draw, paint, write daily',  icon:'Brush', color:'#F8B3D2' }, // pink
  { id:'sleep',    label:'sleep',        hint:'early nights, no caffeine', icon:'Moon',  color:'#C9B6E8' },
  { id:'mind',     label:'mindfulness',  hint:'journal, meditate, breathe',icon:'Note',  color:'#F5D364' },
  { id:'money',    label:'money',        hint:'no-spend, save, track',     icon:'Money', color:'#7FB28A' },
];

const DURATIONS = [
  { days:7,  label:'7 days',  sub:'a starter sprint' },
  { days:14, label:'14 days', sub:'two-week tune-up' },
  { days:21, label:'21 days', sub:'habit forming' },
  { days:30, label:'30 days', sub:'a full month' },
  { days:60, label:'60 days', sub:'going deeper' },
  { days:90, label:'90 days', sub:'transformation' },
];

const PEOPLE = [
  { id:'me',     name:'You',      avatar:'#EE5BA0', initial:'Y' },
  { id:'mira',   name:'Mira',     avatar:'#F4B89C', initial:'M' },
  { id:'sof',    name:'Sofia',    avatar:'#C9B6E8', initial:'S' },
  { id:'iz',     name:'Isabella', avatar:'#A6CFE6', initial:'I' },
  { id:'jun',    name:'June',     avatar:'#7FB28A', initial:'J' },
  { id:'noor',   name:'Noor',     avatar:'#F5D364', initial:'N' },
  { id:'tay',    name:'Taylor',   avatar:'#F8B3D2', initial:'T' },
  { id:'rk',     name:'Rumi K.',  avatar:'#EE5BA0', initial:'R' },
];

// Seeded challenges shown across the app.
const SEED_CHALLENGES = [
  {
    id:'c1', cat:'detox', title:'No phone after 9pm', tagline:'Reclaim your evenings',
    days:21, dayIn:6, members:['me','mira','sof','iz','jun'], host:'mira', emoji:'🌙',
    rule:'Phone in another room from 9pm — 7am. Tick in before bed.',
    streak:6, totalDone:5, ofMembers:5, vibe:'cozy',
  },
  {
    id:'c2', cat:'fitness', title:'Walk 8k steps', tagline:'Outside, every day',
    days:30, dayIn:12, members:['me','noor','tay','rk'], host:'noor', emoji:'🌿',
    rule:'8,000 steps before sundown. Treadmill counts on rainy days.',
    streak:11, totalDone:3, ofMembers:4, vibe:'soft',
  },
  {
    id:'c3', cat:'art', title:'Draw something tiny', tagline:'One sketch a day',
    days:30, dayIn:4, members:['me','sof','jun','tay','iz','rk'], host:'sof', emoji:'🌸',
    rule:'A doodle, a study, a scribble. Photo proof in chat.',
    streak:4, totalDone:4, ofMembers:6, vibe:'bright',
  },
  {
    id:'c4', cat:'reading', title:'20 pages before bed', tagline:'A slow book club',
    days:14, dayIn:0, members:['mira','iz'], host:'mira', emoji:'📖',
    rule:'Twenty pages of anything that isn\'t a screen.',
    streak:0, totalDone:0, ofMembers:2, vibe:'soft',
  },
  {
    id:'c5', cat:'eating', title:'No-sugar september', tagline:'30 sweet-free days',
    days:30, dayIn:0, members:['noor','rk','tay'], host:'noor', emoji:'🍋',
    rule:'No added sugar — fruit & honey are fine.',
    streak:0, totalDone:0, ofMembers:3, vibe:'bright',
  },
  {
    id:'c6', cat:'mind', title:'Morning pages', tagline:'Three pages, every am',
    days:21, dayIn:0, members:['sof','jun'], host:'sof', emoji:'✿',
    rule:'Three pages of stream-of-consciousness before anything else.',
    streak:0, totalDone:0, ofMembers:2, vibe:'soft',
  },
];

// Featured / community discover lane
const DISCOVER_FEATURED = [
  { id:'f1', cat:'fitness', title:'Run a 5k by August', host:'Coach Aya',  members:412, days:60, color:'#F4B89C' },
  { id:'f2', cat:'reading', title:'12 books in 12 weeks', host:'Page Club', members:1208, days:84, color:'#C9B6E8' },
  { id:'f3', cat:'detox',   title:'No-scroll weekends', host:'Quiet hours', members:830, days:30, color:'#A6CFE6' },
  { id:'f4', cat:'art',     title:'Daily watercolor',   host:'Studio Bloom', members:265, days:30, color:'#F8B3D2' },
];

function catById(id){ return CATEGORIES.find(c=>c.id===id) || CATEGORIES[0]; }
function personById(id){ return PEOPLE.find(p=>p.id===id) || PEOPLE[0]; }

Object.assign(window, {
  CATEGORIES, DURATIONS, PEOPLE, SEED_CHALLENGES, DISCOVER_FEATURED,
  catById, personById,
});
