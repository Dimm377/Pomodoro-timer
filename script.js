let pomodoro = document.getElementById('pomodoro-timer');
let short = document.getElementById('short-timer');
let long = document.getElementById('long-timer');
let timers = document.querySelectorAll('.timer-display');
let session = document.getElementById('pomodoro-session');
let shortBreak = document.getElementById('short-break');
let longBreak = document.getElementById('long-break');
let startBtn = document.getElementById('start');
let pauseBtn = document.getElementById('pause');
let stopBtn = document.getElementById('stop');
let timermsg = document.getElementById('timer-message');
let button = document.querySelector('.button');

const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeBtn = document.querySelector('.close-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const pomodoroInput = document.getElementById('pomodoro-input');
const shortBreakInput = document.getElementById('short-break-input');
const longBreakInput = document.getElementById('long-break-input');

const progressRing = document.getElementById('progress-ring-circle');
const radius = progressRing.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

const alarm = new Audio('./music/Bapak Mulyono Raja Tipu Tipu.. (Lyrics Video).mp3');
alarm.loop = true;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  progressRing.style.strokeDashoffset = offset;
}

let currentTimer = null;
window.timerInterval = null;
let timeLeft = 0;
let totalTime = 0;
let isPaused = false;

// Make variables available to other scripts
window.currentTimer = currentTimer;
window.timeLeft = timeLeft;
window.totalTime = totalTime;
window.isPaused = isPaused;

settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

function saveSettings() {
    const pomodoroValue = pomodoroInput.value;
    const shortBreakValue = shortBreakInput.value;
    const longBreakValue = longBreakInput.value;

    pomodoro.setAttribute('data-duration', pomodoroValue);
    short.setAttribute('data-duration', shortBreakValue);
    long.setAttribute('data-duration', longBreakValue);

    stopTimer();
    resetCurrentTimer();

    settingsModal.style.display = 'none';
    timermsg.textContent = 'Settings saved!';
    timermsg.style.display = 'block';
    setTimeout(() => timermsg.style.display = 'none', 2000);
}

function loadSettings() {
    const defaultPomodoro = 25;
    const defaultShortBreak = 5;
    const defaultLongBreak = 10;

    pomodoroInput.value = defaultPomodoro;
    shortBreakInput.value = defaultShortBreak;
    longBreakInput.value = defaultLongBreak;

    pomodoro.setAttribute('data-duration', defaultPomodoro);
    short.setAttribute('data-duration', defaultShortBreak);
    long.setAttribute('data-duration', defaultLongBreak);
}

saveSettingsBtn.addEventListener('click', saveSettings);



function resetCurrentTimer() {
    if (currentTimer) {
        const durationValue = parseFloat(currentTimer.getAttribute('data-duration'));
        if (!isNaN(durationValue) && isFinite(durationValue) && durationValue > 0) {
            totalTime = durationValue * 60;
        } else {
            totalTime = 25 * 60;
        }
        timeLeft = totalTime;
        updateTimerDisplay();
    }

    // Update the global variables
    window.currentTimer = currentTimer;
    window.timeLeft = timeLeft;
    window.totalTime = totalTime;
}

function showDefaultTimer() {
    pomodoro.style.display = 'block';
    short.style.display = 'none';
    long.style.display = 'none';
    currentTimer = pomodoro;
    resetCurrentTimer();
}


function hideAll() {
    timers.forEach((timer) => {
        timer.style.display = 'none';
    })
}

session.addEventListener('click', () => {
    if (window.timerInterval) {
        if (confirm('Timer is currently running. Do you want to switch to this session? This will stop the current timer.')) {
            stopTimer();
            stopAlarm();
        } else {
            return;
        }
    }
    hideAll();
    pomodoro.style.display = 'block';

    session.classList.add('active');
    shortBreak.classList.remove('active');
    longBreak.classList.remove('active');

    currentTimer = pomodoro;
    resetCurrentTimer();
})

