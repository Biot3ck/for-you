(()=>{
const canvas=document.getElementById('shared-atmosphere-canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let width=0,height=0,frame=0,last=0,time=0,paused=false;
// The reference's rising flowers live in the shared background, never the page flow.
const rising=document.createElement('div');rising.className='rising-flowers';rising.setAttribute('aria-hidden','true');
['🌸','🌷','🌸','🌷','🌸'].forEach((symbol,index)=>{
 const flower=document.createElement('span');flower.className='rising-flower';flower.textContent=symbol;
 flower.style.cssText=`--flower-left:${10+index*20}%;--flower-delay:${[0,-3,-6,-9,-4.5][index]}s;--flower-duration:${[13,15,14,16,14.5][index]}s;--flower-drift:${index%2?-20:20}px`;
 rising.append(flower);
});canvas.parentElement.append(rising);
const bits=Array.from({length:16},(_,i)=>({x:Math.random(),y:Math.random(),size:2+Math.random()*4,speed:8+Math.random()*14,phase:Math.random()*Math.PI*2,kind:i%4}));
function draw(){ctx.clearRect(0,0,width,height);for(const bit of bits){const x=bit.x*width+Math.sin(time*.17+bit.phase)*26,y=(bit.y*height+time*bit.speed)%(height+35)-18;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(time*.3+bit.phase)*.5+bit.phase);if(bit.kind===0){ctx.fillStyle='rgba(179,105,132,.15)';ctx.beginPath();ctx.moveTo(0,bit.size*.5);ctx.bezierCurveTo(-bit.size,-bit.size*.2,-bit.size*.8,-bit.size,0,-bit.size*.4);ctx.bezierCurveTo(bit.size*.8,-bit.size,bit.size,-bit.size*.2,0,bit.size*.5);ctx.fill()}else if(bit.kind===1){ctx.fillStyle='rgba(196,131,150,.17)';ctx.beginPath();ctx.ellipse(0,0,bit.size*.55,bit.size*1.15,0,0,Math.PI*2);ctx.fill()}else{ctx.fillStyle='rgba(255,250,234,.8)';ctx.shadowColor='#d8adbd';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(0,0,bit.size*.3,0,Math.PI*2);ctx.fill()}ctx.restore()}}
function tick(stamp){if(paused||document.hidden||reduced.matches){frame=0;return}if(stamp-last>33){time+=Math.min((stamp-last)/1000,.06);last=stamp;draw()}frame=requestAnimationFrame(tick)}
function start(){if(!frame&&!paused&&!document.hidden&&!reduced.matches){last=performance.now();frame=requestAnimationFrame(tick)}}
function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
window.addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0}else start()});reduced.addEventListener('change',()=>{if(reduced.matches&&frame){cancelAnimationFrame(frame);frame=0;draw()}else start()});resize();start();
const welcome=document.getElementById('welcome');new IntersectionObserver(entries=>{if(entries[0].isIntersecting)welcome.classList.add('welcome-alive')},{threshold:.25}).observe(welcome);
const pause=document.createElement('button');pause.type='button';pause.className='welcome-pause';pause.textContent="Arka plan hareketini duraklat";pause.setAttribute('aria-pressed','false');document.querySelector('.end').append(pause);pause.onclick=()=>{paused=!paused;document.body.classList.toggle('atmosphere-paused',paused);pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?"Arka plan hareketini sürdür":"Arka plan hareketini duraklat";if(paused&&frame){cancelAnimationFrame(frame);frame=0}else start()};
})();
