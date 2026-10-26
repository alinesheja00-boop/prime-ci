function more(){const ms=members(),m=me();
 return `${m?`<div class="card p-5 text-center space-y-1 border border-amber-500"><div class="text-xs text-slate-400">MY ID NUMBER</div><div class="text-4xl font-bold font-mono text-amber-400">${idOf(m.n)}</div><div class="font-bold">${esc(m.n)}</div><div class="text-xs text-slate-400">${role()}</div></div>`:""}
 <div class="card p-5 space-y-3"><h3 class="font-bold text-amber-400">⚙️ Settings ${S.admin?"· Admin (full control)":"· Member"}</h3>
 <div class="text-sm">${m?`Signed in as <b>${esc(m.n)}</b> ${idTag(m.n)} · ${role()}`:"Not signed in (Guest)"}</div>
 ${m?`<div class="grid grid-cols-2 gap-2"><button data-a="prof" data-v="${esc(S.me)}" class="btn bg-slate-600 text-sm">My profile</button><button data-a="logout" class="btn bg-slate-600 text-sm">Log out</button></div><button data-a="switch" class="btn bg-blue-600 text-sm">🔄 Switch account</button>${bioOK()?(bioGet()[S.me]?`<button data-a="bioOff" class="btn bg-slate-600 text-sm">🙂 Face ID is ON ✅ — turn off</button>`:`<button data-a="bioOn" class="btn bg-emerald-600 text-sm">🙂 Turn on Face ID login</button>`):""}`:`<button data-a="tab" data-v="login" class="btn bg-blue-600">Login / Register</button>`}
 ${S.admin?`<button data-a="adm" class="btn bg-slate-600">Admin Mode 🔓 — Logout</button>`:`<button data-a="adm" class="text-xs text-slate-500 underline">Owner access</button>`}
 <button data-a="tab" data-v="notes" class="btn bg-[#1a1c28] text-sm">🔔 Notifications (${unread()} new)</button></div>
 ${settingsReq()}
 <button data-a="tab" data-v="receivers" class="card p-5 w-full text-left flex justify-between"><span class="font-bold">👑 Receivers list</span><span class="text-slate-400">›</span></button>
 <button data-a="tab" data-v="members" class="card p-5 w-full text-left flex justify-between"><span class="font-bold">👥 Members (${ms.length})</span><span class="text-slate-400">›</span></button>
 ${S.admin?`<div class="card p-5 space-y-2"><h3 class="font-bold">📊 Reports</h3><button data-a="tab" data-v="reports" class="btn bg-slate-600">Open reports & export</button></div>
 <div class="card p-5 space-y-2"><h3 class="font-bold">🔓 Level access</h3><button data-a="lockLv" class="btn ${S.lockLv?"bg-amber-500 text-black":"bg-emerald-600"}">${S.lockLv?"🔒 Levels need graduation — tap to open all":"🔓 All levels open — tap to require graduation"}</button></div>
 <div class="card p-5 space-y-2"><h3 class="font-bold">💲 Level prices</h3>${TIERS.map((x,i)=>`<div class="row flex justify-between items-center px-4 py-2 text-sm"><span>${x[0]} · $${x[1]} / seat</span><button data-a="price" data-v="${i}" class="text-amber-400 font-bold">Edit</button></div>`).join("")}</div>
 <div class="card p-5 space-y-3"><h3 class="font-bold">💾 Backup</h3><div class="grid grid-cols-2 gap-2"><button data-a="bkCopy" class="btn bg-slate-600">Copy backup</button><button data-a="bkRestore" class="btn bg-slate-600">Restore</button></div></div>
 <div class="card p-5 space-y-3"><h3 class="font-bold">🔐 Security & data</h3><div class="grid grid-cols-2 gap-2"><button data-a="pin" class="btn bg-slate-600">Change admin PIN</button><button data-a="clear" class="btn bg-slate-600">Clear seats</button></div><button data-a="reset" class="btn bg-red-600">Reset all</button></div>`:""}
 <div class="card p-5 text-sm text-slate-400 space-y-1"><h3 class="font-bold text-white">ℹ️ About</h3><div>Prime Circle · v2.4</div><div>${ms.length} members · ${S.rounds} full rounds · $${S.total} received</div><div>Data is saved on this device only.</div></div>`}

