(function(){
var CFG={apiKey:"AIzaSyAUgoNEEDyIqS1zWlrUU18mmHJeuenxdHs",authDomain:"prime-circle-8ead8.firebaseapp.com",projectId:"prime-circle-8ead8",storageBucket:"prime-circle-8ead8.firebasestorage.app",messagingSenderId:"922370298368",appId:"1:922370298368:web:0eeb107dc49bb2db167ee5"};
var LOCAL=["me","admin","tab","pv","q","pick","last","menu","tier"];
var fb=null,db=null,ref=null,ready=false,offline=false,creating=false,busy=false,baseVer=0,lastJ="",timer=null,ptimer=null,pend=null;
function canon(v){if(Array.isArray(v))return "["+v.map(canon).join(",")+"]";
 if(v&&typeof v==="object")return "{"+Object.keys(v).sort().filter(function(k){return v[k]!==undefined}).map(function(k){return JSON.stringify(k)+":"+canon(v[k])}).join(",")+"}";
 return JSON.stringify(v)}
function shared(){var o={};Object.keys(S).forEach(function(k){if(LOCAL.indexOf(k)<0)o[k]=S[k]});return o}
function h(s){return crypto.subtle.digest("SHA-256",new TextEncoder().encode("pc1:"+s)).then(function(d){return Array.prototype.map.call(new Uint8Array(d),function(x){return ("0"+x.toString(16)).slice(-2)}).join("")})}
function prepare(){var jobs=[];
 Object.keys(S.mem||{}).forEach(function(k){var r=S.mem[k];if(r&&r.pin&&String(r.pin).indexOf("sha:")!==0)jobs.push(h(String(r.pin).trim()).then(function(x){r.pin="sha:"+x}))});
 if(S.pin&&String(S.pin).indexOf("sha:")!==0)jobs.push(h(String(S.pin)).then(function(x){S.pin="sha:"+x}));
 return Promise.all(jobs)}
function schedule(){if(!ready||offline)return;clearTimeout(timer);timer=setTimeout(push,700)}
function push(){if(busy){schedule();return}
 prepare().then(function(){var J=canon(shared());if(J===lastJ)return;busy=true;
  return fb.runTransaction(db,function(tx){return tx.get(ref).then(function(snap){var rv=snap.exists()?(snap.data().ver||0):0;if(rv!==baseVer)throw new Error("conflict");tx.set(ref,{json:J,ver:rv+1,ts:Date.now()});return rv+1})})
  .then(function(nv){baseVer=nv;lastJ=J})
  .catch(function(e){toast(String(e&&e.message).indexOf("conflict")>=0?"Someone else just made a change. Please check and repeat your action.":"Could not save online ⚠️")})
  .then(function(){busy=false})})}
function apply(d){var a=document.activeElement;
 if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName||"")){pend=d;clearTimeout(ptimer);ptimer=setTimeout(function(){if(pend){var x=pend;pend=null;apply(x)}},2500);return}
 var dirty=false;try{dirty=lastJ!==""&&canon(shared())!==lastJ}catch(e){}
 var o;try{o=JSON.parse(d.json)}catch(e){return}
 var keep={};LOCAL.forEach(function(k){keep[k]=S[k]});
 S=Object.assign(o,keep);ensure();applyPrices();baseVer=d.ver;lastJ=canon(shared());
 if(dirty)toast("Someone else just made a change. Please check and repeat your action.");
 render()}
function createDoc(){creating=true;
 if(!confirm("The shared database is empty. Create it from THIS phone's data? (Only the owner should do this.)")){creating=false;offline=true;toast("Not connected: this phone only");return}
 var p=prompt("Choose your Owner PIN (4+ digits):");
 if(!p||!/^\d{4,}$/.test(p)){creating=false;offline=true;toast("PIN must be 4+ digits. Reload and try again.");return}
 S.pin=p;ready=true;baseVer=0;lastJ="";creating=false;push()}
function online(){var r=document.getElementById("rf");if(r)r.textContent="☁️";toast("☁️ Shared data connected")}
function start(x){fb=x;db=x.db;ref=x.doc(db,"prime","state");
 fb.onSnapshot(ref,function(snap){
  if(!snap.exists()){if(!ready&&!creating&&!offline)createDoc();return}
  var d=snap.data();
  if(!ready){ready=true;online()}
  if(d.ver===baseVer)return;
  apply(d)},function(){offline=true;toast("Offline: working on this phone only")})}
