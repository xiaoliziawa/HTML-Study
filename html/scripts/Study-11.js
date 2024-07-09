const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const notification = document.getElementById('notification');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let lastResetDate = localStorage.getItem('lastResetDate');

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
                    ${task.text}
                    <div class="task-actions">
                        <button class="complete-btn" onclick="toggleComplete(${index})">${task.completed ? '取消完成' : '完成'}</button>
                        <button class="delete-btn" onclick="deleteTask(${index})">删除</button>
                    </div>
                `;
        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    });
    updateStats();
    saveTasks();
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false, date: new Date().toDateString() });
        taskInput.value = '';
        renderTasks();
    }
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function updateStats() {
    totalTasksSpan.textContent = tasks.length;
    completedTasksSpan.textContent = tasks.filter(task => task.completed).length;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkAndResetTasks() {
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
        const uncompletedYesterday = tasks.filter(task => !task.completed && task.date !== today).length;
        tasks = tasks.filter(task => task.date === today);
        lastResetDate = today;
        localStorage.setItem('lastResetDate', lastResetDate);
        renderTasks();

        if (uncompletedYesterday > 0) {
            showNotification(`昨日有 ${uncompletedYesterday} 项任务未完成。加油！`);
        }
    }
}

function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

checkAndResetTasks();
renderTasks();

setInterval(checkAndResetTasks, 60000);