// Shared screen components: Discover, Mine, Connect, Profile, ChallengeDetail.
const { useState, useMemo, useEffect } = React;

// -------- shared atoms --------

const Avatar = ({ id, size=28, ring }) => {
  const p = personById(id);
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background:p.avatar, color:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontWeight:700, fontSize: size*0.42,
      boxShadow: ring ? `0 0 0 2px ${ring}, 0 0 0 4px var(--bg)` : 'none',
      flex:'none',
    }}>{p.initial}</div>
  );
};

const AvatarStack = ({ ids, max=4, size=24 }) => (
  <div style={{ display:'flex' }}>
    {ids.slice(0,max).map((id,i)=>(
      <div key={id} style={{ marginLeft: i===0 ? 0 : -8 }}>
        <Avatar id={id} size={size} ring="#fff"/>
      </div>
    ))}
    {ids.length>max && (
      <div style={{
        marginLeft:-8, width:size, height:size, borderRadius:'50%',
        background:'#fff', border:'2px solid var(--bg)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:11, fontWeight:700, color:'var(--ink-2)',
      }}>+{ids.length-max}</div>
    )}
  </div>
);

const Pill = ({ children, active, onClick, color }) => (
  <button onClick={onClick} style={{
    padding:'8px 16px', borderRadius:999,
    background: active ? (color||'var(--pink)') : 'var(--pink-4)',
    color: active ? '#fff' : 'var(--ink)',
    fontWeight:600, fontSize:13, transition:'all .15s',
    whiteSpace:'nowrap',
  }}>{children}</button>
);

const CategoryBadge = ({ catId, size=40 }) => {
  const c = catById(catId);
  const G = Icon[c.icon];
  return (
    <div style={{
      width:size, height:size, borderRadius:size*0.35,
      background:c.color+'55', color:c.color,
      display:'flex', alignItems:'center', justifyContent:'center',
      flex:'none',
    }}>
      <G size={size*0.55} stroke={2} color={c.color}/>
    </div>
  );
};

// big floating + button (used on most screens)
const FloatingFab = ({ onClick, label='start one' }) => (
  <button onClick={onClick} style={{
    position:'absolute', right:18, bottom:96,
    background:'var(--pink)', color:'#fff',
    height:56, borderRadius:28, padding:'0 22px',
    display:'flex', alignItems:'center', gap:8,
    fontWeight:700, fontSize:15,
    boxShadow:'0 12px 30px -8px rgba(238,91,160,.55), 0 0 0 6px rgba(238,91,160,.10)',
    zIndex:5,
  }}>
    <Icon.Plus size={20} stroke={2.5}/> {label}
  </button>
);

