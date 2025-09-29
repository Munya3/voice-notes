// Browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
lucide.createIcons();

if (!SpeechRecognition) {
  alert("Your browser does not support SpeechRecognition. Use Chrome or Edge.");
}

// Create recognition instance
const recognition = new SpeechRecognition();
recognition.continuous = true;       // Keep listening
recognition.lang = "en-US";
recognition.interimResults = true;   // Show live text
recognition.maxAlternatives = 1;

// DOM elements
const startBtn = document.getElementById("start");
const transcriptArea = document.querySelector("#transcript textarea");

let isRecording = false;
let finalTranscript = ""; // Permanent transcript

// Handle speech results
recognition.onresult = (event) => {
  let interimTranscript = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript + " ";
    } else {
      interimTranscript += transcript;
    }
  }

  // Show permanent text + live interim (on separate line)
  transcriptArea.value = finalTranscript + (interimTranscript ? `\n(${interimTranscript})` : "");
};

// Restart automatically if recording is active
recognition.onend = () => {
  if (isRecording) recognition.start();
};

// Handle errors
recognition.onerror = (event) => {
  transcriptArea.value += `[Error: ${event.error}]\n`;
  isRecording = false;
  startBtn.textContent = "Start Recording";
  startBtn.style.backgroundColor = "";
};

// Toggle Start/Stop button
startBtn.addEventListener("click", () => {
  if (!isRecording) {
    recognition.start();
    isRecording = true;
    startBtn.textContent = "Stop Recording";
    startBtn.style.backgroundColor = "red";
  } else {
    recognition.stop();
    isRecording = false;
    startBtn.textContent = "Start Recording";
    startBtn.style.backgroundColor = "";
  }
});



const save = document.getElementById("save");
const savedNote = document.querySelector("#savedNotes textarea");
let isSaved = false;

save.addEventListener("click", () => {
    isSaved = !isSaved;
    save.textContent = isSaved ?  "Clear Note" : "Save Note";

  
    if(isSaved){
        savedNote.value = transcriptArea.value;
        save.style.backgroundColor = "green";
    } else{
        save.style.backgroundColor = "#ff6b81";
        savedNote.value = "";
    }
})


const clear = document.getElementById("download");

