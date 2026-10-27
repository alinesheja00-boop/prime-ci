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
window.PC8=1;
})();

