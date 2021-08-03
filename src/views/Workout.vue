<template>
   <h1>{{workout.name}}</h1>
   <p>{{workout.description}}</p>
   <br/><br/>
    <ul>
        <li @click="e => e.target.classList.toggle('active')" v-for="(item, index) in workout.exercises" :key="item.name">
            <p><b>{{item.name}}</b></p>
            <p>{{item.notes}}</p>
            <p>{{item.sets.length}} sets</p>
            <p>Total volume: {{ totalVolume(index) }}</p>
            <button @click="newSet(index)">Add a set</button>
            <div class="sets">
                <ul>
                    <li v-for="(set, index) in item.sets" :key="index">
                        <span>Set {{index+1}}</span>
                        <div>
                            <label for="weight">Weight</label>
                            <input type="number" id="weight" required name="weight" ref="weight" v-model="set.weight"/>
                        </div>
                        <div>
                            <label for="reps">Reps</label>
                            <input type="number" id="reps" required name="reps" ref="reps"  v-model="set.reps"/>
                        </div>
                         <div>
                            <label for="rest">Rest</label>
                            <input type="number" id="rest" required name="rest" ref="rest"  v-model="set.rest"/>
                        </div>
                     </li>
                </ul>
            </div>
        </li>
    </ul>
   <br/><br/>
    <button @click="remove">Delete</button>
</template>

<script>
    import WorkoutDataService from '../services/WorkoutDataService';
    import router from '../router'
    export default {
        data() {
            return {
                id: null,
                workout: {},
                sharedState: this.$root.$data.sharedState
            }
        },

        created() {
              this.id = this.$route.params.id
              this.getWorkout()
        },

        methods: {
            totalVolume(index) {
                let sets =  this.workout.exercises[index].sets
                let sum = 0; 
                for(let i=0; i<sets.length; i++) {
                    let set = sets[i];
                    sum += set.weight* set.reps
                }
                
                return sum

            }, 

            getWorkout() {
                WorkoutDataService.getWorkout(this.id)
                .get() 
                .then( (doc) => {
                    if(doc.exists) {
                        this.workout = doc.data()
                    }
                    else{
                        console.log("nothing to show")
                    }
                });
            },
            remove() {
                WorkoutDataService.delete(this.id)
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
                    WorkoutDataService.updateWorkout(this.id, toSave)
                        .then(() =>{
                            console.log("updated"); 
                        })
                        .catch(e => {
                            console.log("error updating template", e)
                        })
            },

            newSet(index) {
                this.workout.exercises[index].sets.push({weight: 0, reps: 0, rest: 60})
                this.save()
            } 
        }
    }
</script>

<style scoped>
    ul, li, .sets {
        max-width: 100%; 
        box-sizing: border-box;
    }
    li .sets {
        display: none; 
        opacity: 0;

    }
    li.active .sets {
        display: flex; 
        opacity: 1; 
    }

    .sets li {
        width:100%; 
        display: flex; 
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
    }

    .sets li>div {
        margin: 0px .5em;
        display:flex; 
        flex-direction: column;
        flex-grow: 0;
    }

    .sets li input {
        font-size: 16px; 
        flex-grow: 0;
    }
    .sets li span {
        background: #eee; 
        padding: .25em .5em; 
        border-radius: .5em; 
        font-size: 14px;
    }

</style>