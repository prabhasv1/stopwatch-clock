// CLOCK
function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  document.getElementById('current-time').textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// STOPWATCH
let stopwatchInterval;
let elapsedTime = 0;
let isRunning = false;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function updateStopwatchDisplay() {
  document.getElementById('stopwatch').textContent = formatTime(elapsedTime);
}

// CIRCULAR RING
const ring = document.getElementById('progress-ring');
function updateRing() {
  const maxTime = 5 * 60 * 1000; // full ring at 5 min
  const progress = Math.min(elapsedTime / maxTime, 1);
  const offset = 314 - (314 * progress);
  ring.style.strokeDashoffset = offset;
}

function startStopwatch() {
  if (!isRunning) {
    const startTime = Date.now() - elapsedTime;
    stopwatchInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateStopwatchDisplay();
      updateRing();
    }, 1000);
    isRunning = true;
  }
}

function stopStopwatch() {
  if (isRunning) {
    clearInterval(stopwatchInterval);
    isRunning = false;
  }
}

function resetStopwatch() {
  stopStopwatch();
  elapsedTime = 0;
  updateStopwatchDisplay();
  updateRing();
  document.getElementById('laps').innerHTML = '';
}

function lapStopwatch() {
  if (isRunning) {
    const lapTime = formatTime(elapsedTime);
    const lapItem = document.createElement('li');
    lapItem.textContent = `Lap: ${lapTime}`;
    document.getElementById('laps').prepend(lapItem);
  }
}

// DARK MODE
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// DOWNLOAD LAPS
function downloadLaps() {
  const laps = Array.from(document.querySelectorAll('#laps li'))
    .map(li => li.textContent)
    .join('\n');
  const blob = new Blob([laps], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lap-times.txt';
  a.click();
  URL.revokeObjectURL(url);
}
