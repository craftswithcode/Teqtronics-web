const stickyHeader=document.querySelector('.mainHeader');
const heroSection=document.querySelector('.home .hero');
if(stickyHeader&&heroSection){const updateHeader=()=>stickyHeader.classList.toggle('scrolled',window.scrollY>heroSection.offsetHeight-95);window.addEventListener('scroll',updateHeader,{passive:true});updateHeader()}
const currentPath=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.mainHeader nav a').forEach(link=>{if(link.getAttribute('href')===currentPath)link.classList.add('isCurrent')});
const projectTrack=document.querySelector('#projectTrack');
if(projectTrack){
 const projectCards=projectTrack.querySelectorAll('.projectCard');
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let autoScrollTimer=null,resumeTimer=null,selectionTimer=null,animationFrame=null,focused=false,visible=true;
 const stopAutoScroll=()=>{clearInterval(autoScrollTimer);autoScrollTimer=null};
 const cancelProjectAnimation=()=>{if(animationFrame!==null){cancelAnimationFrame(animationFrame);animationFrame=null}};
 const updateSequenceHighlight=()=>{
  if(projectCards.length<2)return;
  const gap=parseFloat(getComputedStyle(projectTrack).gap)||0;
  const step=projectCards[0].getBoundingClientRect().width+gap;
  const firstIndex=step?Math.round(projectTrack.scrollLeft/step):0;
  const secondIndex=(firstIndex+1)%projectCards.length;
  projectCards.forEach((card,index)=>card.classList.toggle('isSequenceSecond',index===secondIndex))
 };
 const moveProjects=direction=>{
  if(projectCards.length<2)return;
  const gap=parseFloat(getComputedStyle(projectTrack).gap)||0;
  const step=projectCards[0].getBoundingClientRect().width+gap;
  const maxScroll=projectTrack.scrollWidth-projectTrack.clientWidth;
  if(maxScroll<=0)return;
  const atStart=projectTrack.scrollLeft<=2,atEnd=projectTrack.scrollLeft>=maxScroll-2;
  const target=direction>0?(atEnd?0:Math.min(projectTrack.scrollLeft+step,maxScroll)):(atStart?maxScroll:Math.max(projectTrack.scrollLeft-step,0));
  cancelProjectAnimation();
  if(reducedMotion){projectTrack.scrollLeft=target;return}
  const start=projectTrack.scrollLeft,startedAt=performance.now(),duration=300;
  const animate=now=>{const progress=Math.min((now-startedAt)/duration,1),eased=1-Math.pow(1-progress,3);projectTrack.scrollLeft=start+(target-start)*eased;if(progress<1)animationFrame=requestAnimationFrame(animate);else animationFrame=null};
  animationFrame=requestAnimationFrame(animate)
 };
 const startAutoScroll=()=>{
  stopAutoScroll();
  if(reducedMotion||!visible||document.hidden||focused)return;
  autoScrollTimer=setInterval(()=>moveProjects(1),3000)
 };
 const pauseForInteraction=()=>{
  stopAutoScroll();
  cancelProjectAnimation();
  clearTimeout(resumeTimer);
  resumeTimer=setTimeout(startAutoScroll,5000)
 };
 projectTrack.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   event.preventDefault();
   moveProjects(event.key==='ArrowRight'?1:-1)
  }
 });
 projectTrack.addEventListener('scroll',()=>{
  clearTimeout(selectionTimer);
  selectionTimer=setTimeout(updateSequenceHighlight,120)
 },{passive:true});
 window.addEventListener('resize',updateSequenceHighlight);
 updateSequenceHighlight();
 projectTrack.addEventListener('focusin',()=>{focused=true;stopAutoScroll();cancelProjectAnimation()});
 projectTrack.addEventListener('focusout',event=>{if(!projectTrack.contains(event.relatedTarget)){focused=false;startAutoScroll()}});
 projectTrack.addEventListener('wheel',pauseForInteraction,{passive:true});
 projectTrack.addEventListener('touchstart',pauseForInteraction,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAutoScroll();cancelProjectAnimation()}else startAutoScroll()});
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)startAutoScroll();else{stopAutoScroll();cancelProjectAnimation()}},{threshold:.1});
  observer.observe(projectTrack)
 }
 startAutoScroll()
}

