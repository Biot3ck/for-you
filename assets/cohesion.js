(()=>{
document.getElementById('replay-love-message').addEventListener('click',()=>{startMusic();beginLoveIntro()});
const cards=[...document.querySelectorAll('.memory-card')];
function markCurrent(){const current=Number(document.getElementById('photo-position').textContent.split('/')[0])-1;cards.forEach((c,i)=>c.classList.toggle('current-card',i===current))}
new MutationObserver(markCurrent).observe(document.getElementById('photo-position'),{childList:true,subtree:true,characterData:true});markCurrent();
const links=[...document.querySelectorAll('.chapter-nav a')];
const sections=links.map(a=>document.querySelector(a.getAttribute('href')));
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)links.forEach(link=>link.setAttribute('aria-current',String(link.getAttribute('href')==='#'+entry.target.id)))})},{rootMargin:'-15% 0px -55% 0px',threshold:0});sections.forEach(section=>observer.observe(section));
})();
