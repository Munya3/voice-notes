// Browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

if (!SpeechRecognition) {
  alert("Your browser does not support SpeechRecognition. Use Chrome or Edge.");
}

// Define a simple grammar (optional)
const grammar = "#JSGF V1.0; grammar colors; public <color> = red | blue | green | yellow | orange | purple | pink ;";

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// DOM elements
const startBtn = document.getElementById("start");
const transcriptArea = document.querySelector("#transcript textarea");
const outputDiv = document.getElementById("output");

let isRecording = false;

// Handle speech results once
recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  outputDiv.textContent = `You said: ${spokenText}`;
  // Append text to textarea
  transcriptArea.value += spokenText + "\n";
};

// Handle errors
recognition.onerror = (event) => {
  outputDiv.textContent = `Error: ${event.error}`;
  isRecording = false;
  startBtn.textContent = "Start Recording";
  startBtn.style.backgroundColor = "";
};

// Toggle Start/Stop button
startBtn.addEventListener("click", () => {
  isRecording = !isRecording;

  if (isRecording) {
    recognition.start();
    startBtn.textContent = "Stop Recording";
    startBtn.style.backgroundColor = "red";
    outputDiv.textContent = "Listening...";
  } else {
    recognition.stop();
    startBtn.textContent = "Start Recording";
    startBtn.style.backgroundColor = "";
    outputDiv.textContent = "Stopped.";
  }
});


const save = document.getElementById("save");
let isSaved = false;

save.addEventListener("click", () => {
    isSaved = !isSaved;
    save.textContent = isSaved ?  "Clear Note" : "Save Note";

    if(isSaved){
        save.style.backgroundColor = "green";
    } else{
        save.style.backgroundColor = "#ff6b81";
    }
})
