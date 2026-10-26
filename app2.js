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

document.write('<script src="app3.js"><\/script>');
