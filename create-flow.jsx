// Create challenge flow — modal with 5 steps:
// 1) category  2) name/rule  3) duration  4) privacy/friends  5) review
const CreateFlow = ({ onClose, onCreated }) => {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    cat: null,
    title: '',
    rule: '',
    days: 21,
    privacy: 'friends', // solo / friends / public
    invites: [],
    startToday: true,
  });
  const set = (k,v) => setDraft(d => ({ ...d, [k]:v }));
  const next = () => setStep(s=>Math.min(s+1, 4));
  const back = () => step===0 ? onClose() : setStep(s=>s-1);

  const canNext =
    step===0 ? !!draft.cat :
    step===1 ? draft.title.trim().length >= 3 :
    step===2 ? draft.days > 0 :
    step===3 ? true :
    true;

  const cat = draft.cat ? catById(draft.cat) : null;

  return (
    <div style={{
      position:'absolute', inset:0, background:'var(--bg)', zIndex:30,
      display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{
        padding:'12px 22px 8px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <button onClick={back} style={{
          width:36, height:36, borderRadius:18, background:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          border:'1px solid var(--line)',
        }}>
          {step===0 ? <Icon.X size={18}/> : <Icon.Back size={18}/>}
        </button>
        <div style={{ fontWeight:700, fontSize:13.5 }}>new challenge</div>
        <button onClick={onClose} style={{ fontSize:13, color:'var(--ink-2)', fontWeight:600 }}>
          {step===4 ? '' : 'save draft'}
        </button>
      </div>

      {/* Step pips */}
      <div style={{ padding:'4px 22px 6px', display:'flex', gap:5 }}>
        {[0,1,2,3,4].map(i=>(
          <div key={i} style={{
            flex:1, height:4, borderRadius:2,
            background: i<=step ? 'var(--pink)' : 'var(--pink-4)',
            transition:'background .2s',
          }}/>
        ))}
      </div>

      {/* Body */}
      <div className="scroll" style={{ flex:1, overflowY:'auto', padding:'10px 22px 100px' }}>
        {step===0 && <StepCategory draft={draft} set={set}/>}
        {step===1 && <StepDetails draft={draft} set={set}/>}
        {step===2 && <StepDuration draft={draft} set={set}/>}
        {step===3 && <StepPrivacy draft={draft} set={set}/>}
        {step===4 && <StepReview draft={draft}/>}
      </div>

      {/* Footer CTA */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        padding:'12px 22px 32px',
        background:'linear-gradient(180deg, transparent 0%, var(--bg) 30%)',
      }}>
        <button onClick={step===4 ? ()=>onCreated(draft) : next} disabled={!canNext} style={{
          width:'100%', padding:'16px', borderRadius:18,
          background: canNext ? 'var(--pink)' : 'var(--pink-3)',
          color:'#fff', fontWeight:800, fontSize:15,
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          boxShadow: canNext ? '0 8px 22px -8px rgba(238,91,160,.55)' : 'none',
          transition:'all .15s',
        }}>
          {step===4 ? 'plant it 🌱' : (step===3 ? 'review' : 'next')}
          {step<4 && <Icon.Forward size={16} stroke={2.5}/>}
        </button>
      </div>
    </div>
  );
};

