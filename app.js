import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getDatabase, ref, set, onValue, push, get, child } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';


// init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// UI elements
const loading = document.getElementById('loading');
const authSection = document.getElementById('authSection');
const mainSection = document.getElementById('mainSection');
const btnLogout = document.getElementById('btnLogout');


// show initial
function showLoading(){ loading.classList.remove('d-none'); authSection.classList.add('d-none'); mainSection.classList.add('d-none'); btnLogout.classList.add('d-none'); }
function showAuth(){ loading.classList.add('d-none'); authSection.classList.remove('d-none'); mainSection.classList.add('d-none'); btnLogout.classList.add('d-none'); }
function showMain(){ loading.classList.add('d-none'); authSection.classList.add('d-none'); mainSection.classList.remove('d-none'); btnLogout.classList.remove('d-none'); }


showLoading();
setTimeout(()=> showAuth(), 1000);


// Register
window.registerUser = async function(){
const name = document.getElementById('regName').value.trim();
const phone = document.getElementById('regPhone').value.trim();
const email = (document.getElementById('regEmail').value || '').trim();
const password = document.getElementById('regPassword').value;
if(!phone || !password){ alert('মোবাইল ও পাসওয়ার্ড দিন'); return; }
const authEmail = email || (phone + '@nandia.local');
try{
const userCred = await createUserWithEmailAndPassword(auth, authEmail, password);
const uid = userCred.user.uid;
await set(ref(db, 'users/' + uid), { name, phone, email: email || '', createdAt: new Date().toISOString(), active: true });
alert('রেজিস্ট্রেশন সফল — আপনি লগইন করতে পারবেন।');
}catch(err){ console.error(err); alert(err.message || err); }
}


// Login
window.loginUser = async function(){
const phone = document.getElementById('loginPhone').value.trim();
const password = document.getElementById('loginPassword').value;
if(!phone || !password){ alert('মোবাইল ও পাসওয়ার্ড দিন'); return; }
const authEmail = phone + '@nandia.local';
try{
const userCred = await signInWithEmailAndPassword(auth, authEmail, password);
const uid = userCred.user.uid;
const snap = await get(child(ref(db), 'users/' + uid));
const user = snap.val();
if(user && user.active) { showMain(); loadHome(); }
else { alert('অ্যাকাউন্ট এক্টিভ নয়'); await signOut(auth); showAuth(); }
}catch(err){ console.error(err); alert('লগইন ভুল: '+(err.message||err)); }
}


// Logout
btnLogout.addEventListener('click', async ()=>{ await signOut(auth); showAuth(); });


// Auth state listener
onAuthStateChanged(auth, user=>{
if(user){ showMain(); loadHome(); }
else { /* no user */ }
});


// Load Home
async function loadHome(){
loadSlider();
loadTexts();
loadButtons();
}
else if(type===
