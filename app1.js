const TIERS=[["Bronze",25],["Silver",50],["Gold",100],["Platinum",200],["Diamond",400]],N=8,KEY="primeCircleV5";
const L={overview:"Overview",levels:"Levels",circle:"Circle",payments:"Payments",more:"Settings",received:"Received",review:"Requests",rounds:"Full rounds",givers:"Givers list",paid:"Paid",wait:"In review",empty:"Empty",seats:"seats paid",app:"Approved Receive ✅",grad:"Receiver Confirm & Graduate 🚀",recv:"RECEIVER",level:"LEVEL",
 how:"How it works",h1:"1. Enter your payment reference (MoMo transaction ID) and tap Request.",h2:"2. Send the request message to the receiver (WhatsApp). The receiver pastes it here, checks the reference and taps ✔ Approve.",h3:"3. Approved people join the Receivers list in order. #1 receives first.",h4:"4. All levels are open to everyone. A receiver who taps Graduate also earns a 🎓 badge for the next level.",
 s1:"1️⃣ Requests (in review until payment is confirmed)",s2:"2️⃣ Paid (approved)",s3:"3️⃣ Receivers list (paid only)",s4:"✅ Already received",s5:"🎓 Graduates (level access)",ask:"Request",ok:"✔ Approve",now:"👑 Receiving now",none:"Nobody yet",rm:"Remove"};
const t=k=>L[k],today=()=>new Date().toLocaleDateString();
const names=["Eliora","Jasher","Vandame","Ineza","Jay","Ivan","Kevin","Irene"];
function fresh(){const lv=TIERS.map(()=>({seats:[],joined:[]}));
 const pay=[];let pid=0;
 lv[0].seats=names.map(n=>{const id=++pid;pay.push({id,n,tier:"Bronze",amt:25,ref:"—",d:today(),st:"requested"});return {n,s:"review",ref:"—",pid:id}});
 lv[0].joined=[{no:1,n:"Prime",d:today(),got:true}];
 return {tab:"circle",tier:0,total:200,rounds:1,pin:"1234",admin:false,hist:[],done:[{n:"Prime",amt:200,tier:"Bronze",type:"Approved",d:today()}],access:{},lv,mem:{},notes:[],pay,pid,me:null}}
function load(){for(const k of [KEY,"primeCircleV4"]){try{const o=JSON.parse(localStorage.getItem(k));if(o&&o.lv)return o}catch(e){}}return null}
let S=load()||fresh();
function ensure(){S.mem=S.mem||{};S.notes=S.notes||[];S.pay=S.pay||[];S.pid=S.pid||0;S.me=S.me||null;S.nums=S.nums||{};S.nextNo=S.nextNo||Object.keys(S.nums).length;S.done=S.done||[];S.access=S.access||{};S.hist=S.hist||[]}
ensure();S.admin=false;
(function(){const j=S.lv&&S.lv[0]&&S.lv[0].joined,p=j&&j.find(x=>x.n==="Prime"&&!x.got);
 if(p&&S.total===200&&S.rounds===1&&!S.done.some(d=>d.n==="Prime")){p.got=true;S.done.unshift({n:"Prime",amt:200,tier:"Bronze",type:"Approved",d:today()});S.lv[0].seats=[]}})();