function init(){
 var p=window.PC_FB_MOCK?Promise.resolve(window.PC_FB_MOCK):Promise.all([import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")]).then(function(m){var app=m[0].initializeApp(CFG),f=m[1];return {db:f.getFirestore(app),doc:f.doc,onSnapshot:f.onSnapshot,runTransaction:f.runTransaction}});
 p.then(start).catch(function(){offline=true;toast("Offline: working on this phone only")})}
var _r=render;render=function(){_r.apply(this,arguments);schedule()};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-a]");if(!b)return;var a=b.dataset.a;
 if(a==="adm"&&!S.admin){e.stopPropagation();S.menu=false;var p=prompt("Owner PIN:");if(p===null){render();return}
  h(p).then(function(x){if(S.pin===p||S.pin==="sha:"+x){S.admin=true;render()}else{toast("Wrong PIN ❌");render()}});return}
 if(a==="login"){e.stopPropagation();S.menu=false;
  var id=document.getElementById("lEmail").value.trim().toLowerCase(),pw=document.getElementById("lPin").value.trim();
  if(!id){toast("Enter your name or email");return}
  var r=Object.values(S.mem).find(function(x){return (x.email||"").toLowerCase()===id})||S.mem[key(id)]||Object.values(S.mem).find(function(x){return key(x.n)===key(id)});
  if(!r){toast("Wrong name/email or PIN ❌");return}
  h(pw).then(function(x){var ok=String(r.pin).trim()===pw||String(r.pin)==="sha:"+x;
   if(!ok){toast("Wrong name/email or PIN ❌");return}
   S.me=key(r.n);S.pick="";if(r.admin)S.admin=true;S.tab="more";toast("Welcome "+r.n+(r.admin?" 🛡 Admin":""));render()});return}
},true);
window.PC9=1;
init();
})();
(function(){
var _m=menuHtml;menuHtml=function(){return _m().replace(' onclick="event.stopPropagation()"','')};
function dedupe(){var ch=false;
 S.lv.forEach(function(l){var seen={},out=[];
  l.joined.forEach(function(x){var k=key(x.n);if(!x.got){if(seen[k]){ch=true;return}seen[k]=1}out.push(x)});
  if(out.length!==l.joined.length)l.joined=out});
 if(ch){if(window.sortQ)sortQ();render()}
 return ch}
document.addEventListener("click",function(){dedupe()});
dedupe();
function pm(){return S.payM||{}}
function payCard(){var p=pm(),T=TIERS[S.tier];
 var row=function(ic,tt,v,k){return '<div class="row px-4 py-2 text-sm"><div class="flex justify-between items-center gap-2"><b>'+ic+' '+tt+'</b>'+(v?'<button data-a="copyPay" data-v="'+k+'" class="text-amber-400 font-bold text-xs">Copy</button>':'')+'</div><div class="break-all text-slate-300 mt-1">'+(v?esc(v):'<span class="text-slate-500">Not set yet - ask the admin</span>')+'</div></div>'};
 return '<div class="bg-[#1a1c28] rounded-2xl p-3 space-y-2 border border-amber-500"><div class="font-bold text-amber-400">💳 How to pay - $'+T[1]+'</div>'+row('🏦','Zelle',p.zelle,'zelle')+row('🪙','USDC (Polygon network only)',p.usdc,'usdc')+'<div class="text-xs text-slate-400">Send exactly $'+T[1]+'. For crypto use <b>USDC on Polygon</b> only: other networks will lose your money. Then enter your payment reference / transaction ID below.</div>'+(S.admin?'<button data-a="editPay" class="btn bg-slate-600 text-sm">✏️ Edit payment info (admin)</button>':'')+'</div>'}
var _p=VIEWS.payments;VIEWS.payments=function(){var h=_p(),mk='<div class="bg-[#1a1c28] rounded-2xl p-3 space-y-2 border border-blue-500">',i=h.indexOf(mk);if(i>=0)h=h.slice(0,i)+payCard()+h.slice(i);return h.replace('Payment reference (MoMo ID)','Payment reference / transaction ID')};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-a]");if(!b)return;var a=b.dataset.a,v=b.dataset.v;
 if(a==="copyPay"){var x=pm()[v]||"";(navigator.clipboard?navigator.clipboard.writeText(x):Promise.reject()).then(function(){toast("Copied ✅")}).catch(function(){prompt("Copy this:",x)})}
 else if(a==="editPay"){if(!S.admin)return toast("Admin only");var p=pm();
  var z=prompt("Zelle (name + email or phone):",p.zelle||"");if(z===null)return;
  var u=prompt("USDC wallet address (Polygon network, starts with 0x):",p.usdc||"");if(u===null)return;
  u=u.trim();if(u&&!/^0x[0-9a-fA-F]{40}$/.test(u))return toast("That is not a valid Polygon/USDC address ❌");
  S.payM={zelle:z.trim(),usdc:u};log("Payment info updated");toast("Saved ✅");render()}
});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-a="addG"]');if(!b)return;e.stopPropagation();S.menu=false;
 var v=b.dataset.v,n=document.getElementById("gName").value.trim(),r0=document.getElementById("gRef"),ref=r0?r0.value.trim():"";
 if(v==="paid"&&!needAdmin())return;if(!n)return toast("Enter a name");
 if(v==="review"&&!ref)return toast("Enter your payment reference");
 if(!canJoin(n,S.tier))return toast("🔒 "+n+" must graduate from "+TIERS[S.tier-1][0]+" first");
 if(seats().some(function(s){return key(s.n)===key(n)})||LV().joined.some(function(x){return !x.got&&key(x.n)===key(n)}))return toast(n+" is already in this level");
 if(paid()>=N)return toast("Seats are full");
 var id=++S.pid,p={n:n,s:v,ref:ref||"admin",pid:id};seats().push(p);
 S.pay.push({id:id,n:n,tier:TIERS[S.tier][0],amt:TIERS[S.tier][1],ref:ref||"admin",d:today(),st:v==="paid"?"approved":"requested"});
 if(v==="paid")joinPush(p);else{note("staff",n+" requested a seat in "+TIERS[S.tier][0]+" (ref "+ref+")");S.last=reqMsg(n,S.tier,ref)}
 log(n+(v==="paid"?" paid":" requested")+" ("+TIERS[S.tier][0]+")");toast(v==="paid"?"✓":"Request sent ✅");
 if(window.sortQ)sortQ();if(window.autoRound)autoRound();render()},true);
