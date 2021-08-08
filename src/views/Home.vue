<template>
    <div class="card card-primary mb-3">
        <div class="card-body">
            <h1 class="mb-3">Welcome {{ state.name }}</h1>

        <!-- <h2>Templates</h2> -->
        <!-- <div class="templates">
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
        </div> -->


            <h2 class="d-flex justify-content-between align-items-center">
                    {{state.workouts.length}} Workouts 
                    <button @click="emptyWorkout" class="btn btn-outline-primary icon-only-rounded">+</button> 
            </h2>  
        </div>
    </div>

    <div class="card mb-2" @click="openWorkout(item.id)" v-for="(item, index) in sortedWorkouts()" :key="item.id">
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <h5 class="card-title">{{item.name}}</h5>
                <h6 class="card-subtitle mb-2 text-muted">
                    <small>{{since(item.createdAt)}}</small><br/>
                    <small>{{date(item.createdAt)}}</small>
                </h6>
            </div>
            <p class="card-text">{{item.description}}</p>

            <div class="button-container text-center mt-5">
                <button class="btn btn-link" @click.self="openWorkout(item.id)">Open</button><br/>
                <button class="btn btn-primary" @click.self="createWorkout(index)">Copy as a new workout</button>
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
                state: this.$root.$data.sharedState,
            }
        },
        computed: {
            owner() {
                return this.state.email
            },
        },
        watch: {
            owner(newVal) {
                if(newVal.length > 0) {
                    this.getWorkouts()
                }
            },
        },

        methods: {
            sortedWorkouts() {
                if(this.state.workouts) {
                    return this.state.workouts.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : ((b.createdAt > a.createdAt) ? 1 : 0)); 
                }
                return []
            }, 
            since(time) {
                return moment(time).fromNow(); 
            },
            date(time) {
                return moment(time).format('MMMM Do YYYY, h:mm')
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
                let toCopy = this.state.workouts[index] 
                toCopy.createdAt = Date.now()
                WorkoutDataService.createWorkout({...toCopy, template: toCopy.id})
            },

            emptyWorkout() {
                router.push("/workout/new")
            }
        },
        created() {
            this.getWorkouts()
        }
    }
</script>

<style scoped>

</style>