// -------- TabBar --------
const TabBar = ({ active, onChange }) => {
  const tabs = [
    { id:'discover', label:'discover', icon:'Bloom' },
    { id:'mine',     label:'mine',     icon:'Spark' },
    { id:'connect',  label:'connect',  icon:'Ring'  },
    { id:'profile',  label:'profile',  icon:'Face'  },
  ];
  return (
    <div style={{
      position:'absolute', left:0, right:0, bottom:0,
      paddingBottom:30, paddingTop:10,
      background:'var(--bg)',
      borderTop:'1px solid var(--line)',
      display:'flex', justifyContent:'space-around',
      zIndex:4,
    }}>
      {tabs.map(t=>{
        const G = Icon[t.icon];
        const on = active===t.id;
        return (
          <button key={t.id} onClick={()=>onChange(t.id)} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:4,
            color: on ? 'var(--pink)' : 'var(--ink-2)',
            fontWeight: on ? 700 : 500, fontSize:11, letterSpacing:.2,
          }}>
            <G size={24} stroke={on ? 2.4 : 1.8}/>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// =========================================================
// DISCOVER SCREEN
// =========================================================
const Discover = ({ onOpenChallenge, onCreate, joined, onJoin }) => {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(()=>{
    if(filter==='all') return DISCOVER_FEATURED;
    return DISCOVER_FEATURED.filter(c=>c.cat===filter);
  },[filter]);

  return (
    <div style={{ paddingBottom:120 }}>
      {/* Header */}
      <div style={{ padding:'18px 22px 12px' }}>
        <div style={{ fontSize:14, color:'var(--ink-2)', fontWeight:500 }}>tuesday · may 27</div>
        <h1 style={{
          fontSize:32, lineHeight:1.05, margin:'4px 0 0',
          fontWeight:800, letterSpacing:-.5,
        }}>what are we<br/><span style={{
          background:'linear-gradient(90deg, var(--pink) 0%, #F8B3D2 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          fontStyle:'italic',
        }}>blooming</span> into?</h1>
      </div>

      {/* Search */}
      <div style={{ padding:'8px 22px 14px' }}>
        <div style={{
          background:'#fff', borderRadius:16, padding:'12px 16px',
          display:'flex', alignItems:'center', gap:10,
          border:'1px solid var(--line)',
        }}>
          <Icon.Search size={18} color="var(--muted)"/>
          <span style={{ color:'var(--muted)', fontSize:14 }}>find a challenge…</span>
        </div>
      </div>

      {/* Hero CTA — your active or a "create" tile */}
      <ActivePeek onOpen={onOpenChallenge} onCreate={onCreate} joined={joined}/>

      {/* Category strip */}
      <div style={{ padding:'8px 22px 0' }}>
        <SectionHead title="browse" sub="pick your lane"/>
      </div>
      <div style={{
        display:'flex', gap:10, padding:'12px 22px 4px',
        overflowX:'auto', scrollbarWidth:'none',
      }} className="scroll">
        <Pill active={filter==='all'} onClick={()=>setFilter('all')}>all</Pill>
        {CATEGORIES.map(c=>(
          <Pill key={c.id} active={filter===c.id} onClick={()=>setFilter(c.id)} color={c.color}>
            {c.label}
          </Pill>
        ))}
      </div>

      {/* Category cards grid */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:12, padding:'14px 22px',
      }}>
        {CATEGORIES.slice(0,6).filter(c=>filter==='all'||c.id===filter).map(c=>{
          const G = Icon[c.icon];
          return (
            <button key={c.id} onClick={()=>setFilter(c.id)} style={{
              background:c.color+'30', borderRadius:20, padding:'16px 14px',
              textAlign:'left', height:108, position:'relative', overflow:'hidden',
            }}>
              <div style={{
                position:'absolute', right:-8, bottom:-8,
                width:64, height:64, borderRadius:32,
                background:c.color+'66',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <G size={30} color={c.color} stroke={2}/>
              </div>
              <div style={{ fontWeight:700, fontSize:15 }}>{c.label}</div>
              <div style={{ fontSize:11.5, color:'var(--ink-2)', marginTop:2, maxWidth:'70%' }}>{c.hint}</div>
            </button>
          );
        })}
      </div>

      {/* Featured */}
      <div style={{ padding:'14px 22px 0' }}>
        <SectionHead title="featured" sub="trending this week"/>
      </div>
      <div style={{ padding:'12px 22px 8px', display:'grid', gap:12 }}>
        {filtered.map(f=>(
          <FeaturedRow key={f.id} f={f} joined={joined.includes(f.id)} onJoin={()=>onJoin(f.id)} onOpen={()=>onOpenChallenge(f.id, 'featured')}/>
        ))}
      </div>
    </div>
  );
};

const SectionHead = ({ title, sub, right }) => (
  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
    <div>
      <div style={{ fontSize:20, fontWeight:800, letterSpacing:-.3 }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:'var(--ink-2)' }}>{sub}</div>}
    </div>
    {right}
  </div>
);

const ActivePeek = ({ onOpen, onCreate, joined }) => {
  const active = SEED_CHALLENGES.filter(c=>c.members.includes('me')).slice(0,2);
  if(active.length===0){
    return (
      <div style={{ padding:'4px 22px 12px' }}>
        <div style={{
          background:'linear-gradient(135deg, var(--pink-3), var(--pink-4))',
          padding:'18px 18px', borderRadius:22,
        }}>
          <div style={{ fontWeight:700, fontSize:17 }}>no active challenges yet</div>
          <div style={{ fontSize:13, color:'var(--ink-2)', marginTop:2 }}>start one in 60 seconds — solo or with friends.</div>
          <button onClick={onCreate} style={{
            marginTop:12, background:'var(--pink)', color:'#fff',
            padding:'10px 18px', borderRadius:999, fontWeight:700, fontSize:13.5,
          }}>create challenge</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding:'4px 22px 12px' }}>
      <div style={{
        background:'linear-gradient(135deg, #FFEEF6 0%, #F4D9E6 100%)',
        padding:'16px 18px', borderRadius:22,
      }}>
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'baseline',
        }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--pink)', letterSpacing:.6 }}>STILL GOING</div>
          <button onClick={()=>onOpen(null,'mine')} style={{
            fontSize:12, color:'var(--ink-2)', fontWeight:600,
          }}>see all →</button>
        </div>
        <div style={{ display:'grid', gap:10, marginTop:10 }}>
          {active.map(c=>(
            <button key={c.id} onClick={()=>onOpen(c.id)} style={{
              display:'flex', alignItems:'center', gap:12,
              background:'#fff', padding:'10px 12px', borderRadius:16, textAlign:'left',
              width:'100%',
            }}>
              <CategoryBadge catId={c.cat} size={38}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
                  <div style={{
                    flex:1, height:5, background:'var(--pink-4)', borderRadius:3, overflow:'hidden',
                  }}>
                    <div style={{
                      width:`${(c.dayIn/c.days)*100}%`, height:'100%',
                      background:'var(--pink)', borderRadius:3,
                    }}/>
                  </div>
                  <div style={{ fontSize:11, color:'var(--ink-2)', fontWeight:600 }}>day {c.dayIn}/{c.days}</div>
                </div>
              </div>
              <Icon.Flame size={16} color="var(--pink)"/>
              <span style={{ fontWeight:800, fontSize:14, color:'var(--pink)' }}>{c.streak}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedRow = ({ f, joined, onJoin, onOpen }) => {
  const c = catById(f.cat);
  const G = Icon[c.icon];
  return (
    <div style={{
      background:'#fff', borderRadius:20, padding:'14px 14px',
      border:'1px solid var(--line)',
      display:'flex', gap:14, alignItems:'center',
    }}>
      <div style={{
        width:60, height:60, borderRadius:18,
        background:`linear-gradient(135deg, ${c.color}99, ${c.color}55)`,
        display:'flex', alignItems:'center', justifyContent:'center',
        flex:'none',
      }}>
        <G size={28} color="#fff" stroke={2.2}/>
      </div>
      <div style={{ flex:1, minWidth:0 }} onClick={onOpen} role="button">
        <div style={{ fontWeight:700, fontSize:15, lineHeight:1.2 }}>{f.title}</div>
        <div style={{ fontSize:12, color:'var(--ink-2)', marginTop:2 }}>
          by {f.host} · {f.members.toLocaleString()} in · {f.days}d
        </div>
      </div>
      <button onClick={joined ? onOpen : onJoin} style={{
        background: joined ? 'var(--pink-4)' : 'var(--pink)',
        color: joined ? 'var(--pink)' : '#fff',
        padding:'8px 14px', borderRadius:999,
        fontSize:12.5, fontWeight:700, flex:'none',
      }}>
        {joined ? 'joined' : 'join'}
      </button>
    </div>
  );
};

// =========================================================
// MINE — your active challenges
// =========================================================
const Mine = ({ onOpen, onCreate, joined }) => {
  const [tab, setTab] = useState('active');
  const mine = SEED_CHALLENGES.filter(c=>c.members.includes('me') || joined.includes(c.id));
  const list = tab==='active' ? mine.filter(c=>c.dayIn < c.days)
             : tab==='upcoming' ? SEED_CHALLENGES.filter(c=>c.dayIn===0 && !c.members.includes('me'))
             : []; // done

  const totalStreak = mine.reduce((s,c)=>s+c.streak,0);

  return (
    <div style={{ paddingBottom:120 }}>
      <div style={{ padding:'18px 22px 8px' }}>
        <h1 style={{ fontSize:32, margin:0, fontWeight:800, letterSpacing:-.5 }}>mine</h1>
        <div style={{ fontSize:14, color:'var(--ink-2)', marginTop:2 }}>your active challenges</div>
      </div>

      {/* Stat hero */}
      <div style={{ padding:'8px 22px 12px' }}>
        <div style={{
          background:'linear-gradient(135deg, #FFEEF6 0%, #F8B3D2 130%)',
          borderRadius:22, padding:'18px 20px', position:'relative', overflow:'hidden',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:13.5, fontWeight:700 }}>today</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:6 }}>
                <span style={{ fontSize:48, fontWeight:800, color:'var(--pink)', lineHeight:1 }}>{mine.length}</span>
                <span style={{ fontSize:13, color:'var(--ink-2)' }}>challenges in motion</span>
              </div>
              <div style={{ fontSize:12.5, color:'var(--ink-2)', marginTop:4 }}>longest streak · {Math.max(0,...mine.map(c=>c.streak))} days</div>
            </div>
            <div style={{
              display:'flex', alignItems:'center', gap:6,
              background:'#fff', padding:'6px 11px', borderRadius:999,
              boxShadow:'0 2px 0 rgba(238,91,160,.10)',
            }}>
              <Icon.Flame size={15} color="var(--pink)"/>
              <span style={{ fontWeight:800, fontSize:13, color:'var(--pink)' }}>{totalStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        margin:'4px 22px 8px', background:'var(--pink-4)', borderRadius:999, padding:4,
        display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
      }}>
        {[
          { id:'active',   label:'active',   n: mine.filter(c=>c.dayIn<c.days).length },
          { id:'upcoming', label:'upcoming', n: SEED_CHALLENGES.filter(c=>c.dayIn===0 && !c.members.includes('me')).length },
          { id:'done',     label:'done',     n: 3 },
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:'8px 0', borderRadius:999,
            background: tab===t.id ? 'var(--pink)' : 'transparent',
            color: tab===t.id ? '#fff' : 'var(--ink)',
            fontWeight:700, fontSize:13,
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            {t.label}
            <span style={{
              background: tab===t.id ? 'rgba(255,255,255,.25)' : '#fff',
              color: tab===t.id ? '#fff' : 'var(--ink-2)',
              borderRadius:999, padding:'1px 7px', fontSize:11, fontWeight:700,
            }}>{t.n}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ padding:'8px 22px', display:'grid', gap:12 }}>
        {tab==='done' && (
          <EmptyDone/>
        )}
        {list.map(c=>(
          <ChallengeCard key={c.id} c={c} onOpen={()=>onOpen(c.id)}/>
        ))}
      </div>

      <FloatingFab onClick={onCreate}/>
    </div>
  );
};

const EmptyDone = () => (
  <div style={{
    padding:'30px 18px', background:'#fff',
    border:'1px dashed var(--pink-2)', borderRadius:20, textAlign:'center',
  }}>
    <div style={{ fontSize:28, marginBottom:6 }}>🌷</div>
    <div style={{ fontWeight:700, fontSize:15 }}>nothing finished yet</div>
    <div style={{ fontSize:12.5, color:'var(--ink-2)', marginTop:2 }}>your first completed challenge will bloom here.</div>
  </div>
);

const ChallengeCard = ({ c, onOpen }) => {
  const cat = catById(c.cat);
  const todayDone = c.totalDone >= c.ofMembers/2;
  return (
    <button onClick={onOpen} style={{
      background:'#fff', border:'1px solid var(--line)', borderRadius:22,
      padding:'14px 14px', textAlign:'left', width:'100%', display:'block',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <CategoryBadge catId={c.cat} size={44}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:15.5, lineHeight:1.15 }}>{c.title}</div>
          <div style={{ fontSize:12.5, color:'var(--ink-2)', marginTop:1 }}>
            {cat.label} · {c.days} days
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5, color:'var(--pink)' }}>
          <Icon.Flame size={15}/>
          <span style={{ fontWeight:800, fontSize:14 }}>{c.streak}</span>
        </div>
      </div>

      {/* progress bar */}
      <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          flex:1, height:6, background:'var(--pink-4)', borderRadius:3, overflow:'hidden', position:'relative',
        }}>
          <div style={{
            width:`${(c.dayIn/c.days)*100}%`, height:'100%',
            background:'linear-gradient(90deg, var(--pink) 0%, #F8B3D2 100%)',
            borderRadius:3,
          }}/>
        </div>
        <div style={{ fontSize:11.5, color:'var(--ink-2)', fontWeight:600 }}>day {c.dayIn}/{c.days}</div>
      </div>

      {/* foot */}
      <div style={{
        marginTop:12, display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <AvatarStack ids={c.members} size={22} max={4}/>
          <span style={{ fontSize:12, color:'var(--ink-2)' }}>
            {c.totalDone}/{c.ofMembers} today
          </span>
        </div>
        <span style={{
          fontSize:11, padding:'4px 10px', borderRadius:999,
          background: todayDone ? '#7FB28A22' : 'var(--pink-4)',
          color: todayDone ? '#5C8268' : 'var(--pink)',
          fontWeight:700,
        }}>
          {todayDone ? 'on track' : 'check in'}
        </span>
      </div>
    </button>
  );
};

