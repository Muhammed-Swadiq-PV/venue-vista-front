import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Directly include Firebase credentials currently
const firebaseConfig = {
  apiKey: "AIzaSyDqwufOxinTAE0vkzLNkZDeEmo-d3SjCtE",
  authDomain: "venue-vista-c9ef1.firebaseapp.com",
  projectId: "venue-vista-c9ef1",
  storageBucket: "venue-vista-c9ef1.appspot.com",
  messagingSenderId: "726763153570",
  appId: "1:726763153570:web:6d200a6cc2c3901945cffb"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
