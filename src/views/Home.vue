<template>
   <h1>Welcome {{ sharedState.name }}</h1>
   <h2>Templates</h2>


<div class="templates">

    <div @click="addNewTemplate" class="card shadow bg-body rounded">
            <div class="card-body">
                Add a new workout template
            </div>
    </div>


    <div class="card" v-for="(item, index) in templates" :key="item.id">
        <div class="card-body">
        <h5 class="card-title">{{item.name}}</h5>
        <p class="card-text">{{item.description}}</p>
        <p class="card-text">{{item.exercises.length}} exercises</p>
        <button class="btn btn-outline-primary" @click.self="createWorkout(index)">Start a workout</button>
        <button class="btn btn-outline-dark" @click.self="openTemplate(item.id)">Edit</button>

        </div>
    </div>
</div>

    <h2>Workouts</h2>  
    <div class="workouts">
        <div class="card" @click.self="openWorkout(item.id)" v-for="(item) in workouts" :key="item.id">
            <div class="card-body">
                <h5 class="card-title">{{item.name}}</h5>
                <p class="card-text">{{item.description}}</p>
                <p class="card-text">{{item.exercises.length}} exercises</p>
                <p class="card-text">{{since(item.createdAt)}} - {{date(item.createdAt)}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import WorkoutDataService from '../services/WorkoutDataService';
    import router from '../router';
    import moment from 'moment';

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
            since(time) {
                return moment(time).fromNow(); 
            },
            date(time) {
                return moment(time).format('MMMM Do YYY, h:mm')
            },
            openTemplate(itemId) {
                router.push('/newTemplate/' + itemId)
            },
            openWorkout(itemId) {
                router.push('/workout/' + itemId)
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
.templates, 
.workouts {
    display:flex; 
    flex-direction: row;
    justify-items: center;
    flex-wrap:wrap;
}
.card {
    cursor: pointer;
    width: 45%; 
    margin: 1em; 
    flex-grow: 0;

}
</style>