// =========================================================
// CONNECT — friends + invites
// =========================================================
const Connect = ({ onOpen }) => {
  return (
    <div style={{ paddingBottom:120 }}>
      <div style={{ padding:'18px 22px 8px' }}>
        <h1 style={{ fontSize:32, margin:0, fontWeight:800, letterSpacing:-.5 }}>connect</h1>
        <div style={{ fontSize:14, color:'var(--ink-2)', marginTop:2 }}>cheer, chat, check in</div>
      </div>

      {/* Today's feed */}
      <div style={{ padding:'6px 22px 12px' }}>
        <SectionHead title="today on the bloom" sub="what your circle is up to"/>
      </div>
      <div style={{ padding:'0 22px', display:'grid', gap:10 }}>
        <FeedItem who="sof" action="checked in" what="Draw something tiny" time="9 min ago" emoji="🌸"/>
        <FeedItem who="noor" action="started a 30-day" what="No-sugar september" time="1 hr ago" emoji="🍋"/>
        <FeedItem who="mira" action="hit a 6-day streak" what="No phone after 9pm" time="2 hr ago" emoji="🌙" highlight/>
        <FeedItem who="iz" action="invited you" what="20 pages before bed" time="yesterday" emoji="📖" canJoin/>
        <FeedItem who="jun" action="finished" what="Cold showers · 14d" time="2d ago" emoji="🏆" done/>
      </div>

      {/* Invites */}
      <div style={{ padding:'18px 22px 8px' }}>
        <SectionHead title="invitations" sub="2 waiting"/>
      </div>
      <div style={{ padding:'0 22px', display:'grid', gap:10 }}>
        <Invite who="iz" title="20 pages before bed" cat="reading" days={14}/>
        <Invite who="rk" title="No-sugar september" cat="eating" days={30}/>
      </div>

      {/* Friends */}
      <div style={{ padding:'18px 22px 8px' }}>
        <SectionHead title="your circle" right={<span style={{ fontSize:12, color:'var(--pink)', fontWeight:700 }}>add friends</span>}/>
      </div>
      <div style={{ padding:'4px 22px 0' }}>
        <div style={{
          display:'flex', gap:14, overflowX:'auto', paddingBottom:10, scrollbarWidth:'none',
        }} className="scroll">
          {PEOPLE.filter(p=>p.id!=='me').map(p=>(
            <div key={p.id} style={{ textAlign:'center', flex:'none', width:64 }}>
              <Avatar id={p.id} size={56}/>
              <div style={{ fontSize:12, fontWeight:600, marginTop:6 }}>{p.name.split(' ')[0]}</div>
              <div style={{ fontSize:10.5, color:'var(--ink-2)' }}>{Math.floor(Math.random()*8)+1} in</div>
            </div>
          ))}
        </div>
      </div>

      <FloatingFab onClick={()=>{}} label="invite"/>
    </div>
  );
};

