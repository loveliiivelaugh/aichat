// import { useEffect, useRef,  useState } from "react"
// import { Box, CircularProgress, Container, Grid, IconButton, InputLabel, MenuItem, Select, Typography } from "@mui/material"
// import { styled } from "@mui/material/styles"
// import AppsIcon from "@mui/icons-material/Apps"
// import Mic from "@mui/icons-material/Mic"
// import MicOffIcon from '@mui/icons-material/MicOff';
// // import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// // import { AudioRecorder } from 'react-audio-voice-recorder';
// // import { LazyLoadImage } from "react-lazy-load-image-component"
// import KeyboardIcon from '@mui/icons-material/Keyboard';

// // Services
// // import { useActions } from "../hooks/useActions"
// // import { usePostChatMutation, useTextToSpeechMutation } from "../api/llms"
// // import ThreeDotsWave from "../../../theme/ThreeDotsWave"
// import { useChatStore } from "../store"
// // import { SpeakerAlert } from "../theme/SpeakerAlert"
// // import BottomNav from "../layout/BottomNav"


// const commands = [
//     {
//       command: 'I would like to order *',
//       callback: (food) => console.log(`Your order is for: ${food}`)
//     },
//     {
//       command: 'The weather is :condition today',
//       callback: (condition) => console.log(`Today, the weather is ${condition}`)
//     },
//     {
//       command: 'My top sports are * and *',
//       callback: (sport1, sport2) => console.log(`#1: ${sport1}, #2: ${sport2}`)
//     },
//     {
//       command: 'Pass the salt (please)',
//       callback: () => console.log('My pleasure')
//     },
//     {
//       command: ['Hello', 'Hi'],
//       callback: ({ command }) => console.log(`Hi there! You said: "${command}"`),
//       matchInterim: true
//     },
//     {
//       command: ['Aurora'],
//       callback: ({ command }) => console.log(`Hi there! You said: "${command}"`),
//       matchInterim: true
//     },
//     {
//       command: 'Beijing',
//       callback: (command, spokenPhrase, similarityRatio) => console.log(`${command} and ${spokenPhrase} are ${similarityRatio * 100}% similar`),
//       // If the spokenPhrase is "Benji", the message would be "Beijing and Benji are 40% similar"
//       isFuzzyMatch: true,
//       fuzzyMatchingThreshold: 0.2
//     },
//     {
//       command: ['eat', 'sleep', 'leave'],
//       callback: (command) => console.log(`Best matching command: ${command}`),
//       isFuzzyMatch: true,
//       fuzzyMatchingThreshold: 0.2,
//       bestMatchOnly: true
//     },
//     {
//       command: 'clear',
//       callback: ({ resetTranscript }) => resetTranscript()
//     }
// ]

// const VoiceContainer = styled(Box)(() => ({
//     height: window.innerHeight - 200,
//     width: '100vw',
//     justifyContent: 'center',
// }));

// const VoiceView = (props) => {
//     const chat = useChatStore();
//     // const actions = useActions();
//     // const {
//     //     transcript,
//     //     listening,
//     //     resetTranscript,
//     //     browserSupportsSpeechRecognition,
//     // } = useSpeechRecognition({ commands });
//     // const [postChat, postChatResponse] = usePostChatMutation();
//     // const [speechToText, speechToTextResponse] = useTextToSpeechMutation();
//     const [submitted, setSubmitted] = useState(null)
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [mediaRecorder, setMediaRecorder] = useState(null)
//     const [audioChunks, setAudioChunks] = useState([])
//     const [selectedVoice, setSelectedVoice] = useState("Daniel");

//     const handleMic = () => listening 
//         ? SpeechRecognition.stopListening() 
//         : SpeechRecognition.startListening({ continuous: false, language: 'en-US' });

//     const submitText = async (file) => {
//         setIsSubmitting(true);
//         // actions.addMessage({
//         //     ...actions.getMetaData(), 
//         //     text: transcript, 
//         //     sender: 'user',
//         // });
//         const response = await postChat({
//             ...actions.getMetaData(), 
//             prompt: transcript, 
//             model: 'whisper',
//             file: file // audio file > server > Whisper > Ollama > Elevenlabs > app
//         });
//         // actions.addMessage({
//         //     ...actions.getMetaData(), 
//         //     text: response?.data, 
//         //     sender: 'bot' 
//         // });
//         setIsSubmitting(false);
//         // resonse.transcription Need to play this audio file
//         const audio = new Audio(response?.transcription);
//         if (audio) audio.play();
//         console.log("Voice response: ", response, postChatResponse);
//         // Add text to speech
//         const synth = window.speechSynthesis;
        
//         const utterance = new SpeechSynthesisUtterance(response?.data);
//         utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
//         synth.speak(utterance);
//     }

