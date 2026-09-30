const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");

let tasks = loadTasks();


// Save tasks in localStorage
function saveTasks() {
    const json = JSON.stringify(tasks);
    localStorage.setItem("tasks", json);
}


// Load tasks from localStorage
function loadTasks() {
    const raw = localStorage.getItem("tasks");

    if (!raw) {
        return [];
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        return [];
    }
}


// Add a new task
function addTask(title) {
    const newTask = {
        id: Date.now(),
        title: title,
        done: false
    };

    tasks = [...tasks, newTask];

    saveTasks();
    renderTasks();
}


// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}


// Mark a task as complete or incomplete
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                done: !task.done
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


// Display the tasks on the page
function renderTasks() {
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task");

        if (task.done) {
            li.classList.add("completed");
        }

        const title = document.createElement("span");
        title.classList.add("task-title");
        title.textContent = task.title;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";

        title.addEventListener("click", () => {
            toggleTask(task.id);
        });

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.append(title);
        li.append(deleteButton);
        list.append(li);
    });
}


// Handle form submission
function handleSubmit(event) {
    event.preventDefault();

    const title = input.value.trim();

    if (!title) {
        message.textContent = "Please enter a task.";
        return;
    }

    message.textContent = "";

    addTask(title);

    input.value = "";
    input.focus();
}


form.addEventListener("submit", handleSubmit);

renderTasks();