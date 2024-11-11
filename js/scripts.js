// HTML Elements:

const todoListFormEl = document.querySelector(".todo-list-form");

const todoListAddTaskEl = document.getElementById("todo-list-add-task");

const todoListAppCategoriesEl = document.getElementById("todo-list-app-categories");

const todoListAddBtnEl = document.querySelector(".todo-list-add-btn");

const categoryTabEls = document.querySelectorAll(".category-tab");

const tasksEl = document.querySelector(".tasks");

// Global Variables:

let taskId, targetCategory;

// Categories Tabs:

categoryTabEls.forEach(el => {

    el.addEventListener("click", function () {

        categoryTabEls.forEach(el => {

            el.classList.remove("active");

        });

        this.classList.add("active");

        showTasks(this.dataset.category);

        targetCategory = this.dataset.category;

    });

});

// Show Tasks:

function showTasks(category = "") {

    tasksEl.innerHTML = "";

    let tasks = localStorage.getItem("tasks") ?
    JSON.parse(localStorage.getItem("tasks")) : [];

    if (category !== "") {

        tasks = tasks.filter(task => {

            return task.category === category;

        });

    }

    if (tasks.length > 0) {

        tasks.forEach(task => {

            createTask(task);

        });

    } else {

        tasksEl.innerHTML = "<p class=\"empty\">No Tasks To Show!</p>";

    }

}

showTasks();

// Create New Task:

function createTask(task) {

    const taskEl = document.createElement("div");

    taskEl.className = "task";

    const divEl = document.createElement("div");

    const toConfirmTaskEl = document.createElement("input");

    toConfirmTaskEl.type = "checkbox";

    toConfirmTaskEl.style.display = "none";

    toConfirmTaskEl.id = `to-confirm-task-${task.id}`;

    toConfirmTaskEl.onchange = function (e) {

        toggleConfirm(task.id, e.target.checked);

    }

    toConfirmTaskEl.checked = task.confirmed;

    divEl.appendChild(toConfirmTaskEl);

    const labelEl = document.createElement("label");

    labelEl.setAttribute("for", `to-confirm-task-${task.id}`);

    labelEl.innerHTML = "<i class=\"fa-solid fa-chevron-down\"></i>";

    divEl.appendChild(labelEl);

    const taskTitleEl = document.createElement("p");

    taskTitleEl.className = "task-title";

    taskTitleEl.textContent = task.title;

    if (task.confirmed) {

        taskTitleEl.classList.add("confirmed");

    }

    divEl.appendChild(taskTitleEl);

    taskEl.appendChild(divEl);

    const todoAppActionsEl = document.createElement("div");

    todoAppActionsEl.className = "todo-app-actions";

    const editBtnEl = document.createElement("button");

    editBtnEl.className = "edit-btn";

    editBtnEl.innerHTML = "<i class=\"fa-regular fa-pen-to-square\"></i>";

    editBtnEl.addEventListener("click", () => {

        taskId = task.id;

        todoListAddTaskEl.value = task.title;

        todoListAppCategoriesEl.value = task.category;

        todoListAddBtnEl.textContent = "Edite Task";

    });

    todoAppActionsEl.appendChild(editBtnEl);

    const deleteBtnEl = document.createElement("button");

    deleteBtnEl.className = "delete-btn";

    deleteBtnEl.innerHTML = '<i class="fa-solid fa-trash"></i>';

    deleteBtnEl.onclick = function () {

        const deleted = confirm("Are you sure! You want delete this task?");

        if (deleted) {

            deleteTask(task.id);

            showTasks(targetCategory);

        }

    }

    todoAppActionsEl.appendChild(deleteBtnEl);

    taskEl.appendChild(todoAppActionsEl);

    tasksEl.appendChild(taskEl);

}

// Add New Task:

todoListFormEl.addEventListener("submit", (e) => {

    e.preventDefault();

    const taskTitle = todoListAddTaskEl.value;

    const taskCategory = todoListAppCategoriesEl.value;

    if (taskTitle === "") {

        alert("Empty Input!");

    } else {

        if (todoListAddBtnEl.textContent === "Add Task") {

            const newTask = {

                id: new Date().getTime(),

                title: taskTitle,

                category: taskCategory,

                confirmed: false

            }

            addTaskToLS(newTask);

            showTasks(targetCategory);

            todoListAppCategoriesEl.value = newTask.category;

        } else {

            const updatedTask = {

                title: taskTitle,

                category: taskCategory,

            }

            editeTask(taskId, updatedTask);

            showTasks(targetCategory);

            todoListAppCategoriesEl.value = updatedTask.category;

            todoListAddBtnEl.textContent = "Add Task";

        }

        todoListAddTaskEl.value = "";

    }

});

// Add Task To Local Storage:

function addTaskToLS(newTask) {

    const tasksFromLS = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];

    localStorage.setItem("tasks", JSON.stringify([...tasksFromLS, newTask]));

}

// Confirm Task:

function toggleConfirm(taskId, isConfirmed) {

    const tasks = JSON.parse(localStorage.getItem("tasks"));

    const task = tasks.find(task => task.id === taskId);

    task.confirmed = isConfirmed;

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Edite Task:

function editeTask(taskId, updatedTask) {

    const tasks = JSON.parse(localStorage.getItem("tasks"));

    const targetTast = tasks.find(task => task.id === taskId);

    targetTast.title = updatedTask.title;

    targetTast.category = updatedTask.category;

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Delete Task:

function deleteTask(taskId) {

    const tasks = JSON.parse(localStorage.getItem("tasks"));

    const afterDelete = tasks.filter(task => task.id !== taskId);

    localStorage.setItem("tasks", JSON.stringify(afterDelete));

}