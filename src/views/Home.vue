<template>
   <h1>Welcome {{ state.name }}</h1>
   <h2>Templates</h2>


<div class="templates">
    <div @click="addNewTemplate" class="new card shadow bg-body rounded">
            <div class="mr-auto card-body">
                Add a new workout template
            </div>
    </div>

    <div class="card" v-for="(item, index) in state.templates" :key="item.id">
        <div class="card-body">
        <h5 class="card-title">{{item.name}}</h5>
        <p class="card-text">{{item.description}}</p>
        <p class="card-text">{{item.exercises.length}} exercises</p>
        <button class="btn btn-outline-primary btn-sm" @click.self="createWorkout(index)">Start a workout</button>
        <button class="btn btn-link btn-sm" @click.self="openTemplate(item.id)">Edit</button>

        </div>
    </div>
</div>


    <h2>Workouts</h2>  
    <ul class="list-group ">
        <li class="list-group-item" @click="openWorkout(item.id)" v-for="(item) in state.workouts" :key="item.id">
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
                state: this.$root.$data.sharedState,
            }
        },
        computed: {
            owner() {
                return this.state.email
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
                return moment(time).format('MMMM Do YYYY, h:mm:ss')
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
                WorkoutDataService.getTemplates(this.state.email)
                .get() 
                .then( querySnapshot => {
                    const documents = querySnapshot.docs.map(doc => {
                             let d = doc.data()
                             d.id = doc.id
                             return d; 
                            }
                        )
                    this.state.templates = documents; 
                });
            },
            getWorkouts() {
                WorkoutDataService.getWorkouts(this.state.email)
                .get() 
                .then( querySnapshot => {
                    const documents = querySnapshot.docs.map(doc => {
                             let d = doc.data()
                             d.id = doc.id
                             return d; 
                            }
                        )
                    this.state.workouts = documents.sort((a,b) => (a.createdAt > b.createdA) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0)); 
                });
            },
            createWorkout(index) {
                let toCopy = this.state.templates[index] 
                WorkoutDataService.createWorkout({...toCopy, template: toCopy.id})
            }
        },
        created() {
            this.getTemplates()            
            this.getWorkouts()
        }
    }
</script>

<style scoped>
.templates {
    display: flex;
    flex-direction: row; 
    flex-wrap: nowrap; 
    overflow-x:auto;
    scroll-snap-type: x proximity;
    scroll-padding: 25%;
    width: auto;
    margin-bottom: 1em;
}
.templates .card {
    min-width: 12rem; 
    scroll-snap-align: start;
}

.card.new {
    min-width: 10rem; 
    width: 10rem; 
    background: #eee !important;
}

.card .btn {
    margin-right: 1rem; 
}

.card {
    cursor: pointer;
    width: 12rem;
    min-width: 12rem; 
    margin: 1em; 
}
</style>