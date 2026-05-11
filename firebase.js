import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

let app;
let auth;
let db;
let firebaseReady = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  firebaseReady = firebaseConfig.apiKey !== 'YOUR_API_KEY';
} catch (error) {
  console.warn('Firebase not configured yet. Running in demo mode.', error);
}

const demoDatabase = {
  materials: [
    { id: 'm1', name: 'Urea', quantity: 20, price: 1200, supplier: 'Agro Center', purchaseDate: '2026-05-01' },
    { id: 'm2', name: 'Seeds', quantity: 12, price: 2400, supplier: 'Green Seeds', purchaseDate: '2026-05-03' }
  ],
  usage: [
    { id: 'u1', material: 'Urea', crop: 'Sugarcane', quantity: 4, date: '2026-05-04', notes: 'First spray round' }
  ],
  crops: [
    { id: 'c1', name: 'Sugarcane', sowingDate: '2026-01-10', harvestDate: '2026-11-20', status: 'Growing', fertilizer: 'Urea', pesticide: 'Neem Spray', waterUsage: 'High', profit: 85000, imageUrl: '' },
    { id: 'c2', name: 'Wheat', sowingDate: '2025-12-10', harvestDate: '2026-04-15', status: 'Harvested', fertilizer: 'NPK', pesticide: 'Bio Wash', waterUsage: 'Medium', profit: 42000, imageUrl: '' }
  ],
  expenses: [
    { id: 'e1', type: 'Fuel', amount: 2600, date: '2026-05-02', notes: 'Tractor diesel' },
    { id: 'e2', type: 'Labor', amount: 3400, date: '2026-05-05', notes: 'Field cleaning' },
    { id: 'e3', type: 'Water', amount: 1800, date: '2026-05-06', notes: 'Pipeline motor' }
  ],
  workers: [
    { id: 'w1', name: 'Ramesh', attendance: 22, dailySalary: 600, advance: 1500 },
    { id: 'w2', name: 'Sunita', attendance: 24, dailySalary: 550, advance: 800 }
  ],
  activities: [
    { id: 'a1', title: 'Drip line inspection', time: '06:30 AM', note: 'North plot checked' },
    { id: 'a2', title: 'Pesticide spray', time: '08:15 AM', note: 'Cotton section complete' },
    { id: 'a3', title: 'Worker attendance saved', time: '05:40 PM', note: 'Monthly record updated' }
  ]
};

async function getCollectionData(collectionName) {
  if (!firebaseReady || !db) return [...(demoDatabase[collectionName] || [])];
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function addCollectionData(collectionName, payload) {
  if (!firebaseReady || !db) {
    const record = { id: crypto.randomUUID(), ...payload };
    demoDatabase[collectionName].unshift(record);
    return record;
  }

  const docRef = await addDoc(collection(db, collectionName), {
    ...payload,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...payload };
}

async function login(email, password) {
  if (!firebaseReady || !auth) return { email, demo: true };
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

async function signup(email, password) {
  if (!firebaseReady || !auth) return { email, demo: true };
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

async function logout() {
  if (!firebaseReady || !auth) return true;
  await signOut(auth);
  return true;
}

function observeAuth(callback) {
  if (!firebaseReady || !auth) {
    callback({ uid: 'demo-user', email: 'demo@krishisetu.app', demo: true });
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export {
  firebaseReady,
  demoDatabase,
  getCollectionData,
  addCollectionData,
  login,
  signup,
  logout,
  observeAuth
};
