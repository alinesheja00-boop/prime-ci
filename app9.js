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
  if(!id){toast("Enter your email");return}
  var r=Object.values(S.mem).find(function(x){return (x.email||"").toLowerCase()===id})||S.mem[id];
  if(!r){toast("Wrong email or password ❌");return}
  h(pw).then(function(x){var ok=String(r.pin).trim()===pw||String(r.pin)==="sha:"+x;
   if(!ok){toast("Wrong email or password ❌");return}
   S.me=key(r.n);S.pick="";if(r.admin)S.admin=true;S.tab="more";toast("Welcome "+r.n+(r.admin?" 🛡 Admin":""));render()});return}
},true);
window.PC9=1;
init();
})();
