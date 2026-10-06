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