function addHoneypot(form){if(form.querySelector('[name="website"]'))return;const wrap=document.createElement('div');wrap.className='formHoneypot';wrap.setAttribute('aria-hidden','true');wrap.innerHTML='<label>Leave this field empty<input name="website" type="text" tabindex="-1" autocomplete="off"></label>';form.append(wrap)}
function formPayload(form){const data=Object.fromEntries(new FormData(form).entries());let service=data.service||data.subject||data.course||data.area||'General inquiry';let message=data.message||data.goals||data.learningGoals||'';
 if(form.classList.contains('corporateForm')){service='Corporate training';message=[`Organization: ${data.organization||''}`,`Team size: ${data.teamSize||''}`,`Learning goals: ${data.learningGoals||''}`].join('\n')}
 if(form.closest('.sitePage')&&location.pathname.endsWith('enroll.html')){service=`Enrollment: ${data.course||'Course advice'}`;message=[`City: ${data.city||''}`,`Background: ${data.background||''}`,`Schedule: ${data.schedule||''}`,data.message||''].join('\n')}
 if(location.pathname.endsWith('careers.html')){service=`Careers: ${data.area||'General interest'}`;message=[`Portfolio: ${data.portfolio||''}`,data.message||''].join('\n')}
 return {name:data.name||'',email:data.email||'',phone:data.phone||'',service,message,website:data.website||''}}
document.querySelectorAll('form').forEach(form=>{addHoneypot(form);form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('[type="submit"],button:not([type])');const notice=form.querySelector('.notice');if(!notice)return;notice.hidden=false;notice.textContent='Sending your inquiry…';if(button){button.disabled=true;button.dataset.label=button.textContent;button.textContent='SENDING…'}try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(formPayload(form))});const result=await response.json();if(!response.ok)throw new Error(result.error||'Please check your details and try again.');notice.textContent='Thank you. Your inquiry has been received. We’ll be in touch soon.';notice.dataset.state='success';form.reset()}catch(error){notice.textContent=error.message==='Failed to fetch'?'Could not connect. Please try again in a moment.':error.message;notice.dataset.state='error'}finally{if(button){button.disabled=false;button.textContent=button.dataset.label||'SUBMIT INQUIRY'}}})});

const themeToggle=document.querySelector('#themeToggle');
if(themeToggle){const storedTheme=localStorage.getItem('teqtronics-theme');const setTheme=dark=>{document.body.classList.toggle('dark-mode',dark);themeToggle.setAttribute('aria-pressed',String(dark));themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');themeToggle.querySelector('.themeIcon').textContent=dark?'☀':'☾';};setTheme(storedTheme==='dark');themeToggle.addEventListener('click',()=>{const dark=!document.body.classList.contains('dark-mode');setTheme(dark);localStorage.setItem('teqtronics-theme',dark?'dark':'light')});}


if(themeToggle&&document.body.classList.contains('home'))document.body.appendChild(themeToggle);

const serviceInquiryDialog=document.querySelector('#serviceInquiryDialog');
if(serviceInquiryDialog){const serviceField=serviceInquiryDialog.querySelector('[name="service"]');const inquiryCards=document.querySelectorAll('.serviceVisualCard,.portfolioCard');const openInquiry=card=>{const title=card.querySelector('h3')?.textContent?.trim()||card.querySelector('.serviceVisualPhoto span')?.textContent?.trim()||'IT Services';const isProject=card.classList.contains('portfolioCard');serviceField.value=isProject?`Portfolio project: ${title}`:title;serviceInquiryDialog.querySelector('#serviceInquiryTitle').textContent=`Ask about ${title}`;serviceInquiryDialog.showModal();serviceInquiryDialog.querySelector('[name="name"]').focus()};inquiryCards.forEach(card=>{const title=card.querySelector('h3')?.textContent?.trim()||'this item';card.setAttribute('role','button');card.setAttribute('tabindex','0');card.setAttribute('aria-label',`Ask about ${title}`);card.addEventListener('click',()=>openInquiry(card));card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openInquiry(card)}})});serviceInquiryDialog.querySelector('.serviceDialogClose').addEventListener('click',()=>serviceInquiryDialog.close());serviceInquiryDialog.addEventListener('click',event=>{if(event.target===serviceInquiryDialog)serviceInquiryDialog.close()});serviceInquiryDialog.addEventListener('close',()=>{serviceInquiryDialog.querySelector('.notice').hidden=true})}