var _mo=VIEWS.more;VIEWS.more=function(){var h=_mo();if(!S.admin)return h;var c=S.pay.filter(function(p){return p.st==="cancelled"}).length,mk='<div class="card p-5 space-y-3"><h3 class="font-bold">💾 Backup</h3>',i=h.indexOf(mk);
 if(i>=0)h=h.slice(0,i)+'<div class="card p-5 space-y-2"><h3 class="font-bold">♻️ Restore requests</h3><div class="text-sm text-slate-400">'+c+' cancelled request(s) can be put back in review.</div><button data-a="restoreReq" class="btn bg-amber-500 text-black">♻️ Restore cancelled requests</button></div>'+h.slice(i);return h};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-a="restoreReq"]');if(!b)return;
 if(!S.admin)return toast("Admin only");var n=0,seen={};
 S.pay.slice().reverse().forEach(function(p){if(p.st!=="cancelled")return;var li=TIERS.findIndex(function(x){return x[0]===p.tier});if(li<0)return;var l=S.lv[li],k=key(p.n),sk=li+"|"+k;if(seen[sk])return;seen[sk]=1;
  if(l.seats.some(function(x){return key(x.n)===k})||l.joined.some(function(x){return !x.got&&key(x.n)===k})){p.st="rejected";return}
  l.seats.push({n:p.n,s:"review",ref:p.ref||"-",pid:p.id});p.st="requested";n++});
 log("Restored "+n+" requests");toast(n?"Restored "+n+" request(s) ✅":"Nothing to restore");if(window.sortQ)sortQ();render()});
var _ml=menuHtml;menuHtml=function(){return _ml().replace('<div class="text-xs text-slate-400 pt-2 px-1">ACCOUNTS</div>','').replace(/<button data-a="pickAcc"[\s\S]*?<\/button>/g,'')};
VIEWS.login=function(){var bio=Object.values(S.mem).filter(function(x){return x.email&&bioGet()[key(x.n)]}).map(function(a){return '<button data-a="bioIn" data-v="'+esc(key(a.n))+'" class="btn bg-emerald-600">🙂 Log in with Face ID - '+esc(a.n)+'</button>'}).join("");
 return '<div class="card p-5 space-y-3"><h3 class="font-bold">👤 Log in</h3>'+bio+'<input id="lEmail" class="in" placeholder="Your name or email" autocapitalize="off" autocomplete="username"><input id="lPin" class="in" type="password" placeholder="PIN (4+ digits) or password" autocomplete="current-password"><button data-a="login" class="btn bg-emerald-600">Log in</button>'
 +'<div class="border-t border-slate-700 pt-3 space-y-2"><div class="font-bold text-sm text-amber-400">New here? Create an account</div><input id="rName" class="in" placeholder="Full name"><input id="rEmail" class="in" type="email" placeholder="Email" autocapitalize="off" inputmode="email"><input id="rPin" class="in" type="password" placeholder="Choose a PIN (4+ digits)"><button data-a="register" class="btn bg-blue-600">Create account</button></div>'
 +'<button data-a="adm" class="btn bg-slate-700 text-sm">🔑 Owner access (owner PIN)</button></div>'};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-a="register"]');if(!b)return;e.stopPropagation();S.menu=false;
 var g=function(i){var x=document.getElementById(i);return x?x.value.trim():""},n=g("rName"),em=g("rEmail").toLowerCase(),p=g("rPin");
 if(!n)return toast("Enter your full name");if(!/^\S+@\S+\.\S+$/.test(em))return toast("Enter a valid email");if(p.length<4)return toast("PIN must be 4+ characters");
 if(Object.values(S.mem).some(function(x){return (x.email||"").toLowerCase()===em}))return toast("This email already has an account");
 if(S.mem[key(n)])return toast("This name already has an account");
 S.mem[key(n)]={n:n,email:em,pin:p,d:today()};S.me=key(n);S.tab="more";log(n+" registered");toast("Account created ✅ Your ID: "+idOf(n));render()},true);
if(S.me&&S.mem[S.me]&&S.mem[S.me].admin&&!S.admin){S.admin=true;render()}
window.PC8=1;
})();
