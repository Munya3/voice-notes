lucide.createIcons();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert("Your browser does not support SpeechRecognition. Use Chrome or Edge");
}

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = true;
recognition.maxAlternatives = 1;

// DOM elements
const startBtn = document.getElementById("start");
const transcriptPlace = document.querySelector("#transcript textarea");
const timeDisplay = document.querySelector(".time");

// Timer
let timerInterval;
let seconds = 0;

function startTimer() {
  seconds = 0;
  timeDisplay.textContent = "00:00";
  timerInterval = setInterval(() => {
    seconds++;
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const second = String(seconds % 60).padStart(2, "0");
    timeDisplay.textContent = `${minutes}:${second}`;
    if (seconds >= 60) stopRecording();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

let isRecording = false;
let finalTranscript = "";

recognition.onresult = (event) => {
  let interimTranscript = "";
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript + " ";
    } else {
      interimTranscript += transcript;
    }
  }
  transcriptPlace.value = finalTranscript + (interimTranscript ? `\n(${interimTranscript})` : "");
};

recognition.onend = () => {
  if (isRecording) recognition.start();
};

// ===== Start/Stop recording handlers =====
function stopRecording() {
  recognition.stop();
  isRecording = false;
  stopTimer();
  startBtn.style.backgroundColor = "";
}

startBtn.addEventListener("click", () => {
  if (!isRecording) {
    recognition.start();
    isRecording = true;
    startTimer(); // TIMER STARTS HERE
    startBtn.style.backgroundColor = "red";
  } else {
    stopRecording();
  }
});

const trashBtn = document.getElementById("delete");

trashBtn.addEventListener("click", () => {
  finalTranscript = "";
  transcriptPlace.value = "";
  stopTimer();
  if (isRecording) stopRecording();
});
