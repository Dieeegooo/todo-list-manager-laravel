const host = "http://localhost:8000/api";
const getListButton = document.getElementById("get-list-button");
const postListName = document.getElementById("post-list-name");
const postListButton = document.getElementById("post-list-button");
const resultList = document.getElementById("result-list");
const description = document.getElementById("descrizione");
const putListName = document.getElementById("put-list-name");
let putListId = document.getElementById("put-list-id");
const putListButton = document.getElementById("put-list");
const descriptionListName = document.getElementById("description-list");
const descriptionListButton = document.getElementById("put-list-description");
const getListButtonNote = document.getElementById("get-list-button-note");
const postListNameNote = document.getElementById("post-list-name-note");
const postListButtonNote = document.getElementById("post-list-button-note");
const resultListNote = document.getElementById("result-list-note");
const putListNameNote = document.getElementById("put-list-name-note");
let putListIdNote = "";
const putListButtonNote = document.getElementById("put-list-note");
let postNoteId = "";
let deleteListId = "";
let descriptionListId = "";
let id = null;

async function reloadListTable() {
  apiRequest(host + "/tasks", "GET", {})
    .then((data) => {
      console.log(data);
      resultList.innerHTML = "";
      const table = document.createElement("table");

      const th = document.createElement("th");
      th.textContent = "Tasks";
      th.colSpan = "5";
      const tr = document.createElement("tr");
      tr.appendChild(th);
      table.appendChild(tr);

      for (const tasks of data) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerHTML = tasks.id;
        const td2 = document.createElement("td");
        td2.innerHTML = tasks.title;
        const td3 = document.createElement("td");
        td3.style.cursor = "pointer";
        td2.style.cursor = "pointer";
        td3.innerHTML = tasks.description;
        const td4 = document.createElement("td");
        td4.innerHTML = "&#9003";
        td2.addEventListener("click", () => {
          putListId = tasks.id;
          deleteListId = tasks.id;
          postNoteId = tasks.id;

          reloadListTableNote(tasks.id);
        });

        td3.addEventListener("click", () => {
          descriptionListId = tasks.id;
          descriptionListName.focus();
        });
        td4.style.cursor = "pointer";
        td4.addEventListener("click", () => {

          apiRequest(host + "/tasks/" + tasks.id, "GET")
            .then((data) => {
              if (data.notes.length !== 0) {
                if (confirm("vuoi cancellare questa lista e tutte le sue note?")) {
                  apiRequest(host + "/tasks/" + tasks.id, "DELETE", {});
                  resultListNote.innerHTML = "";
                  reloadListTable();
                }
              }else {
                  apiRequest(host + "/tasks/" + tasks.id, "DELETE", {});
                  resultListNote.innerHTML = "";
                  reloadListTable();

                  
                }
            })



        });
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
      }
      resultList.appendChild(table);
    })
    .catch((error) => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => {
  reloadListTable();
});

postListButton.addEventListener("click", () => {
  if (postListName.value == "") {
    return console.log("nome o descrizione non validi");
  }

  apiRequest(host + "/tasks", "POST", { title: postListName.value, description: description.value });

  postListName.value = "";
  description.value = "";

  reloadListTable();
});

putListButton.addEventListener("click", () => {
  if (putListId.value == "" || putListName.value == "") {
    return console.log("id o nome non validi");
  }

  apiRequest(host + "/tasks/" + putListId, "PUT", { title: putListName.value });

  putListId.value = "";
  putListName.value = "";

  reloadListTable();
});

descriptionListButton.addEventListener("click", async () => {
  if (descriptionListName.value == "") {
    return console.log("id o nome non validi");
  }
  await apiRequest(host + "/tasks/" + descriptionListId, "PUT", { description: descriptionListName.value });

  descriptionListName.value = "";

  await reloadListTable();
});

postListButtonNote.addEventListener("click", async () => {
  if (postListNameNote.value == "") {
    return console.log("nome non valido");
  }

  await apiRequest(host + "/notes", "POST", { task_id: postNoteId, state: "todo", name: postListNameNote.value });

  postListNameNote.value = "";

  await reloadListTableNote(postNoteId);
});
putListButtonNote.addEventListener("click", () => {
  if (putListNameNote.value == "") {
    return console.log("nome inserito non valido")
  }
  apiRequest(host + "/notes/" + putListIdNote, "PUT", { name: putListNameNote.value });
  putListNameNote.value = "";
  reloadListTableNote(postNoteId);
})

function reloadListTableNote(taskId) {
  apiRequest(host + "/tasks/" + taskId, "GET")
    .then((data) => {
      resultListNote.innerHTML = "";
      const table = document.createElement("table");
      const th = document.createElement("th");
      th.textContent = "Notes";
      th.colSpan = "4";
      const tr = document.createElement("tr");
      tr.appendChild(th);
      table.appendChild(tr);
      for (const notes of data.notes) {

        const td5 = document.createElement("td");
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerHTML = notes.id;
        const td2 = document.createElement("td");
        td2.innerHTML = notes.name;
        td2.style.cursor = "pointer";
        td2.addEventListener("click", () => {
          putListIdNote = notes.id;
          putListNameNote.focus();
        })
        const td4 = document.createElement("td");
        td4.innerHTML = notes.state;
        td4.addEventListener("click", async () => {
          if (notes.state == "todo") {
            await apiRequest(host + "/notes/" + notes.id, "PUT", { state: "done" });
          } else {
            await apiRequest(host + "/notes/" + notes.id, "PUT", { state: "todo" });
          }
          await reloadListTableNote(taskId);
        });
        td5.innerHTML = "&#9003";
        td5.style.cursor = "pointer";
        td5.addEventListener("click", async () => {
          await apiRequest(host + "/notes/" + notes.id, "DELETE", {});
          await reloadListTableNote(taskId);
        });
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td4);
        tr.appendChild(td5);
        table.appendChild(tr);

      }
      resultListNote.appendChild(table);
    })
    .catch((error) => console.error(error));
}


// for (const notes of data.notes) {
//            if (notes.id) {
//             verifica = 0;
//         } else {
//         verifica = 1;
//     }
// }