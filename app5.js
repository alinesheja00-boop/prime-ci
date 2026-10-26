(function(){
function autoRound(){var did=false;
 for(var li=0;li<TIERS.length;li++){var l=S.lv[li];
  while(l.seats.filter(function(x){return x.s==="paid"}).length>=N&&l.joined.some(function(x){return !x.got})){
   var T0=TIERS[li],amt=T0[1]*N,r=l.joined.find(function(x){return !x.got}),msg="";
   r.got=true;S.total+=amt;S.rounds++;
   S.done.unshift({n:r.n,amt:amt,tier:T0[0],type:"Graduate",d:today()});l.seats=[];
   note(key(r.n),"You received $"+amt+" in "+T0[0]+" ✅");
   if(li<TIERS.length-1){var k=key(r.n),old=S.access[k];S.access[k]={n:r.n,l:Math.max(old?old.l:0,li+1)};msg=" · moved to "+TIERS[li+1][0]+" 🔓";note(k,"You moved up to "+TIERS[li+1][0]+" 🔓");
    var L2=S.lv[li+1];if(!L2.joined.some(function(x){return key(x.n)===k&&!x.got})){L2.joined.push({no:(L2.joined.length?Math.max.apply(null,L2.joined.map(function(x){return x.no})):0)+1,n:r.n,d:today(),got:false})}}
   var nx=l.joined.find(function(x){return !x.got});
   if(nx)note(key(nx.n),"You are now the receiver 👑 in "+T0[0]);
   log(r.n+" received $"+amt+" (auto) "+T0[0]+(nx?" | Next: "+nx.n:""));
   toast(r.n+" received $"+amt+msg+(nx?" · Next: "+nx.n+" 👑":""));
   did=true}}
 return did}
window.autoRound=autoRound;
document.addEventListener("click",function(){setTimeout(function(){if(autoRound())render()},0)});
if(autoRound())render();
window.PC5=1;
})();
