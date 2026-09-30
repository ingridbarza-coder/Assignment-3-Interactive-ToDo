const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const categoryTitle = document.querySelector("#category-title");
const taskCount = document.querySelector("#task-count");
const tabs = document.querySelectorAll(".tab");

let tasks = loadTasks();
let currentCategory = "uni";


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
        category: currentCategory,
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


// Complete or uncomplete a task

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


// Display tasks

function renderTasks() {
    list.innerHTML = "";

    let visibleTasks;

    if (currentCategory === "completed") {
        visibleTasks = tasks.filter(task => task.done === true);
        categoryTitle.textContent = "Completed";
    } else {
        visibleTasks = tasks.filter(task =>
            task.category === currentCategory && task.done === false
        );

        categoryTitle.textContent = currentCategory;
    }


    visibleTasks.forEach(task => {
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


    if (visibleTasks.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No tasks here yet.";
        emptyMessage.style.color = "#71805f";
        emptyMessage.style.fontStyle = "italic";
        emptyMessage.style.padding = "15px 5px";

        list.append(emptyMessage);
    }


    if (currentCategory === "completed") {
        taskCount.textContent =
            visibleTasks.length + " completed task(s)";
    } else {
        taskCount.textContent =
            visibleTasks.length + " task(s)";
    }
}


// Handle form submission

function handleSubmit(event) {
    event.preventDefault();

    const title = input.value.trim();

    if (!title) {
        message.textContent = "Please enter a task.";
        return;
    }

    if (currentCategory === "completed") {
        message.textContent =
            "Choose Uni, Social or Personal to add a task.";
        return;
    }

    message.textContent = "";

    addTask(title);

    input.value = "";
    input.focus();
}


// Change category

function changeCategory(category) {
    currentCategory = category;

    tabs.forEach(tab => {
        tab.classList.remove("active");

        if (tab.dataset.category === category) {
            tab.classList.add("active");
        }
    });


    if (category === "completed") {
        form.style.display = "none";
        message.textContent = "";
    } else {
        form.style.display = "flex";
    }

    renderTasks();
}


// Form event

form.addEventListener("submit", handleSubmit);


// Tab events

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        changeCategory(tab.dataset.category);
    });
});


renderTasks();