//     const addAudioElement = (blob) => {
//         console.log("addAudioElement: ", blob);
//         const url = URL.createObjectURL(blob);
//         const audio = document.createElement("audio");
//         audio.src = url;
//         console.log("addAudioElement: ", url);
//         audio.controls = true;
//         document.body.appendChild(audio);
//     };

//     const configureMediaRecorder = (mediaRecorder) => {
//         // these two dont work. need a different way to do it
//         mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

//         mediaRecorder.onstop = (e) => {
//             console.log("recorder stopped");

//             console.log("audioChunks: ", audioChunks);
//             const blob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
//             // Create a File from the Blob
//             const file = new File([blob], 'audioFile.ogg', { type: "audio/ogg" });

//             console.log("file: ", file);
//             submitText(file);
//             setAudioChunks([]);
//             const audioURL = window.URL.createObjectURL(blob);
//             console.log("audioURL: ", audioURL);
//             // audio.src = audioURL;
//         };
//     }

//     const handleVoiceChange = (event) => {
//         console.log("handleVoiceChange: ", event.target.value);
//         setSelectedVoice(event.target.value);
//     }

//     // useEffect(() => {
//     //     if (listening) {
//     //         SpeechRecognition.startListening();
//     //         mediaRecorder?.start();
            
//     //         // console.log("Ready to receive a color command.");
//     //     } else {
//     //         SpeechRecognition.stopListening();
//     //         console.log("Speech recognition has stopped.", transcript);
//     //         mediaRecorder?.stop();

//     //         console.log("audioChunks: ", audioChunks);
//     //         const blob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
//     //         // Create a File from the Blob
//     //         const file = new File([blob], 'audioFile.ogg', { type: "audio/ogg" });

//     //         console.log("file: ", file);
//     //         submitText(file);
//     //         setAudioChunks([]);

//     //         // if (transcript) submitText();
//     //         // resetTranscript();
//     //     }
//     // }, [listening]);

//     useEffect(() => {

//         (async () => {
//             const audioStream = await navigator.mediaDevices
//                 .getUserMedia({ audio: true })
//                 // Error callback
//                 .catch(console.error);

//             const recorder = new MediaRecorder(audioStream);
//             configureMediaRecorder(recorder);
//             setMediaRecorder(recorder);
//         })()
//     }, [])


//     return (
//         <Grid container sx={{ mt: 8, px: 2 }}>
//             <VoiceContainer>
//                 <Container maxWidth="sm" sx={{ textAlign: "center" }}>
//                     <Typography variant="h5" mt={1}>
//                         Under Construction 😎
//                     </Typography>
//                     <Typography variant="subtitle1">
//                         Please be patient. 😅
//                     </Typography>
//                     {/* <LazyLoadImage 
//                         loading="lazy"
//                         src={constructionImage} 
//                         alt="construction" 
//                         style={{ borderRadius: '8px', maxHeight: window.innerHeight - 400 }}
//                     /> */}
//                     {/* <ThreeDotsWave isLoading={true || isSubmitting} /> */}
//                     <Typography variant="h4" gutterBottom>
//                         {/* {(!listening && !isSubmitting) && "Start Speaking"}
//                         {(listening && !isSubmitting) && "Listening..."}
//                         {isSubmitting && "Submitting..."} */}
//                     </Typography>
//                     {/* {(!browserSupportsSpeechRecognition) && (
//                         <span>Browser doesn't support speech recognition.</span>
//                     )} */}
//                     <div>
//                         {/* <p>Microphone: {listening ? 'on' : 'off'}</p>
//                         <p>{transcript}</p> */}
//                         <p>{submitted && submitted}</p>
//                     </div>

//                     <div>
//                         {/* <SpeakerAlert /> */}
//                     </div>
//                     {/* <AudioRecorder 
//                         onRecordingComplete={addAudioElement}
//                         audioTrackConstraints={{
//                             noiseSuppression: true,
//                             echoCancellation: true,
//                         }} 
//                         downloadOnSavePress={true}
//                         downloadFileExtension="webm"
//                     /> */}
//                     <Box mt={8} mb={2}>
//                         <IconButton onClick={handleMic} size="large">
//                             {/* {listening ? <MicOffIcon /> : <Mic />} */}
//                         </IconButton>
//                         <InputLabel>
//                             Mic
//                         </InputLabel>
//                     </Box>
//                     <Select
//                         value={selectedVoice}
//                         onChange={handleVoiceChange}
//                     >
//                         {window.speechSynthesis.getVoices().map((voice) => (
//                             <MenuItem value={voice.name}>{voice.name} ({voice.lang})</MenuItem>
//                         ))}
//                     </Select>
//                     <Box>
//                         <IconButton onClick={() => chat.handleView("chat")} size="large">
//                             <KeyboardIcon />
//                         </IconButton>
//                         <InputLabel>
//                             Chat
//                         </InputLabel>
//                     </Box>
                    
//                 </Container>
//             </VoiceContainer>
//         </Grid>
//     )
// }

// export default VoiceView