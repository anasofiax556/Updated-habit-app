// Top-level app: tab routing + modal control + created confirmation.
const App = () => {
  const [tab, setTab] = useState('discover');
  const [detailId, setDetailId] = useState(null);   // open challenge id
  const [creating, setCreating] = useState(false);  // create modal open
  const [created, setCreated] = useState(null);     // last created challenge (for toast)
  const [joined, setJoined] = useState([]);         // featured ids we've joined

  const openChallenge = (id, source) => {
    if(id) setDetailId(id);
    else if(source==='mine') setTab('mine');
  };
  const closeDetail = () => setDetailId(null);

  const handleJoin = (id) => {
    setJoined(j => j.includes(id) ? j : [...j, id]);
  };

  const handleCreated = (draft) => {
    setCreating(false);
    setCreated(draft);
    setTab('mine');
    setTimeout(()=>setCreated(null), 3200);
  };

  // current screen
  let screen;
  if(tab==='discover') screen = <Discover onOpenChallenge={openChallenge} onCreate={()=>setCreating(true)} joined={joined} onJoin={handleJoin}/>;
  else if(tab==='mine') screen = <Mine onOpen={openChallenge} onCreate={()=>setCreating(true)} joined={joined}/>;
  else if(tab==='connect') screen = <Connect onOpen={openChallenge}/>;
  else if(tab==='profile') screen = <Profile/>;

  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        position:'absolute', inset:0, background:'var(--bg)',
        overflow:'hidden',
      }}>
        {/* status bar safe area handled by iOS frame; we leave 50px top for status */}
        <div className="scroll" style={{
          position:'absolute', inset:0, top:50, bottom:0,
          overflowY:'auto',
        }}>
          {screen}
        </div>

        {/* FAB on discover too */}
        {tab==='discover' && <FloatingFab onClick={()=>setCreating(true)}/>}
        {tab==='profile'  && <FloatingFab onClick={()=>setCreating(true)}/>}

        {/* Detail overlay */}
        {detailId && (
          <div style={{
            position:'absolute', inset:0, top:50, bottom:0,
            background:'var(--bg)', zIndex:20, overflowY:'auto',
          }} className="scroll">
            <ChallengeDetail
              id={detailId}
              joined={joined.includes(detailId)}
              onJoin={()=>handleJoin(detailId)}
              onBack={closeDetail}
            />
          </div>
        )}

        {/* Create overlay */}
        {creating && (
          <CreateFlow
            onClose={()=>setCreating(false)}
            onCreated={handleCreated}
          />
        )}

        {/* Created toast */}
        {created && (
          <div style={{
            position:'absolute', left:18, right:18, bottom:104, zIndex:40,
            background:'#1B1410', color:'#fff',
            padding:'14px 16px', borderRadius:18,
            display:'flex', alignItems:'center', gap:12,
            animation:'slideUp .4s ease-out',
            boxShadow:'0 16px 30px -10px rgba(0,0,0,.3)',
          }}>
            <div style={{
              width:34, height:34, borderRadius:17,
              background:'var(--pink)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon.Check size={18} color="#fff" stroke={3}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:700 }}>planted!</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.7)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {created.title} · {created.days} days
              </div>
            </div>
            <button onClick={()=>setCreated(null)} style={{ color:'rgba(255,255,255,.6)' }}>
              <Icon.X size={16}/>
            </button>
          </div>
        )}

        {/* Tab bar — hidden during create flow */}
        {!creating && <TabBar active={tab} onChange={(t)=>{ setDetailId(null); setTab(t); }}/>}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity:0; }
          to   { transform: translateY(0); opacity:1; }
        }
      `}</style>
    </IOSDevice>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
