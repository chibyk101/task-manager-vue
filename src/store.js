import { reactive } from 'vue'

export const store = reactive({
    token: localStorage.getItem('task_manager_token') || ''
})