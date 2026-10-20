(()=>{
 const stage=document.getElementById('opening-scene'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const canvas=document.createElement('canvas');canvas.className='opening-party-canvas';canvas.setAttribute('aria-hidden','true');stage.append(canvas);const ctx=canvas.getContext('2d');
 const rings=document.createElement('div');rings.className='opening-party-rings';rings.setAttribute('aria-hidden','true');rings.innerHTML='<i></i><i></i><i></i>';stage.append(rings);
 const banner=document.getElementById('opening-banner'),title=banner.querySelector('h1');let letter=0;
 title.setAttribute('aria-label','İyi ki doğdun');title.innerHTML=['İyi ki','doğdun'].map(line=>`<span class="party-title-line" aria-hidden="true">${[...line].map(char=>`<span style="--party-letter:${letter++}">${char===' '?'&nbsp;':char}</span>`).join('')}</span>`).join('');
 const wish=document.createElement('p');wish.className='party-wish';wish.textContent='Yeni yaşın sana güzel sürprizler getirsin. ♡';banner.append(wish);
 const orbit=document.createElement('div');orbit.className='party-title-orbit';orbit.setAttribute('aria-hidden','true');banner.prepend(orbit);
 const progress=document.createElement('div');progress.className='party-progress';progress.setAttribute('aria-hidden','true');banner.append(progress);
 let width=0,height=0,frame=0,last=0,time=0,bits=[],active=false,settling=false,settleAt=0,cues=[];
 const colors=['#b96d8c','#df9cb2','#cfaf6a','#98a882','#fff8df','#d6acba'];
 function resize(){const box=stage.getBoundingClientRect();width=box.width;height=Math.max(box.height,innerHeight);const dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0)}
 function burst(x,y,count,power=1){for(let i=0;i<count&&bits.length<420;i++){const angle=Math.random()*Math.PI*2,speed=(45+Math.random()*180)*power;bits.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-70*power,age:0,life:2.4+Math.random()*2.3,size:2.5+Math.random()*5,rotation:Math.random()*6.28,spin:(Math.random()-.5)*5,kind:i%4,color:colors[i%colors.length]})}}
 function shape(p){const s=p.size;ctx.fillStyle=p.color;ctx.strokeStyle=p.color;if(p.kind===0){ctx.beginPath();ctx.moveTo(0,s*.7);ctx.bezierCurveTo(-s*1.6,-s*.3,-s*.8,-s*1.4,0,-s*.55);ctx.bezierCurveTo(s*.8,-s*1.4,s*1.6,-s*.3,0,s*.7);ctx.fill()}else if(p.kind===1){ctx.fillRect(-s*.35,-s,s*.7,s*2)}else if(p.kind===2){ctx.beginPath();ctx.ellipse(0,0,s*.6,s*1.1,0,0,Math.PI*2);ctx.fill()}else{ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-s,0);ctx.lineTo(s,0);ctx.moveTo(0,-s);ctx.lineTo(0,s);ctx.stroke()}}
 function tick(stamp){if(!active||document.hidden){frame=0;return}const dt=Math.min((stamp-last)/1000,.045);if(stamp-last<30){frame=requestAnimationFrame(tick);return}last=stamp;time+=dt;ctx.clearRect(0,0,width,height);
  if(!settling)cues.forEach(cue=>{if(!cue.done&&time>=cue.at){cue.done=true;burst(cue.x*width,cue.y*height,width<600?48:72,.7)}});
  bits=bits.filter(p=>p.age<p.life);for(const p of bits){p.age+=dt;p.vy+=48*dt;p.vx*=Math.pow(.82,dt);p.x+=p.vx*dt;p.y+=p.vy*dt;p.rotation+=p.spin*dt;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.globalAlpha=Math.min(1,p.age*7)*Math.max(0,1-(p.age/p.life)**2);shape(p);ctx.restore()}
  if((settling&&time-settleAt>4)||time>12){clear();return}frame=requestAnimationFrame(tick);
 }
 function start(){clear();if(reduced.matches||!ctx)return;resize();active=true;const heart=document.getElementById('seed-heart').getBoundingClientRect(),box=stage.getBoundingClientRect();const x=heart.width?heart.left-box.left+heart.width/2:width/2,y=heart.height?heart.top-box.top+heart.height/2:height*.5;stage.style.setProperty('--launch-x',x+'px');stage.style.setProperty('--launch-y',y+'px');stage.classList.add('is-celebrating');burst(x,y,width<600?95:145,1.3);cues=[{at:1.3,x:.2,y:.25},{at:2.7,x:.8,y:.3},{at:4.1,x:.45,y:.22}];last=performance.now();frame=requestAnimationFrame(tick)}
 function settle(){if(!active)return;settling=true;settleAt=time;burst(width*.5,height*.18,width<600?55:85,.55)}
 function clear(){if(frame)cancelAnimationFrame(frame);frame=0;active=false;settling=false;time=0;bits=[];cues=[];ctx?.clearRect(0,0,width,height);stage.classList.remove('is-celebrating')}
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0}else if(active&&!frame){last=performance.now();frame=requestAnimationFrame(tick)}});reduced.addEventListener('change',()=>{if(reduced.matches)clear()});addEventListener('resize',()=>{if(active)resize()},{passive:true});
 window.birthdayParty={start,settle,clear};
})();
