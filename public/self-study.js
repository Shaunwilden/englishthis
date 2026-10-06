'use strict';
(()=>{
const root=section('study','Self-study','Build your English, one small step at a time.');
pathChoice.insertBefore(action('Self-study',()=>menu()),pathChoice.lastElementChild);
const priorShow=showView;showView=function(next){priorShow(next);if(view===next)root.hidden=next!=='study';};
const key='ih-team-study-v1';let progress={};try{progress=JSON.parse(localStorage.getItem(key))||{};}catch{}
let lesson,index=0,attempts=0,media=null,chunks=[],url=null,studyRecordingToken=0;
const lessons={
 words:{title:'Words for teamwork',time:'3 minutes',steps:[
 {kind:'card',title:'A shared goal',body:'A shared goal is something everyone in the team wants to achieve.',example:'We all want to make a useful class guide.'},
 {kind:'quiz',title:'Which goal is shared?',choices:['I help Ana with her presentation.','We prepare our presentation together.'],correct:1,why:'“Our presentation” belongs to the whole team.'},
 {kind:'card',title:'Role, task and strategy',body:'A role is your part in a team. A task is a piece of work. A strategy is your plan for reaching a goal.',example:'My role is organiser. My task is to set a deadline. Our strategy is to share the work.'},
 {kind:'quiz',title:'What is a task?',choices:['Finish the pictures by Friday.','The person who organises the group.','Our plan for the whole project.'],correct:0,why:'A task is a specific piece of work. A role is your part; a strategy is the plan.'},
 {kind:'quiz',title:'What does “contribute” mean?',body:'Everyone contributes an idea to the project.',choices:['Wait for other people to finish.','Do all the work alone.','Give something that helps the team.'],correct:2,why:'You can contribute ideas, time or work.'},
 {kind:'quiz',title:'Choose the best word',body:'My ___ is to check that the facts are correct.',choices:['goal','responsibility','strategy'],correct:1,why:'A responsibility is something you are expected to do.'}
 ]},
 grammar:{title:'Talk about your strengths',time:'5–7 minutes',steps:[
 {kind:'card',title:'Talk about your strengths',body:'Everyone has different strengths at work. You might be good at working with people, solving problems, organising your time, or staying calm under pressure. Knowing your strengths can help you do your job well and feel more confident. In this lesson, we’re going to practise talking about our strengths and giving examples of how we use them at work.'},
 ...[
 ['reliable',3,'You can be trusted to do your work well.'],
 ['organised',5,'You plan your work and manage your time well.'],
 ['patient',7,'You can stay calm when something takes a long time.'],
 ['creative',0,'You have lots of new ideas.'],
 ['flexible',2,'You can change your plans when necessary.'],
 ['hard-working',1,'You work hard and put in a lot of effort.'],
 ['confident',6,'You believe in your abilities.'],
 ['helpful',4,'You like helping other people.']
 ].map(([word,correct,why],i)=>({kind:'match',title:word,body:'Match the strength to its meaning.',matchNumber:i+1,choices:[
 'You have lots of new ideas.','You work hard and put in a lot of effort.','You can change your plans when necessary.','You can be trusted to do your work well.','You like helping other people.','You plan your work and manage your time well.','You believe in your abilities.','You can stay calm when something takes a long time.'
 ],correct,why:word.charAt(0).toUpperCase()+word.slice(1)+' means: '+why})),
 {kind:'speak',title:'Think about yourself',body:'What are you good at at work?\n\nWhat is your biggest strength?\n\nCan you give an example?',prompt:'The learner is describing strengths at work. Check whether they say what they are good at, identify their biggest strength and give a specific work example. Give one evidence-based strength and one priority improvement. Focus on vocabulary from reliable, organised, patient, creative, flexible, hard-working, confident and helpful where relevant, and natural phrases such as good at + -ing. Do not require all eight words, invent work details, rate their personality, or assess pronunciation. Ask for a concrete example if missing.',model:'I’m good at organising my time. My biggest strength is being reliable. Last week, I finished an important report before the deadline.',checks:['Did you say what you are good at?','Did you name your biggest strength?','Did you give an example from work?']}
 ]},
 reading:{title:'Read about a team',time:'4 minutes',steps:[
 {kind:'card',title:'Read for the main idea',body:'Read the short story on the next screen. Decide what helped the team.',example:'You do not need to understand every word.'},
 {kind:'quiz',title:'What helped the team?',body:'Sara suggested a video for the class project. Ben wanted a poster. Mei asked them to explain their ideas. Sara said a video could show people speaking. Ben said a poster was quick to make. They chose a short video with a simple poster.',choices:['One person made every decision.','They explained and combined their ideas.','They avoided making a decision.'],correct:1,why:'Mei invited reasons. The final plan used parts of both ideas.'},
 {kind:'quiz',title:'Read between the lines',body:'Sara offered to film. Ben agreed to make the poster. Mei checked the deadline and offered to help either person if needed.',choices:['Mei is willing to take different tasks.','Mei wants to do no work.','Mei thinks Ben cannot make a poster.'],correct:0,why:'“Help either person” suggests Mei is flexible. The text does not say Ben lacks ability.'},
 {kind:'quiz',title:'Read for a detail',body:'The teacher asked for the project on Friday. Mei suggested finishing on Thursday so the team could check it together.',choices:['They must hand it in on Thursday.','They do not plan to check it.','They want time to check before Friday.'],correct:2,why:'Thursday is their own target. Friday is the teacher’s deadline.'},
 {kind:'card',title:'A useful reading habit',body:'Find a reason in the text for your answer. Keep facts and guesses separate.',example:'Fact: Mei offered help. Reasonable guess: Mei is flexible.'}
 ]},
 useful:{title:'Share ideas politely',time:'3 minutes',steps:[
 {kind:'card',title:'Agree and disagree',body:'Agree: “That’s a good idea.” Disagree politely: “I’m not sure I agree.” Give a reason: “I think… because…”',example:'I see what you mean, but we only have 30 minutes.'},
 {kind:'quiz',title:'Disagree politely',body:'Alex says: “Let’s each work alone.” You want the team to work together.',choices:['You’re wrong. That’s stupid.','Yes, let’s work alone.','I’m not sure I agree. We could share ideas first.'],correct:2,why:'This responds politely and offers another suggestion.'},
 {kind:'quiz',title:'Show partial agreement',body:'“A video is interesting, but it takes time.” Which reply agrees with part of this idea?',choices:['I see what you mean, but we could make a short one.','I completely disagree with everything.','A video is a kind of recording.'],correct:0,why:'“I see what you mean, but…” recognises the other view before giving your idea.'},
 {kind:'quiz',title:'Invite someone into the discussion',choices:['You must accept my idea.','What do you think, Ana?','We have already decided without you.'],correct:1,why:'An open question gives Ana a chance to contribute.'}
 ]},
 speak:{title:'Speak: plan an event',time:'4 minutes',steps:[
 {kind:'card',title:'Get ready to speak',body:'Your team is planning a class event. Alex wants an expensive restaurant. You prefer a picnic.',example:'Give your opinion, give a reason and respond politely to Alex.'},
 {kind:'speak',title:'Your turn',body:'Speak for about 30 seconds. Suggest a picnic and respond to Alex’s restaurant idea.',prompt:'Alex suggests an expensive restaurant for a class event. Suggest a picnic, give a reason and respond politely to Alex. Check only these goals and useful English; do not assess pronunciation.',model:'I see what you mean, but I think a picnic would be better because it costs less. What do you think?',checks:['Did you give your opinion?','Did you give a reason?','Did you respond politely?']}
 ]},
 write:{title:'Write a team message',time:'4 minutes',steps:[
 {kind:'card',title:'A clear team message',body:'Tell your team what you can do. Suggest a task for someone else. Give a deadline.',example:'Use a friendly question: “Could you find the pictures?”'},
 {kind:'write',title:'Send your team a plan',body:'Write 3–4 sentences. Your team is making a class guide. Say your task, suggest another task and give a deadline.',prompt:'Write a friendly 3–4 sentence message to a team making a class guide: say what you can do, suggest a task for someone else and give a deadline. Check those three goals and one useful language improvement.',model:'Hi everyone! I can write the introduction. Could you find the pictures, Ana? Let’s finish by Thursday so we can check our work.',checks:['Did you say what you can do?','Did you suggest another task politely?','Did you give a deadline?']}
 ]}
};
function stop(){studyRecordingToken++;if(media?.state==='recording')media.stop();if(url){URL.revokeObjectURL(url);url=null;}}
function clear(title){root.replaceChildren(text('p','SKILLS FOR LIFE · B1','eyebrow'),text('h1',title));}
function display(){showView('study');const h=root.querySelector('h1');h.tabIndex=-1;h.focus({preventScroll:true});window.scrollTo(0,0);}
function save(){try{localStorage.setItem(key,JSON.stringify(progress));}catch{toast('Progress could not be saved on this device.',true);}}
function menu(){try{progress=JSON.parse(localStorage.getItem(key))||{};}catch{progress={};}stop();clear('Working in a team');root.append(text('p','Learn English to share ideas and work with others.','lead'));const order=['grammar',...Object.keys(lessons).filter(id=>id!=='grammar')];order.forEach(id=>{const l=lessons[id];root.append(action((id==='grammar'&&progress[id]?'✓ ':'')+l.title+(id==='grammar'?' · '+l.time:''),()=>{if(id!=='grammar'){menu();toast('Not available yet');return;}lesson=id;index=0;step();},'button secondary full'));});root.append(action('Back',()=>showView('path'),'textbutton'));display();}
function next(){stop();index++;if(index>=lessons[lesson].steps.length){progress[lesson]=true;save();clear('Practice complete');root.append(text('p','You have practised '+lessons[lesson].title.toLowerCase()+'.'),action('Choose another lesson',menu),action('Practise again',()=>{index=0;step();},'button secondary full'));display();}else step();}
function step(reset=true){stop();if(reset)attempts=0;const l=lessons[lesson],s=l.steps[index];clear(s.title);root.prepend(text('p',`${index+1} / ${l.steps.length} · ${l.title}`,'small'));if(s.body)root.append(text('p',s.body,'studyText'));if(s.matchNumber)root.append(text('p',`Strength ${s.matchNumber} of 8`,'small'));if(s.kind==='card'){if(s.example)root.append(text('p',s.example,'responsePrompt'));root.append(action('Continue',next));}else if(s.kind==='match'){const select=document.createElement('select');select.setAttribute('aria-label','Choose the meaning of '+s.title);const placeholder=text('option','Choose a meaning');placeholder.value='';select.append(placeholder);s.choices.forEach((label,i)=>{const o=text('option',label);o.value=String(i);select.append(o);});root.append(select,action('Check',()=>{if(select.value===''){toast('Choose a meaning first.',true);return;}check(s,Number(select.value));}));}else if(s.kind==='quiz'){s.choices.forEach((label,i)=>root.append(action(label,()=>check(s,i),'button secondary full')));}else productive(s);root.append(action('Skip',next,'button secondary full'),action('Back to lessons',menu,'textbutton'));display();}
function check(s,i){attempts++;const correct=i===s.correct;clear(correct?'That’s right':"That's not correct, try again");if(correct){root.append(text('p',s.why),text('p',s.choices[s.correct],'responsePrompt'),action('Continue',next));}else {root.append(action('Try again',()=>{step(false);}));}root.append(action('Skip',next,'button secondary full'),action('Back to lessons',menu,'textbutton'));display();}
function productive(s){const field=document.createElement('textarea');field.rows=4;field.maxLength=1500;field.setAttribute('aria-label',s.kind==='speak'?'Your spoken words or typed answer':'Your team message');field.placeholder=s.kind==='speak'?'Your words will appear here after transcription. You can also type.':'Write your answer here.';root.append(field);
if(s.kind==='speak'){
 let blob,transcribing=false;
 const note=text('p','When you stop, your recording is sent for transcription. Check your words before getting feedback. Feedback checks your words, not pronunciation.','small');
 const status=text('p','','small');status.setAttribute('role','status');
 const player=document.createElement('audio');player.controls=true;player.hidden=true;
 async function transcribeRecording(){
  if(!blob||transcribing)return;
  const token=studyRecordingToken;transcribing=true;record.disabled=true;retry.hidden=true;field.disabled=true;status.textContent='Turning your recording into text…';
  try{
   if(blob.size>2900000)throw Error('This recording is too large. Try a shorter recording.');
   const audio=await readBlob(blob);
   const result=await api({action:'transcribe',level:'B1',audio});
   if(token!==studyRecordingToken||!root.contains(field))return;
   field.value=result.text.slice(0,1500);status.textContent='Check your words, then tap Get feedback.';
  }catch(e){if(token===studyRecordingToken&&root.contains(field)){status.textContent=e.message;retry.hidden=false;}}
  finally{transcribing=false;record.disabled=false;field.disabled=false;}
 }
 const retry=action('Retry transcription',transcribeRecording,'textbutton');retry.hidden=true;
 const record=action('Record my voice',async()=>{
  if(media?.state==='recording'){media.stop();return;}
  record.disabled=true;const token=++studyRecordingToken;let stream;
  try{
   if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw Error('Recording is unavailable here. You can type your words instead.');
   stream=await navigator.mediaDevices.getUserMedia({audio:true});
   if(token!==studyRecordingToken||!root.contains(field)){stream.getTracks().forEach(t=>t.stop());return;}
   const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));
   const captured=new MediaRecorder(stream,{...(mime?{mimeType:mime}:{}),audioBitsPerSecond:64000});media=captured;const parts=[];
   captured.ondataavailable=e=>{if(e.data.size)parts.push(e.data);};
   const timer=setTimeout(()=>{if(captured.state==='recording')captured.stop();},60000);
   captured.onerror=()=>{clearTimeout(timer);stream.getTracks().forEach(t=>t.stop());status.textContent='Recording failed. Try again or type your words.';record.textContent='Record again';};
   captured.onstop=async()=>{
    clearTimeout(timer);stream.getTracks().forEach(t=>t.stop());
    if(token!==studyRecordingToken||!root.contains(field))return;
    const type=(captured.mimeType||parts[0]?.type||mime||'audio/webm').split(';')[0];
    blob=new Blob(parts,{type});record.textContent='Record again';
    if(!blob.size){status.textContent='No audio was recorded. Please try again.';return;}
    if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);player.src=url;player.hidden=false;
    await transcribeRecording();
   };
   field.value='';retry.hidden=true;status.textContent='Recording… Tap Stop recording when you finish.';
   captured.start();record.textContent='Stop recording';
  }catch(e){stream?.getTracks().forEach(t=>t.stop());status.textContent=e.message;}
  finally{record.disabled=false;}
 },'button secondary full');
 root.insertBefore(record,field);root.insertBefore(player,field);root.insertBefore(status,field);root.insertBefore(retry,field);root.append(note);
}

