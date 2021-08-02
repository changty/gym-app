import  { db } from "../firebase"; 

class WorkoutDataService {
  getAll() {
    return db.collection('workouts');
  }

  getWorkout(id) {
    console.log("getting: ", id)
    return db.collection('workouts').doc(id)
  } 

  getOwnWorkouts(owner) {
    return db.collection('workouts').where("owner", "==", owner)//.orderBy("createdAt")
  } 

  create(workout) {

    workout.createdAt = Date.now();
    return db.collection('workouts').add(workout);
  }

  update(key, workout) {
    return db.collection('workouts').doc(key).set(workout);
  }

  delete(key) {
    return db.collection('workouts').doc(key).delete();
  }

  deleteAll() {
    //return db.collection('workouts').remove();
  }

  getMoves(workoutId) {
    return db.collection('moves').where('workout', '==', workoutId)
  } 

  addMove(move) {
    return db.collection('moves').add(move)
  }
}

export default new WorkoutDataService();