<template>
   <h1>Welcome {{ sharedState.name }} (Home)</h1>
   <h2>Templates</h2>
   <button @click="addNewTemplate">Add new workout template</button>

    <ul>
        <li @click.self="openTemplate(item.id)" v-for="(item, index) in templates" :key="item.id">
            <p>{{item.name}}</p>
            <p>{{item.description}}</p>
            <p>{{item.exercises.length}} exercises</p>
            <p><button @click.self="createWorkout(index)">new workout</button></p>
        </li>
    </ul>

    <hr/>
    <h2>Workouts</h2>    <ul>
        <li @click.self="openWorkout(item.id)" v-for="(item, index) in workouts" :key="item.id">
            <p>{{index}} {{item.name}}</p>
            <p>{{item.description}}</p>
            <p>{{item.exercises.length}} exercises</p>
            <p>{{item.createdAt}}</p>
        </li>
    </ul>
</template>

<script>
    import WorkoutDataService from '../services/WorkoutDataService';
    import router from '../router';

    export default {

        data() {
            return {
                templates: [],
                workouts:[],
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
                    this.getTemplates()
                    this.getWorkouts()
                }
            }
        },

        methods: {
            openTemplate(itemId) {
                router.push('/newTemplate/' + itemId)
            },
            addNewTemplate: function() {
                router.push("/newTemplate")        
            },
            getTemplates() {
                WorkoutDataService.getTemplates(this.sharedState.email)
                .get() 
                .then( querySnapshot => {
                    const documents = querySnapshot.docs.map(doc => {
                             let d = doc.data()
                             d.id = doc.id
                             return d; 
                            }
                        )
                    this.templates = documents; 
                });
            },
            getWorkouts() {
                WorkoutDataService.getWorkouts(this.sharedState.email)
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
            },
            createWorkout(index) {
                let toCopy = this.templates[index] 
                WorkoutDataService.createWorkout({...toCopy, template: toCopy.id})
            }
        },
        created() {
            this.getTemplates()            
            this.getWorkouts()
        }
    }
</script>

<style>
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