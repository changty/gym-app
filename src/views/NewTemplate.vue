<template>
   <h1>New workout</h1>
    <div class="form">
        <label for="name">Name</label>
        <input id="name" required v-model="template.name" name="name" />
        <br/>
        <label for="description">Description</label>
        <input id="description" v-model="template.description" name="description" />
        <br/>
        <span>
            <button @click="saveTemplate">Save</button> 
        </span>
        <button @click="back">Back</button>
<hr/>

        <ul>
            <li class="newExercise">
                <label for="exerciseName">Exercise name</label>
                <input id="exerciseName" required name="exerciseName" ref="exerciseName"/>
                <br/>
                <label for="notes">Notes</label>
                <input id="notes" name="notes" ref="notes"/>
                <button @click="addExercise">Add</button>
            </li>
            <li v-for="(item, index) in template.exercises" :key="item.name">
                <p><b>{{item.name}}</b></p>
                <p>{{item.notes}}</p>
                <button @click="deleteExercise(index)">Delete</button>
                <!-- <p>{{item.sets}}</p> -->
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
                documentId: null,
                template: {
                    name: "",
                    description: "", 
                    owner: "",
                    exercises: [{
                        name: "", 
                        notes: "", 
                        sets: [
                            // {
                            //     weight: 0, 
                            //     reps: 0, 
                            //     rest: 60
                            // }
                        ]
                    }],
                },
                sharedState: this.$root.$data.sharedState
            }
        },

        created() {
              this.documentId = this.$route.params.id
              if(this.documentId) {
                  this.getTemplate()
              }
        },

        methods: {
            back() {
                router.back()
            },
            saveTemplate() {
                this.template.owner = this.sharedState.email

                let toSave = {
                    name: this.template.name,
                    description: this.template.description,
                    owner: this.template.owner, 
                    exercises: this.template.exercises
                }

                if(this.documentId !== null) {
                    WorkoutDataService.updateTemplate(this.documentId, toSave)
                        .then(() =>{
                            console.log("updated"); 
                        })
                        .catch(e => {
                            console.log("error updating template", e)
                        })
                }

                else {
                    WorkoutDataService.createTemplate(toSave)
                        .then((docRef) => {
                            this.documentId = docRef.id
                            console.log("new workout created");
                            //router.push('/') 
                            this.isDisabled = true; 

                        })
                        .catch(e => {
                            console.log("Error saving new workout", e)
                        })

                }
            },
            addExercise() {
                let exercise = {
                    name: this.$refs.exerciseName.value,
                    notes: this.$refs.notes.value,
                    sets:[]
                }

                this.$refs.exerciseName.value = ''
                this.$refs.notes.value = ''
                this.template.exercises.push(exercise);

                this.saveTemplate()
            },

            getTemplate() {
                WorkoutDataService.getTemplate(this.documentId)
                .get() 
                .then( (doc) => {
                    if(doc.exists) {
                        this.template = doc.data()
                    }
                    else{
                        console.log("nothing to show")
                    }
                });
            },

            deleteExercise(index) {
                this.template.exercises.splice(index, 1)
                this.saveTemplate();
            },
        }
    }
</script>
