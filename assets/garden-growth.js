(()=>{
 const garden=document.getElementById('garden-stage'),button=document.getElementById('bloom-button'),message=document.getElementById('garden-message');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');const ns='http://www.w3.org/2000/svg';
 let planted=0,serial=0,messageTimer;
 const messages=['Gülümsemen için bir zambak. ♡','Bir tane de hayallerin için.','Umarım hayatında mutluluğa hep yer olur.','Güzel şeyleri hak ediyorsun.','Bu bahçe senin için çiçek açıyor. ♡'];
 function node(tag,attrs={},children=[]){const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,String(value)));children.forEach(child=>el.append(child));return el}
 function growingLily(){
  const svg=window.birthdayLily.clone('grown'),id=`garden-grow-${serial++}`,defs=svg.querySelector('defs');
  const stem=svg.querySelector('.lily-stem');
  const stemPath='M130 435C115 350 148 264 130 143';
  stem.replaceChildren(node('path',{d:stemPath,stroke:'#81966c','stroke-width':3.7,'stroke-linecap':'round',pathLength:1,class:'growing-stem'}),node('path',{d:stemPath,stroke:'#c6d2ad','stroke-width':.75,'stroke-linecap':'round',pathLength:1,class:'growing-stem stem-highlight'}));
  const leaves=[
   {d:'M128 382C169 368 187 337 196 309C158 324 139 351 128 382Z',vein:'M190 317Q155 355 128 382',origin:'128px 382px',delay:.55,color:'#b1bd95'},
   {d:'M129 346C78 332 47 284 39 252C90 263 124 304 129 346Z',vein:'M46 262Q101 307 129 346',origin:'129px 346px',delay:.95,color:'#a4b58d'},
   {d:'M131 295C178 268 198 226 204 200C164 223 139 255 131 295Z',vein:'M200 207Q159 258 131 295',origin:'131px 295px',delay:1.5,color:'#91a57a'}
  ];
  leaves.forEach(leaf=>{
   const group=node('g',{class:'growing-leaf',style:`transform-origin:${leaf.origin};--leaf-delay:${leaf.delay}s`},[node('path',{d:leaf.d,fill:leaf.color,stroke:'#879b72','stroke-width':.9}),node('path',{d:leaf.vein,stroke:'#e1e6c8','stroke-width':.85})]);stem.append(group);
  });
  const bloom=svg.querySelector('.lily-bloom'),tips=[[-103,-80],[-12,-120],[108,-94],[-105,10],[108,14],[-8,98]];
  const petals=[...bloom.querySelectorAll('.lily-petal')];
  petals.forEach((petal,i)=>{
   const gradientId=`${id}-shade-${i}`;
   defs.append(node('linearGradient',{id:gradientId,gradientUnits:'userSpaceOnUse',x1:tips[i][0],y1:tips[i][1],x2:0,y2:0},[
    node('stop',{offset:0,'stop-color':'#fffef6'}),node('stop',{offset:.58,'stop-color':'#fff8ee'}),node('stop',{offset:.86,'stop-color':'#f6e0e6'}),node('stop',{offset:1,'stop-color':'#dba8bd'})
   ]));
   petal.firstElementChild.setAttribute('fill',`url(#${gradientId})`);petal.firstElementChild.setAttribute('stroke','#d4b7bc');petal.style.setProperty('--petal-delay',`${2.4+i*.14}s`);
   // Fine secondary veins follow each petal's own plane.
   const [x,y]=tips[i];petal.append(node('path',{d:`M0 0Q${x*.32+5} ${y*.45-4} ${x*.82+3} ${y*.83}`,stroke:'#ead2d8','stroke-width':.55,opacity:.7,fill:'none'}));
  });
  const center=node('g',{class:'growing-center'});[...bloom.children].filter(child=>!child.classList.contains('lily-petal')).forEach(child=>center.append(child));bloom.append(center);
  bloom.append(node('circle',{class:'bloom-halo',cx:0,cy:0,r:16,fill:'none',stroke:'#d8b774','stroke-width':.8}));
  const spark=node('g',{class:'growing-spark'},[
   node('circle',{r:8,fill:'#f2d39a',opacity:.25}),
   node('path',{d:'M0 5C-7 2-5-5 1-12C0-7 7-3 4 2C3 4 1 5 0 5Z',fill:'#f0c66f'}),
   node('circle',{r:2.7,cy:-1,fill:'#fff9d6'}),
   node('animateMotion',{dur:'2.6s',path:stemPath,calcMode:'paced',fill:'freeze'})
  ]);
  svg.querySelector('.lily-sway').append(spark);return svg;
 }
 const tools=document.createElement('div');tools.className='garden-tools';button.before(tools);tools.append(button);
 const reset=document.createElement('button');reset.type='button';reset.className='garden-reset';reset.textContent='Bahçeyi yeniden başlat ↺';tools.append(reset);
 const count=document.createElement('p');count.className='garden-count';count.setAttribute('aria-live','polite');garden.after(count);
 const hint=garden.querySelector('.garden-touch-hint');
 function clearGarden(){clearTimeout(messageTimer);garden.querySelectorAll('.garden-flower').forEach(el=>el.remove());planted=0;garden.classList.remove('has-flowers');hint.textContent='Dokun, ilk zambak seninle büyüsün ✧';count.textContent='✳ İlk dokunuşunu bekliyor';message.textContent='Bir dokunuş, bir küçük dilek.'}
 function plant(point){
  const box=garden.getBoundingClientRect();if(!box.width)return;
  const mobile=box.width<500,size=mobile?130+(planted*11)%27:170+(planted*13)%36;
  const desired=point?point.x-box.left-size/2:box.width*(.12+((planted*23)%65)/100)-size*.2;
  const left=Math.max(3,Math.min(box.width-size-3,desired));
  const flower=document.createElement('div');flower.className='garden-flower';flower.setAttribute('aria-hidden','true');flower.style.cssText=`left:${left}px;width:${size}px;bottom:-3px;z-index:${planted}`;
  const svg=growingLily();svg.querySelector('.lily-sway').style.setProperty('--lean',`${((planted*7)%11)-5}deg`);flower.append(svg);garden.append(flower);
  const all=garden.querySelectorAll('.garden-flower');if(all.length>12)all[0].remove();
  const note=messages[planted%messages.length];planted++;garden.classList.add('has-flowers');hint.textContent='Bir dokunuş daha, bir zambak daha ♡';count.textContent=`✳ ${planted} zambak, ${planted} güzel dilek`;
  clearTimeout(messageTimer);message.textContent=reduced.matches?note:'Işık yükseliyor… zambağın büyüyor. ♡';
  if(!reduced.matches)messageTimer=setTimeout(()=>{message.textContent=note},4200);
 }
 garden.addEventListener('click',event=>plant({x:event.clientX,y:event.clientY}));button.addEventListener('click',()=>plant());reset.addEventListener('click',clearGarden);
 document.getElementById('relock').addEventListener('click',clearGarden);document.getElementById('opening-replay').addEventListener('click',clearGarden);
 clearGarden();
})();
