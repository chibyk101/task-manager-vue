<template>
    <v-row justify="center">
        <v-col cols="6">
            <v-form @submit.prevent="createTask">
                <v-card title="Add new task">
                    <template #text>
                        <v-select :error-messages="errors.task_category_id" v-if="categories" :items="categories.taskCategories" v-model="form.task_category_id"
                            item-value="id" item-title="name"></v-select>
                        <v-text-field :error-messages="errors.title" label="Title" v-model="form.title"></v-text-field>
                        <v-text-field :error-messages="errors.description" label="description" v-model="form.description"></v-text-field>
                        <v-text-field :error-messages="errors.due_date" type="date" label="due_date" v-model="form.due_date"></v-text-field>
                    </template>
                    <template #actions>
                        <v-spacer></v-spacer>
                        <v-btn :loading="isCreating" type="submit">submit</v-btn>
                    </template>
                </v-card>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

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
        const { mutate: createTask, loading: isCreating } = useMutation(gql`
            mutation createTask ($title: String, $due_date: String, $task_category_id: Int){
                createTask(title: $title, due_date: $due_date, task_category_id: $task_category_id){
                    id
                    title
                    due_date
                }
            }
        `, {
            errorPolicy: "all"
        })

        const categories = useQuery(CATEGORY_QUERY).result;
        const errorMessage = ref("")
        const errors = ref({})

        const form = ref({
            title: "",
            due_date: "",
            description: "",
            task_category_id: null
        })
        return {
            createTask,
            form,
            categories,
            errors,
            errorMessage,
            isCreating
        }
    },
    methods: {
        createTask() {
            this.createTask({
                title: this.form.title,
                due_date: this.form.due_date,
                description: this.form.description,
                task_category_id: Number(this.form.task_category_id) || null
            })
                .then((result) => {
                    if (result) {
                        if (result.errors) {
                            console.log(result.errors);
                            this.errorMessage = result.errors[0].message

                            if (result.errors[0].extensions['validation']) {
                                this.errors = result.errors[0].extensions['validation']
                            }

                        } else {
                            this.$router.push('/')
                        }
                    }
                })
        },
    }
}
</script>