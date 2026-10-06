'use strict';
// Keep the existing photo, AI, recording and local-storage behaviour; show one step at a time.
const main=document.querySelector('main');
function section(id,title,subtitle){const el=document.createElement('section');el.id=id+'View';el.className='view wizard';el.hidden=true;el.append(text('p','', 'stepLabel'),text('h1',title));if(subtitle)el.append(text('p',subtitle,'lead'));main.insertBefore(el,$('status'));return el;}
function action(label,fn,cls='button primary full'){const b=text('button',label,cls);b.type='button';b.onclick=fn;return b;}
let entryRoute='photo', selectedScenario='cafe';
const scenarioExamples={
 cafe:{title:'At a café',scene:'Café menu: soup £6 · sandwich £7 · eggs on toast £8',simple:'Order one item from the menu. Say why you want it.',advanced:'Recommend a lunch to a friend. Compare two items and explain your choice.',hints:['I would like…','I recommend… because…'],language:[{phrase:'I would like…',meaning:'A polite way to order food.',example:'I would like the soup, please.'},{phrase:'Could I have…?',meaning:'A polite way to ask for something.',example:'Could I have some water, please?'}]},
 shop:{title:'In a shop',scene:'You want a blue T-shirt. The one on display is too small.',simple:'Ask the shop assistant for a larger blue T-shirt. Ask how much it costs.',advanced:'Ask for another size. If it is not available, explain what you need and ask about other options.',hints:['Do you have…?','How much is…?'],language:[{phrase:'Do you have this in…?',meaning:'Ask for a different size or colour.',example:'Do you have this in a larger size?'},{phrase:'How much does it cost?',meaning:'Ask about the price.',example:'This one looks good. How much does it cost?'}]},
 travel:{title:'Finding your way',scene:'You are outside a train station. You need to find the town centre.',simple:'Ask someone how to get to the town centre. Ask if you can walk there.',advanced:'Ask for directions to the town centre. Find out whether walking or taking a bus would be better.',hints:['How do I get to…?','Can I walk there?'],language:[{phrase:'How do I get to…?',meaning:'Ask someone for directions.',example:'How do I get to the town centre?'},{phrase:'How long does it take?',meaning:'Ask about the time needed.',example:'How long does it take to walk there?'}]}
};
const welcome=section('welcome','Welcome to English This','English This helps you practise English for everyday life.');
welcome.classList.add('welcome');
const overview=text('div','','overview');overview.append(text('p','Choose a way to practise:'));
const options=text('ul','');
const scenarioOption=text('li','');scenarioOption.append(text('strong','Scenario: '),document.createTextNode('Choose an example, such as ordering food, shopping or asking for directions.'));
const photoOption=text('li','');photoOption.append(text('strong','Take photo: '),document.createTextNode('Take or upload a photo of a menu, sign, object or place. AI will create an English task about it.'));
const studyOption=text('li','');studyOption.append(text('strong','Self-study: '),document.createTextNode('Build your English with short lessons and feedback.'));options.append(scenarioOption,photoOption,studyOption);
overview.append(options,text('p','Choose your English level. Then choose a short task, speaking practice or useful words. The app shows one step at a time. You can open extra help when you need it.'),text('p','Type your answer or record your voice. For photo tasks, AI gives feedback on your answer and suggests what to improve. The example scenarios use sample feedback.'),text('p','Save useful words and finished tasks in My English so you can look at them again.'));
welcome.append(overview,action('Continue',()=>showView('path')));
const pathChoice=section('path','What do you want to do?');
pathChoice.append(action('Practise a scenario',()=>{entryRoute='scenario';showView('scenario');}),action('Work with a photo',()=>{entryRoute='photo';demoScene=false;updateStart();showView('photo');}),action('Back',()=>showView('welcome'),'textbutton'));
$('navExplore').hidden=true;
const scenarios=section('scenario','Choose a scenario','Try an everyday situation.');
Object.entries(scenarioExamples).forEach(([id,item])=>{scenarios.append(action(item.title,()=>{selectedScenario=id;demoScene=true;entryRoute='scenario';updateStart();showView('choice');},'button secondary full'));});
scenarios.append(text('p','These examples use sample tasks and feedback.','small'),action('Back',()=>showView('path'),'textbutton'));
const levelRow=document.querySelector('.levelrow');
const photo=section('photo','Add a photo','An object, a menu or a place.');
photo.append($('capture'),$('cameraInput'),$('uploadInput'));
const photoNext=action('Next',()=>{if(!image){toast('Choose a photo first.',true);return;}showView('photoOptions');});photoNext.disabled=!image;photo.append(photoNext,action('Back',()=>showView('path'),'textbutton'));
const photoOptions=section('photoOptions','What do you want to do with your photo?');
const selectedPhoto=text('img','','chosenPhoto');selectedPhoto.alt='Your uploaded photo';photoOptions.append(selectedPhoto);
async function startPhotoMode(mode){if(busy||!image)return;demoScene=false;document.querySelector(`input[name="mode"][value="${mode}"]`).checked=true;await startActivity();}
photoOptions.append(action('Speak',()=>startPhotoMode('speak')),action('Teach me',()=>startPhotoMode('teach')),action('Change photo',()=>showView('photo'),'textbutton'));
const afterPhoto=async e=>{const uploaded=await choosePhoto(e);photoNext.disabled=!image;if(uploaded&&image&&!busy&&!demoScene){selectedPhoto.src=image;showView('photoOptions');}};
['cameraInput','uploadInput'].forEach(id=>{const input=$(id);input.removeEventListener('change',choosePhoto);input.addEventListener('change',afterPhoto);});
$('emptyCapture').querySelector('h2').hidden=true;$('emptyCapture').querySelector('p').hidden=true;$('emptyCapture').querySelector('.small').textContent='Avoid private information.';
const choice=section('choice','Choose your task','What would you like to do?');
choice.append(levelRow,$('modes'));
choice.querySelector('legend').hidden=true;
const modes=choice.querySelectorAll('.mode');const titles=['Quick task','Speaking','Learn some words'];const descriptions=['A short English task.','Talk about your photo.','Find useful words.'];
modes.forEach((m,i)=>{m.querySelector('strong').textContent=titles[i];m.querySelector('small').textContent=descriptions[i];});
const extra=document.createElement('details');$('context').setAttribute('aria-label','Optional question about your photo');extra.append(text('summary','Add a question (optional)'),$('context'));choice.append(extra,$('start'),action('Back',()=>showView(entryRoute==='scenario'?'scenario':'photo'),'textbutton'));$('start').textContent='Show my task';
$('exploreView').hidden=true;
const task=$('activityView');task.classList.add('wizard');const taskMain=document.querySelector('.activityMain');
const speakScreen=section('speak','Speak');const teachScreen=section('teach','Teach me');const activityParts=Array.from(task.children);
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
demoActivity=function(level,mode){const example=scenarioExamples[selectedScenario];const prompt=['A2','B1'].includes(level)?example.simple:example.advanced;return {title:example.title,scene:example.scene,goal:'I can use English in this situation.',prompt:(mode==='teach'?'Use one of the useful expressions. ':mode==='speak'?'Imagine you are speaking to someone. ':'')+prompt,hints:example.hints,language:example.language};};
const originalRender=renderActivity;renderActivity=function(){originalRender();$('activityScene').hidden=!session.demo;taskWordContent.replaceChildren();session.activity.language.forEach(w=>{const row=text('div','','languageCard');row.append(text('strong',w.phrase),text('p',w.meaning));taskWordContent.append(row);});taskWords.open=session.mode==='teach';help.open=false;words.open=false;};
let responseMethod='type';
function setMethod(value){if(recorder?.state==='recording'){toast('Stop recording first.',true);return;}responseMethod=value;type.setAttribute('aria-pressed',String(value==='type'));voice.setAttribute('aria-pressed',String(value==='voice'));$('answer').hidden=value==='voice'&&!$('answer').value&&!session?.demo;$('answerForm').querySelector('label').textContent=value==='voice'?'Record, then check your words.':'Write your answer.';document.querySelector('.recordrow').hidden=value==='type';$('audioBox').hidden=value==='type'||!audioBlob;$('audioNote').hidden=true;$('send').textContent='Get feedback';}
const originalTranscribe=$('transcribe').onclick;$('transcribe').onclick=async()=>{await originalTranscribe();if($('answer').value)$('answer').hidden=false;};
$('transcribe').textContent='Check my words';
$('audioBox').querySelector('.small').textContent='Check the text before sending.';
const originalSubmit=$('answerForm').onsubmit;$('answerForm').onsubmit=async e=>{const before=session?.feedbacks.length||0;await originalSubmit(e);if((session?.feedbacks.length||0)<=before)return;const f=session.feedbacks.at(-1);$('conversation').replaceChildren();const card=text('div','','message');if(session.demo)card.append(text('p','Example feedback','small'));card.append(text('h3','Well done'),text('p',f.strength),text('h3','Next time'),text('p',f.nextStep));$('conversation').append(card);languageCards($('activityLanguage'),f.language);words.open=false;showView('feedback');};
const originalStart=startActivity;startActivity=async function(forceDemo=false){await originalStart(forceDemo);if(session){responsePrompt.textContent=session.activity.prompt;setMethod(session.mode==='speak'?'voice':'type');}};
const originalNewPhoto=$('newPhoto').onclick;$('newPhoto').onclick=()=>{if(busy)return;originalNewPhoto();if(view==='photo'){entryRoute='photo';demoScene=false;updateStart();}};
$('navExplore').onclick=()=>showView(session?'activity':'welcome');
document.querySelector('.brand').onclick=e=>{e.preventDefault();showView(session?'activity':'welcome');};
const originalShow=showView;showView=function(next){if(busy||recorder?.state==='recording'){originalShow(next);return;}if(next==='activity'){const destination=session?.mode==='speak'?'speak':session?.mode==='teach'?'teach':'activity';const target=$(destination+'View');activityParts.forEach(part=>target.append(part));next=destination;}if(next==='photoOptions'){if(!image){next='photo';}else{photoOptions.insertBefore(levelRow,selectedPhoto);selectedPhoto.src=image;}}if(next==='choice')choice.insertBefore(levelRow,$('modes'));if(next==='photo')photoNext.disabled=!image;originalShow(next);const effective=view;document.querySelector('.bottomnav').hidden=['welcome','path'].includes(effective);extra.hidden=entryRoute==='scenario';choice.querySelector('.lead').textContent=entryRoute==='scenario'?scenarioExamples[selectedScenario].title:'What would you like to do?';document.querySelectorAll('.stepLabel').forEach(el=>el.textContent='');const heading=$(effective+'View')?.querySelector('h1');if(heading&&!busy){heading.tabIndex=-1;heading.focus({preventScroll:true});}};
showView('welcome');