const teamProfiles={
 development:[
  {name:'Rana Abdul Rehman',role:'Senior Full Stack Developer',education:'Graduate — Software Engineering',bio:'Leads full stack development and supports practical software project work.'},
  {name:'Reeba Rasheed',role:'Senior ML Developer',education:'Graduate in Computer Science',bio:'Works on machine learning development and applied AI projects.'},
  {name:'Muhammad Fahad Javed',role:'Junior Web Developer · MERN Stack',education:'Veterinary Doctor',bio:'Builds web applications using the MERN stack.'},
  {name:'Usman Tahir',role:'Junior Web Developer',education:'FSc Pre-Medical',bio:'Supports web development projects and implementation.'},
  {name:'Muhammad Hamza',role:'Junior Web Developer · TypeScript',education:'Matric',bio:'Works on TypeScript based web development.'}
 ],
 network:[{name:'Taimoor Babar',role:'Local Business Market Expert',education:'',bio:'Supports local business market understanding and relationship development.'}],
 marketing:[
  {name:'Mahin Tanveer',role:'SEO & Digital Marketing Expert',education:'Graduate in HND',bio:'Works across search optimization and digital marketing.'},
  {name:'Rutaba Waseem',role:'Graphic Designer',education:'BS Computer Science',bio:'Creates visual design assets for digital communication.'},
  {name:'Fatima Nadeem',role:'Digital Marketing Expert',education:'FSc Pre-Medical · B-Form',bio:'Supports digital marketing planning and campaign work.'},
  {name:'Ayesha Arshad',role:'Social Media Expert',education:'BS Software Engineering',bio:'Supports social media planning and content publishing.'}
 ], agents:[
  {name:'Sir Zain ul Abideen',role:'CEO · Senior AI Agents',education:'Leadership & AI Agents',bio:'Leads AI agents work and guides the team with senior technical and business direction.'},
  {name:'Amna Rehman',role:'AI Agents',education:'BS Software Engineering',bio:'Works on AI agents and applied software solutions.'}
 ],
 mentorship:[
  {name:'Sir Zain ul Abideen',role:'CEO · Senior AI Agents',education:'Leadership & FYP Mentorship',bio:'Guides students and teams with professional mentorship and AI agents leadership.'},
  {name:'Amna Rehman',role:'AI Agents',education:'BS Software Engineering',bio:'Mentors learners in AI agents and applied technology projects.'},
  {name:'Rana Abdul Rehman',role:'Senior Full Stack Mentor',education:'Graduate — Software Engineering',bio:'Provides software development guidance for student and team projects.'},
  {name:'Fatima Nadeem',role:'Digital Marketing Mentor',education:'FSc Pre-Medical · B-Form',bio:'Supports learners with practical digital marketing guidance.'}
 ]
};
const teamDialog=document.querySelector('#teamDialog');if(teamDialog){const grid=teamDialog.querySelector('#teamProfileGrid');const closeTeam=()=>teamDialog.close();document.querySelectorAll('.teamCategory').forEach(card=>card.addEventListener('click',()=>{const key=card.dataset.team;const profiles=teamProfiles[key]||[];teamDialog.querySelector('#teamDialogTitle').textContent=card.querySelector('h3').textContent;grid.innerHTML=profiles.map(person=>{const initials=person.name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();return `<article class="teamProfile"><div class="profileAvatar">${initials}</div><div><h3>${person.name}</h3><strong>${person.role}</strong>${person.education?`<p class="profileEducation">${person.education}</p>`:''}<p>${person.bio}</p></div></article>`}).join('');teamDialog.showModal()}));teamDialog.querySelector('.teamDialogClose').addEventListener('click',closeTeam);teamDialog.addEventListener('click',event=>{if(event.target===teamDialog)closeTeam()})}

const homeStats={completedProjects:56,totalProjects:67,currentProjects:39,fypClients:17};
const homeStatsSection=document.querySelector('.homeStats');
if(homeStatsSection){
 const counters=homeStatsSection.querySelectorAll('[data-stat]');
 const renderCounts=progress=>counters.forEach(counter=>{const target=homeStats[counter.dataset.stat];counter.textContent=new Intl.NumberFormat().format(Math.round(target*progress))});
 const animateCounts=()=>{
  const startedAt=performance.now();
  const frame=now=>{const progress=Math.min((now-startedAt)/1400,1);renderCounts(1-Math.pow(1-progress,3));if(progress<1)requestAnimationFrame(frame)};
  requestAnimationFrame(frame)
 };
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)renderCounts(1);
 else if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){observer.disconnect();animateCounts()}},{threshold:.25});observer.observe(homeStatsSection)}
 else animateCounts()
}




