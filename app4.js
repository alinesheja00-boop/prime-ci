document.addEventListener("input",e=>{if(e.target.id==="mq"){S.q=e.target.value;$("mlist").innerHTML=memberRows()}});
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a,v=b.dataset.v;
 if(a==="menu"){S.menu=!S.menu;render();return}
 S.menu=false;
 if(a==="tab")S.tab=v;
 else if(a==="hdr"){if(S.me||S.admin){S.me=null;S.admin=false;S.tab="circle";toast("Logged out")}else S.tab="login"}
 else if(a==="shareWa"){window.open("https://wa.me/?text="+encodeURIComponent(S.last||""),"_blank");return}
 else if(a==="copyReq"){const j=S.last||"";(navigator.clipboard?navigator.clipboard.writeText(j):Promise.reject()).then(()=>toast("Copied ✅")).catch(()=>prompt("Copy this:",j));return}
 else if(a==="closeLast"){S.last=null}
 else if(a==="impReq"){if(!needStaff())return;const x=prompt("Paste the request message here:");if(!x)return;const err=importReq(x);if(err)return toast(err);toast("Request added ✅")}
 else if(a==="refresh"){refresh();return}
 else if(a==="lvl"){S.tier=+v;if(S.tab==="levels")S.tab="circle";if(!unlocked(S.tier))toast("🔒 Locked: only graduates from "+TIERS[S.tier-1][0]+" can join")}
 else if(a==="approve"){if(!needStaff())return;return finish(false)}
 else if(a==="grad"){if(!needStaff())return;return finish(true)}
 else if(a==="adm"){if(S.admin)S.admin=false;else{const p=prompt("Owner PIN:");if(p===null)return;if(p!==S.pin)return toast("Wrong PIN ❌");S.admin=true}}
 else if(a==="login"){const id=$("lEmail").value.trim().toLowerCase(),r=Object.values(S.mem).find(x=>(x.email||"").toLowerCase()===id)||S.mem[id];if(!id)return toast("Enter your email");if(!r||String(r.pin).trim()!==$("lPin").value.trim())return toast("Wrong email or password ❌");S.me=key(r.n);S.pick="";if(r.admin)S.admin=true;S.tab="more";toast("Welcome "+r.n+(r.admin?" 🛡 Admin":""))}
 else if(a==="register"){const n=$("lName").value.trim(),em=$("lEmail").value.trim().toLowerCase(),p=$("lPin").value.trim();if(!n)return toast("Enter your full name");if(!/^\S+@\S+\.\S+$/.test(em))return toast("Enter a valid email");if(Object.values(S.mem).some(x=>(x.email||"").toLowerCase()===em))return toast("This email already has an account");if(p.length<6)return toast("Password must be 6+ characters");if(S.mem[key(n)])return toast("This name already has an account");S.mem[key(n)]={n,email:em,pin:p,d:today()};S.me=key(n);S.tab="more";log(n+" registered");toast("Account created ✅ Your ID: "+idOf(n))}
 else if(a==="toRev"){const j=v.indexOf("|"),li=+v.slice(0,j),k=v.slice(j+1);if(!canAct(li))return toast("Only the admin or this level's receiver can do this");backToReview(li,k)}
 else if(a==="bioOn"){bioEnable();return}
 else if(a==="bioIn"){bioLogin(v);return}
 else if(a==="bioOff"){const o=bioGet();delete o[S.me];bioSet(o);toast("Face ID turned off")}
 else if(a==="pickAcc"){S.pick=v;S.tab="login"}
 else if(a==="switch"){S.me=null;S.admin=false;S.pick="";S.tab="login"}
 else if(a==="logout"){S.me=null;S.admin=false;toast("Logged out")}
 else if(a==="prof"){S.pv=v;S.tab="profile"}
 else if(a==="ok"){if(!needStaff())return;approveSeat(+v)}
 else if(a==="okS"||a==="rejS"){const [li,i]=v.split(",").map(Number),old=S.tier;S.tier=li;if(!needStaff()){S.tier=old;return}if(a==="okS")approveSeat(i);else rejectSeat(i);S.tier=old}
 else if(a==="rej"){if(!needStaff())return;rejectSeat(+v)}
 else if(a==="addG"){const n=$("gName").value.trim(),ref=($("gRef")?$("gRef").value.trim():"");
  if(v==="paid"&&!needAdmin())return;if(!n)return toast("Enter a name");
  if(v==="review"&&!ref)return toast("Enter your payment reference");
  if(!canJoin(n,S.tier))return toast("🔒 "+n+" must graduate from "+TIERS[S.tier-1][0]+" first");
  if(seats().some(s=>key(s.n)===key(n))||LV().joined.some(x=>!x.got&&key(x.n)===key(n)))return toast(n+" is already in this level");
  if(seats().length>=N)return toast("Seats are full");
  const id=++S.pid,p={n,s:v,ref:ref||"admin",pid:id};seats().push(p);
  S.pay.push({id,n,tier:TIERS[S.tier][0],amt:TIERS[S.tier][1],ref:ref||"admin",d:today(),st:v==="paid"?"approved":"requested"});
  if(v==="paid")joinPush(p);else{note("staff",n+" requested a seat in "+TIERS[S.tier][0]+" (ref "+ref+")");S.last=reqMsg(n,S.tier,ref)}
  log(n+(v==="paid"?" paid":" requested")+" ("+TIERS[S.tier][0]+")");toast(v==="paid"?"✓":"Request sent ✅")}
 else if(a==="rmR"){if(!needAdmin())return;const x=LV().joined.splice(+v,1)[0];S.done.unshift({n:x.n,amt:0,tier:TIERS[S.tier][0],type:"Removed",d:today()});log(x.n+" removed")}
 else if(a==="addM"){if(!needAdmin())return;const n=$("mName").value.trim(),em=$("mEmail").value.trim().toLowerCase(),p=$("mPin").value.trim();
  if(!n)return toast("Enter the full name");if(!/^\S+@\S+\.\S+$/.test(em))return toast("Enter a valid email");if(p.length<6)return toast("Password must be 6+ characters");
  if(S.mem[key(n)]&&S.mem[key(n)].email)return toast("This member already has an account");
  if(Object.values(S.mem).some(x=>(x.email||"").toLowerCase()===em))return toast("This email is already used");
  S.mem[key(n)]={n,email:em,pin:p,d:today()};log(n+" added as member ("+idOf(n)+")");toast("Member added ✅ "+idOf(n))}
 else if(a==="setM"){if(!needAdmin())return;const r=S.mem[v],nm=(people().find(x=>key(x.n)===v)||{}).n||v;const em=prompt("Email for "+nm+":",r?r.email||"":"");if(em===null)return;const e2=em.trim().toLowerCase();if(!/^\S+@\S+\.\S+$/.test(e2))return toast("Enter a valid email");
  if(Object.entries(S.mem).some(([k2,x])=>k2!==v&&(x.email||"").toLowerCase()===e2))return toast("This email is already used");
  const pn=prompt("New password for "+nm+" (6+ characters, empty = keep):","");if(pn===null)return;if(pn&&pn.length<6)return toast("Password must be 6+ characters");
  const cur0=r||{n:nm,pin:"",d:today()};if(!r&&!pn)return toast("Set a password for this new account");S.mem[v]=Object.assign(cur0,{email:e2},pn?{pin:pn}:{});log("Account updated for "+nm);toast("Saved ✅")}
 else if(a==="mkAdm"){if(!needAdmin())return;const r=S.mem[v];if(!r)return toast("This member has no account");r.admin=!r.admin;log(r.n+(r.admin?" made admin":" admin rights removed"));toast(r.admin?"Admin rights given 🛡":"Admin rights removed")}
 else if(a==="delM"){if(!needAdmin())return;if(!confirm("Remove "+v+" from all levels?"))return;S.lv.forEach(l=>{l.joined=l.joined.filter(x=>key(x.n)!==v);l.seats=l.seats.filter(s=>key(s.n)!==v)});delete S.access[v];delete S.mem[v];if(S.me===v)S.me=null;log(v+" removed from members");S.tab="more"}
 else if(a==="lockLv"){if(!needAdmin())return;S.lockLv=!S.lockLv;log(S.lockLv?"Levels locked (graduates only)":"All levels opened")}
 else if(a==="price"){if(!needAdmin())return;const p=prompt("New seat price for "+TIERS[+v][0]+" ($):",TIERS[+v][1]);if(p===null)return;const n=Number(p);if(!(n>0))return toast("Enter a valid price");S.prices[+v]=n;applyPrices();log(TIERS[+v][0]+" price set to $"+n)}
 else if(a==="bkCopy"){if(!needAdmin())return;const j=JSON.stringify(S);(navigator.clipboard?navigator.clipboard.writeText(j):Promise.reject()).then(()=>toast("Backup copied ✅")).catch(()=>prompt("Copy this backup:",j));return}
 else if(a==="bkRestore"){if(!needAdmin())return;const p=prompt("Paste your backup here:");if(!p)return;try{const o=JSON.parse(p);if(!Array.isArray(o.lv)||typeof o.tier!=="number")throw 0;S=o;ensure();S.admin=true;applyPrices();toast("Backup restored ✅")}catch(x){return toast("Invalid backup ❌")}}
 else if(a==="csvPay"){if(!needAdmin())return;dl("payments.csv",payCsv());return}
 else if(a==="csvMem"){if(!needAdmin())return;dl("members.csv",csv([["ID","Name","Email","Role","Levels"],...members().map(m=>[idOf(m.n),m.n,(S.mem[key(m.n)]||{}).email||"",isRecvOf(key(m.n))?"Receiver":"Giver",Object.entries(m.lv).map(([i,s])=>TIERS[i][0]+":"+s).join(" | ")])]));return}
 else if(a==="csvCopy"){if(!needAdmin())return;const j=payCsv();(navigator.clipboard?navigator.clipboard.writeText(j):Promise.reject()).then(()=>toast("Copied ✅")).catch(()=>prompt("Copy this:",j));return}
 else if(a==="print"){window.print();return}
 else if(a==="nClear"){S.notes=S.notes.filter(x=>!mine().includes(x))}
 else if(a==="clear"){if(!needAdmin())return;S.pay.forEach(p=>{if(p.st==="requested"&&p.tier===TIERS[S.tier][0])p.st="cancelled"});LV().seats=[];log("Seats cleared")}
 else if(a==="pin"){if(!needAdmin())return;const p=prompt("New admin PIN (4+ digits):");if(p&&/^\d{4,}$/.test(p)){S.pin=p;toast("PIN changed ✅")}}
 else if(a==="reset"){if(!needAdmin())return;if(!confirm("Reset everything? (accounts are kept)"))return;const pin=S.pin,pr=S.prices,mem=S.mem,nums=S.nums,nn=S.nextNo;S=fresh();S.pin=pin;S.prices=pr;S.mem=mem;S.nums=nums;S.nextNo=nn;S.admin=true;S.total=0;S.rounds=0;S.lv=TIERS.map(()=>({seats:[],joined:[]}));S.pay=[];S.pid=0;S.tab="more"}
 render()});
render();
window.PC2=1;