function menuHtml(){if(!S.menu)return "";const m=me(),it=(a,v,i,l)=>`<button data-a="${a}" data-v="${v}" class="w-full text-left px-4 py-3 rounded-xl bg-[#1a1c28] flex justify-between"><span>${i} ${l}</span><span class="text-slate-500">›</span></button>`;
 return `<div data-a="menu" class="fixed inset-0 z-40 bg-black/60"><div class="w-72 max-w-[85%] h-full bg-[#111320] border-r border-slate-700 p-4 space-y-2 overflow-y-auto" onclick="event.stopPropagation()"><div class="flex justify-between items-center mb-2"><div><div class="font-bold text-amber-400">Prime Circle</div><div class="text-xs text-slate-400">${m?esc(m.n)+" · "+idOf(m.n)+" · ":""}${role()}</div></div><button data-a="menu" class="text-2xl">✕</button></div>
 ${it("tab","overview","▦","Overview")}${it("tab","levels","☰","Levels")}${it("tab","circle","◉","Circle")}${it("tab","payments","➕","Request a seat")}${it("tab","payments","▭","Payments")}${it("tab","notes","🔔","Notifications ("+unread()+")")}
 ${it("tab","receivers","👑","Receivers list")}${it("tab","members","👥","Members")}${it("tab","more","⚙️","Settings")}${m?it("prof",S.me,"👤","My profile"):it("tab","login","👤","Login / Register")}
 ${S.admin?it("tab","reports","📊","Reports & export"):""}${it("refresh","","⟳","Refresh")}
 <div class="text-xs text-slate-400 pt-2 px-1">ACCOUNTS</div>
 ${Object.values(S.mem).filter(x=>x.email).map(x=>it("pickAcc",esc(x.email),S.me===key(x.n)?"✅":"👤",esc(x.n)+(x.admin?" 🛡":""))).join("")}
 ${m||S.admin?it("switch","","🔄","Switch account"):""}${S.admin?it("adm","","🔓","Admin logout"):it("adm","","🔑","Owner access")}${m?it("logout","","↩","Log out"):""}</div></div>`}
const VIEWS={receivers:receiversView,members:membersView,circle,overview,levels,payments,more,notes,login,profile,reports};
function render(){
 $("view").innerHTML=(VIEWS[S.tab]||circle)();
 if(S.tab==="notes")mine().forEach(x=>x.read=true);
 $("nav").innerHTML=[["overview","▦"],["levels","☰"],["circle","◉"],["payments","▭"],["more","⚙️"]].map(a=>`<button data-a="tab" data-v="${a[0]}" class="px-3 py-1 rounded-2xl ${S.tab===a[0]?"bg-teal-900 text-cyan-300":"text-slate-400"}"><div class="text-xl">${a[1]}</div>${t(a[0])}</button>`).join("");
 $("menu").innerHTML=menuHtml();
 $("bell").textContent=unread();
 $("who").textContent=(S.me||S.admin)?"Log out ("+(S.admin?"Admin":me()?me().n:"")+")":"Log in";
 $("who").className="text-xs font-bold rounded-full px-3 py-1.5 "+((S.me||S.admin)?"bg-slate-600 text-white":"bg-amber-500 text-black");
 save();
}
function finish(up){const T0=TIERS[S.tier],amt=T0[1]*N,r=waiting()[0];
 if(!r)return toast("No receiver in the list");
 if(!confirm("Has "+r.n+" confirmed receiving $"+amt+"?"))return;
 r.got=true;S.total+=amt;S.rounds++;S.done.unshift({n:r.n,amt,tier:T0[0],type:up?"Graduate":"Approved",d:today()});LV().seats=[];
 let msg="";note(key(r.n),"You received $"+amt+" in "+T0[0]+" ✅");
 if(up){if(S.tier<TIERS.length-1){const k=key(r.n),old=S.access[k];S.access[k]={n:r.n,l:Math.max(old?old.l:0,S.tier+1)};msg=r.n+" unlocked "+TIERS[S.tier+1][0]+" 🔓";note(k,"You unlocked "+TIERS[S.tier+1][0]+" 🔓")}else msg=r.n+" completed the top level 🏆"}
 const nx=waiting()[0];if(nx)note(key(nx.n),"You are now the receiver 👑 in "+T0[0]);
 log(r.n+" "+(up?"Graduate 🚀":"Approved ✅")+" $"+amt+(msg?" → "+msg:"")+(nx?" | Next: "+nx.n:""));
 toast(msg||(nx?"Next: "+nx.n+" 👑":"No one else in the list"));render()}