const applyPrices=()=>{if(!Array.isArray(S.prices))S.prices=TIERS.map(x=>x[1]);TIERS.forEach((x,i)=>{x[1]=S.prices[i]||x[1]})};
applyPrices();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const toast=m=>{const e=$("toast");e.textContent=m;e.classList.remove("hidden");setTimeout(()=>e.classList.add("hidden"),2600)};
const log=m=>{S.hist.unshift(new Date().toLocaleString()+" — "+m);S.hist=S.hist.slice(0,12)};
const key=n=>String(n).trim().toLowerCase();
const idOf=n=>{const k=key(n);if(!S.nums[k])S.nums[k]=++S.nextNo;return "PC-"+String(S.nums[k]).padStart(3,"0")};
const idTag=n=>`<span class="text-amber-400 text-xs font-mono">${idOf(n)}</span>`;
const LV=()=>S.lv[S.tier],seats=()=>LV().seats;
const paid=()=>seats().filter(x=>x.s==="paid").length,rev=()=>seats().filter(x=>x.s==="review").length;
const waiting=()=>LV().joined.filter(x=>!x.got),cur=()=>(waiting()[0]||{n:"—"}).n;
const unlocked=i=>i===0||!S.lockLv||Object.values(S.access).some(a=>a.l>=i);
const canJoin=(n,i)=>i===0||!S.lockLv||((S.access[key(n)]||{l:0}).l>=i);
const joinPush=p=>{const j=LV().joined;j.push({no:(j.length?Math.max(...j.map(x=>x.no)):0)+1,n:p.n,d:today(),got:false})};
const me=()=>S.me?S.mem[S.me]:null;
const isRecvOf=k=>S.lv.some(l=>{const w=l.joined.find(x=>!x.got);return w&&key(w.n)===k});
const isRecv=()=>{const w=waiting()[0];return !!(S.me&&w&&key(w.n)===S.me)};
const staff=()=>S.admin||isRecv();
const role=()=>S.admin?"Admin":S.me?(isRecvOf(S.me)?"Receiver":"Giver"):"Guest";
const needAdmin=()=>S.admin||(toast("Admin only"),false);
const needStaff=()=>staff()||(toast("Only the admin or the current receiver can do this"),false);
const note=(to,msg)=>{S.notes.unshift({to,msg,d:new Date().toLocaleString(),read:false});S.notes=S.notes.slice(0,60)};
const mine=()=>S.notes.filter(x=>x.to==="all"||(x.to==="staff"&&staff())||(S.me&&x.to===S.me));
const unread=()=>mine().filter(x=>!x.read).length;
const payRec=id=>S.pay.find(p=>p.id===id);
const back=`<button data-a="tab" data-v="more" class="text-sm text-amber-400">← Back to Settings</button>`;
const stTxt=s=>s==="received"?"✅ received":s==="waiting"?"🟡 waiting":"⏳ requested";

function people(){const m={};const add=n=>{const k=key(n);idOf(n);return m[k]=m[k]||{n,lv:{}}};
 Object.values(S.mem).forEach(r=>{add(r.n).reg=true});
 S.lv.forEach((l,li)=>{l.joined.forEach(x=>{add(x.n).lv[li]=x.got?"received":"waiting"});l.seats.forEach(s=>{if(s.s==="review"){const o=add(s.n);if(!o.lv[li])o.lv[li]="requested"}})});
 Object.values(S.access).forEach(a=>{add(a.n).access=a.l});
 return Object.values(m).sort((a,b)=>a.n.localeCompare(b.n))}
const members=()=>people().filter(m=>m.reg);
function memberRows(){const q=(S.q||"").toLowerCase(),ms=members().filter(m=>m.n.toLowerCase().includes(q)||idOf(m.n).toLowerCase().includes(q));
 return ms.map(m=>{const k=key(m.n);return `<li data-a="prof" data-v="${esc(k)}" class="bg-[#1a1c28] rounded-2xl px-4 py-2 text-sm"><div class="flex justify-between items-center"><b>${esc(m.n)} ${idTag(m.n)} ${(S.mem[k]||{}).admin?"🛡":""} ${m.reg?"":"<span class='text-xs text-slate-500'>(no account)</span>"}</b><span class="text-xs text-slate-400">${isRecvOf(k)?"👑 Receiver":"Giver"} ›</span></div><div class="text-xs text-slate-400 mt-1">${Object.entries(m.lv).map(([i,s])=>`${TIERS[i][0]}: ${stTxt(s)}`).join(" · ")||"—"}${m.access!==undefined?` · 🎓 access to ${TIERS[m.access][0]}`:""}</div></li>`}).join("")||`<li class='text-slate-500 text-sm'>No members found</li>`}

