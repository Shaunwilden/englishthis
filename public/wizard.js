'use strict';
// Keep the existing photo, AI, recording and local-storage behaviour; show one step at a time.
const main=document.querySelector('main');
function section(id,title,subtitle){const el=document.createElement('section');el.id=id+'View';el.className='view wizard';el.hidden=true;el.append(text('p','', 'stepLabel'),text('h1',title));if(subtitle)el.append(text('p',subtitle,'lead'));main.insertBefore(el,$('status'));return el;}
function action(label,fn,cls='button primary full'){const b=text('button',label,cls);b.type='button';b.onclick=fn;return b;}
const welcome=section('welcome','Your world.\nYour English.','Take a photo. Try something in English.');
welcome.classList.add('welcome');
const levelRow=document.querySelector('.levelrow');welcome.append(levelRow,action('Start',()=>showView('photo')),action('Try an example',()=>{$('demo').click();},'textbutton'));
const photo=section('photo','Add a photo','An object, a menu or a place.');
photo.append($('capture'),$('cameraInput'),$('uploadInput'));
photo.append(action('Next',()=>{if(!image&&!demoScene){toast('Choose a photo first.',true);return;}showView('choice');}),action('Back',()=>showView('welcome'),'textbutton'));
$('emptyCapture').querySelector('h2').hidden=true;$('emptyCapture').querySelector('p').hidden=true;$('emptyCapture').querySelector('.small').textContent='Avoid private information.';
const choice=section('choice','Choose your task','What would you like to do?');
choice.append($('modes'));
choice.querySelector('legend').hidden=true;
const modes=choice.querySelectorAll('.mode');const titles=['Quick task','Speaking','Learn some words'];const descriptions=['A short English task.','Talk about your photo.','Find useful words.'];
modes.forEach((m,i)=>{m.querySelector('strong').textContent=titles[i];m.querySelector('small').textContent=descriptions[i];});
const extra=document.createElement('details');extra.append(text('summary','Add a question (optional)'),$('context'));$('context').setAttribute('aria-label','Optional question about your photo');choice.append(extra,$('start'),action('Back',()=>showView('photo'),'textbutton'));$('start').textContent='Show my task';
$('exploreView').hidden=true;
const task=$('activityView');task.classList.add('wizard');const taskMain=document.querySelector('.activityMain');
const response=section('response','Your turn');
const responsePrompt=text('p','','responsePrompt');response.append(responsePrompt);
const method=text('div','','tabs');const type=action('Type',()=>setMethod('type'),'button secondary');const voice=action('Speak',()=>setMethod('voice'),'button secondary');method.append(type,voice);response.append(method,$('answerForm'),action('Back to task',()=>showView('activity'),'textbutton'));
const feedback=section('feedback','A little feedback');feedback.append($('conversation'));
const words=document.createElement('details');words.append(text('summary','Useful words'),$('activityLanguage'));feedback.append(words);
feedback.append(action('Continue',()=>{if(!session?.feedbacks.length)return;responsePrompt.textContent=session.feedbacks.at(-1).question;discardAudio();$('answer').value='';setMethod(responseMethod);showView('response');}),$('finish'),action('Back to task',()=>showView('activity'),'textbutton'));
$('finish').className='button primary full';$('finish').textContent='Finish & save';
const languagePanel=document.querySelector('.languagePanel');languagePanel.hidden=true;
const help=task.querySelector('details');help.querySelector('summary').textContent='Need help?';
const taskWords=document.createElement('details');taskWords.append(text('summary','Useful words'));const taskWordContent=text('div','');taskWords.append(taskWordContent);taskMain.append(taskWords,action('My turn',()=>{responsePrompt.textContent=session.activity.prompt;setMethod(session.mode==='speak'?'voice':'type');showView('response');}));
const goal=$('activityGoal');goal.hidden=true;$('activityScene').hidden=true;
const originalRender=renderActivity;renderActivity=function(){originalRender();$('activityScene').hidden=!session.demo;taskWordContent.replaceChildren();session.activity.language.forEach(w=>{const row=text('div','','languageCard');row.append(text('strong',w.phrase),text('p',w.meaning));taskWordContent.append(row);});taskWords.open=session.mode==='teach';help.open=false;words.open=false;};
let responseMethod='type';
function setMethod(value){if(recorder?.state==='recording'){toast('Stop recording first.',true);return;}responseMethod=value;type.setAttribute('aria-pressed',String(value==='type'));voice.setAttribute('aria-pressed',String(value==='voice'));$('answer').hidden=value==='voice'&&!$('answer').value&&!session?.demo;$('answerForm').querySelector('label').textContent=value==='voice'?'Record, then check your words.':'Write your answer.';document.querySelector('.recordrow').hidden=value==='type';$('audioBox').hidden=value==='type'||!audioBlob;$('audioNote').hidden=true;$('send').textContent='Get feedback';}
const originalTranscribe=$('transcribe').onclick;$('transcribe').onclick=async()=>{await originalTranscribe();if($('answer').value)$('answer').hidden=false;};
$('transcribe').textContent='Check my words';
$('audioBox').querySelector('.small').textContent='Check the text before sending.';
const originalSubmit=$('answerForm').onsubmit;$('answerForm').onsubmit=async e=>{const before=session?.feedbacks.length||0;await originalSubmit(e);if((session?.feedbacks.length||0)<=before)return;const f=session.feedbacks.at(-1);$('conversation').replaceChildren();const card=text('div','','message');if(session.demo)card.append(text('p','Example feedback','small'));card.append(text('h3','Well done'),text('p',f.strength),text('h3','Next time'),text('p',f.nextStep));$('conversation').append(card);languageCards($('activityLanguage'),f.language);words.open=false;showView('feedback');};
const originalStart=startActivity;startActivity=async function(forceDemo=false){await originalStart(forceDemo);if(session){responsePrompt.textContent=session.activity.prompt;setMethod(session.mode==='speak'?'voice':'type');}};
$('navExplore').onclick=()=>showView(session?'activity':'welcome');
document.querySelector('.brand').onclick=e=>{e.preventDefault();showView(session?'activity':'welcome');};
const originalShow=showView;showView=function(next){originalShow(next);const effective=view;const steps={welcome:0,photo:1,choice:2,activity:3,response:4,feedback:5};document.querySelectorAll('.stepLabel').forEach(el=>el.textContent=effective==='welcome'?'':`Step ${steps[effective]||1} of 5`);const heading=$(effective+'View')?.querySelector('h1');if(heading&&!busy){heading.tabIndex=-1;heading.focus({preventScroll:true});}};
showView('welcome');
