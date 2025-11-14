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

        updatePomodoroDisplay(duration);
    }
}

function updatePomodoroDisplay(duration) {
    const pomodoroTimer = document.getElementById('pomodoro-timer');

    if (pomodoroTimer) {
        pomodoroTimer.setAttribute('data-duration', duration);

        const timeElement = pomodoroTimer.querySelector('.time');
        if (timeElement) {
            const minutes = parseInt(duration);
            const formattedTime = `${minutes.toString().padStart(2, '0')}:00`;
            timeElement.textContent = formattedTime;
        }

        document.querySelectorAll('.timer-display').forEach(timer => {
            timer.style.display = 'none';
        });

        pomodoroTimer.style.display = 'block';

        document.getElementById('pomodoro-session')?.classList.add('active');
        document.getElementById('short-break')?.classList.remove('active');
        document.getElementById('long-break')?.classList.remove('active');
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

        let li = document.createElement('li');
        if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
            const originalText = inputTask.value.replace(/\s*\(\d+\s*min\)\s*$/, '').trim();
            li.textContent = originalText + ` (${duration} min)`;
            li.setAttribute('data-duration', duration);
        } else {
            li.textContent = inputTask.value;
        }

        taskList.appendChild(li);
        let span = document.createElement('span');
        span.innerHTML = '\u00d7';
        li.appendChild(span);
    }
    inputTask.value = '';
}

