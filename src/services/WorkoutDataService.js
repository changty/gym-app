import  { db } from "../firebase"; 

class WorkoutDataService {
  // Templates
  getTemplates(owner) {
    return db.collection('templates').where("owner", "==", owner)
  }

  getTemplate(id) {
    return db.collection('templates').doc(id)
  }

  updateTemplate(id, template) {
    return db.collection('templates').doc(id).set(template, {merge: true})
  }

  createTemplate(template) {
    template.createdAt = Date.now() 
    return db.collection('templates').add(template)
  }

  deleteTemplate(id) {
    return db.collection('templates').doc(id).delete()
  }

  // Workouts
  getWorkouts(owner) {
    return db.collection('workouts').where("owner", "==", owner)//.orderBy("createdAt", "asc")
  }

  getSimilarWorkouts(template) {
    return db.collection('workouts').where("template", "==", template)
  }

  getWorkout(id) {
    return db.collection('workouts').doc(id)
  }

  updateWorkout(id, template) {
    return db.collection('workouts').doc(id).set(template, {merge: true})
  }

  createWorkout(workout) {
    return db.collection('workouts').add(workout)
  }

  deleteWorkout(id) {
    return db.collection('workouts').doc(id).delete()
  }

}

export default new WorkoutDataService();