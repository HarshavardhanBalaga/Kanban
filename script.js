let tasksData = {}

const tasks = document.querySelectorAll(".task");
const columns = document.querySelectorAll(".task-column");
const count = document.querySelectorAll(".count");
const addTaskBtn = document.getElementById("add-task");
const toggleModalBtn = document.getElementById("toggle-modal");
const modal = document.querySelector(".modal");
const bg = document.querySelector(".bg");
const todo = document.getElementById("to-do");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

let draggedTask = null;

function addTask(title, description, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            <button>Delete</button>
        `;
  column.appendChild(div);
  div.addEventListener("dragstart", (e) => {
    draggedTask = div;
    div.classList.add("dragging");
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  });
  div.addEventListener("dragend", (e) => {
    div.classList.remove("dragging");
    draggedTask = null;
  });
  div.querySelector("button").addEventListener("click", () => {
    div.remove();
    updateCounts();
  });
  return div; 
}

function updateCounts() {
   [todo, progress, done].forEach((column) => {
      const tasksInColumn = column.querySelectorAll(".task");
      const count = column.querySelector(".heading .count");
      
      tasksData[column.id] = Array.from(tasksInColumn).map(task => ({
        title: task.querySelector("h3").innerText,
        description: task.querySelector("p").innerText
      }));

      localStorage.setItem('tasksData', JSON.stringify(tasksData));

      count.innerText = tasksInColumn.length;
  });
}

if(localStorage.getItem('tasksData')) {
  const data = JSON.parse(localStorage.getItem('tasksData'));
  for(const col in data){

    const column = document.getElementById(`${col}`);
    data[col].forEach(task => {
    addTask(task.title, task.description, column);
  });
    updateCounts();
}
} 

tasks.forEach((task) => {
  task.addEventListener("dragstart", (e) => {
    draggedTask = task;
    task.classList.add("dragging");
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  });

  task.addEventListener("dragend", (e) => {
    task.classList.remove("dragging");
    draggedTask = null;
  });
});

columns.forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("drop", (e) => {
    column.classList.remove("hover-over");
    if (draggedTask) {
      column.appendChild(draggedTask);
    }
    updateCounts();


});
});
// Modal Toggle

toggleModalBtn.addEventListener("click", () => {
  modal.classList.toggle("active");
});

bg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");

  addTask(titleInput.value, descriptionInput.value, todo);
  updateCounts();
  
  // Clear input fields
  titleInput.value = "";
  descriptionInput.value = "";

  modal.classList.remove("active");
});
  
