
const API = "http://localhost:8000/api";

const newTaskTitleInput = document.getElementById("post-list-name");
const newTaskDescInput = document.getElementById("descrizione");
const addTaskButton = document.getElementById("post-list-button");
const editTaskTitleInput = document.getElementById("put-list-name");
const editTaskDescInput = document.getElementById("description-list");
const editTaskButton = document.getElementById("put-list");
const editTaskDescButton = document.getElementById("put-list-description");
const tasksContainer = document.getElementById("result-list");


const newNoteInput = document.getElementById("post-list-name-note");
const addNoteButton = document.getElementById("post-list-button-note");
const editNoteInput = document.getElementById("put-list-name-note");
const editNoteButton = document.getElementById("put-list-note");
const notesContainer = document.getElementById("result-list-note");


let selectedTaskId = null;
let selectedNoteId = "";


async function reloadTasks() {
  apiRequest(API + "/tasks", "GET", {})
    .then((data) => {
      tasksContainer.innerHTML = "";
      const table = document.createElement("table");

      const header = document.createElement("th");
      header.textContent = "Tasks";
      header.colSpan = "5";
      const headerRow = document.createElement("tr");
      headerRow.appendChild(header);
      table.appendChild(headerRow);

      for (const task of data) {
        const row = document.createElement("tr");
        const tdId = document.createElement("td");
        const tdTitle = document.createElement("td");
        const tdDesc = document.createElement("td");
        const tdDelete = document.createElement("td");

        tdId.innerHTML = task.id;
        tdTitle.innerHTML = task.title;
        tdDesc.innerHTML = task.description;
        tdDelete.innerHTML = "⌫";

        tdTitle.style.cursor = tdDesc.style.cursor = tdDelete.style.cursor = "pointer";

        tdTitle.addEventListener("click", () => {
          selectedTaskId = task.id;
          const wasSelected = tdTitle.classList.contains("is-selected");
          table.querySelectorAll("td.is-selected").forEach(td => {
            td.classList.remove("is-selected");
          });
          if (!wasSelected) tdTitle.classList.add("is-selected");
          reloadNotes(task.id);
        });

        tdDesc.addEventListener("click", () => {
          selectedTaskId = task.id;
          editTaskDescInput.focus();
        });

        tdDelete.addEventListener("click", () => {
          apiRequest(API + "/tasks/" + task.id, "GET")
            .then((data) => {
              if (data.notes.length !== 0) {
                if (confirm("Vuoi cancellare questa lista e tutte le sue note?")) {
                  apiRequest(API + "/tasks/" + task.id, "DELETE", {});
                  notesContainer.innerHTML = "";
                  reloadTasks();
                }
              } else {
                apiRequest(API + "/tasks/" + task.id, "DELETE", {});
                notesContainer.innerHTML = "";
                reloadTasks();
              }
            });
        });

        row.appendChild(tdId);
        row.appendChild(tdTitle);
        row.appendChild(tdDesc);
        row.appendChild(tdDelete);
        table.appendChild(row);
      }
      tasksContainer.appendChild(table);
    })
    .catch((error) => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => reloadTasks());

addTaskButton.addEventListener("click", () => {
  if (!newTaskTitleInput.value) return;
  apiRequest(API + "/tasks", "POST", {
    title: newTaskTitleInput.value,
    description: newTaskDescInput.value
  });
  newTaskTitleInput.value = newTaskDescInput.value = "";
  reloadTasks();
});

editTaskButton.addEventListener("click", () => {
  if (!selectedTaskId || !editTaskTitleInput.value) return;
  apiRequest(API + "/tasks/" + selectedTaskId, "PUT", { title: editTaskTitleInput.value });
  editTaskTitleInput.value = "";
  reloadTasks();
});

editTaskDescButton.addEventListener("click", async () => {
  if (!editTaskDescInput.value) return;
  await apiRequest(API + "/tasks/" + selectedTaskId, "PUT", { description: editTaskDescInput.value });
  editTaskDescInput.value = "";
  await reloadTasks();
});



function reloadNotes(taskId) {
  apiRequest(API + "/tasks/" + taskId, "GET")
    .then((data) => {
      notesContainer.innerHTML = "";
      const table = document.createElement("table");
      const header = document.createElement("th");
      header.textContent = "Notes";
      header.colSpan = "4";
      const headerRow = document.createElement("tr");
      headerRow.appendChild(header);
      table.appendChild(headerRow);

      for (const note of data.notes) {
        const row = document.createElement("tr");
        const tdId = document.createElement("td");
        const tdName = document.createElement("td");
        const tdState = document.createElement("td");
        const tdDelete = document.createElement("td");

        tdId.innerHTML = note.id;
        tdName.innerHTML = note.name;
        tdState.innerHTML = note.state;
        tdDelete.innerHTML = "⌫";

        tdName.style.cursor = tdDelete.style.cursor = "pointer";

        tdName.addEventListener("click", () => {
          selectedNoteId = note.id;
          editNoteInput.focus();
        });

        tdState.addEventListener("click", async () => {
          const newState = note.state === "todo" ? "done" : "todo";
          await apiRequest(API + "/notes/" + note.id, "PUT", { state: newState });
          await reloadNotes(taskId);
        });

        tdDelete.addEventListener("click", async () => {
          await apiRequest(API + "/notes/" + note.id, "DELETE", {});
          await reloadNotes(taskId);
        });

        row.appendChild(tdId);
        row.appendChild(tdName);
        row.appendChild(tdState);
        row.appendChild(tdDelete);
        table.appendChild(row);
      }
      notesContainer.appendChild(table);
    })
    .catch((error) => console.error(error));
}

addNoteButton.addEventListener("click", async () => {
  if (!newNoteInput.value) return;
  await apiRequest(API + "/notes", "POST", {
    task_id: selectedTaskId,
    state: "todo",
    name: newNoteInput.value
  });
  newNoteInput.value = "";
  await reloadNotes(selectedTaskId);
});

editNoteButton.addEventListener("click", () => {
  if (!editNoteInput.value) return;
  apiRequest(API + "/notes/" + selectedNoteId, "PUT", { name: editNoteInput.value });
  editNoteInput.value = "";
  reloadNotes(selectedTaskId);
});

function submitOnEnter(input, button) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      button.click();
    }
  });
}

// task
submitOnEnter(newTaskTitleInput,  addTaskButton);
submitOnEnter(newTaskDescInput,   addTaskButton);
submitOnEnter(editTaskTitleInput, editTaskButton);
submitOnEnter(editTaskDescInput,  editTaskDescButton);

// note
submitOnEnter(newNoteInput,  addNoteButton);
submitOnEnter(editNoteInput, editNoteButton);