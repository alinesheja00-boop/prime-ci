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
function dl(name,text){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/csv"}));a.download=name;document.body.appendChild(a);a.click();a.remove()}catch(e){prompt("Copy this:",text)}}

document.write('<script src="app4.js"><\/script>');
