<template>
    <div class="d-flex w-100 justify-content-between mt-3 mb-3">
        <div v-if="!edit">
            <h1>{{workout.name}}</h1>
            <p>{{workout.description}}</p>
            <p class="small">{{since(workout.createdAt)}}<br/>({{date(workout.createdAt)}})</p>
            <p class="small">{{since(previousWorkout.createdAt)}}<br/>({{date(previousWorkout.createdAt)}})</p>
        </div>
        <div v-if="edit">
             <div class="form">
                <label for="name">Name</label>
                <input id="name" required v-model="workout.name" name="name" />
                <br/>
                <label for="description">Description</label>
                <input id="description" v-model="workout.description" name="description" />
                <br/>
                <span>
                    <button @click="save">Save</button> 
                </span>
        </div>
        </div>
        <div>  
            <button @click="toggleEdit" class="btn btn-link">{{editButton}}</button>
        </div>
    </div>



        <div class="card mb-5 shadow-sm" v-for="(item, index) in workout.exercises" :key="item.name">
            <div class="card-header d-flex w-100 justify-content-between">
                <div>
                    <b>{{item.name}} ({{item.sets.length}} sets)</b>
                    <p class="card-text">{{item.notes}}</p>
                </div>
                <div>
                    <p>Total volume: {{ totalVolume(index) }}</p>
                </div>
            </div>

            <div class="card-body">
                    <div class="sets">
                        <ul>
                            <li v-for="(set, setIndex) in item.sets" :key="setIndex">
                                <span>Set {{setIndex+1}}</span>
                                <div>
                                    <span>{{previousData(item.name, setIndex)}}</span>
                                </div>
                                <div>
                                    <label for="reps">Reps</label>
                                    <input type="number" id="reps" required name="reps" ref="reps"  v-model="set.reps"/>
                                </div>
                                <div>
                                    <label for="weight">Weight</label>
                                    <input type="number" id="weight" required name="weight" ref="weight" v-model="set.weight"/>
                                </div>
                                <!-- lets skip this for now -->
                                <!-- <div>
                                    <label for="rest">Rest</label>
                                    <input type="number" id="rest" required name="rest" ref="rest"  v-model="set.rest"/>
                                </div> -->
                                <div v-if="edit">
                                    <button @click="removeSet(index, setIndex)" class="btn btn-danger btn-sm">x</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <button class="btn btn-outline-primary btn-block"  style="flex-grow:100; width:100%" @click="newSet(index)">Add a set</button>
                </div>
            </div>
    <div v-if="addExercise">
            <label for="exerciseName">Exercise name</label>
            <input id="exerciseName" required name="exerciseName" ref="exerciseName"/>
            <br/>
            <label for="notes">Notes</label>
            <input id="notes" name="notes" ref="notes"/>
    <button @click="addNewExercise" class="btn-block btn btn-outline-primary">Add</button>
    </div>
    <button @click="toggleAddExercise" class="btn-block btn btn-primary" style="width:100%">{{addExerciseButtonText}}</button>


    <div v-if="edit">
        <button class="btn btn-danger" @click="remove">Delete workout</button>
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
                workout: {},
                previousWorkout: {},
                allWorkouts: {},
                state: this.$root.$data.sharedState
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
            totalVolume(index) {
                let sets =  this.workout.exercises[index].sets
                let sum = 0; 
                for(let i=0; i<sets.length; i++) {
                    let set = sets[i];
                    sum += set.weight*set.reps
                }
                
                return sum

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
                filtered = this.state.workouts.filter(w => w.template === this.workout.template); 
                // sort from newest to oldest
                filtered = filtered.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : ((b.createdAt > a.createdAt) ? 1 : 0))
                this.allWorkouts = filtered; 
                // get previous workout, if there are any
                if(filtered.length > 1) {
                    this.previousWorkout = this.allWorkouts[1]
                }

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
                    exercises: this.workout.exercises
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
    .sets li {
        width:100%; 
        display: flex; 
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
    }

    .sets li>div {
        margin: 0px .25em;
        display: flex; 
        flex-direction: column;
        flex-grow: 0;
        width: 100%;
        align-items: stretch;
    }

    .sets li input {
        font-size: 16px; 
        flex-grow: 0;
        width: 70px;
    }
    .sets li span {
        text-align:center;
        background: #eee; 
        padding: .25em .5em; 
        border-radius: .5em; 
        font-size: 13px;
        min-width:45px;
    }


</style>