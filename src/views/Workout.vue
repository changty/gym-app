<template>
    <div :class="'lift card mb-3 '">
        <div class="card-body">
            <div class="d-flex w-100 justify-content-between mt-3 mb-3">
                <div v-if="!edit">
                    <h1 :class="workout.color+'-txt'">{{workout.name}}</h1>
                    <p>{{workout.description}}</p>
                    <p class="small">{{since(workout.createdAt)}}<br/>({{date(workout.createdAt)}})</p>
                    <!-- <p class="small">{{since(previousWorkout.createdAt)}}<br/>({{date(previousWorkout.createdAt)}})</p> -->

                </div>
                <div v-if="edit" class="w-50">
                    <form>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input  class="form-control" id="name" required v-model="workout.name" name="name"/>
                        </div>
                        <div class="form-group mt-3 mb-3">
                            <label for="description">Description</label>
                            <textarea rows="3" class="form-control" id="description" v-model="workout.description" name="description" />
                        </div>

                        <div class="form-group">
                            <div class="btn-group" role="group" aria-label="color">
                                <button @click="setColor('green')" type="button" class="btn green btn-sm">Green</button>
                                <button @click="setColor('red')" type="button" class="btn red btn-sm">Red</button>
                                <button @click="setColor('blue')" type="button" class="btn blue btn-sm">Blue</button>
                                <button @click="setColor('yellow')" type="button" class="btn yellow btn-sm">Yellow</button>
                            </div>
                        </div>
                        <!-- <button type="submit" class="mt-3 btn btn-primary" @click="save">Save</button>  -->
                    </form>
                    
                    <button class="btn btn-danger mt-3" @click="remove">Delete workout</button>

                </div>
                <div>  
                    <button @click="toggleEdit" class="btn btn-link">{{editButton}}</button>
                </div>
            </div>
        </div>
    </div>
            <button :class="'workout-total-volume btn btn-outline-primary text-center w-100 mb-3 ' + workout.status">Volume: {{ volumeDifference() }}</button>
 

      <div v-if="addExercise" class="card w-100 mb-3">
          <div class="card-body">
                <h3>New exercise</h3>
                <form>
                    <div class="form-group">
                        <label for="exerciseName">Exercise name</label>
                        <input class="form-control" id="exerciseName" required name="exerciseName" ref="exerciseName"/>
                    </div>
                    <div class="form-group">
                        <label for="notes">Notes</label>
                        <textarea class="form-control" rows="3" id="notes" name="notes" ref="notes"/>
                    </div>
                </form>
            <button @click="addNewExercise" class="btn-block btn btn-primary mt-3 mb-3">Add</button>
            </div>
    </div>
    <button @click="toggleAddExercise" class="btn-block btn btn-outline-primary mb-3" style="width:100%">{{addExerciseButtonText}}</button>


        <div :class="'workout card mb-2 shadow ' + item.status" v-for="(item, index) in workout.exercises" :key="item.name">
            <div v-if="!item.edit" class="card-header d-flex w-100 justify-content-between">
                <div>
                    <b>{{item.name}} ({{item.sets.length}} sets)</b>
                    <p class="card-text">{{item.notes}}</p>
                    <p @click="item.edit=!item.edit" class="text-muted link">Edit</p>
                </div>
                <div style="flex-shrink: 0;">
                    <span class="text-muted">Volume</span><span><br/>{{ totalExerciseVolume(index) }}</span><span class="text-muted"> /{{previousExerciseVolume(index)}}</span><br/>
                    <span>{{ exerciseDiff(index) }}</span>
                </div>
            </div>
            <div v-if="item.edit" class="card-header d-flex w-100 justify-content-between">
                     <form>
                        <div class="form-group">
                            <label for="exerciseName">Exercise name</label>
                            <input class="form-control" id="exerciseName" required name="exerciseName" ref="exerciseName" v-model="item.name"/>
                        </div>
                        <div class="form-group">
                            <label for="notes">Notes</label>
                            <textarea class="form-control" rows="3" id="notes" name="notes" ref="notes" v-model="item.notes"/>
                        </div>
                    </form>
                     <p @click="item.edit=!item.edit" class="text-muted link">Save</p>

                </div>

            <div class="card-body">
                    <div class="sets">
                            <div class="set d-flex w-100 justify-content-between align-items-center" v-for="(set, setIndex) in item.sets" :key="setIndex">
                                <div class="d-flex align-items-center">
                                    <div class="form-group">
                                        <label for="set">&nbsp;</label><br/>
                                        <span name="set" class="badge badge-primary">Set {{setIndex+1}}</span>
                                    </div>
                                    <div class="form-group">
                                        <label for="previousData">Previous</label><br/>
                                        <span name="previousData" class="badge previous">{{previousData(item.name, setIndex)}}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="reps">Reps</label>
                                    <input class="form-control" type="number" id="reps" required name="reps" ref="reps"  v-model="set.reps"/>
                                </div>
                                <div class="form-group">
                                    <label for="weight">Weight</label>
                                    <input class="form-control" type="number" id="weight" required name="weight" ref="weight" v-model="set.weight"/>
                                </div>
                                <!-- lets skip this for now -->
                                <!-- <div>
                                    <label for="rest">Rest</label>
                                    <input type="number" id="rest" required name="rest" ref="rest"  v-model="set.rest"/>
                                </div> -->
                                <div v-if="edit" class="mt-4">
                                    <button v-if="edit" @click="removeSet(index, setIndex)" class="btn btn-danger icon-only-rounded btn-sm">x</button>
                                </div>
                            </div>
                    </div>
                    <button class="btn btn-outline-primary btn-block mt-3"  style="flex-grow:100; width:100%" @click="newSet(index)">Add a set</button>
                </div>
            </div>
