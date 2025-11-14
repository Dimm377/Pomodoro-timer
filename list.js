let inputTask;
let taskList;
let addTaskBtn;

document.addEventListener('DOMContentLoaded', function () {
    inputTask = document.getElementById('input-task');
    taskList = document.getElementById('task-list');
    addTaskBtn = document.getElementById('add-task-btn');

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addTask);
    }

    taskList.addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            e.target.classList.toggle('checked');

            if (e.target.classList.contains('checked') && !e.target.hasAttribute('data-duration')) {
                let duration = prompt('Berapa menit waktu yang dibutuhkan untuk tugas ini?', '');
                if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
                    let originalText = e.target.textContent.replace(/\s*\(\d+\s*min\)\s*$/, '').trim();

                    e.target.setAttribute('data-duration', duration);

                    setPomodoroTime(duration);

                    e.target.textContent = originalText + ` (${duration} min)`;
                }
            } else if (e.target.classList.contains('checked') && e.target.hasAttribute('data-duration')) {
                let duration = e.target.getAttribute('data-duration');
                setPomodoroTime(duration);
            }
        }
        else if (e.target.tagName === 'SPAN') {
            let li = e.target.parentElement;
            li.remove();
        }
    });

});

function setPomodoroTime(duration) {
    const pomodoroInput = document.getElementById('pomodoro-input');

    if (pomodoroInput) {
        pomodoroInput.value = parseInt(duration);

        // Update the timer display directly
        updatePomodoroDisplay(duration);
    }
}

function updatePomodoroDisplay(duration) {
    const pomodoroTimer = document.getElementById('pomodoro-timer');

    if (pomodoroTimer) {
        // Update the data-duration attribute
        pomodoroTimer.setAttribute('data-duration', duration);

        // Update the display time
        const timeElement = pomodoroTimer.querySelector('.time');
        if (timeElement) {
            const minutes = parseInt(duration);
            const formattedTime = `${minutes.toString().padStart(2, '0')}:00`;
            timeElement.textContent = formattedTime;
        }

        // Only change the displayed timer if no timer is currently running
        if (!window.timerInterval) {
            // Show the pomodoro timer and hide others
            document.querySelectorAll('.timer-display').forEach(timer => {
                timer.style.display = 'none';
            });

            pomodoroTimer.style.display = 'block';

            // Update active session button
            document.getElementById('pomodoro-session')?.classList.add('active');
            document.getElementById('short-break')?.classList.remove('active');
            document.getElementById('long-break')?.classList.remove('active');

            // Update currentTimer reference in script.js
            if (typeof window.currentTimer !== 'undefined') {
                window.currentTimer = pomodoroTimer;
                // Reset the actual timer values
                if (typeof window.resetCurrentTimer === 'function') {
                    window.resetCurrentTimer();
                }
            }
        }
    }
}

function addTask() {
    if (!inputTask || !taskList) {
        console.error('Todo elements not found');
        return;
    }

    if (inputTask.value === '') {
        alert('Please input your task !');
    }
    else {
        let duration = prompt('Berapa menit waktu yang dibutuhkan untuk tugas ini?', '');

        if (duration !== null) { // User didn't cancel the prompt
            let li = document.createElement('li');

            if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
                // Only add duration if it's valid
                const originalText = inputTask.value.replace(/\s*\(\d+\s*min\)\s*$/, '').trim();
                li.textContent = originalText + ` (${duration} min)`;
                li.setAttribute('data-duration', duration);
            } else {
                // If duration is not valid, just use the task text without duration
                li.textContent = inputTask.value;
            }

            taskList.appendChild(li);
            let span = document.createElement('span');
            span.innerHTML = '\u00d7';
            li.appendChild(span);
        }
    }
    inputTask.value = '';
}