const FeedItem = ({ who, action, what, time, emoji, highlight, canJoin, done }) => {
  const p = personById(who);
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, #FFEEF6, #FCD9E6)' : '#fff',
      border:'1px solid var(--line)', borderRadius:18,
      padding:'12px 14px', display:'flex', gap:11, alignItems:'center',
    }}>
      <Avatar id={who} size={36}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, lineHeight:1.3 }}>
          <span style={{ fontWeight:700 }}>{p.name}</span>
          <span style={{ color:'var(--ink-2)' }}> {action} </span>
          <span style={{ fontWeight:600 }}>{what}</span>
        </div>
        <div style={{ fontSize:11.5, color:'var(--muted)', marginTop:2 }}>{time}</div>
      </div>
      {done ? <Icon.Trophy size={20} color="#F5D364"/>
       : canJoin ? <button style={{
            background:'var(--pink)', color:'#fff',
            padding:'6px 12px', borderRadius:999, fontSize:11.5, fontWeight:700,
          }}>join</button>
       : <button style={{
            width:34, height:34, borderRadius:'50%',
            background:'var(--pink-4)', display:'flex', alignItems:'center', justifyContent:'center',
          }}><Icon.Heart size={16} color="var(--pink)"/></button>
      }
    </div>
  );
};

const Invite = ({ who, title, cat, days }) => {
  const p = personById(who);
  return (
    <div style={{
      background:'#fff', border:'1px solid var(--pink-2)', borderRadius:20,
      padding:'14px 14px',
    }}>
      <div style={{ display:'flex', gap:11, alignItems:'center' }}>
        <Avatar id={who} size={40}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12.5, color:'var(--ink-2)' }}>{p.name} invited you</div>
          <div style={{ fontWeight:700, fontSize:15 }}>{title}</div>
        </div>
        <CategoryBadge catId={cat} size={36}/>
      </div>
      <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{
          fontSize:11.5, fontWeight:700, color:'var(--pink)',
          padding:'4px 10px', borderRadius:999, background:'var(--pink-4)',
        }}>{days} days</span>
        <div style={{ flex:1 }}/>
        <button style={{
          fontSize:13, fontWeight:600, color:'var(--ink-2)',
          padding:'8px 12px',
        }}>decline</button>
        <button style={{
          fontSize:13, fontWeight:700, color:'#fff',
          padding:'8px 16px', borderRadius:999, background:'var(--pink)',
        }}>accept</button>
      </div>
    </div>
  );
};