function levelBar(){return `<div class="flex gap-2 overflow-x-auto pb-1">${TIERS.map((x,i)=>`<button data-a="lvl" data-v="${i}" class="shrink-0 px-3 py-1 rounded-full text-sm font-bold ${i===S.tier?"bg-amber-500 text-black":"bg-[#1a1c28] text-slate-300"}">${unlocked(i)?"":"🔒 "}${x[0]}</button>`).join("")}</div>`}
function ring(){let h="";for(let i=0;i<N;i++){const a=(-90+i*45)*Math.PI/180,x=150+120*Math.cos(a)-28,y=150+120*Math.sin(a)-28,p=seats()[i];
 h+=`<div class="seat ${p?(p.s==="review"?"review":""):"empty"}" style="left:${x}px;top:${y}px">${p?esc(p.n[0].toUpperCase()):""}</div>`}return h}
function stats(){return `<div class="grid grid-cols-3 gap-2 text-center">${[[t("received"),"$"+S.total],[t("review"),rev()],[t("rounds"),S.rounds]].map(a=>`<div class="bg-[#1a1c28] rounded-2xl py-3"><div class="text-xs text-slate-400">${a[0]}</div><div class="text-xl font-bold">${a[1]}</div></div>`).join("")}</div>`}
function givers(){return `<h3 class="font-bold mt-2">${t("givers")}</h3><div class="space-y-2">${Array.from({length:N},(_,i)=>{const p=seats()[i];return `<div class="row flex justify-between px-4 py-3"><span><span class="text-slate-500 font-mono mr-2">${i+1}.</span>${p?esc(p.n):"—"}</span><span class="${p&&p.s==="paid"?"text-amber-400":"text-slate-500"}">${p?(p.s==="paid"?"✓ "+t("paid"):"⏳ "+t("wait")):t("empty")}</span></div>`}).join("")}</div>`}

function circle(){const T0=TIERS[S.tier],full=paid()>=N;
 return levelBar()+`<div class="card p-5"><div class="flex justify-between items-end"><div><div class="text-cyan-300 text-xs tracking-widest">${t("level")} ${S.tier+1}</div><div class="text-2xl font-bold">${T0[0]}</div><div class="text-slate-400">$${T0[1]} / seat</div></div><div class="text-right"><div class="text-3xl font-bold text-cyan-300">${paid()}/${N}</div><div class="text-xs text-slate-400">${t("seats")}</div></div></div>
 <div class="relative mx-auto my-4" style="width:300px;height:300px"><div class="absolute rounded-full border-2 border-dashed border-amber-700" style="inset:30px"></div>${ring()}
 <div class="absolute rounded-full bg-[#f19e4a] text-black text-center flex flex-col items-center justify-center" style="width:130px;height:130px;left:85px;top:85px">👑<b>${esc(cur())}</b><span class="text-xs">${t("recv")}</span></div></div>
 <button data-a="tab" data-v="payments" class="btn bg-blue-600 mt-4">➕ Request a seat in ${T0[0]}</button>
 ${stats()}${givers()}
 ${full?(staff()?`<div class="space-y-2 mt-4"><button data-a="approve" class="btn bg-emerald-500">${t("app")}</button><button data-a="grad" class="btn bg-gradient-to-r from-amber-400 to-orange-500 text-black">${t("grad")}</button></div>`:`<p class="text-sm text-amber-400 mt-4 text-center">All seats paid. Waiting for the receiver (${esc(cur())}) to confirm.</p>`):""}</div>`}

function overview(){const ac=Object.values(S.access);
 return `<div class="card p-5 space-y-3"><div class="text-slate-400">Prime Circle</div><div class="text-4xl font-bold text-amber-400">$${S.total}</div>${stats()}
 <h3 class="font-bold">${t("s5")} (${ac.length})</h3><ul class="space-y-2">${ac.map(a=>`<li class="row flex justify-between px-4 py-2 text-sm"><span>🎓 ${esc(a.n)}</span><span class="text-emerald-400">🔓 ${TIERS[a.l][0]}</span></li>`).join("")||`<li class='text-slate-500 text-sm'>${t("none")}</li>`}</ul>
 <h3 class="font-bold">${t("s4")} (${S.done.length})</h3><ul class="space-y-2">${S.done.map((x,i)=>`<li class="row flex justify-between items-center px-4 py-2 text-sm"><span>${i+1}. ${esc(x.n)}<br><span class="text-xs text-slate-400">${x.d} · ${x.tier}</span></span><span class="${x.type==="Removed"?"text-red-400":"text-emerald-400"}">${x.type==="Removed"?"✖":"✓ $"+x.amt}</span></li>`).join("")||`<li class='text-slate-500 text-sm'>${t("none")}</li>`}</ul>
 <h3 class="font-bold">History</h3><ul class="text-xs text-slate-300 space-y-1">${S.hist.map(h=>`<li>• ${esc(h)}</li>`).join("")||"<li class='text-slate-500'>—</li>"}</ul></div>`}

function levels(){return TIERS.map((x,i)=>{const g=Object.values(S.access).filter(a=>a.l>=i).map(a=>esc(a.n)).join(", "),pc=S.lv[i].seats.filter(s=>s.s==="paid").length;
 return `<button data-a="lvl" data-v="${i}" class="card p-4 w-full text-left ${i===S.tier?"border-cyan-400":""}"><div class="flex justify-between items-center"><div><div class="text-xs text-cyan-300">${t("level")} ${i+1}</div><div class="text-xl font-bold">${x[0]}</div></div><div class="text-right"><div>$${x[1]} × ${N} = <b>$${x[1]*N}</b></div><div class="text-xs text-slate-400">${pc}/${N} · ${i===S.tier?"● Viewing":unlocked(i)?"🔓 Open":"🔒 Locked"}</div></div></div>${i>0&&g?`<div class="text-xs text-emerald-400 mt-2">🎓 Access: ${g}</div>`:""}</button>`}).join("")}

function payments(){const sx=seats(),rq=sx.map((p,i)=>[p,i]).filter(x=>x[0].s==="review"),ap=sx.filter(p=>p.s==="paid"),w=waiting(),none=`<p class='text-slate-500 text-sm'>${t("none")}</p>`,m=me();
 return levelBar()+`<div class="card p-5 space-y-3">
 <div class="bg-[#1a1c28] rounded-2xl p-3 space-y-2 border border-blue-500"><div class="font-bold text-blue-300">➕ Request a seat — ${TIERS[S.tier][0]} ($${TIERS[S.tier][1]})</div>
 <input id="gName" class="in" placeholder="Your name" value="${esc(m?m.n:"")}" ${m&&!S.admin?"readonly":""}>
 <div class="flex gap-2"><input id="gRef" class="in" placeholder="Payment reference (MoMo ID)"><button data-a="addG" data-v="review" class="bg-blue-600 font-bold px-4 rounded-xl">${t("ask")}</button></div>
 ${S.admin?`<button data-a="addG" data-v="paid" class="btn bg-emerald-700 text-sm">+ ${t("paid")} (admin)</button>`:""}
 </div>
 ${S.last?`<div class="bg-[#1a1c28] rounded-2xl p-3 space-y-2 border border-emerald-500"><div class="font-bold text-emerald-300">✅ Request saved — now send it to the receiver</div><pre class="text-xs whitespace-pre-wrap text-slate-300">${esc(S.last)}</pre><div class="grid grid-cols-2 gap-2"><button data-a="shareWa" class="btn bg-emerald-600 text-sm">Send on WhatsApp</button><button data-a="copyReq" class="btn bg-slate-600 text-sm">Copy message</button></div><button data-a="closeLast" class="text-xs text-slate-400">Close</button></div>`:""}
 ${staff()?`<button data-a="impReq" class="btn bg-amber-500 text-black">📥 Paste a request from a member</button>`:""}
 <div class="bg-[#1a1c28] rounded-2xl p-3 text-sm space-y-1"><b class="text-amber-400">${t("how")}</b><div>${t("h1")}</div><div>${t("h2")}</div><div>${t("h3")}</div><div>${t("h4")}</div></div>
  <h3 class="font-bold pt-2">${t("s1")} (${rq.length})</h3>
 ${rq.map(([p,i])=>`<div class="row flex justify-between items-center px-4 py-2"><span>${esc(p.n)} ${idTag(p.n)}<br><span class="text-xs text-slate-400">ref: ${esc(p.ref||"—")}</span></span>${staff()?`<span class="flex gap-1"><button data-a="ok" data-v="${i}" class="bg-emerald-500 px-3 py-1 rounded-full text-sm font-bold">${t("ok")}</button><button data-a="rej" data-v="${i}" class="bg-red-600 px-3 py-1 rounded-full text-sm font-bold">✖</button></span>`:`<span class="text-slate-400 text-sm">⏳ ${t("wait")}</span>`}</div>`).join("")||none}
 <h3 class="font-bold pt-2">${t("s2")} (${ap.length})</h3>
 ${ap.map(p=>`<div class="row px-4 py-2 text-amber-400">✓ ${esc(p.n)} ${idTag(p.n)}</div>`).join("")||none}
 <h3 class="font-bold pt-2">${t("s3")} (${w.length})</h3>
 <ul class="space-y-2">${w.map((x,i)=>`<li class="row flex justify-between items-center px-4 py-2 text-sm"><span><b class="text-amber-400">#${x.no}</b> ${esc(x.n)} ${idTag(x.n)}${i===0?`<br><span class="text-xs text-emerald-400">${t("now")}</span>`:""}</span><span class="flex items-center gap-2"><span class="text-xs text-slate-400">${x.d}</span>${staff()?`<button data-a="toRev" data-v="${S.tier}|${esc(key(x.n))}" class="bg-amber-500 text-black px-2 py-1 rounded-full text-xs font-bold">↩ Review</button>`:""}${S.admin?`<button data-a="rmR" data-v="${LV().joined.indexOf(x)}" class="text-red-400 text-xs">${t("rm")}</button>`:""}</span></li>`).join("")||none}</ul></div>`}

function notes(){const ns=mine();
 return `<div class="card p-5 space-y-3">${back}<h3 class="font-bold">🔔 Notifications (${ns.length})</h3>
 <div class="grid grid-cols-2 gap-2"><button data-a="nClear" class="btn bg-slate-600 text-sm">Clear mine</button><button data-a="tab" data-v="payments" class="btn bg-blue-600 text-sm">Go to Payments</button></div>
 <ul class="space-y-2">${ns.map(x=>`<li class="bg-[#1a1c28] rounded-2xl px-4 py-2 text-sm"><div>${esc(x.msg)}</div><div class="text-xs text-slate-500">${esc(x.d)}</div></li>`).join("")||`<li class='text-slate-500 text-sm'>No notifications</li>`}</ul></div>`}

function login(){const accs=Object.values(S.mem).filter(x=>x.email);return `<div class="card p-5 space-y-3">${back}<h3 class="font-bold">👤 Login / Register</h3>
 ${accs.length?`<div class="text-sm text-slate-400">Accounts on this device — tap one, then enter its password:</div><div class="space-y-2">${accs.map(a=>`<button data-a="pickAcc" data-v="${esc(a.email)}" class="w-full text-left rounded-2xl px-4 py-2 flex justify-between items-center ${S.pick===a.email?"bg-amber-500 text-black":"bg-[#1a1c28]"}"><span><b>${esc(a.n)}</b> ${a.admin?"🛡":""}<br><span class="text-xs opacity-70">${esc(a.email)}</span></span><span class="text-xs">${idOf(a.n)}</span></button>`).join("")}</div>`:""}
 ${accs.filter(a=>bioGet()[key(a.n)]).map(a=>`<button data-a="bioIn" data-v="${esc(key(a.n))}" class="btn bg-emerald-600">🙂 Log in with Face ID — ${esc(a.n)}</button>`).join("")}
 <input id="lEmail" class="in" type="email" placeholder="Email" autocapitalize="off" inputmode="email" value="${esc(S.pick||"")}"><input id="lName" class="in" placeholder="Full name (register only)"><input id="lPin" class="in" type="password" placeholder="Password (6+ characters)" autocomplete="current-password">
 <div class="grid grid-cols-2 gap-2"><button data-a="login" class="btn bg-emerald-600">Login</button><button data-a="register" class="btn bg-blue-600">Register</button></div>
 <p class="text-xs text-slate-500">Log in with your <b>email + password</b>. To create an account, fill email, full name and a password (6+ characters), then tap Register. Accounts are stored on this device only.</p><button data-a="adm" class="btn bg-slate-700 text-sm">🔑 Owner access (owner PIN)</button></div>`}

function profile(){const back=`<button data-a="tab" data-v="members" class="text-sm text-amber-400">← Back to Members</button>`;const k=S.pv,m=people().find(x=>key(x.n)===k);if(!m)return `<div class="card p-5 space-y-3">${back}<p>Member not found</p></div>`;
 const r=S.mem[k],see=S.admin||S.me===k,pays=S.pay.filter(p=>key(p.n)===k),got=S.done.filter(d=>key(d.n)===k);
 return `<div class="card p-5 space-y-3">${back}
 <div class="flex items-center gap-3"><div class="w-14 h-14 rounded-full bg-[#f19e4a] text-black text-2xl font-bold flex items-center justify-center">${esc(m.n[0].toUpperCase())}</div><div><div class="text-xl font-bold">${esc(m.n)}</div><div class="text-sm">🆔 <b class="text-amber-400 font-mono">${idOf(m.n)}</b></div><div class="text-xs text-slate-400">${isRecvOf(k)?"👑 Receiver":"Giver"}${r&&r.admin?" · 🛡 Admin":""}${r?" · joined "+esc(r.d):" · no account"}</div></div></div>
 ${see&&r?`<div class="text-sm">✉️ ${esc(r.email||r.phone||"—")}</div>`:""}
 ${m.access!==undefined?`<div class="text-sm text-emerald-400">🎓 Access up to ${TIERS[m.access][0]}</div>`:""}
 <h3 class="font-bold">Levels</h3><ul class="space-y-1 text-sm">${Object.entries(m.lv).map(([i,s])=>`<li class="row px-4 py-2 flex justify-between"><span>${TIERS[i][0]}</span><span>${stTxt(s)}</span></li>`).join("")||"<li class='text-slate-500'>—</li>"}</ul>
 <h3 class="font-bold">Payments (${pays.length})</h3><ul class="space-y-1 text-sm">${pays.map(p=>`<li class="row px-4 py-2 flex justify-between"><span>${esc(p.tier)} · $${p.amt}<br><span class="text-xs text-slate-400">${esc(p.d)} · ref ${esc(p.ref||"—")}</span></span><span class="${p.st==="approved"?"text-emerald-400":p.st==="rejected"?"text-red-400":"text-amber-400"}">${esc(p.st)}</span></li>`).join("")||"<li class='text-slate-500'>—</li>"}</ul>
 <h3 class="font-bold">Received (${got.length})</h3><ul class="space-y-1 text-sm">${got.map(d=>`<li class="row px-4 py-2 flex justify-between"><span>${esc(d.tier)} · ${esc(d.d)}</span><span>${d.type==="Removed"?"✖":"$"+d.amt}</span></li>`).join("")||"<li class='text-slate-500'>—</li>"}</ul>
 ${S.admin&&r?`<button data-a="mkAdm" data-v="${esc(k)}" class="btn ${r.admin?"bg-slate-600":"bg-amber-500 text-black"}">${r.admin?"Remove admin rights":"Make admin 🛡"}</button>`:""}
 ${S.admin?`<button data-a="setM" data-v="${esc(k)}" class="btn bg-blue-600">✉️ Set email / password</button><button data-a="delM" data-v="${esc(k)}" class="btn bg-red-600">Remove member</button>`:""}</div>`}

function reports(){if(!S.admin)return `<div class="card p-5 space-y-3">${back}<p class="text-sm">Reports are for the admin. Log in as admin in Settings.</p></div>`;
 const ap=S.pay.filter(p=>p.st==="approved"),pend=S.pay.filter(p=>p.st==="requested").length,sum=ap.reduce((a,p)=>a+p.amt,0);
 return `<div class="card p-5 space-y-3">${back}<h3 class="font-bold">📊 Reports</h3>
 <div class="grid grid-cols-2 gap-2 text-center">${[["Members",members().length],["Received","$"+S.total],["Payments approved","$"+sum],["Pending requests",pend]].map(a=>`<div class="bg-[#1a1c28] rounded-2xl py-3"><div class="text-xs text-slate-400">${a[0]}</div><div class="text-xl font-bold">${a[1]}</div></div>`).join("")}</div>
 <h3 class="font-bold">By level</h3><ul class="space-y-2 text-sm">${TIERS.map((x,i)=>{const d=S.done.filter(z=>z.tier===x[0]&&z.type!=="Removed");return `<li class="row px-4 py-2 flex justify-between"><span>${x[0]} · $${x[1]}/seat</span><span>${S.lv[i].seats.filter(s=>s.s==="paid").length}/${N} seats · ${d.length} rounds · $${d.reduce((a,z)=>a+z.amt,0)}</span></li>`}).join("")}</ul>
 <h3 class="font-bold">Export</h3><div class="grid grid-cols-2 gap-2"><button data-a="csvPay" class="btn bg-slate-600 text-sm">Payments CSV</button><button data-a="csvMem" class="btn bg-slate-600 text-sm">Members CSV</button><button data-a="csvCopy" class="btn bg-slate-600 text-sm">Copy payments</button><button data-a="print" class="btn bg-slate-600 text-sm">Print / PDF</button></div></div>`}

function receiversView(){const w=waiting(),got=LV().joined.filter(x=>x.got),none=`<p class="text-slate-500 text-sm">${t("none")}</p>`;
 return levelBar()+`<div class="card p-5 space-y-3">${back}<h3 class="font-bold">👑 Receivers list — ${TIERS[S.tier][0]}</h3>
 <div class="text-sm text-slate-400">Only people whose payment is confirmed, in the order they joined. #1 receives first. (This is separate from the Members list.)</div>
 <ul class="space-y-2">${w.map((x,i)=>`<li data-a="prof" data-v="${esc(key(x.n))}" class="row flex justify-between items-center px-4 py-2 text-sm"><span><b class="text-amber-400">#${i+1}</b> ${esc(x.n)} ${idTag(x.n)}${i===0?`<br><span class="text-xs text-emerald-400">${t("now")}</span>`:""}</span><span class="flex items-center gap-2"><span class="text-xs text-slate-400">${x.d}</span>${canAct(S.tier)?`<button data-a="toRev" data-v="${S.tier}|${esc(key(x.n))}" class="bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold">↩ Review</button>`:""}</span></li>`).join("")||none}</ul>
 <h3 class="font-bold pt-2">✅ Already received (${got.length})</h3>
 <ul class="space-y-2">${got.map(x=>`<li class="row flex justify-between px-4 py-2 text-sm"><span>${esc(x.n)} ${idTag(x.n)}</span><span class="text-emerald-400">✓</span></li>`).join("")||none}</ul></div>`}
function membersView(){const ms=members(),reg=ms.filter(m=>m.reg).length;
 return `<div class="card p-5 space-y-3">${back}<h3 class="font-bold">👥 Members (${ms.length})</h3><div class="text-xs text-slate-500">Registered accounts only. The queue of people receiving is in <b>👑 Receivers list</b>.</div>${me()&&!S.admin?`<div class="text-sm">Your ID: <b class="text-amber-400 font-mono">${idOf(me().n)}</b> · view only</div>`:""}
 <div class="grid grid-cols-3 gap-2 text-center text-xs">${[["Total",ms.length],["With account",reg],["Receivers",ms.filter(m=>isRecvOf(key(m.n))).length]].map(a=>`<div class="bg-[#1a1c28] rounded-2xl py-2"><div class="text-slate-400">${a[0]}</div><div class="text-lg font-bold">${a[1]}</div></div>`).join("")}</div>
 ${S.admin?`<div class="bg-[#1a1c28] rounded-2xl p-3 space-y-2 border border-amber-600"><div class="font-bold text-amber-400">➕ Add member</div><input id="mName" class="in" placeholder="Full name"><input id="mEmail" class="in" type="email" placeholder="Email" autocapitalize="off"><input id="mPin" class="in" placeholder="Temporary password (6+ characters)"><button data-a="addM" class="btn bg-emerald-600">Add member</button></div>`:""}
 <input id="mq" class="in" placeholder="Search name or ID" value="${esc(S.q||"")}"><ul id="mlist" class="space-y-2">${memberRows()}</ul></div>`}
window.PC1=1;
