import firebase from 'firebase';
import 'firebase/firestore';
import config from './config.js';


const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId, 
    measurementId: config.measurementId
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()
const usersCollection = db.collection('users')
const workoutsCollections = db.collection('workouts')

export {
    auth,
    db,
    usersCollection,
    workoutsCollections
}