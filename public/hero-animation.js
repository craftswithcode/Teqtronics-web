(()=>{
  const left=document.getElementById('heroLeft'),right=document.getElementById('heroRight'),seam=document.getElementById('heroSeam'),canvas=document.getElementById('heroFx'),brain=document.querySelector('.home .brain');
  if(!left||!right||!seam||!canvas||!brain)return;
  const ctx=canvas.getContext('2d'),W=840,H=605;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal=()=>document.querySelectorAll('.heroReveal').forEach((el,i)=>setTimeout(()=>el.classList.add('show'),i*260));
  if(reduce||!ctx){left.style.opacity=right.style.opacity='1';seam.style.opacity='.55';reveal();return}
  const ease=x=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
  const bits=Array.from({length:82},()=>({x:170+Math.random()*500,y:60+Math.random()*470,p:Math.random()*6.28,v:.7+Math.random()*1.8,ch:Math.random()<.5?'0':'1'}));
  const nodes=Array.from({length:30},()=>({x:90+Math.random()*660,y:85+Math.random()*420,p:Math.random()*6.28,r:1.7+Math.random()*2}));
  const startedAt=performance.now();let revealed=false,visible=false,running=false;
  const startLoop=()=>{if(!running&&visible&&!document.hidden){running=true;requestAnimationFrame(frame)}};
  function frame(now){
    if(document.hidden||!visible){running=false;return}
    const t=(now-startedAt)/1000,split=ease((t-.35)/2.1),offset=(1-split)*32;
    left.style.opacity=right.style.opacity=String(Math.min(1,split*1.5));
    left.style.transform=`translateX(${-offset*5}%)`;right.style.transform=`translateX(${offset*5}%)`;
    ctx.clearRect(0,0,W,H);ctx.font='14px monospace';
    const ambient=.62+.1*Math.sin(t*.7);
    bits.forEach((b,i)=>{const x=b.x+Math.sin(t*.42+b.p)*13,y=((b.y+t*b.v*5)%H),blink=.5+.5*Math.pow((Math.sin(t*(1.2+(i%4)*.23)+b.p)+1)/2,5);ctx.globalAlpha=ambient*blink;ctx.fillStyle=i%5===0?'#ffb08c':'#ff6872';ctx.shadowColor='#e5222f';ctx.shadowBlur=8;ctx.fillText(b.ch,x,y)});
    ctx.shadowBlur=0;
    ctx.globalAlpha=1;ctx.lineWidth=1;
    nodes.forEach((n,i)=>{const m=nodes[(i+4)%nodes.length],x=n.x+Math.sin(t*.35+n.p)*10,y=n.y+Math.cos(t*.31+n.p)*8,mx=m.x+Math.sin(t*.35+m.p)*10,my=m.y+Math.cos(t*.31+m.p)*8,glow=.18+.35*(.5+.5*Math.sin(t*1.4+n.p));ctx.strokeStyle=`rgba(229,34,47,${glow})`;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(mx,my);ctx.stroke()});
    nodes.forEach(n=>{const x=n.x+Math.sin(t*.35+n.p)*10,y=n.y+Math.cos(t*.31+n.p)*8,pulse=.5+.5*Math.sin(t*2.5+n.p);ctx.globalAlpha=.78+.22*pulse;ctx.fillStyle=pulse>.72?'#fff8f3':'#ff7966';ctx.shadowColor='#e5222f';ctx.shadowBlur=17+pulse*20;ctx.beginPath();ctx.arc(x,y,n.r+pulse*2.2,0,Math.PI*2);ctx.fill()});
    ctx.globalAlpha=1;ctx.shadowBlur=0;
    const flash=.12+.88*Math.pow((Math.sin(t*2.15)+1)/2,8);seam.style.opacity=String(t<1.2?ease((t-.35)/.85)*flash:flash);
    if(!revealed&&t>2.8){revealed=true;reveal()}
    requestAnimationFrame(frame)
  }
  const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;startLoop()},{threshold:.08}):null;
  if(observer)observer.observe(brain);else visible=true;
  document.addEventListener('visibilitychange',startLoop);
  startLoop()
})();
