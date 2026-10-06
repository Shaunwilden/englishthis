# English This — open pilot

This version does not require an access code. Anyone with the link can use the paid AI connection. Use for a small, short trial; there are no individual quotas or accounts.

## Update your existing deployment

1. Unzip the package and open english-this.
2. In your existing GitHub english-this repository choose Add file → Upload files.
3. Upload the contents of the folder, preserving all folders and overwriting existing files, then Commit changes.
4. Netlify automatically redeploys the connected repository. Wait for Published.
5. Keep OPENAI_API_KEY in Netlify, scoped to Functions. APP_ACCESS_CODE is no longer used and may be deleted.
6. Reload the app. Choose your own photo and tap English this. No password is needed.

API keys remain server-side. Paid image, feedback and transcription calls require an OpenAI API account with billing/model access. No key is included.

## Features and limits

Photo capture/upload, A2–C1, Quick/Speak/Teach me, typed responses, 60-second recording/playback, opt-in editable transcription, conversation feedback, local vocabulary/history, export/delete and home-screen installation. Demo is explicitly labelled and uses fixed feedback. Transcripts cannot assess pronunciation. This is not a CEFR assessment or digital twin.

Saved history and vocabulary stay in this browser. Photos/audio are not saved in the collection. Live photos, notes, responses and explicitly transcribed audio are sent through Netlify to OpenAI. Responses use store:false; provider retention policies still apply. Keep sensitive personal data out of photos. This version has no accounts, sync, import or per-user quotas. Export data before clearing browser storage.

## Validation

npm test checks configuration, input limits, mocked API image/reply/transcription payloads and readable errors, including requests without a code. npm run build checks deployment inputs. No live API or visual/device browser verification was possible in this environment.

## Separate screens
Welcome → Photo → Choose a task → Task → Your answer → Feedback. Help and useful words expand only when requested. Listen is removed. Keep public/wizard.js beside public/app.js when uploading.

The welcome screen now offers Scenario or Take photo. Scenario opens three everyday examples: a café, a shop and finding your way. Examples use sample tasks and explicitly labelled sample feedback. Photo tasks use live AI. Level selection appears on the task-choice screen.

Latest flow: B1 overview → Continue → What do you want to do? → Practise a scenario / Work with a photo. Both route buttons use the green accent. The old bottom English this navigation button is hidden; My English remains available after the introduction.

Photo route: take/upload → automatic Speak / Teach me choice → a separate Speak or Teach me screen. Both use the uploaded image and live AI, with level selection on the photo-choice screen.

## Self-study unit: Working in a team
Integrated into Continue → Self-study. Six B1 mini-lessons cover vocabulary, grammar, reading, functional language, speaking and writing. Fixed-answer tasks work offline after the app is cached. Productive tasks use the existing feedback API, with a self-check alternative. Speaking includes recording/playback and optional transcription; it does not assess pronunciation. Completion records practice, not mastery. Progress is stored on this device and included in Export my English. There is no listening lesson in this release.

Update the same repository; do not create a second app. Upload public/self-study.js and replace public/index.html, public/app.js, public/wizard.js and public/sw.js, plus public/styles.css. The package contains the complete app, so you can upload its contents as usual. No new API key or server setting is needed.

### Adapted strengths lesson
Self-study → Talk about your strengths now uses the supplied workplace introduction, eight word-to-meaning matches (one per screen), and a recording task with three reflection questions. Correct mapping: reliable=d, organised=f, patient=h, creative=a, flexible=c, hard-working=b, confident=g, helpful=e. Record → stop → turn recording into text → check words → get feedback → try again. Feedback checks strengths language and the work example, not pronunciation.

### Current pilot menu
Talk about your strengths is first and is the only available self-study lesson. Other lesson buttons display “Not available yet” while staying on the menu; their content is not opened. Incorrect answers display “That's not correct, try again”. Skip moves to the next screen, including from feedback. The app uses #00205B as its IH blue screen colour, with white text on blue buttons.

### Automatic self-study transcription
Stopping a self-study recording now automatically sends it to transcription. The transcript stays editable before feedback. A failed transcription retains the audio and offers Retry transcription. Recordings request 64 kbps and normalise MIME labels; server validation accepts browser codec labels and distinguishes format errors from actual size errors. No live microphone/browser verification was available in the build environment.

### Strengths activity sequence
Activity 1: “Match the word to the right meaning.” Eight matches. Activity 2: “Choose the correct word for each sentence.” Eight supplied workplace sentences with all eight words available in a dropdown, one sentence per screen. Answer order: reliable, patient, organised, flexible, creative, hard-working, helpful, confident. Activity 3: record personal strengths with automatic transcription and feedback.
