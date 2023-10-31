<template>
    <v-row justify="center">
        <v-col cols="9">
            <v-card title="Task Information" :loading="loading">
                <v-card-item v-if="error">
                    <v-alert type="error" :text="error"></v-alert>
                </v-card-item>

                <template v-else-if="result">
                    <v-card-item>
                        <p class="text-h6 font-weight-bold mb-3">
                            {{ result.viewTask.title }}
                        </p>
                        <p class="mb-3"> <b>Due date:</b> {{ result.viewTask.due_date }}
                            <v-chip v-if="result.viewTask.is_due" color="error">Due</v-chip>
                            <v-chip v-else-if="result.viewTask.is_almost_due" color="warning">Almost
                                due</v-chip>
                        </p>
                        <p class="mb-3">
                            <b>Status</b>: {{ result.viewTask.status }}
                        </p>
                        <p class="mb-3">
                            <b>Description</b>: {{ result.viewTask.description }}
                        </p>
                    </v-card-item>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="deleteTask(result.viewTask)">
                            delete task
                        </v-btn>
                    </v-card-actions>
                </template>
            </v-card>
            <v-form @submit.prevent="handleTaskUpdate" v-if="result">
                <v-card title="Edit task info">
                    <template #text>
                        <v-select v-if="categories" :items="categories.taskCategories" v-model="form.task_category_id"
                            item-value="id" item-title="name"></v-select>
                        <v-text-field label="Title" v-model="form.title"></v-text-field>
                        <v-text-field label="description" v-model="form.description"></v-text-field>
                        <v-text-field type="date" label="due_date" v-model="form.due_date"></v-text-field>
                    </template>
                    <template #actions>
                        <v-spacer></v-spacer>
                        <v-btn :loading="isUpdating" type="submit">submit</v-btn>
                    </template>
                </v-card>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import { useMutation, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const VIEW_TASK = gql`
    query viewTask ($id: ID!) {
        viewTask(id: $id){
        id
        title
        description
        category{
        id
        name
        }
        due_date
        status
        created_at
        is_almost_due
        is_due
    }
}`;

const CATEGORY_QUERY = gql`
query getAllTaskCategories{
  taskCategories{
    id
    name
    created_at
    updated_at
  }
}`

export default {
    setup() {
        const route = useRoute();
        const { result, loading, error, onResult, refetch, onError } = useQuery(VIEW_TASK, {
            id: route.params.id
        })
        const categories = useQuery(CATEGORY_QUERY).result;

        const deleteTask = useMutation(gql`
            mutation deleteTask($id: ID!){
                deleteTask(id: $id){
                        id
                        title
                    }
            }`, { errorPolicy: "all" });

        const form = ref({
            title: "",
            due_date: "",
            description: "",
            task_category_id: null
        })
        const {mutate: updateTask, loading: isUpdating} = useMutation(gql`
            mutation updateTask($id: ID!, $title: String, $description: String, $due_date: String, $task_category_id: Int){
                updateTask(id: $id, title: $title, description: $description, due_date: $due_date, task_category_id: $task_category_id){
                        id
                        title,
                        due_date
                    }
            }`, { errorPolicy: "all" });
        return {
            loading,
            result,
            error,
            deleteTask,
            form,
            onResult,
            categories,
            updateTask,
            refetch,
            onError,
            isUpdating,
            route
        }
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
                            this.$router.push('/')
                        }
                    }
                })
        },
        handleTaskUpdate() {
            this.updateTask({
                id: this.route.params.id,
                title: this.form.title,
                due_date: this.form.due_date,
                description: this.form.description,
                task_category_id: Number(this.form.task_category_id)
            }).then((result) => {
                if (result) {
                    if (result.errors) {
                        console.log(result.errors);
                        this.errorMessage = result.errors[0].message

                    } else {
                        this.refetch()
                    }
                }
            })
        },
    },
    mounted() {
        if (this.result) {
            this.refetch()
        }

        this.onResult((res) => {

            Object.assign(this.form, res.data?.viewTask)
            this.form.task_category_id = res.data?.viewTask?.category?.id

        })

        this.onError(err => {
            this.errorMessage = err.graphQLErrors[0].message

            if (err.graphQLErrors[0].extensions['guards']) {

                    alert(this.errorMessage)

                    

                    router.push('login')
                
            }
        })
    }
}
</script>