const bioGet=()=>{try{return JSON.parse(localStorage.getItem("pcBio"))||{}}catch(e){return {}}};
const bioSet=o=>{try{localStorage.setItem("pcBio",JSON.stringify(o))}catch(e){}};
const b2s=b=>btoa(String.fromCharCode(...new Uint8Array(b))),s2b=x=>Uint8Array.from(atob(x),c=>c.charCodeAt(0));
const bioOK=()=>!!(window.PublicKeyCredential&&navigator.credentials&&window.crypto);
async function bioEnable(){if(!bioOK())return toast("Face ID is not supported in this browser");const k=S.me;if(!k||!S.mem[k])return toast("Log in first");
 try{const c=await navigator.credentials.create({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rp:{name:"Prime Circle"},user:{id:new TextEncoder().encode(k).slice(0,64),name:S.mem[k].email||k,displayName:S.mem[k].n},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required"},timeout:60000}});
  const o=bioGet();o[k]=b2s(c.rawId);bioSet(o);toast("Face ID turned on ✅");render()}catch(e){toast("Face ID was cancelled or is not available")}}
async function bioLogin(k){const o=bioGet();if(!o[k])return toast("Face ID is not set up for this account");
 try{await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),allowCredentials:[{type:"public-key",id:s2b(o[k]),transports:["internal"]}],userVerification:"required",timeout:60000}});
  const r=S.mem[k];if(!r)return toast("Account not found");S.me=k;S.pick="";if(r.admin)S.admin=true;S.tab="more";toast("Welcome "+r.n+" ✅");render()}catch(e){toast("Face ID failed or was cancelled")}}
function backToReview(li,k){const l=S.lv[li],i=l.joined.findIndex(x=>!x.got&&key(x.n)===k);if(i<0)return toast("Not in the paid list");const n=l.joined[i].n;
 let seat=l.seats.find(x=>key(x.n)===k);
 if(!seat){if(l.seats.length>=N)return toast("Seats are full — remove someone first");const id=++S.pid;seat={n,s:"review",ref:"—",pid:id};l.seats.push(seat);S.pay.push({id,n,tier:TIERS[li][0],amt:TIERS[li][1],ref:"—",d:today(),st:"requested"})}
 else{seat.s="review";const pr=payRec(seat.pid);if(pr)pr.st="requested"}
 l.joined.splice(i,1);note(k,"Your payment is back in review ⏳ ("+TIERS[li][0]+") — please send your payment reference");log(n+" moved back to review ("+TIERS[li][0]+")");toast(n+" is back in review ⏳")}
