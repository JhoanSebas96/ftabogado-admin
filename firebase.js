import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-storage.js";
import { getFirestore, orderBy, query, collection, doc, addDoc, getDoc, onSnapshot,limit} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAJjGnJ6AMa3hOx1oHea72wC32ml1NbBuI",
    authDomain: "lawft-15a2b.firebaseapp.com",
    projectId: "lawft-15a2b",
    storageBucket: "lawft-15a2b.appspot.com",
    messagingSenderId: "985988342015",
    appId: "1:985988342015:web:8ea4ed195c75ac2de52cca"

};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export var download_url ='';


/**
 * Upload a New file in Storage
 * @param {bytes} file the file 
 */

export const uploadFile = async (file) => {
    const uploadTask = await uploadBytesResumable(ref(storage, "casos/"+ file.name), file);
    await getDownloadURL(ref(storage, 'casos/'+ file.name)).then((downloadUrl) => {
        download_url = downloadUrl;
    })
}

/**
 * Save a Document in Firestore
 * @param {string} cedula the cedula of the user
 * @param {string} namePdf the name of the pdf
 * @param {string} url the url of the pdf
 * @param {numeric} numero the numero of the pdf
 */
export const saveDocument = (cedula, namePdf, url, numero) => {
    addDoc(collection(db,"casos"),{cedula, namePdf, url, numero});
}

export const onGetDocuments = (callback) =>{
    const q = query(collection(db,"casos"), orderBy("numero"))
    onSnapshot(q, callback);
}