// ----- Step 1: pick category -----
const StepCategory = ({ draft, set }) => (
  <div>
    <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:-.4, margin:'8px 0 4px' }}>what kind of<br/>challenge?</h2>
    <p style={{ fontSize:13.5, color:'var(--ink-2)', margin:'0 0 18px' }}>pick a lane — you can change the title in a sec.</p>
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 1fr', gap:12,
    }}>
      {CATEGORIES.map(c=>{
        const G = Icon[c.icon];
        const on = draft.cat===c.id;
        return (
          <button key={c.id} onClick={()=>set('cat', c.id)} style={{
            background: on ? c.color+'55' : '#fff',
            border: on ? `2px solid ${c.color}` : '1px solid var(--line)',
            borderRadius:20, padding:'16px 14px', textAlign:'left',
            position:'relative', height:122, transition:'all .15s',
          }}>
            <div style={{
              width:42, height:42, borderRadius:14, background:c.color+'66',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <G size={22} color={c.color} stroke={2.2}/>
            </div>
            <div style={{ fontWeight:800, fontSize:15, marginTop:12 }}>{c.label}</div>
            <div style={{ fontSize:11.5, color:'var(--ink-2)', marginTop:2 }}>{c.hint}</div>
            {on && (
              <div style={{
                position:'absolute', top:12, right:12,
                width:22, height:22, borderRadius:11, background:c.color,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon.Check size={14} color="#fff" stroke={3}/>
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

// ----- Step 2: title & rule -----
const StepDetails = ({ draft, set }) => {
  const cat = catById(draft.cat);
  // suggestion prompts per category
  const suggestions = {
    fitness:  ['Walk 8k a day', 'Yoga every morning', 'Run a 5k'],
    reading:  ['20 pages before bed', '1 book a week', 'Read 30 min'],
    detox:    ['No phone after 9pm', 'No-scroll mornings', 'Phone-free dinners'],
    eating:   ['No added sugar', 'Cook every dinner', 'Hydrate 2L'],
    art:      ['Daily doodle', 'One watercolor a day', 'Write 500 words'],
    sleep:    ['Lights out by 11', 'No caffeine after 2pm'],
    mind:     ['Morning pages', '10 min meditation'],
    money:    ['No-spend week', 'Pack lunch every day'],
  }[draft.cat] || [];

  return (
    <div>
      <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:-.4, margin:'8px 0 4px' }}>name it.</h2>
      <p style={{ fontSize:13.5, color:'var(--ink-2)', margin:'0 0 18px' }}>short and clear is best. you'll see this every day.</p>

      <div style={{
        background:'#fff', border:'1px solid var(--line)', borderRadius:18,
        padding:'14px 14px', display:'flex', gap:12, alignItems:'center',
      }}>
        <CategoryBadge catId={draft.cat} size={42}/>
        <input
          autoFocus value={draft.title}
          onChange={e=>set('title', e.target.value)}
          placeholder="e.g. 20 pages before bed"
          style={{
            flex:1, border:'none', outline:'none', background:'transparent',
            fontSize:16, fontWeight:600,
          }}
        />
      </div>

      {/* Suggestions */}
      {suggestions.length>0 && (
        <div style={{ marginTop:14 }}>
          <div style={{ fontSize:12, color:'var(--ink-2)', fontWeight:600, marginBottom:8 }}>or try one of these</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {suggestions.map(s=>(
              <button key={s} onClick={()=>set('title', s)} style={{
                padding:'8px 14px', borderRadius:999,
                background:'var(--pink-4)', color:'var(--ink)',
                fontSize:13, fontWeight:600,
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Rule */}
      <div style={{ marginTop:22 }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>the rule <span style={{ color:'var(--ink-2)', fontWeight:500, fontSize:12 }}>(optional)</span></div>
        <div style={{
          background:'#fff', border:'1px solid var(--line)', borderRadius:18,
          padding:'14px 14px',
        }}>
          <textarea
            value={draft.rule}
            onChange={e=>set('rule', e.target.value)}
            placeholder="describe what counts as a check-in…"
            rows={3}
            style={{
              width:'100%', border:'none', outline:'none', background:'transparent',
              fontSize:14, resize:'none', fontFamily:'inherit',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ----- Step 3: duration -----
const StepDuration = ({ draft, set }) => {
  const [custom, setCustom] = useState(false);
  const isPreset = DURATIONS.some(d=>d.days===draft.days);
  return (
    <div>
      <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:-.4, margin:'8px 0 4px' }}>how long?</h2>
      <p style={{ fontSize:13.5, color:'var(--ink-2)', margin:'0 0 18px' }}>most habits take 21 days to settle. pick your stretch.</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {DURATIONS.map(d=>{
          const on = draft.days===d.days && !custom;
          return (
            <button key={d.days} onClick={()=>{ setCustom(false); set('days', d.days); }} style={{
              background: on ? 'linear-gradient(135deg, var(--pink) 0%, #F8B3D2 100%)' : '#fff',
              color: on ? '#fff' : 'var(--ink)',
              border: on ? 'none' : '1px solid var(--line)',
              borderRadius:18, padding:'16px 14px', textAlign:'left',
              transition:'all .15s',
              boxShadow: on ? '0 8px 18px -8px rgba(238,91,160,.5)' : 'none',
            }}>
              <div style={{ fontSize:22, fontWeight:800, letterSpacing:-.4 }}>{d.label}</div>
              <div style={{ fontSize:12, color: on ? 'rgba(255,255,255,.85)' : 'var(--ink-2)', marginTop:2 }}>{d.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Custom */}
      <div style={{ marginTop:14 }}>
        <button onClick={()=>{ setCustom(true); if(isPreset) set('days', 45); }} style={{
          width:'100%', padding:'16px 14px', borderRadius:18, textAlign:'left',
          background: custom ? 'var(--pink-4)' : '#fff',
          border: custom ? '2px solid var(--pink)' : '1px solid var(--line)',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700 }}>custom length</div>
              <div style={{ fontSize:12, color:'var(--ink-2)' }}>pick any number of days</div>
            </div>
            {custom && (
              <div style={{
                display:'flex', alignItems:'baseline', gap:4,
                background:'#fff', borderRadius:14, padding:'6px 12px',
                border:'1px solid var(--pink-2)',
              }}>
                <span style={{ fontSize:22, fontWeight:800, color:'var(--pink)' }}>{draft.days}</span>
                <span style={{ fontSize:12, color:'var(--ink-2)' }}>days</span>
              </div>
            )}
          </div>
          {custom && (
            <input type="range" min={1} max={365} value={draft.days}
              onChange={e=>set('days', Number(e.target.value))}
              style={{ width:'100%', marginTop:14, accentColor:'#EE5BA0' }}
              onClick={e=>e.stopPropagation()}
            />
          )}
        </button>
      </div>

      {/* Start when */}
      <div style={{ marginTop:18 }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>start when?</div>
        <div style={{ display:'flex', gap:8 }}>
          {[
            { v:true,  label:'today',    sub:'right now' },
            { v:false, label:'monday',   sub:'in 6 days' },
          ].map(o=>(
            <button key={String(o.v)} onClick={()=>set('startToday', o.v)} style={{
              flex:1, padding:'12px 14px', borderRadius:16, textAlign:'left',
              background: draft.startToday===o.v ? 'var(--pink-4)' : '#fff',
              border: draft.startToday===o.v ? '2px solid var(--pink)' : '1px solid var(--line)',
            }}>
              <div style={{ fontSize:14, fontWeight:700 }}>{o.label}</div>
              <div style={{ fontSize:11.5, color:'var(--ink-2)' }}>{o.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----- Step 4: privacy & invites -----
const StepPrivacy = ({ draft, set }) => {
  const toggleInvite = (id) => {
    set('invites', draft.invites.includes(id)
      ? draft.invites.filter(x=>x!==id)
      : [...draft.invites, id]);
  };
  return (
    <div>
      <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:-.4, margin:'8px 0 4px' }}>who's in?</h2>
      <p style={{ fontSize:13.5, color:'var(--ink-2)', margin:'0 0 18px' }}>solo, with friends, or open it up.</p>

      <div style={{ display:'grid', gap:10 }}>
        {[
          { id:'solo',    title:'just me',     sub:'private to you', icon:'Lock' },
          { id:'friends', title:'with friends', sub:'invite your crew', icon:'Users' },
          { id:'public',  title:'public',      sub:'anyone can join', icon:'Globe' },
        ].map(o=>{
          const G = Icon[o.icon];
          const on = draft.privacy===o.id;
          return (
            <button key={o.id} onClick={()=>set('privacy', o.id)} style={{
              padding:'14px', borderRadius:18,
              background: on ? 'var(--pink-4)' : '#fff',
              border: on ? '2px solid var(--pink)' : '1px solid var(--line)',
              display:'flex', alignItems:'center', gap:14, textAlign:'left',
            }}>
              <div style={{
                width:42, height:42, borderRadius:14,
                background: on ? 'var(--pink)' : 'var(--pink-4)',
                color: on ? '#fff' : 'var(--pink)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <G size={20} stroke={2.2}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:700 }}>{o.title}</div>
                <div style={{ fontSize:12.5, color:'var(--ink-2)' }}>{o.sub}</div>
              </div>
              {on && <div style={{
                width:22, height:22, borderRadius:11, background:'var(--pink)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}><Icon.Check size={14} color="#fff" stroke={3}/></div>}
            </button>
          );
        })}
      </div>

      {draft.privacy==='friends' && (
        <div style={{ marginTop:20 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>
            invite friends {draft.invites.length>0 && <span style={{ color:'var(--pink)' }}>· {draft.invites.length}</span>}
          </div>
          <div style={{ display:'grid', gap:8 }}>
            {PEOPLE.filter(p=>p.id!=='me').map(p=>{
              const on = draft.invites.includes(p.id);
              return (
                <button key={p.id} onClick={()=>toggleInvite(p.id)} style={{
                  background:'#fff', border: on ? '1px solid var(--pink)' : '1px solid var(--line)',
                  borderRadius:14, padding:'10px 12px',
                  display:'flex', alignItems:'center', gap:12, textAlign:'left',
                }}>
                  <Avatar id={p.id} size={32}/>
                  <div style={{ flex:1, fontSize:14, fontWeight:600 }}>{p.name}</div>
                  <div style={{
                    width:22, height:22, borderRadius:11,
                    background: on ? 'var(--pink)' : 'transparent',
                    border: on ? 'none' : '1.5px solid var(--pink-2)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {on && <Icon.Check size={14} color="#fff" stroke={3}/>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ----- Step 5: review -----
const StepReview = ({ draft }) => {
  const cat = catById(draft.cat);
  return (
    <div>
      <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:-.4, margin:'8px 0 4px' }}>almost there.</h2>
      <p style={{ fontSize:13.5, color:'var(--ink-2)', margin:'0 0 18px' }}>looks good? hit plant when you're ready.</p>

      <div style={{
        background:`linear-gradient(160deg, ${cat.color}55 0%, var(--pink-4) 100%)`,
        borderRadius:24, padding:'22px 18px', textAlign:'center', position:'relative',
      }}>
        <div style={{ display:'flex', justifyContent:'center' }}>
          <CategoryBadge catId={draft.cat} size={64}/>
        </div>
        <div style={{ marginTop:12, fontSize:11.5, color:cat.color, fontWeight:800, letterSpacing:.8, textTransform:'uppercase' }}>
          {cat.label} · {draft.days} days
        </div>
        <div style={{ fontSize:22, fontWeight:800, marginTop:4, letterSpacing:-.3, textWrap:'balance' }}>
          {draft.title || 'untitled challenge'}
        </div>
        {draft.rule && (
          <div style={{ fontSize:13, color:'var(--ink-2)', marginTop:8 }}>“{draft.rule}”</div>
        )}
      </div>

      {/* Summary rows */}
      <div style={{ marginTop:18, display:'grid', gap:8 }}>
        <ReviewRow icon="Calendar" k="starts" v={draft.startToday ? 'today' : 'monday'}/>
        <ReviewRow icon="Clock"    k="length" v={`${draft.days} days`}/>
        <ReviewRow icon={draft.privacy==='solo'?'Lock':draft.privacy==='public'?'Globe':'Users'}
                   k="who"
                   v={draft.privacy==='solo' ? 'just you'
                       : draft.privacy==='public' ? 'public — anyone can join'
                       : `you${draft.invites.length>0 ? ' + ' + draft.invites.length + ' invited' : ''}`}/>
      </div>
    </div>
  );
};

const ReviewRow = ({ icon, k, v }) => {
  const G = Icon[icon];
  return (
    <div style={{
      background:'#fff', border:'1px solid var(--line)', borderRadius:14,
      padding:'12px 14px', display:'flex', alignItems:'center', gap:12,
    }}>
      <div style={{
        width:32, height:32, borderRadius:10, background:'var(--pink-4)', color:'var(--pink)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <G size={16} stroke={2.2}/>
      </div>
      <div style={{ flex:1, fontSize:12.5, color:'var(--ink-2)' }}>{k}</div>
      <div style={{ fontSize:13.5, fontWeight:700 }}>{v}</div>
    </div>
  );
};

window.CreateFlow = CreateFlow;
