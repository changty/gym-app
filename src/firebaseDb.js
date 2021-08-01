import firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore()
const usersCollection = db.collection('users')
const workoutsCollections = db.collection('workouts')

export {
    db,
    usersCollection,
    workoutsCollections
}