<template>
    <div class="card green mb-3">
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

    <div class="card mb-2 pointer" @click="openWorkout(item.id)" v-for="(item, index) in sortedWorkouts()" :key="item.id">
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <h5 :class="'link card-title ' +  item.color +'-txt'">{{item.name}}</h5>
                <h6 class="card-subtitle mb-2 text-muted">
                    <small>{{since(item.createdAt)}}</small><br/>
                    <small>{{date(item.createdAt)}}</small>
                </h6>
            </div>
            <p class="card-text">{{item.description}}</p>
            <h4>Volume: {{workoutTotalVolume(index)}}</h4>
            <div class="button-container text-center mt-5">
                <!-- <button class="btn btn-link" @click.self="openWorkout(item.id)">Open</button><br/> -->
                <button class="btn btn-primary" @click.stop="createWorkout(index)">Copy as a new workout</button>
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
                color: 0,
                colors: ['green-txt', 'red-txt', 'blue-txt', 'yellow-txt'],
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
            workoutTotalVolume(index) {
                let sum = 0; 
                for(let i=0; i<this.state.workouts[index].exercises.length; i++) {
                    for(let j=0; j<this.state.workouts[index].exercises[i].sets.length; j++) {
                        sum += this.state.workouts[index].exercises[i].sets[j].weight*this.state.workouts[index].exercises[i].sets[j].reps
                    }
                }
                
                let sum2 = 0; 
                let workout = this.getPreviousWorkout(index)
                if(workout) {

                    for(let i=0; i<workout.exercises.length; i++) {
                        for(let j=0; j<workout.exercises[i].sets.length; j++) {
                            sum2 += workout.exercises[i].sets[j].weight*workout.exercises[i].sets[j].reps
                        }
                    }
                
                }
                let diff = sum-sum2
                if(diff > 0 && sum2 > 0) {
                    return "+" + diff
                }
                return sum-sum2


            },
            getPreviousWorkout(index) {
                let filtered = []; 
                let workout = this.state.workouts[index]
                let key = workout.template || workout.id

                filtered = this.state.workouts.filter(w => (w.template === key || w.id === key)); 
                // sort from newest to oldest
                filtered = filtered.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : ((b.createdAt > a.createdAt) ? 1 : 0))
                
                // get previous workout, if there are any
                if(filtered.length > 1 && filtered[1].createdAt < workout.createdAt) {
                    return filtered[1]
                }
            },
            nextColor() {
                if(this.color > this.colors.length-1) {
                    this.color = 0; 
                }
                return this.colors[this.color++];
            },
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
            openWorkout(itemId) {
                router.push('/workout/' + itemId)
            },
            getWorkouts(forward) {
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

                    if(forward !== undefined) {
                        router.push('/workout/' + forward)
                    }
                });
            },
            createWorkout(index) {
                let toCopy = {
                    name: this.state.workouts[index].name,
                    description: this.state.workouts[index].description, 
                    owner: this.state.workouts[index].owner,
                    template: this.state.workouts[index].id,
                    color: this.state.workouts[index].color,
                    createdAt: Date.now(),
                    exercises: this.state.workouts[index].exercises
                }
                console.log(toCopy);
                toCopy.exercises.forEach(exercise => {
                    exercise.sets.forEach(set => {
                        set.weight = 0; 
                    })
                })
                
                WorkoutDataService.createWorkout(toCopy)
                    .then(doc => {
                        this.getWorkouts(doc.id)
                    })
                    .catch(e => {
                        console.log("error creating an exercise", e)
                    })
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