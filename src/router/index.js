import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
        auth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/workout/:id',
    name: 'workout',
    component: () => import('../views/Workout.vue'),
    meta: {
        auth: true
    }
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router