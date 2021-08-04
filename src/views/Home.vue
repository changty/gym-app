<template>
   <h1>Welcome {{ sharedState.name }}</h1>
   <h2>Templates</h2>


<div class="templates">

    <div class="card" v-for="(item, index) in templates" :key="item.id">
        <div class="card-body">
        <h5 class="card-title">{{item.name}}</h5>
        <p class="card-text">{{item.description}}</p>
        <p class="card-text">{{item.exercises.length}} exercises</p>
        <button class="btn btn-outline-primary" @click.self="createWorkout(index)">Start a workout</button>
        <button class="btn btn-link" @click.self="openTemplate(item.id)">Edit</button>

        </div>
    </div>
    <div @click="addNewTemplate" class="new card shadow bg-body rounded">
            <div class="card-body">
                Add a new workout template
            </div>
    </div>
</div>


    <h2>Workouts</h2>  
    <ul class="list-group ">
        <li class="list-group-item" @click="openWorkout(item.id)" v-for="(item) in workouts" :key="item.id">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{item.name}}</h5>
                <small>{{since(item.createdAt)}}</small>
            </div>
            <p class="mb-1">{{item.description}}</p>
            <small>{{date(item.createdAt)}}</small>
        </li>
    </ul>
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
.templates {
    display: flex;
    flex-direction: row; 
    flex-wrap: nowrap; 
    overflow-x:auto;
    scroll-snap-type: x proximity;
    scroll-padding: 25%;
    width: auto;
}
.templates .card {
    min-width: 18rem; 
    scroll-snap-align: start;
}

.card.new {
    min-width: 10rem; 
    width: 10rem; 
}

.card .btn {
    margin-right: 1rem; 
}
.card {
    cursor: pointer;
    width: 18rem;
    min-width: 18rem; 
    margin: 1em; 
}
</style>