const feedbackButton=action('Get feedback',async()=>{if(field.disabled){toast('Wait for transcription to finish.',true);return;}if(media?.state==='recording'){toast('Stop recording first.',true);return;}const answer=field.value.trim();if(!answer){toast('Record your answer or type your words first.',true);return;}feedbackButton.disabled=true;try{const f=await api({action:'reply',level:'B1',answer,activity:{title:s.title,prompt:s.prompt},history:[]});clear('Your feedback');root.append(text('h2','What worked'),text('p',f.strength),text('h2','Try this'),text('p',f.nextStep));const original=text('details','');original.append(text('summary','Your answer'),text('p',answer));root.append(original,action('Try again',()=>{step();root.querySelector('textarea').value=answer;}),action('Finish this lesson',next,'button secondary full'),action('Back to lessons',menu,'textbutton'));display();}catch(e){toast(e.message,true);}finally{feedbackButton.disabled=false;}});root.append(feedbackButton);
const review=document.createElement('details');review.append(text('summary','Check it yourself'));s.checks.forEach(c=>{const label=text('label','','studyCheck');const box=document.createElement('input');box.type='checkbox';label.append(box,document.createTextNode(c));review.append(label);});review.append(text('p','One possible answer:','small'),text('p',s.model),text('p','Your answer can be different. Check the goals, then improve it.','small'));root.append(review,action('Finish after self-check',()=>{if(!field.value.trim()&&s.kind!=='speak'){toast('Write a message first.',true);return;}if(!review.querySelectorAll('input:checked').length){review.open=true;toast('Use the checklist before finishing.',true);return;}next();},'textbutton'));}
const exportOriginal=$('export').onclick;$('export').onclick=()=>{const old=data.selfStudy;data.selfStudy=progress;exportOriginal();if(old===undefined)delete data.selfStudy;else data.selfStudy=old;};
})();
