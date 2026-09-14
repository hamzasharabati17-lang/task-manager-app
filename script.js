const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

const clearCompleted = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || [];

function saveTasks() {
  localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("button");
    checkbox.className = "task-checkbox";
    checkbox.setAttribute("aria-label", "Complete task");

    checkbox.addEventListener("click", () => {
      toggleTask(task.id);
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "×";
    deleteBtn.setAttribute("aria-label", "Delete task");

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateStats();

  if (tasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    taskInput.focus();
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.unshift(newTask);

  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = total - completed;

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  remainingTasks.textContent = remaining;
}

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);

  saveTasks();
  renderTasks();
});

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

renderTasks();