function approveSeat(i){const p=seats()[i];p.s="paid";joinPush(p);const pr=payRec(p.pid);if(pr)pr.st="approved";note(key(p.n),"Your payment was confirmed ✅ ("+TIERS[S.tier][0]+")");if(paid()>=N)note("staff",TIERS[S.tier][0]+" is full — receiver can confirm receipt");log(p.n+" confirmed ("+TIERS[S.tier][0]+")")}
function rejectSeat(i){const p=seats().splice(i,1)[0];const pr=payRec(p.pid);if(pr)pr.st="rejected";note(key(p.n),"Your request was rejected ✖ ("+TIERS[S.tier][0]+")");log(p.n+" rejected ✖")}
const canAct=li=>S.admin||!!(S.me&&(()=>{const w=S.lv[li].joined.find(x=>!x.got);return w&&key(w.n)===S.me})());
function settingsReq(){const rq=[],pd=[];S.lv.forEach((l,li)=>l.seats.forEach((p,i)=>{(p.s==="review"?rq:pd).push([p,li,i])}));
 const mineP=S.me?S.pay.filter(p=>key(p.n)===S.me):[],stl=x=>x==="approved"?"✓ Paid & confirmed":x==="rejected"?"✖ Rejected":x==="cancelled"?"Cancelled":"⏳ In review";
 const any=S.admin||(S.me&&isRecvOf(S.me));
 return (any?`<div class="card p-5 space-y-3"><h3 class="font-bold text-amber-400">📋 Requests & approvals</h3>
 <div class="text-sm text-slate-400">Only people whose payment you confirm join the Receivers list. Everyone else stays <b>in review</b>.</div>
 <h3 class="font-bold">⏳ In review (${rq.length})</h3>
 ${rq.map(([p,li,i])=>`<div class="row flex justify-between items-center px-4 py-2"><span>${esc(p.n)} ${idTag(p.n)}<br><span class="text-xs text-slate-400">${TIERS[li][0]} · ref: ${esc(p.ref||"—")}</span></span>${canAct(li)?`<span class="flex gap-1"><button data-a="okS" data-v="${li},${i}" class="bg-emerald-500 px-3 py-1 rounded-full text-sm font-bold">✔ Confirm</button><button data-a="rejS" data-v="${li},${i}" class="bg-red-600 px-3 py-1 rounded-full text-sm font-bold">✖</button></span>`:`<span class="text-slate-400 text-sm">⏳ In review</span>`}</div>`).join("")||`<p class="text-slate-500 text-sm">Nobody yet</p>`}
 <h3 class="font-bold pt-2">✅ Paid & confirmed (${pd.length})</h3>
 ${pd.map(([p,li])=>`<div class="row flex justify-between px-4 py-2 text-sm"><span>✓ ${esc(p.n)} ${idTag(p.n)}<br><span class="text-xs text-slate-400">${TIERS[li][0]}</span></span>${canAct(li)?`<button data-a="toRev" data-v="${li}|${esc(key(p.n))}" class="bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold">↩ Review</button>`:""}</div>`).join("")||`<p class="text-slate-500 text-sm">Nobody yet</p>`}</div>`:"")
 +(S.me?`<div class="card p-5 space-y-2"><h3 class="font-bold">🧾 My requests</h3>${mineP.map(p=>`<div class="row flex justify-between px-4 py-2 text-sm"><span>${esc(p.tier)} · $${p.amt}<br><span class="text-xs text-slate-400">ref ${esc(p.ref||"—")}</span></span><span class="${p.st==="approved"?"text-emerald-400":p.st==="rejected"?"text-red-400":"text-amber-400"}">${stl(p.st)}</span></div>`).join("")||`<p class="text-slate-500 text-sm">No requests yet</p>`}</div>`:"")}
function refresh(quiet){try{const o=JSON.parse(localStorage.getItem(KEY));if(o&&o.lv){const keep={menu:false,admin:S.admin,tab:S.tab,me:S.me,pv:S.pv,q:S.q};S=Object.assign(o,keep);ensure();applyPrices()}}catch(e){}
 render();if(!quiet){const r=$("rf");r.style.transition="transform .5s";r.style.transform="rotate(360deg)";setTimeout(()=>{r.style.transition="none";r.style.transform=""},520);toast("Refreshed ✅")}}
window.addEventListener("storage",e=>{if(e.key===KEY)refresh(true)});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh(true)});
function reqMsg(n,li,ref){return "PRIME CIRCLE — SEAT REQUEST\nID: "+idOf(n)+"\nName: "+n+"\nLevel: "+TIERS[li][0]+" ($"+TIERS[li][1]+")\nRef: "+ref+"\nCode: PCREQ|"+n+"|"+TIERS[li][0]+"|"+ref}
function importReq(txt){const m=String(txt).match(/PCREQ\|([^|\n]+)\|([^|\n]+)\|([^\n]*)/);if(!m)return "Invalid request message";
 const n=m[1].trim(),li=TIERS.findIndex(x=>x[0]===m[2].trim()),ref=m[3].trim();if(li<0)return "Unknown level";
 const L2=S.lv[li];if(L2.seats.some(x=>key(x.n)===key(n)))return n+" is already in "+TIERS[li][0];if(L2.seats.length>=N)return "Seats are full";
 const id=++S.pid;L2.seats.push({n,s:"review",ref,pid:id});S.pay.push({id,n,tier:TIERS[li][0],amt:TIERS[li][1],ref,d:today(),st:"requested"});idOf(n);
 note("staff",n+" requested a seat in "+TIERS[li][0]+" (ref "+ref+")");log(n+" request imported ("+TIERS[li][0]+")");S.tier=li;return ""}
const csv=rows=>rows.map(r=>r.map(c=>'"'+String(c==null?"":c).replace(/"/g,'""')+'"').join(",")).join("\n");
const payCsv=()=>csv([["Date","Name","Level","Amount","Reference","Status"],...S.pay.map(p=>[p.d,p.n,p.tier,p.amt,p.ref,p.st])]);
function dl(name,text){try{const a=document.createElement("a");a.href=URL.createObjectUR
