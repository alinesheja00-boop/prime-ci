(function(){TIERS.length=0;[["Bronze",25],["Silver",50],["Gold",100],["Platinum",250],["Sapphire",500],["Emerald",1000],["Ruby",2500],["Diamond",5000]].forEach(function(x){TIERS.push(x)});var _e=ensure;ensure=function(){_e();while(S.lv.length<TIERS.length)S.lv.push({seats:[],joined:[]});if(!Array.isArray(S.prices)||S.prices.length!==TIERS.length)S.prices=TIERS.map(function(x){return x[1]})};ensure();applyPrices();if(S.tier>=TIERS.length)S.tier=0})();
(function(){
function autoRound(){var did=false;
 for(var li=0;li<TIERS.length;li++){var l=S.lv[li];
  while(l.seats.filter(function(x){return x.s==="paid"}).length>=N&&l.joined.some(function(x){return !x.got})){
   var T0=TIERS[li],amt=T0[1]*N,r=l.joined.find(function(x){return !x.got}),msg="";
   r.got=true;S.total+=amt;S.rounds++;
   S.done.unshift({n:r.n,amt:amt,tier:T0[0],type:"Graduate",d:today()});l.seats=l.seats.filter(function(x){return x.s!=="paid"});
   note(key(r.n),"You received $"+amt+" in "+T0[0]+" ✅");
   if(li<TIERS.length-1){var k=key(r.n),old=S.access[k];S.access[k]={n:r.n,l:Math.max(old?old.l:0,li+1)};msg=" · moved to "+TIERS[li+1][0]+" 🔓";note(k,"You moved up to "+TIERS[li+1][0]+" 🔓");
    var L2=S.lv[li+1];if(!L2.joined.some(function(x){return key(x.n)===k&&!x.got})){L2.joined.push({no:(L2.joined.length?Math.max.apply(null,L2.joined.map(function(x){return x.no})):0)+1,n:r.n,d:today(),got:false})}}
   var nx=l.joined.find(function(x){return !x.got});
   if(nx)note(key(nx.n),"You are now the receiver 👑 in "+T0[0]);
   log(r.n+" received $"+amt+" (auto) "+T0[0]+(nx?" | Next: "+nx.n:""));
   toast(r.n+" received $"+amt+msg+(nx?" · Next: "+nx.n+" 👑":""));
   did=true}}
 return did}
var VIP={0:["jasher"],1:["prime","jasher","jay"],2:["prime","jasher","jay"],3:["prime","jasher","jay"],4:["prime","jasher","jay"],5:["prime","jasher","jay"],6:["prime","jasher","jay"],7:["prime","jasher","jay"]},VN={prime:"Prime",jasher:"Jasher",jay:"Jay"};
function nm(k){return (S.vn&&S.vn[k])||VN[k]}
function vk(k){return key(nm(k))}
function ren(on,nn){var ok=key(on),nk=key(nn);
 S.lv.forEach(function(l){l.joined.forEach(function(x){if(key(x.n)===ok)x.n=nn});l.seats.forEach(function(x){if(key(x.n)===ok)x.n=nn})});
 S.pay.forEach(function(p){if(key(p.n)===ok)p.n=nn});S.done.forEach(function(d){if(key(d.n)===ok)d.n=nn});
 if(ok!==nk){
  if(S.mem[ok]){S.mem[nk]=Object.assign(S.mem[ok],{n:nn});delete S.mem[ok]}else if(S.mem[nk])S.mem[nk].n=nn;
  if(S.access[ok]){S.access[nk]=Object.assign(S.access[ok],{n:nn});delete S.access[ok]}
  if(S.nums[ok]){if(!S.nums[nk])S.nums[nk]=S.nums[ok];delete S.nums[ok]}
  S.notes.forEach(function(x){if(x.to===ok)x.to=nk});
  if(S.me===ok)S.me=nk;if(S.pv===ok)S.pv=nk}
 else if(S.mem[ok])S.mem[ok].n=nn}
window.vipNm=nm;
window.vipRename=function(base,nn){nn=String(nn||"").trim();if(!nn)return "Enter a name";var on=nm(base);if(key(nn)!==key(on)&&S.mem[key(nn)])return "That name already has an account";
 ren(on,nn);S.vn=S.vn||{};S.vn[base]=nn;log(on+" renamed to "+nn);ensureVIP();sortQ();return ""};
function ensureVIP(){var ch=false;
 S.lv.forEach(function(l,li){(VIP[li]||[]).forEach(function(k){
  if(!l.joined.some(function(x){return key(x.n)===vk(k)})){l.joined.push({no:l.joined.length+1,n:nm(k),d:today(),got:false});ch=true}})});
 return ch}
function sortQ(){var ch=false;
 S.lv.forEach(function(l,li){var tn=TIERS[li][0];
  var w=l.joined.filter(function(x){return !x.got});
  var idx=function(x){var vp=(VIP[li]||[]).map(vk).indexOf(key(x.n));if(vp>=0)return -100+vp;var ids=S.pay.filter(function(p){return key(p.n)===key(x.n)&&p.tier===tn}).map(function(p){return p.id});return ids.length?Math.min.apply(null,ids):1e9};
  var s=w.map(function(x,i){return {x:x,i:i,k:idx(x)}}).sort(function(a,b){return a.k-b.k||a.i-b.i}).map(function(o){return o.x});
  var g=l.joined.filter(function(x){return x.got}),nj=g.concat(s);
  if(nj.some(function(x,i){return x!==l.joined[i]})){l.joined=nj;ch=true}
  l.joined.forEach(function(x,i){if(x.no!==i+1){x.no=i+1;ch=true}})});
 return ch}
function sortS(){var ch=false;S.lv.forEach(function(l){var p=l.seats.filter(function(x){return x.s==="paid"}),r=l.seats.filter(function(x){return x.s!=="paid"}),n=p.concat(r);if(n.some(function(x,i){return x!==l.seats[i]})){l.seats=n;ch=true}});return ch}
function tick(){var v=ensureVIP(),a=sortQ(),b=autoRound(),c=sortS();return v||a||b||c}
window.autoRound=autoRound;window.sortQ=sortQ;
document.addEventListener("click",function(){setTimeout(function(){if(tick())render()},0)});
if(tick())render();
window.PC7=1;
})();
