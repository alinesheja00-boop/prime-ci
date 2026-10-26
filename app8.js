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
window.PC8=1;
})();
