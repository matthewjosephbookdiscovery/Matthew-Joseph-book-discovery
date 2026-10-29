(function(){
"use strict";
var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

/* header shadow on scroll (no size change, so nothing shifts) */
var hdr=document.querySelector('header.site');
function onScroll(){ if(hdr) hdr.classList.toggle('scrolled', window.scrollY>10); }
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* mobile menu */
var mt=document.getElementById('menuToggle'), mp=document.getElementById('mobilePanel');
if(mt&&mp){
  mt.addEventListener('click',function(){var o=mp.classList.toggle('open');mt.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':'';});
}

/* testimonials: renders only real entries from testimonials.js */
var T=window.TESTIMONIALS||[];
var sec=document.getElementById('testimonials'), mount=document.getElementById('testiMount');
if(sec&&mount&&T.length){
  mount.innerHTML=T.map(function(t,i){
    var esc=function(s){var d=document.createElement('div');d.textContent=s||'';return d.innerHTML;};
    return '<figure class="testi reveal" data-delay="'+(i*90)+'" style="margin:0"><blockquote>&ldquo;'+esc(t.quote)+'&rdquo;</blockquote><figcaption class="who"><b>'+esc(t.name)+'</b>'+esc(t.book)+'</figcaption></figure>';
  }).join('');
  sec.hidden=false;
}

/* scroll reveal */
var els=[].slice.call(document.querySelectorAll('.reveal'));
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){var d=e.target.getAttribute('data-delay'); if(d) e.target.style.transitionDelay=d+'ms'; e.target.classList.add('in'); io.unobserve(e.target);}
  });},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){io.observe(el);});
}else{els.forEach(function(el){el.classList.add('in');});}

/* count-up stats */
var counters=[].slice.call(document.querySelectorAll('[data-count]'));
function runCount(el){
  var end=parseInt(el.getAttribute('data-count'),10), suf=el.getAttribute('data-suffix')||'', t0=null, dur=1400;
  function step(ts){ if(!t0) t0=ts; var p=Math.min((ts-t0)/dur,1); var v=Math.floor(end*(1-Math.pow(1-p,3))); el.textContent=v+suf; if(p<1) requestAnimationFrame(step); else el.textContent=end+suf; }
  requestAnimationFrame(step);
}
if(counters.length&&'IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){runCount(e.target);co.unobserve(e.target);}});},{threshold:.6});
  counters.forEach(function(c){co.observe(c);});
}

/* forms */
function thanks(id,msg,closest){
  setTimeout(function(){var w=document.getElementById(id); if(!w) return; w.innerHTML='<div class="thankyou"><h2>Thank you.</h2><p>'+msg+'</p></div>';},300);
}
var af=document.getElementById('auditForm');
if(af) af.addEventListener('submit',function(){thanks('auditFormWrap','Your request has been received. Matthew will review your information and get in touch shortly.');});
var cf=document.getElementById('contactForm');
if(cf) cf.addEventListener('submit',function(){setTimeout(function(){var g=cf.closest('.contact-grid'); if(g) g.innerHTML='<div class="thankyou" style="grid-column:1/-1"><h2>Thank you.</h2><p>Your message has been received. Matthew will get back to you shortly.</p></div>';},300);});

var ap=document.getElementById('applyForm');
if(ap){
  var steps=[].slice.call(ap.querySelectorAll('.step-fieldset')), cur=0, ind=document.getElementById('stepIndicator');
  ind.innerHTML=steps.map(function(){return '<span></span>';}).join('');
  var dots=[].slice.call(ind.children);
  function paint(){
    steps.forEach(function(s,i){s.classList.toggle('active',i===cur);});
    dots.forEach(function(d,i){d.classList.toggle('done',i<cur);d.classList.toggle('current',i===cur);});
    document.getElementById('apBack').style.visibility=cur===0?'hidden':'visible';
    document.getElementById('apNext').style.display=cur===steps.length-1?'none':'inline-block';
    document.getElementById('apSubmit').style.display=cur===steps.length-1?'inline-block':'none';
  }
  paint();
  document.getElementById('apNext').addEventListener('click',function(){
    var r=steps[cur].querySelectorAll('[required]');
    for(var i=0;i<r.length;i++){ if(!r[i].checkValidity()){r[i].reportValidity();return;} }
    if(cur<steps.length-1){cur++;paint();}
  });
  document.getElementById('apBack').addEventListener('click',function(){ if(cur>0){cur--;paint();} });
  ap.addEventListener('submit',function(){thanks('applyFormWrap','Your application will be reviewed and Matthew will get in touch shortly.');});
}
})();
