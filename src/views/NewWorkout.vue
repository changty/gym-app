<template>
   <h1>New workout</h1>
    <div class="form">
        <label for="name">Name</label>
        <input id="name" required v-model="workout.name" name="name" :disabled="isDisabled"/>
        <br/>
        <label for="description">Description</label>
        <input id="description" v-model="workout.description" name="description" :disabled="isDisabled"/>
        <br/>
        <span v-if="!isDisabled">
            <button @click="saveWorkout">Create</button> 
        </span>
        <button @click="cancel">Back</button>

        <button @click="addMove">New move</button>
<hr/>
        <div v-if="showNewMove">
            <label for="moveName">Move name</label>
            <input id="moveName" required v-model="move.name" name="moveName"/>
            <br/>
            <label for="notes">Notes</label>
            <input id="notes" v-model="move.notes" name="notes"/>
            <br/>
            <button @click="saveMove">Add</button>
        </div>

        <ul>
            <li v-for="item in moves" :key="item.name">
                <p><b>{{item.name}}</b></p>
                <p>{{item.notes}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import WorkoutDataService from "../services/WorkoutDataService"; 
import router from '../router'

    export default {
        data() {
            return {
                moves: [],
                documentId: null,
                showNewMove: false,
                isDisabled: false, 
                workout: {
                    name: "",
                    description: "", 
                    owner: "",
                },
                move: {
                    name: "", 
                    notes: "", 
                    workout: "", 
                    sets:[{weight: 0, reps: 0}]
                },
                sharedState: this.$root.$data.sharedState
            }
        },



        methods: {
            cancel() {
                router.push('/')
            },
            saveWorkout() {
                this.workout.owner = this.sharedState.email

                WorkoutDataService.create({
                    name: this.workout.name,
                    description: this.workout.description,
                    owner: this.workout.owner, 
                })
                    .then((docRef) => {
                        this.documentId = docRef.id
                        console.log("new workout created");
                        //router.push('/') 
                        this.isDisabled = true; 

                    })
                    .catch(e => {
                        console.log("Error saving new workout", e)
                    })

            },
            addMove() {
                this.showNewMove = true; 
            },

            saveMove() {
                WorkoutDataService.addMove({
                    name: this.move.name,
                    notes: this.move.notes, 
                    workout: this.documentId,
                    sets:[{weight: 0, reps: 0}]
                })
                    .then(() => {
                        console.log("move saved")
                        this.moves.push({                    
                            name: this.move.name,
                            notes: this.move.notes, 
                        })
                        
                        this.move.name = ""; 
                        this.move.notes =""; 
                    })
                    .catch( e => {
                        console.log("Error saving move", e)
                    })
            }

        }
    }
</script>
