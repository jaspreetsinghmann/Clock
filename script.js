const STORAGE_KEY = "todoTasks";
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");

    let ampmSpan = document.getElementById("ampm");
    if (!ampmSpan) {
        ampmSpan = document.createElement("span");
        ampmSpan.id = "ampm";
        ampmSpan.classList.add("separator");
        document.querySelector(".clock").appendChild(ampmSpan);
    }
    ampmSpan.textContent = ampm;
}
setInterval(updateClock, 1000);
updateClock();

function saveTasks() {
    const tasks = [];
    list.querySelectorAll("li").forEach((li) => {
        tasks.push(li.firstChild.textContent);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTaskItem(text) {
    const li = document.createElement("li");
    li.textContent = text;
    const removeBtn = document.createElement("button");
    removeBtn.setAttribute("aria-label", `Remove task: ${text}`);
    removeBtn.innerHTML = "&times;";
    removeBtn.addEventListener("click", () => {
        li.classList.add("removing");
        setTimeout(() => {
            li.remove();
            saveTasks();
        }, 300);
    });
    li.appendChild(removeBtn);
    return li;
}

function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    let tasks;
    try {
        tasks = JSON.parse(stored);
    } catch {
        return;
    }
    tasks.forEach((task) => {
        const taskItem = createTaskItem(task);
        list.appendChild(taskItem);
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTask = input.value.trim();
    if (!newTask) return;
    const taskItem = createTaskItem(newTask);
    list.appendChild(taskItem);
    saveTasks();
    input.value = "";
    input.focus();
});

loadTasks();