<template>
   <h1>Welcome {{ sharedState.name }} (Home)</h1>
   <button @click="addNewWorkout">Add new workout</button>

    <ul>
        <li @click="openWorkout(item.id)" v-for="item in workouts" :key="item.id">
            <p>{{item.name}} - {{item.owner}}</p>
            <p>{{item.description}}</p>
        </li>
    </ul>
</template>

<script>
    import WorkoutDataService from '../services/WorkoutDataService';
    import router from '../router';

    export default {

        data() {
            return {
                workouts: [],
                sharedState: this.$root.$data.sharedState,
            }
        },
        computed: {
            owner() {
                return this.sharedState.email
            }
        },
        watch: {
            owner(newVal) {
                if(newVal.length > 0) {
                    this.getWorkouts()
                }
            }
        },

        methods: {
            openWorkout(itemId) {
                router.push('/workout/' + itemId)
            },
            addNewWorkout: function() {
                router.push("/newWorkout")        
            },
            getWorkouts() {
                WorkoutDataService.getOwnWorkouts(this.sharedState.email)
                .get() 
                .then( querySnapshot => {
                    const documents = querySnapshot.docs.map(doc => {
                             let d = doc.data()
                             d.id = doc.id
                             return d; 
                            }
                        )
                    this.workouts = documents; 
                });
            }
        },
        created() {
            this.getWorkouts()            
        }
    }
</script>

<style scoped>
ul {
    list-style-type: none; 
    padding:0; 
    margin:0;
}
li {
    padding: 1.5em 1em;
    box-shadow: 0px 0px 1em rgba(0,0,0,.1);
    border-radius: 10px; 
    margin: 2em; 
}

li:hover {
    background:#f9f9f9;
}
</style>