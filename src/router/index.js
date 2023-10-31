import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
            protected: true
        }
    },
    {
        path: '/create-task',
        name: 'createTask',
        component: () => import('../views/CreateTask.vue'),
        meta: {
            protected: true
        }
    },
    {
        path: '/task/:id',
        name: 'task',
        component: () => import('../views/Task.vue'),
        meta: {
            protected: true
        }
    },
    {
        path: '/task-categories',
        name: 'task-categories',
        component: () => import('../views/TaskCategories.vue'),
        meta: {
            protected: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta: {
            protected: false
        }
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('../views/Signup.vue'),
        meta: {
            protected: false
        }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from) => {
    if (!localStorage.getItem('task_manager_token') && to.meta.protected) {
        return { name: 'login' }
    }

})

export default router