shortBreak.addEventListener('click', () => {
    if (window.timerInterval) {
        if (confirm('Timer is currently running. Do you want to switch to this session? This will stop the current timer.')) {
            stopTimer();
            stopAlarm();
        } else {
            return;
        }
    }
    hideAll();
    short.style.display = 'block';

    shortBreak.classList.add('active');
    session.classList.remove('active');
    longBreak.classList.remove('active');

    currentTimer = short;
    resetCurrentTimer();
})

longBreak.addEventListener('click', () => {
    if (window.timerInterval) {
        if (confirm('Timer is currently running. Do you want to switch to this session? This will stop the current timer.')) {
            stopTimer();
            stopAlarm();
        } else {
            return;
        }
    }
    hideAll();
    long.style.display = 'block';

    longBreak.classList.add('active');
    session.classList.remove('active');
    shortBreak.classList.remove('active');

    currentTimer = long;
    resetCurrentTimer();
})

function updateTimerDisplay() {
    if (!currentTimer) return;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const timeElement = currentTimer.querySelector('.time');
    if (timeElement) {
        timeElement.textContent = formattedTime;
    }

    // Only calculate progress if totalTime is not zero to prevent division by zero
    const progressPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    setProgress(progressPercent);
}

function startTimer() {
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }

    // Update totalTime based on current timer's data-duration
    const durationValue = parseFloat(currentTimer.getAttribute('data-duration'));
    if (!isNaN(durationValue) && isFinite(durationValue) && durationValue > 0) {
        totalTime = durationValue * 60;
    } else {
        totalTime = 25 * 60;
    }

    // If timer is finished (timeLeft is 0), reset it to the total time
    if (timeLeft === 0) {
        timeLeft = totalTime;
    }

    window.timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(window.timerInterval);
            window.timerInterval = null;
            isPaused = false;
            timermsg.style.display = 'block';
            timermsg.textContent = 'Time is up!';
            setProgress(0);
            playAlarm();
        }
    }, 1000);

    isPaused = false;

    // Update the global variables
    window.timeLeft = timeLeft;
    window.totalTime = totalTime;
    window.isPaused = isPaused;
}

function pauseTimer() {
    if (window.timerInterval && !isPaused) {
        clearInterval(window.timerInterval);
        window.timerInterval = null;
        isPaused = true;
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        timermsg.style.display = 'block';
        timermsg.textContent = 'Timer paused';
        setTimeout(() => timermsg.style.display = 'none', 2000);
    }

    // Update the global variables
    window.isPaused = isPaused;
}

function stopTimer() {
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
        window.timerInterval = null;
    }
    isPaused = false;

    // Update the global variables
    window.isPaused = isPaused;
}

function playAlarm() {
    alarm.play().catch(e => console.log("Audio play failed:", e));
}

function stopAlarm() {
    alarm.pause();
    alarm.currentTime = 0;
}


startBtn.addEventListener('click', () => {
    if(currentTimer) {
        if (!window.timerInterval) {
            const durationValue = parseFloat(currentTimer.getAttribute('data-duration'));
            if (!isNaN(durationValue) && isFinite(durationValue) && durationValue > 0) {
                totalTime = durationValue * 60;
            } else {
                totalTime = 25 * 60;
            }

            if (timeLeft === 0) timeLeft = totalTime;
        }
        startTimer();
        timermsg.style.display = 'none';
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        isPaused = false;
    } else {
        timermsg.style.display = 'block';
    }
});

pauseBtn.addEventListener('click', () => {
    if (currentTimer && window.timerInterval) {
        pauseTimer();
    }
});

stopBtn.addEventListener('click', () => {
    stopAlarm();
    stopTimer();
    resetCurrentTimer();
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    isPaused = false;
});

document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    showDefaultTimer();

    // Update the global variables
    window.currentTimer = currentTimer;
});

// Make functions available to other scripts
window.resetCurrentTimer = resetCurrentTimer;