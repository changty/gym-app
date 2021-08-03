<template>
   <h1>{{workout.name}}</h1>
   {{workout.name}} - {{workout.description}}
   <br/><br/>
    <ul>
        <li v-for="item in workout.exercises" :key="item.name">
            <p><b>{{item.name}}</b></p>
            <p>{{item.notes}}</p>
            <p>{{item.sets}}</p>
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
                sharedState: this.$root.$data.sharedState
            }
        },

        created() {
              this.id = this.$route.params.id
              this.getWorkout()
        },

        methods: {
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
