(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let flowerId=0;
  // Each clone owns its paint servers, including when the template is hidden.
  function cloneLily(prefix='lily'){
    const svg=document.querySelector('.lily-corner .lily-art').cloneNode(true);
    const ids=new Map();
    svg.querySelectorAll('[id]').forEach(el=>{const old=el.id;const next=`${prefix}-${flowerId++}-${old}`;ids.set(old,next);el.id=next});
    svg.querySelectorAll('*').forEach(el=>{[...el.attributes].forEach(attr=>{let value=attr.value;ids.forEach((next,old)=>{value=value.replaceAll(`url(#${old})`,`url(#${next})`);if(value===`#${old}`)value=`#${next}`});if(value!==attr.value)el.setAttribute(attr.name,value)})});
    return svg;
  }
  window.birthdayLily={clone:cloneLily};
  const seedLilies=document.createElement('div');seedLilies.className='seed-lilies';seedLilies.setAttribute('aria-hidden','true');
  for(let i=0;i<2;i++){const wrap=document.createElement('div');wrap.className='seed-lily';wrap.append(cloneLily('seed'));seedLilies.append(wrap)}
  document.getElementById('opening-scene').prepend(seedLilies);
  const seedNote=document.createElement('p');seedNote.className='seed-note';seedNote.textContent='Kalbe dokun, başlayalım ♡';document.querySelector('.opening-for').before(seedNote);
  const welcome=document.getElementById('welcome');
  for(let i=0;i<2;i++){const wrap=document.createElement('div');wrap.className='lily-scene'+(i?' right':'');wrap.setAttribute('aria-hidden','true');wrap.append(cloneLily('welcome'));welcome.append(wrap)}
  const chips=document.createElement('div');chips.className='surprise-chips';chips.innerHTML='<a href="#kenangan">birkaç anı ↗</a><a href="#taman">biraz çiçek ✳</a><a href="#harapan">bir küçük dilek ♡</a>';
  welcome.querySelector('.welcome-scroll').after(chips);
  document.querySelectorAll('.wish').forEach((wish,i)=>{const icon=document.createElement('span');icon.className='wish-icon';icon.setAttribute('aria-hidden','true');icon.textContent=['☼','✧','♡'][i];wish.prepend(icon)});
  for(const target of [welcome,document.getElementById('opening-seed')]){
    for(let i=0;i<2;i++){const doodle=document.createElement('span');doodle.className='float-doodle '+(i?'two':'one');doodle.textContent=i?'✧':'✳';doodle.setAttribute('aria-hidden','true');target.append(doodle)}
  }
  // Tiny, short-lived bursts respond to a deliberate touch, without following the cursor.
  const symbols=['✧','♡','✦','·'],colors=['#b87894','#d4a768','#9da782','#d7a4b4'];
  function sparkle(x,y,count=10){
    if(reduced||document.body.classList.contains('atmosphere-paused'))return;
    const remaining=48-document.querySelectorAll('.tap-spark').length;
    if(remaining<=0)return;
    for(let i=0;i<Math.min(count,remaining);i++){
      const bit=document.createElement('span');bit.className='tap-spark';bit.setAttribute('aria-hidden','true');bit.textContent=symbols[i%4];
      const a=(i/count)*Math.PI*2,dist=34+Math.random()*57;
      bit.style.cssText=`--spark-x:${x}px;--spark-y:${y}px;--spark-dx:${Math.cos(a)*dist}px;--spark-dy:${Math.sin(a)*dist-30}px;--spark-turn:${Math.random()*100-50}deg;--spark-color:${colors[i%4]};--spark-size:${12+Math.random()*12}px`;
      document.body.append(bit);setTimeout(()=>bit.remove(),1100);
    }
    const ring=document.createElement('span');ring.className='tap-ring';ring.setAttribute('aria-hidden','true');ring.style.left=x+'px';ring.style.top=y+'px';document.body.append(ring);setTimeout(()=>ring.remove(),800);
  }
  window.birthdaySparkle=sparkle;
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('button,.cake,.memory-card');if(!trigger||trigger.disabled)return;
    const box=trigger.getBoundingClientRect();const x=e.detail?e.clientX:box.left+box.width/2,y=e.detail?e.clientY:box.top+box.height/2;
    sparkle(x,y,trigger.matches('[data-bouquet],#open-gift')?15:8);
  });
  const magic=document.createElement('button');magic.type='button';magic.className='tree-magic';magic.textContent='Biraz daha sihir ✦';
  document.querySelector('.opening-actions').append(magic);let magicTimer;
  magic.onclick=()=>{
    const tree=document.querySelector('.opening-tree-art'),box=tree.getBoundingClientRect();sparkle(box.left+box.width/2,box.top+box.height*.3,24);
    if(!reduced){tree.classList.remove('tree-sparkling');void tree.offsetWidth;tree.classList.add('tree-sparkling');clearTimeout(magicTimer);magicTimer=setTimeout(()=>tree.classList.remove('tree-sparkling'),2100)}
  };
  if(!reduced){
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}})},{threshold:.06});
    document.querySelectorAll('.letter,.wishes,.memories,.flower-garden,.cosmic-love,.special-letters,.cake-section,.final-bouquet,.keepsake-section').forEach(section=>{section.classList.add('fun-reveal');observer.observe(section)});
  }
  const progress=document.createElement('div');progress.className='fun-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  let scrollFrame=0;function updateProgress(){scrollFrame=0;const max=document.documentElement.scrollHeight-innerHeight;progress.style.setProperty('--read-progress',max>0?Math.max(0,Math.min(1,scrollY/max)):0)}
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress)},{passive:true});addEventListener('resize',updateProgress,{passive:true});updateProgress();
})();