</template>

<script>
    import WorkoutDataService from '../services/WorkoutDataService';
    import router from '../router'
    import moment from 'moment';

    export default {
        data() {
            return {
                addExerciseButtonText: "Add an exercise", 
                addExercise: false,
                edit: false,
                editButton: "edit",
                id: null,
                workout: {
                    color: 'green',
                },
                previousWorkout: {},
                allWorkouts: {},
                state: this.$root.$data.sharedState
            }
        },
    
        watch: {
            workout: {
                handler() {
                    this.save()
                },
                deep: true
            }
        },

        created() {
            if(this.$route.params.id === "new") {
                this.workout.name = ""
                this.workout.description = ""
                this.workout.exercises = []
                this.edit = true
                this.editButton = "done"
            }
            else {
                this.id = this.$route.params.id
                this.getWorkout()
                this.getSimilarWorkouts()
            }
        },

        methods: {
            totalExerciseVolume(index) {
                let sets =  this.workout.exercises[index].sets
                let sum = 0; 
                for(let i=0; i<sets.length; i++) {
                    let set = sets[i];
                    sum += set.weight*set.reps
                }
                
                return sum

            }, 

            previousExerciseVolume(index) {
                let sum = 0; 

                if(this.previousWorkout && this.previousWorkout.exercises !== undefined && this.previousWorkout.exercises[index])  {
                    let sets =  this.previousWorkout.exercises[index].sets
                    for(let i=0; i<sets.length; i++) {
                        let set = sets[i];
                        sum += set.weight*set.reps
                    }
                    return sum
                }

            },

            exerciseDiff(index) {
                let current = this.totalExerciseVolume(index); 
                let previous = this.previousExerciseVolume(index); 

                let diff = current-previous
                
                const item = this.workout.exercises[index]

                if(diff === 0) {
                    item.status = ''
                }
                else if(diff < 0) {
                    item.status = 'red-txt lift'
                }
                else {
                    item.status =  'green-txt'
                }

                if(isNaN(diff)) {
                    return "-"
                }
                else if(diff > 0) {
                    return '+' + diff
                }
                else {
                    return diff
                }
            },

            previousWorkoutTotalVolume() {
                let sum = 0; 
                if(this.previousWorkout && this.previousWorkout.exercises) {
                    for(let i=0; i<this.previousWorkout.exercises.length; i++) {
                        for(let j=0; j<this.previousWorkout.exercises[i].sets.length; j++) {
                            sum += this.previousWorkout.exercises[i].sets[j].weight*this.previousWorkout.exercises[i].sets[j].reps
                        }
                    }
                    return sum; 
                }
            },

            volumeDifference() {
                let diff = this.workoutTotalVolume() - this.previousWorkoutTotalVolume()
                if(isNaN(diff)) {
                    this.workout.status = 'white'
                    return this.workoutTotalVolume()
                }
                if(diff > 0) {
                    this.workout.status = 'green'
                    return "+" + diff
                }
                this.workout.status = 'red'
                return diff
            },

            workoutTotalVolume() {
                let sum = 0; 
                for(let i=0; i<this.workout.exercises.length; i++) {
                    for(let j=0; j<this.workout.exercises[i].sets.length; j++) {
                        sum += this.workout.exercises[i].sets[j].weight*this.workout.exercises[i].sets[j].reps
                    }
                }
                return sum; 
            },

            getWorkout() {
                // Filter this workout from shared state workouts
                this.workout = this.state.workouts.find(w => w.id === this.id)
            },
            date(time) {
                return moment(time).format('MMMM Do YYYY, h:mm:ss')
            },
            since(time) {
                return moment(time).fromNow(); 
            },

            getSimilarWorkouts() {

                let filtered = []; 
                let key = this.workout.template || this.workout.id

                filtered = this.state.workouts.filter(w => (w.template === key || w.id === key)); 
                // sort from newest to oldest
                filtered = filtered.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : ((b.createdAt > a.createdAt) ? 1 : 0))
                this.allWorkouts = filtered; 
                // get previous workout, if there are any
                if(filtered.length > 1 && this.allWorkouts[1].createdAt < this.workout.createdAt) {
                    this.previousWorkout = this.allWorkouts[1]
                }

            },
            setColor(color) {
                this.workout.color = color; 
                this.save
            },
            remove() {
                WorkoutDataService.deleteWorkout(this.id)
                .then(() => {
                    router.push('/')
                })
                .catch((e) => {
                    console.log("could not remove", e)
                })
            },

            save() {
                let toSave = {
                    name: this.workout.name,
                    description: this.workout.description,
                    exercises: this.workout.exercises,
                    color: this.workout.color
                }

                if(this.id !== null) {
                    WorkoutDataService.updateWorkout(this.id, toSave)
                        .then(() =>{
                        })
                        .catch(e => {
                            console.log("error updating template", e)
                        })
                }
                else {
                    toSave.owner = this.state.email
                    toSave.createdAt = Date.now() 

                    WorkoutDataService.createWorkout(toSave)
                        .then((docRef) => {
                            this.id = docRef.id
                        })
                        .catch(e => {
                            console.log("Error saving new workout", e)
                        })
                }
            },

            newSet(index) {
                this.workout.exercises[index].sets.push({index: this.workout.exercises[index].sets.length, weight: 0, reps: 0, rest: 60})
                this.save()
            }, 

            removeSet(index, setIndex) {
                this.workout.exercises[index].sets.splice(setIndex, 1);
                this.save(); 
            },

            addNewExercise() {
                let exercise = {
                    name: this.$refs.exerciseName.value,
                    notes: this.$refs.notes.value,
                    sets:[]
                }

                this.$refs.exerciseName.value = ''
                this.$refs.notes.value = ''
                this.workout.exercises.push(exercise);

                this.save()
            },

            toggleEdit(){
                this.edit = !this.edit
                if(this.edit) {
                    this.editButton="done"
                }
                else {
                    this.editButton="edit"
                    this.save()
                }
            },

            toggleAddExercise() {
                this.addExercise = !this.addExercise
                if(this.addExercise) {
                    this.addExerciseButtonText = "Cancel"
                }
                else {
                    this.addExerciseButtonText = "Add an exercise"
                }
            },

            previousData(exerciseName, set) {
                if(this.previousWorkout.exercises !== undefined)  {
                    const previous = this.previousWorkout.exercises.find(e => e.name === exerciseName)
                    if(previous && previous.sets && this.previousWorkout.createdAt < this.workout.createdAt) {
                        if(typeof previous.sets[set] !== 'undefined') {
                            return previous.sets[set].reps + "x" + previous.sets[set].weight
                        }
                    }
                    return "-"
                }
            }
            
        }
    }
</script>

<style scoped>

    .badge.badge-primary {
        background: rgb(122,222,196) !important; 
        color:#121212 !important;
    }

    .workout.red-txt .badge.badge-primary {
        background: #cd6a92 !important; 
    }
    .badge {
        font-size: 16px; 
        padding: .5rem .75rem; 
        border-radius: 5px; 
        background: rgba(255,255,255,.12);
        margin-right: .5em;
        color:rgba(255,255,255,.60) !important;
        width: 50px !important;
    }
    .badge.previous {
        width: 80px!important; 
    }
    .form-group {
        margin-right: .5rem !important;
    }
    /* .sets li input {
        font-size: 16px; 
        flex-grow: 0;
        width: 70px;
    } */

    .workout-total-volume {
        position: -webkit-sticky !important;  
        position: sticky !important; 
        top: 10px !important; 
        z-index: 9999999;
        background: #121212;
    }


</style>