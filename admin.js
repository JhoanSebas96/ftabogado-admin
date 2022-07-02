import {
  uploadFile,
  download_url,
  saveDocument,
  onGetDocuments,
  db,
} from "./firebase.js";
import {
  getDoc,
  doc,
  orderBy,
  startAfter,
  endBefore,
  limit,
  limitToLast,
  onSnapshot,
  query,
  where,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");
const tabla = document.getElementById("tabla");
const tabla2 = document.getElementById("tabla2");
const btnSearch = document.getElementById("btn-search");
const inputSearch = document.getElementById("input-search");
const inputFile = document.getElementById("input-file");

let numeroDocs ;

window.addEventListener("DOMContentLoaded", async (e) =>{
    
    let dataSet = [];
    var i = 1;
    
    onGetDocuments((querySnapshot) =>{
        numeroDocs = querySnapshot.size + 1 ;
        dataSet = [];
        $('#id-tabla').DataTable().destroy();
        querySnapshot.forEach((doc) => {
            const document = doc.data();
            dataSet.push( [ document.cedula, `<a href="${document.url}" target ="_blank">${document.namePdf}</a>`],) 
            // tab.row.add(dataSet).draw();
            i++;
            // console.log(dataSet)
        });
        
        $('#id-tabla').DataTable({
            responsive: true,
            lengthMenu: [
                [5, 10, 20, -1],
                [5, 10, 20, 'All'],
            ],
            ordering : false,
            stateSave: true,
            data: dataSet
        });
        

    })
    
    
    
    

});

btnSearch.addEventListener("click", async (e) => {
  const q = query(
    collection(db, "casos"),
    where("cedula", "==", inputSearch.value)
  );
  const querySnapshot = await getDocs(q);
  tabla2.innerHTML = "";
  querySnapshot.forEach((doc) => {
    tabla2.innerHTML += `
            <tr>
                <td>${doc.data().cedula}</td>
                <td><a href="${doc.data().url}" target="_blank">${doc.data().namePdf}</a></td>
            </tr>
            
        `;
  });
});

inputFile.addEventListener("change", async (e) => {
  await uploadFile(inputFile.files[0]);
  taskForm["url-file"].value = download_url;
});

taskForm.addEventListener("submit", async (e) => {
    const numeroD = numeroDocs;
    e.preventDefault();
    const cedula = taskForm["cedula"];
    const namePdf = inputFile.files[0];
    const url = taskForm["url-file"];

    try {
        saveDocument(cedula.value, namePdf.name, url.value, numeroD);
        taskForm.reset();
    } catch (error) {
        console.log(error);
    }
});
