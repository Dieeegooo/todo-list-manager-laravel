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
let postNoteId = "";
let deleteListId = "";
let descriptionListId = "";
let id = null;
//ricordati di cambiare tutti i path delle richieste alle api e pensa a come fare la show
async function reloadListTable() {
  apiRequest(host + "/tasks", "GET", {})
    .then((data) => {
      console.log(data); // TODO: delete this line
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
        td2.style.cursor = "pointer"
        td3.innerHTML = tasks.description;
        const td4 = document.createElement("td");
        td4.innerHTML = "&#9003";
        td2.addEventListener("click", () => {
          putListId = tasks.id;
          deleteListId = tasks.id;
          postNoteId = tasks.id;
        })
        td3.addEventListener("click", () => {
          descriptionListId = tasks.id;
          descriptionListName.focus();
        })
        td4.style.cursor = "pointer"
        td4.addEventListener("click", async () => {
          await apiRequest(host + "/tasks/" + tasks.id, "DELETE", {});
          await reloadListTable();
        })
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
  reloadListTableNote();
});

postListButton.addEventListener("click", () => {
  if (postListName.value == "") {
    return console.log("nome o descrizione non validi");
  }

  apiRequest(host + "/tasks", "POST", { title:postListName.value, description:description.value });

  postListName.value = "";
  description.value = "";

  reloadListTable();
});

putListButton.addEventListener("click", () => {
  if (putListId.value == "" || putListName.value == "") {
    return console.log("id o nome non validi");
  }

  apiRequest(host + "/tasks/" + putListId, "PUT", { title:putListName.value });

  putListId.value = "";
  putListName.value = "";

  reloadListTable();
});


descriptionListButton.addEventListener("click",async () => {
  if (descriptionListName.value == "") {
    return console.log("id o nome non validi");
  }
  await apiRequest(host + "/tasks/" + descriptionListId, "PUT", { description: descriptionListName.value });

  descriptionListName.value = "";

  await reloadListTable();
})



const getListButtonNote = document.getElementById("get-list-button-note");
const postListNameNote = document.getElementById("post-list-name-note");
const postListButtonNote = document.getElementById("post-list-button-note");
const resultListNote = document.getElementById("result-list-note");
const putListNameNote = document.getElementById("put-list-name-note");
let putListIdNote = ""
const putListButtonNote = document.getElementById("put-list-note");

async function reloadListTableNote() {
  apiRequest(host + "/notes", "GET", {})
    .then((data) => {
      resultListNote.innerHTML = "";
      const table = document.createElement("table");

      const th = document.createElement("th");
      th.textContent = "Note";
      th.colSpan = "5";
      const tr = document.createElement("tr");
      tr.appendChild(th);
      table.appendChild(tr);

      for (const note of data) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerHTML = note.id;
        const td2 = document.createElement("td");
        td2.innerHTML = note.name;
        td2.style.cursor = "pointer";
          td2.addEventListener("click", () => {
            putListIdNote = note.id;
            putListNameNote.focus();
        })
        const td3 = document.createElement("td");
        td3.innerHTML = note.task_id;
        const td4 = document.createElement("td");
        td4.innerHTML = note.state;
        const td5 = document.createElement("td");
        td5.innerHTML = "&#9003";
        td5.style.cursor = "pointer";
        td5.addEventListener("click", async () => {

          await apiRequest(host + "/notes/" + note.id, "DELETE", {});

          await reloadListTableNote();
        });

        td4.addEventListener("click", () => {
          if (note.state == "todo") {
            // cambia in done
            apiRequest(host + "/notes/" + note.id , "PUT", { state: "done" }).then(() => {
              setTimeout(() => {
                reloadListTableNote();
              }, 20);
            });
          } else {
            // cambia in todo
            apiRequest(host + "/notes/" + note.id , "PUT", { state: "todo" }).then(() => {
              setTimeout(() => {
                reloadListTableNote();
              }, 20);
            });
          }
        });

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        table.appendChild(tr);
      }
      resultListNote.appendChild(table);
    })
    .catch((error) => console.error(error));
}

reloadListTableNote();

postListButtonNote.addEventListener("click", () => {
  if (postListNameNote.value == "" ) {
    return console.log("id o nome non validi");
  }

  //chiedere a derteo se gli passi che todo

  apiRequest(host + "/notes", "POST", { task_id:postNoteId, state:"todo", name: postListNameNote.value });

  postListNameNote.value = "";

  reloadListTableNote()
});

putListButtonNote.addEventListener("click", () => {
  if (putListNameNote.value == "") {
    return console.log("id o nome non validi");
  }

  apiRequest(host + "/notes/" + putListIdNote, "PUT", { name: putListNameNote.value });

  putListNameNote.value = "";

  reloadListTableNote();
});

// ripassare quello che ho scritto su perplexity per eliminare un intera riga con la DELETE grazie a un bottone serve l'id scorrendo un for
