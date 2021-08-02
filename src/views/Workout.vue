<template>
   <h1>{{workout.name}}</h1>
   {{workout.name}} - {{workout.description}}
   <br/><br/>
    <ul>
        <li v-for="item in moves" :key="item.id">
            <p><b>{{item.name}}</b></p>
            <p>{{item.notes}}</p>
        </li>
    </ul>
   <br/><br/>
    <button @click="back">Back</button>
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
                moves: [],
                sharedState: this.$root.$data.sharedState
            }
        },

        created() {
              this.id = this.$route.params.id

              this.getWorkout()

              this.getMoves()
        },

        methods: {
            getMoves() {
                WorkoutDataService.getMoves(this.id)
                .get() 
                .then( querySnapshot => {
                    const documents = querySnapshot.docs.map(doc => {
                             let d = doc.data()
                             d.id = doc.id
                             return d; 
                            }
                        )
                    this.moves = documents; 
                });
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
            back() {
                router.push('/')
            },
            remove() {
                WorkoutDataService.delete(this.id)
                .then(() => {
                    router.push('/')
                })
                .catch((e) => {
                    console.log("could not remove", e)
                })
            }
        }
    }
</script>
