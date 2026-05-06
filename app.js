// ================== app.js ==================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHNIUz3BwoD3VMTwsK32skMUycAJ9IcxM",
  authDomain: "list-6a238.firebaseapp.com",
  projectId: "list-6a238",
  storageBucket: "list-6a238.firebasestorage.app",
  messagingSenderId: "124379264870",
  appId: "1:124379264870:web:dbd9e3000aa991afe4faa7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const itemsCol = collection(db, "compras");

const itemInput = document.getElementById('itemInput');
const addButton = document.getElementById('addButton');
const shoppingList = document.getElementById('shoppingList');

// Agregar nuevo artículo
addButton.addEventListener('click', async () => {
    const text = itemInput.value.trim();
    if (text === "") return;

    try {
        await addDoc(itemsCol, {
            nombre: text,
            comprado: false,
            fecha: Date.now()
        });
        itemInput.value = "";
    } catch (e) {
        console.error("Error al agregar:", e);
        alert("Error al guardar el artículo");
    }
});

// Escuchar cambios en tiempo real
const q = query(itemsCol, orderBy("fecha", "desc"));

onSnapshot(q, (snapshot) => {
    shoppingList.innerHTML = "";

    if (snapshot.empty) {
        shoppingList.innerHTML = `<li style="justify-content:center; color:#888;">La lista está vacía 🛍️</li>`;
        return;
    }

    snapshot.forEach((docSnap) => {
        const item = docSnap.data();
        const id = docSnap.id;

        const li = document.createElement('li');
        if (item.comprado) li.classList.add('checked');

        li.innerHTML = `
            <div class="check-box-container">
                <input type="checkbox" ${item.comprado ? 'checked' : ''}>
            </div>
            <div class="item-text">${item.nombre}</div>
            <button class="delete-btn">✕</button>
        `;

        // Marcar como comprado
        li.querySelector('input').addEventListener('change', (e) => {
            updateDoc(doc(db, "compras", id), { 
                comprado: e.target.checked 
            });
        });

        // Eliminar artículo
        li.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm("¿Eliminar este artículo?")) {
                deleteDoc(doc(db, "compras", id));
            }
        });

        shoppingList.appendChild(li);
    });
});