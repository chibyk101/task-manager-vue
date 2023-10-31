<template>
    <v-row>
        <v-col cols="12" md="3">
            <v-card rounded="lg" title="Filter by status">
                <v-card-item>
                    <v-card-item>
                        <v-select :items="['not_started','in_progress','completed']" @update:model-value="filterTasks"></v-select>
                    </v-card-item>
                </v-card-item>
            </v-card>
        </v-col>

        <v-col cols="12" md="9">
            <v-card min-height="70vh" rounded="lg">
                <v-card-title>
                    <v-toolbar flat color="transparent">
                        <v-toolbar-title>Tasks</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" to="create-task">Add new</v-btn>
                    </v-toolbar>
                </v-card-title>
                <v-alert v-if="error" :text="errorMessage"></v-alert>
                <p v-if="loading" class="d-flex pt-12 justify-center">
                    <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
                </p>
                <v-table v-else-if="result">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>
                                Actions
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="task in result.tasks">
                            <td>
                                <router-link :to="`task/${task.id}`">
                                    {{ task.title }}
                                </router-link>
                            </td>
                            <td>{{ task.category.name }}</td>
                            <td :class="{'text-warning' : task.is_almost_due, 'text-error' : task.is_due}">{{ task.due_date }}</td>
                            <td>{{ task.status }}</td>
                            <td>
                                <v-menu bottom offset-y right nudge-right="20" min-width="150" :min-width="400">
                                    <template #activator="{ props }">
                                        <v-btn v-bind="props" icon="mdi-chevron-down-circle-outline" size="x-small"></v-btn>
                                    </template>
                                    <v-list variant="flat" density="compact">
                                       
                                        <v-list-item link @click="deleteTask(task)">
                                            <template #prepend>
                                                <v-icon icon="mdi-trash-can"></v-icon>
                                            </template>
                                            <v-list-item-title>Delete</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </td>
                        </tr>

                    </tbody>
                </v-table>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref } from 'vue';
import router from '@/router';
import { store } from '@/store';

const TASK_QUERY = gql`
  query getAllTasks ($status: String) {
  tasks (status: $status) {
    id
    title
    category{
      id
      name
    }
    description
    is_due
    is_almost_due
    due_date
    status
    created_at
    updated_at
  }
}
`;


export default {
    setup() {
        const { result, loading, error, onError, refetch } = useQuery(TASK_QUERY);
        const errorMessage = ref("")
        
        const errors = ref({})
        const showEdit = ref(false)
        const deleteTask = useMutation(gql`
            mutation deleteTask($id: ID!){
                deleteTask(id: $id){
                        id
                        title
                    }
            }`, { errorPolicy: "all" });

       
        return {
            result,
            loading,
            error,
            onError,
            errorMessage,
            refetch,
            deleteTask,
            showEdit,
            errors,
        };
    },
    mounted() {
        if(this.result){
            this.refetch()
        }

        this.onError(err => {
            
            this.errorMessage = err.graphQLErrors[0].message

            if (err.graphQLErrors[0].extensions['guards']) {

              console.log(store.token);
                    alert(this.errorMessage)

                    // 

                    router.push('login')
                
            }
        })
    },
    methods: {
       
        deleteTask(task) {
            if (confirm(`Are you sur you want to delete ${task.title}?`))

                this.deleteTask.mutate({
                    id: task.id
                }).then((result) => {
                    if (result) {
                        if (result.errors) {

                            this.errorMessage = result.errors[0].message

                        } else {
                            this.refetch()
                        }
                    }
                })
        },

        filterTasks(status){
            this.refetch({
                status
            })
        }
    }
}

</script>