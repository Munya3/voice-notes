window.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser does not support SpeechRecognition. Use Chrome or Edge");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  // DOM elements
  const startBtn = document.getElementById("start");
  const trashBtn = document.getElementById("delete");
  const transcriptPlace = document.getElementById("transcript-text");
  const timeDisplay = document.querySelector(".time");
  const copyBtn = document.getElementById("copy-transcript");
  // Timer
  let timerInterval;
  let seconds = 0;

  function startTimer() {
    seconds = 0;
    timeDisplay.textContent = "00:00";
    timeDisplay.classList.add("recording");

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
    timeDisplay.classList.remove("recording");
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

  function stopRecording() {
    recognition.stop();
    isRecording = false;
    startBtn.classList.remove("recording");
    stopTimer();
  }

  // Start/Stop recording
  startBtn.addEventListener("click", () => {
    if (!isRecording) {
      recognition.start();
      isRecording = true;
      startTimer();
      startBtn.classList.add("recording");
    } else {
      stopRecording();
    }
  });

  trashBtn.addEventListener("click", () => {
    finalTranscript = "";
    transcriptPlace.value = "";
    stopTimer();
    if (isRecording) stopRecording();
  });

  copyBtn.addEventListener("click", () => {
  const transcriptText = transcriptPlace.value.trim();

  if (!transcriptText) {
    alert("Transcript is empty!");
    return;
  }

  navigator.clipboard.writeText(transcriptText)
    .then(() => {
      copyBtn.textContent = "Copied!";   // change button text
      copyBtn.disabled = true;            // optional: prevent double clicks

      setTimeout(() => {
        copyBtn.textContent = "Copy";     // revert back
        copyBtn.disabled = false;
      }, 1500); // 1.5 seconds
    })
    .catch(err => alert("Failed to copy transcript: " + err));
  });

});




