(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
// Opening a gift reveals the existing photos as a three-dimensional carousel.
const gift=document.getElementById('open-gift');const reveal=document.getElementById('gift-reveal');const gallery=document.getElementById('gift-gallery');let opening=false,current=0,giftTimer;
const cards=[...document.querySelectorAll('.memory-card')];
function positionCards(){cards.forEach((card,index)=>{let offset=index-current;if(offset>1)offset-=cards.length;if(offset< -1)offset+=cards.length;card.style.setProperty('--card-offset',offset);card.style.setProperty('--card-scale',offset===0?'1':'.82');card.style.setProperty('--card-opacity',offset===0?'1':'.48');card.style.setProperty('--card-z',offset===0?'3':'1');card.tabIndex=offset===0?0:-1});document.getElementById('photo-position').textContent=String(current+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0')}
function resetGift(focus=false){
 clearTimeout(giftTimer);opening=false;current=0;reveal.hidden=false;gallery.hidden=true;reveal.classList.remove('is-opening');gift.disabled=false;gift.setAttribute('aria-expanded','false');
 cards.forEach((card,index)=>{card.setAttribute('aria-pressed','false');card.querySelector('.memory-front').setAttribute('aria-hidden','false');card.querySelector('.memory-back').setAttribute('aria-hidden','true');card.setAttribute('aria-label',`Fotoğrafı çevir ${index+1}: ${card.querySelector('.memory-caption').textContent}`)});
 positionCards();if(focus){gift.focus({preventScroll:true});gift.scrollIntoView({block:'center',behavior:reduced?'auto':'smooth'})}
}
resetGift();
gift.addEventListener('click',()=>{if(opening)return;opening=true;gift.disabled=true;gift.setAttribute('aria-expanded','true');reveal.classList.add('is-opening');giftTimer=setTimeout(()=>{reveal.hidden=true;gallery.hidden=false;gift.disabled=false;positionCards();document.getElementById('photo-next').focus({preventScroll:true});petals()},reduced?0:900)});
document.getElementById('close-gift').addEventListener('click',()=>resetGift(true));
document.getElementById('relock').addEventListener('click',()=>resetGift());
document.getElementById('opening-replay').addEventListener('click',()=>resetGift());
function navigatePhoto(step){current=(current+step+cards.length)%cards.length;positionCards()}
document.getElementById('photo-prev').onclick=()=>navigatePhoto(-1);document.getElementById('photo-next').onclick=()=>navigatePhoto(1);
cards.forEach((card,index)=>card.addEventListener('click',e=>{if(index!==current){e.stopImmediatePropagation();current=index;positionCards()}},true));
gallery.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();navigatePhoto(-1)}if(e.key==='ArrowRight'){e.preventDefault();navigatePhoto(1)}});
// Repeat the birthday tree with the greeting animation.
document.getElementById('replay-birthday').addEventListener('click',()=>{document.querySelector('.birthday-tree')?.getAnimations({subtree:true}).forEach(a=>{a.cancel();a.play()})});
// The same particles morph from a heart into Ebrar Saldamli and back.
const canvas=document.getElementById('particle-heart'),ctx=canvas.getContext('2d');
if(!ctx)return;
const stage=canvas.parentElement,button=document.getElementById('heart-burst'),pool=stage.querySelector('.particle-pool');
let width=0,height=0,active=false,frame=0,last=0,time=0,progress=0,cycleElapsed=-1,phase='heart',reducedReturnTimer;
const dots=Array.from({length:1900},()=>{const t=Math.random()*Math.PI*2,r=Math.pow(Math.random(),.35);return{x:16*Math.sin(t)**3*r,y:-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*r,z:(Math.random()-.5)*8*r,size:.65+Math.random()*.65,phase:Math.random()*Math.PI*2,vx:(Math.random()-.5)*95,vy:(Math.random()-.5)*70,tx:0,ty:0}});
function buildName(){
 if(width<1||height<1)return;
 const sample=document.createElement('canvas');sample.width=Math.round(width);sample.height=Math.round(height);const ink=sample.getContext('2d',{willReadFrequently:true});
 ink.fillStyle='#000';ink.textAlign='center';ink.textBaseline='middle';
 const stacked=width<560;const lines=stacked?['Ebrar','Saldamli']:['Ebrar Saldamli'];
 let size=stacked?Math.min(width*.19,76):Math.min(width*.102,86);
 ink.font=`italic 400 ${size}px "Bodoni Moda", Georgia, serif`;
 const longest=Math.max(...lines.map(line=>ink.measureText(line).width));if(longest>width*.86)size*=width*.86/longest;
 ink.font=`italic 400 ${size}px "Bodoni Moda", Georgia, serif`;
 lines.forEach((line,i)=>ink.fillText(line,width/2,height*.46+(i-(lines.length-1)/2)*size*1.28));
 const pixels=ink.getImageData(0,0,sample.width,sample.height).data,points=[];
 for(let y=0;y<sample.height;y+=2)for(let x=0;x<sample.width;x+=2)if(pixels[(y*sample.width+x)*4+3]>160)points.push({x,y});
 for(let i=points.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[points[i],points[j]]=[points[j],points[i]]}
 dots.forEach((dot,i)=>{const point=points[Math.floor(i*points.length/dots.length)]||{x:width/2,y:height/2};dot.tx=point.x;dot.ty=point.y});
}
function resize(){const r=stage.getBoundingClientRect();width=r.width;height=r.height;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);buildName();draw()}
function draw(){
 ctx.clearRect(0,0,width,height);const p=progress*progress*(3-2*progress),scale=Math.min(width/42,height/39),rotation=reduced?.2:Math.sin(time*.4)*.55,cos=Math.cos(rotation),sin=Math.sin(rotation),pulse=reduced?1:1+Math.sin(time*2)*.035;
 pool.style.opacity=String(.65*(1-p));
 for(const dot of dots){
 const z=-dot.x*sin+dot.z*cos,perspective=1+z*.014;
 const hx=width/2+(dot.x*cos+dot.z*sin)*scale*pulse*perspective,hy=height*.43+dot.y*scale*pulse*perspective;
 const swirl=reduced?0:Math.sin(p*Math.PI);
 const breathe=reduced?1:1+Math.sin(time*.9)*.006;
 const drift=reduced?0:Math.sin(time*1.3+dot.phase)*1.7;
 const tx=width/2+(dot.tx-width/2)*breathe+drift;
 const ty=dot.ty+(reduced?0:Math.sin(time*1.15+dot.tx*.014)*2.8+Math.cos(time*1.8+dot.phase)*1.5);
 const x=hx+(tx-hx)*p+dot.vx*swirl,y=hy+(ty-hy)*p+dot.vy*swirl;
 const twinkle=reduced?.85:.58+Math.sin(time*2.1+dot.phase)*.25;
 ctx.fillStyle=`rgba(${160+Math.round(25*Math.sin(dot.phase))},${78+Math.round(18*Math.cos(dot.phase))},${112+Math.round(20*Math.sin(dot.phase))},${twinkle})`;
 const radius=Math.max(.4,dot.size*(1-p)*perspective+(.85+(reduced?0:Math.sin(time*1.7+dot.phase)*.28))*p);
 if(dot.phase<.32){const glow=ctx.createRadialGradient(x,y,0,x,y,radius*5);glow.addColorStop(0,'rgba(183,104,139,.22)');glow.addColorStop(1,'rgba(183,104,139,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,radius*5,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(176,96,128,.8)'}
 ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
 }
}
function setPhase(next){if(phase===next)return;phase=next;canvas.dataset.phase=next;
 if(next==='name'){canvas.setAttribute('aria-label',"Hafifçe hareket eden ışık parçacıklarından Ebrar Saldamli yazısı");document.getElementById('cosmic-note').textContent="Umarım yolun hep aydınlık olur. ♡"}
 else if(next==='returning'){canvas.setAttribute('aria-label',"İsmin parçacıkları yeniden kalbe dönüşüyor");document.getElementById('cosmic-note').textContent="İyi dilekler her adımında seninle olsun. ♡"}
 else if(next==='heart'){canvas.setAttribute('aria-label',"Işık parçacıklarının oluşturduğu kalp");document.getElementById('cosmic-note').textContent="Bir dokunuş, bir sürü iyi dilek. ♡";button.disabled=false;button.removeAttribute('aria-busy');button.textContent="Adı yeniden oluştur ✧"}
}
function advanceCycle(dt){if(cycleElapsed<0)return;cycleElapsed+=dt;
 if(cycleElapsed<1.8){progress=cycleElapsed/1.8}
 else if(cycleElapsed<6.3){progress=1;setPhase('name')}
 else if(cycleElapsed<8.5){progress=1-(cycleElapsed-6.3)/2.2;setPhase('returning')}
 else{progress=0;cycleElapsed=-1;setPhase('heart')}
}
function tick(stamp){if(!active||document.hidden){frame=0;return}if(stamp-last>32){const dt=Math.min((stamp-last)/1000,.06);time+=dt;last=stamp;advanceCycle(dt);draw()}frame=requestAnimationFrame(tick)}
function start(){if(reduced){draw();return}if(active&&!frame&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick)}}
new ResizeObserver(resize).observe(stage);new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)start();else if(frame){cancelAnimationFrame(frame);frame=0}},{threshold:.1}).observe(stage);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0}else start()});
function morphHeart(){if(cycleElapsed>=0)return;clearTimeout(reducedReturnTimer);cycleElapsed=0;phase='forming';canvas.dataset.phase='forming';button.disabled=true;button.setAttribute('aria-busy','true');button.textContent="Işıklar dans ediyor…";canvas.setAttribute('aria-label',"Kalbin parçacıkları Ebrar Saldamli adını oluşturuyor");document.getElementById('cosmic-note').textContent="Biraz bekle, ışıklar adını yazıyor. ♡";
 if(reduced){progress=1;setPhase('name');draw();reducedReturnTimer=setTimeout(()=>{progress=0;cycleElapsed=-1;setPhase('heart');draw()},4500)}else start();
}
button.textContent="Ebrar Saldamli adını oluştur ✧";button.removeAttribute('aria-pressed');canvas.dataset.phase='heart';button.onclick=morphHeart;canvas.addEventListener('click',morphHeart);resize();document.fonts.ready.then(()=>{buildName();if(reduced)draw()});
})();