// =========================================================
// PROFILE
// =========================================================
const Profile = () => {
  const completed = 8;
  const total = 14;
  return (
    <div style={{ paddingBottom:120 }}>
      <div style={{
        padding:'14px 22px 14px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <button style={{ width:36, height:36, borderRadius:18, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--line)' }}>
          <Icon.Settings size={18}/>
        </button>
        <div style={{ fontWeight:700 }}>you</div>
        <button style={{ width:36, height:36, borderRadius:18, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--line)' }}>
          <Icon.Share size={18}/>
        </button>
      </div>

      <div style={{ textAlign:'center', padding:'8px 22px 12px' }}>
        <div style={{
          width:96, height:96, borderRadius:48, margin:'0 auto',
          background:'linear-gradient(135deg, var(--pink) 0%, #F8B3D2 100%)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontWeight:800, fontSize:38,
          boxShadow:'0 8px 24px -8px rgba(238,91,160,.5)',
        }}>Y</div>
        <div style={{ fontWeight:800, fontSize:24, marginTop:10, letterSpacing:-.3 }}>you</div>
        <div style={{ fontSize:13, color:'var(--ink-2)' }}>@bloom · joined may 2026</div>
      </div>

      {/* Stats triplet */}
      <div style={{
        margin:'4px 22px 12px', background:'#fff', borderRadius:22,
        padding:'14px 8px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
        border:'1px solid var(--line)',
      }}>
        <Stat n="3" label="active"/>
        <Stat n={completed} label="completed"/>
        <Stat n="11" label="best streak" hot/>
      </div>

      {/* Bloom Garden — completed challenges as flowers */}
      <div style={{ padding:'4px 22px 0' }}>
        <SectionHead title="your garden" sub={`${completed} blooms grown`} right={
          <span style={{ fontSize:12, color:'var(--pink)', fontWeight:700 }}>see all</span>
        }/>
      </div>
      <div style={{
        margin:'12px 22px', background:'linear-gradient(180deg, #FFF7FB 0%, #F8E1EC 100%)',
        borderRadius:22, padding:'18px 14px',
        display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14,
      }}>
        {[
          { c:'detox',   t:'phone-free evenings', d:21, stage:'bloom'   },
          { c:'fitness', t:'walk 8k',              d:30, stage:'bloom'   },
          { c:'art',     t:'daily doodle',         d:14, stage:'bud'     },
          { c:'reading', t:'4 books',              d:30, stage:'bloom'   },
          { c:'mind',    t:'morning pages',        d:21, stage:'sprout'  },
          { c:'eating',  t:'hydrate 8c',           d:14, stage:'bloom'   },
        ].map((b,i)=> <GardenBloom key={i} {...b}/>)}
      </div>

      {/* Categories streak chart */}
      <div style={{ padding:'8px 22px 0' }}>
        <SectionHead title="where you bloom" sub="by category"/>
      </div>
      <div style={{ padding:'12px 22px 0', display:'grid', gap:10 }}>
        {[
          { c:'detox',   v: .82 },
          { c:'fitness', v: .55 },
          { c:'reading', v: .70 },
          { c:'art',     v: .40 },
        ].map(r=>(
          <div key={r.c} style={{ display:'flex', alignItems:'center', gap:12 }}>
            <CategoryBadge catId={r.c} size={32}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{catById(r.c).label}</div>
              <div style={{
                height:6, background:'var(--pink-4)', borderRadius:3, marginTop:4, overflow:'hidden',
              }}>
                <div style={{
                  width:`${r.v*100}%`, height:'100%',
                  background:catById(r.c).color, borderRadius:3,
                }}/>
              </div>
            </div>
            <div style={{ fontSize:12, color:'var(--ink-2)', fontWeight:600, width:32, textAlign:'right' }}>{Math.round(r.v*100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Stat = ({ n, label, hot }) => (
  <div style={{ textAlign:'center', padding:'4px 4px' }}>
    <div style={{ fontSize:26, fontWeight:800, color: hot ? 'var(--pink)' : 'var(--ink)', letterSpacing:-.5, lineHeight:1 }}>
      {hot && <Icon.Flame size={18} color="var(--pink)"/>} {n}
    </div>
    <div style={{ fontSize:11.5, color:'var(--ink-2)', marginTop:4 }}>{label}</div>
  </div>
);

const GardenBloom = ({ c, t, d, stage }) => {
  const cat = catById(c);
  const stageColor = stage==='bloom' ? cat.color : stage==='bud' ? cat.color+'88' : cat.color+'44';
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{
        width:64, height:64, borderRadius:'50%', margin:'0 auto',
        background:stageColor,
        display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative',
        boxShadow: stage==='bloom' ? `0 0 0 3px #fff, 0 0 0 5px ${cat.color}` : `0 0 0 3px #fff, 0 0 0 5px ${cat.color}66`,
      }}>
        <Icon.Bloom size={32} color="#fff" stroke={2}/>
      </div>
      <div style={{ fontSize:11.5, fontWeight:700, marginTop:8, lineHeight:1.15 }}>{t}</div>
      <div style={{
        fontSize:9.5, color:cat.color, fontWeight:800, letterSpacing:.8, marginTop:2,
      }}>{stage.toUpperCase()}</div>
    </div>
  );
};

// =========================================================
// CHALLENGE DETAIL
// =========================================================
const ChallengeDetail = ({ id, onBack, onJoin, joined }) => {
  // Look in seed first, then in featured
  let c = SEED_CHALLENGES.find(x=>x.id===id);
  let mode = 'mine';
  if(!c){
    const f = DISCOVER_FEATURED.find(x=>x.id===id);
    if(f){
      c = {
        id:f.id, cat:f.cat, title:f.title, tagline:'community challenge',
        days:f.days, dayIn:0, members:[], host:f.host, emoji:'🌸',
        rule:'Check in daily. Cheer your crew on.',
        streak:0, totalDone:0, ofMembers:f.members,
      };
      mode = 'featured';
    }
  }
  if(!c) return null;

  const isMine = c.members && c.members.includes('me');
  const cat = catById(c.cat);
  const [checked, setChecked] = useState(false);

  const dayCells = Array.from({length:c.days}, (_,i)=>i);

  return (
    <div style={{ paddingBottom:140 }}>
      {/* Hero */}
      <div style={{
        background:`linear-gradient(160deg, ${cat.color}66 0%, var(--pink-4) 100%)`,
        padding:'16px 22px 26px',
        position:'relative',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <button onClick={onBack} style={{
            width:38, height:38, borderRadius:19, background:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 1px 0 rgba(0,0,0,.04)',
          }}>
            <Icon.Back size={20}/>
          </button>
          <button style={{
            width:38, height:38, borderRadius:19, background:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon.Share size={18}/>
          </button>
        </div>

        <div style={{ display:'flex', justifyContent:'center', marginTop:14 }}>
          <CategoryBadge catId={c.cat} size={80}/>
        </div>
        <div style={{ textAlign:'center', marginTop:14 }}>
          <div style={{
            fontSize:11.5, fontWeight:800, color:cat.color, letterSpacing:.8, textTransform:'uppercase',
          }}>{cat.label} · {c.days} days</div>
          <h2 style={{ fontSize:26, fontWeight:800, margin:'4px 0 4px', letterSpacing:-.4, textWrap:'balance' }}>
            {c.title}
          </h2>
          <div style={{ fontSize:13, color:'var(--ink-2)' }}>{c.tagline}</div>
        </div>

        {/* Members + host */}
        <div style={{
          margin:'18px auto 0', background:'#fff', borderRadius:18,
          padding:'12px 14px', display:'flex', alignItems:'center', gap:12,
          maxWidth:340,
        }}>
          {c.members.length > 0
            ? <AvatarStack ids={c.members} size={26} max={5}/>
            : <div style={{ width:26 }}/>
          }
          <div style={{ flex:1, fontSize:12.5 }}>
            {c.members.length > 0 ? (
              <>
                <div style={{ fontWeight:700 }}>{c.members.length} in</div>
                <div style={{ color:'var(--ink-2)' }}>hosted by {personById(c.host).name}</div>
              </>
            ) : (
              <>
                <div style={{ fontWeight:700 }}>{c.ofMembers?.toLocaleString?.()} people in</div>
                <div style={{ color:'var(--ink-2)' }}>hosted by {c.host}</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Check-in (mine only) */}
      {isMine && (
        <div style={{ padding:'14px 22px 0' }}>
          <div style={{
            background: checked ? 'linear-gradient(135deg, #7FB28A22, #FFFFFF)' : '#fff',
            border:`1px solid ${checked ? '#7FB28A55' : 'var(--line)'}`,
            borderRadius:22, padding:'16px 14px',
            display:'flex', alignItems:'center', gap:14,
          }}>
            <button onClick={()=>setChecked(v=>!v)} style={{
              width:50, height:50, borderRadius:25, flex:'none',
              background: checked ? '#7FB28A' : 'transparent',
              border: checked ? 'none' : `2px solid ${cat.color}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all .2s',
            }}>
              {checked && <Icon.Check size={24} color="#fff" stroke={3}/>}
            </button>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15 }}>
                {checked ? 'nice — counted for today' : 'check in for day ' + (c.dayIn+1)}
              </div>
              <div style={{ fontSize:12.5, color:'var(--ink-2)', marginTop:2 }}>{c.rule}</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress dot grid */}
      <div style={{ padding:'14px 22px 0' }}>
        <SectionHead title="progress" sub={`day ${c.dayIn}/${c.days}${c.streak ? ' · '+c.streak+' day streak' : ''}`}/>
      </div>
      <div style={{
        margin:'12px 22px', background:'#fff', borderRadius:22, padding:'14px',
        border:'1px solid var(--line)',
      }}>
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:6,
        }}>
          {dayCells.map(i=>{
            const past = i < c.dayIn;
            const today = i === c.dayIn;
            const passed = past || (today && checked);
            return (
              <div key={i} style={{
                aspectRatio:'1', borderRadius:6,
                background: passed ? cat.color : '#FBEEF4',
                border: today ? `2px solid ${cat.color}` : 'none',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:9, fontWeight:700, color:passed ? '#fff' : 'var(--muted)',
              }}>{i+1}</div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ padding:'8px 22px 0' }}>
        <SectionHead title="who's checked in" sub="today"/>
      </div>
      <div style={{ padding:'10px 22px 0', display:'grid', gap:8 }}>
        {(c.members.length>0 ? c.members : ['mira','sof','iz','jun']).map((mid,i)=>{
          const p = personById(mid);
          const done = i < (c.totalDone || 3);
          const myStreak = mid==='me' ? c.streak : Math.max(0, c.streak - i + Math.floor(Math.random()*3) - 1);
          return (
            <div key={mid+i} style={{
              background:'#fff', border:'1px solid var(--line)', borderRadius:16,
              padding:'10px 12px',
              display:'flex', alignItems:'center', gap:11,
            }}>
              <Avatar id={mid} size={32}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:13.5 }}>{p.name}{mid==='me' && ' · you'}</div>
                <div style={{ fontSize:11.5, color:'var(--ink-2)' }}>
                  {done ? 'checked in today' : 'not yet today'}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:4, color: done?'var(--pink)':'var(--muted)' }}>
                <Icon.Flame size={14}/>
                <span style={{ fontWeight:800, fontSize:13 }}>{myStreak}</span>
              </div>
              {done && <Icon.Check size={18} color="#7FB28A" stroke={2.5}/>}
            </div>
          );
        })}
      </div>

      {/* Action bar */}
      {!isMine && (
        <div style={{
          position:'absolute', left:0, right:0, bottom:0,
          padding:'14px 22px 32px',
          background:'linear-gradient(180deg, transparent 0%, var(--bg) 30%)',
          zIndex:6,
        }}>
          <button onClick={onJoin} disabled={joined} style={{
            width:'100%', padding:'16px', borderRadius:18,
            background: joined ? 'var(--pink-3)' : 'var(--pink)',
            color:'#fff', fontWeight:800, fontSize:15,
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            boxShadow: joined ? 'none' : '0 8px 22px -8px rgba(238,91,160,.55)',
          }}>
            {joined ? <><Icon.Check size={18} color="#fff" stroke={3}/> joined — see in mine</>
                    : <><Icon.Plus size={18} stroke={2.5}/> join challenge</>}
          </button>
        </div>
      )}
    </div>
  );
};

Object.assign(window, {
  Avatar, AvatarStack, Pill, CategoryBadge, FloatingFab, TabBar,
  Discover, Mine, Connect, Profile, ChallengeDetail,
  SectionHead,
});
