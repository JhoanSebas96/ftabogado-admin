import {uploadFile, download_url, saveDocument, onGetDocuments, updateDocument, db, getDocument} from "./firebase.js";


const taskForm = document.getElementById("task-form");
const tabla = document.getElementById("table-body");
const codigoInput = document.getElementById("codigo");
const urlInput = document.getElementById("url-file");
const inputFile = document.getElementById("input-file");
const btnUpdate = document.getElementById("btn-update");
const btnCancel = document.getElementById("btn-cancel");
const btnsEdit = tabla.querySelectorAll(".btnEditar");
const btnAdd = document.getElementById("btn-add");
const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
let numberDocs ;
let editStatus = false; 
var idUpdate;
window.addEventListener("DOMContentLoaded", async (e) =>{
    
    let dataSet = [];
    var i = 1;
    
    onGetDocuments((querySnapshot) =>{
        numberDocs = querySnapshot.size + 1 ;
        dataSet = [];
        $('#id-tabla').DataTable().destroy();
        querySnapshot.forEach((doc) => {
            const document = doc.data();
            dataSet.push( [ 
                document.codigo,
                `<a href="${document.url}" target ="_blank">${document.namePdf}</a>`,
                document.description, 
                `<button class='btnEditar btn btn-primary' data-id="${doc.id}">${iconoEditar}</button>`,
                doc.id
            ],) 
            i++;
        });
        
        $('#id-tabla').DataTable({
            columnDefs: [
                { visible: false, targets: 4 }
            ],
            responsive: true,
            lengthMenu: [
                [5, 10, 20, -1],
                [5, 10, 20, 'All'],
            ],
            stateSave: true,
            data: dataSet,
        });
    });

    
});

$('#id-tabla').on('click','.btnEditar',  function() {
    let fila = $('#id-tabla').dataTable().fnGetData($(this).closest('tr')); 
    let id = fila[4];
    idUpdate = id;
    taskForm["codigo"].value = fila[0];
    taskForm["description"].value = fila[2];
    taskForm["codigo"].setAttribute('disabled', 'true');
    taskForm["input-file"].setAttribute('disabled', 'true');
    btnUpdate.removeAttribute('hidden');
    btnCancel.removeAttribute('hidden');
    btnAdd.setAttribute('hidden', 'true');
    
});

function resetForm() {
    taskForm["codigo"].removeAttribute('disabled');
    taskForm["input-file"].removeAttribute('disabled');
    btnUpdate.setAttribute('hidden', 'true');
    btnCancel.setAttribute('hidden', 'true');
    btnAdd.removeAttribute('hidden');
    taskForm.reset();
}

btnUpdate.addEventListener('click', (e) =>{
    e.preventDefault();
    const descriptionUpdate= taskForm["description"].value
    updateDocument(idUpdate, descriptionUpdate);
    resetForm();
});

btnCancel.addEventListener('click', (e) => {
    resetForm();
})

inputFile.addEventListener("change", async (e) => {
  await uploadFile(inputFile.files[0]);
  taskForm["url-file"].value = download_url;
});

taskForm.addEventListener("submit", async (e) => {
    const numberD = numberDocs;
    e.preventDefault();
    const codigo = taskForm["codigo"];
    const namePdf = inputFile.files[0];
    const url = taskForm["url-file"];
    const descr = taskForm["description"]
    try {
        saveDocument(codigo.value, namePdf.name, url.value, descr.value, numberD);
        taskForm.reset();
    } catch (error) {
        console.log(error);
    }
});
