<template>
    <v-row justify="center">
        <v-col cols="12" md="9">
            <v-card min-height="70vh" rounded="lg">
                <v-card-title>
                    <v-toolbar flat color="transparent">
                        <v-toolbar-title>Task Categories</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="showCreate = true">Add new</v-btn>
                    </v-toolbar>
                </v-card-title>
                <v-alert v-if="error" :text="errorMessage"></v-alert>
                <p v-if="loading" class="d-flex pt-12 justify-center">
                    <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
                </p>
                <v-table v-else-if="result">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>
                                Actions
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in result.taskCategories">
                            <td>{{ category.name }}</td>
                            <td>{{ category.created_at }}</td>
                            <td>
                                <v-menu bottom offset-y right nudge-right="20" min-width="150" :min-width="400">
                                    <template #activator="{ props }">
                                        <v-btn v-bind="props" icon="mdi-chevron-down-circle-outline" size="x-small"></v-btn>
                                    </template>
                                    <v-list variant="flat" density="compact">
                                        <v-list-item link @click="editTaskCategory(category)">
                                            <template #prepend>
                                                <v-icon icon="mdi-pencil"></v-icon>
                                            </template>
                                            <v-list-item-title>Edit</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item link @click="deleteTaskCategory(category)">
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
    <!-- create task -->
    <v-dialog v-model="showCreate" max-width="500">
        <v-form @submit.prevent="createTaskCategory">
            <v-card title="Add new task">
                <template #text>
                    <v-text-field label="Name" :error-messages="errors.name" v-model="form.name"></v-text-field>

                </template>
                <template #actions>
                    <v-spacer></v-spacer>
                    <v-btn :loading="isCreating" type="submit">submit</v-btn>
                </template>
            </v-card>
        </v-form>
    </v-dialog>
    <!-- update task -->
    <v-dialog v-model="showEdit" max-width="500">
        <v-form @submit.prevent="handleTaskUpdate">
            <v-card title="edit task info">
                <template #text>

                    <v-text-field label="Name" v-model="form.name" :error-messages="errors.name"></v-text-field>

                </template>
                <template #actions>
                    <v-spacer></v-spacer>
                    <v-btn :loading="isUpdating" type="submit">submit</v-btn>
                </template>
            </v-card>
        </v-form>
    </v-dialog>
</template>
<script>
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref } from 'vue';
import router from '@/router';

const TASK_CATEGORY_QUERY = gql`
  query getAllTaskCategories{
  taskCategories{
    id
    name
    created_at
    updated_at
  }
}
`;

export default {
    setup() {
        const showCreate = ref(false)
        const { result, loading, error, onError, refetch } = useQuery(TASK_CATEGORY_QUERY);
        const errorMessage = ref("")
        const form = ref({
            name: ""
        })
        const errors = ref({})
        const showEdit = ref(false)
        const deleteTaskCategory = useMutation(gql`
            mutation deleteTaskCategory($id: ID!){
                deleteTaskCategory(id: $id){
                        id
                        name
                    }
            }`, { errorPolicy: "all" });
        const { mutate: updateTaskCategory, loading: isUpdating } = useMutation(gql`
            mutation updateTaskCategory($id: ID!, $name: String){
                updateTaskCategory(id: $id, name: $name){
                        id
                        name
                    }
            }`, { errorPolicy: "all" });

        const { mutate: createTaskCategory, loading: isCreating } = useMutation(gql`
            mutation createTaskCategory ($name: String){
                createTaskCategory(name: $name){
                    id
                    name
                }
            }
        `, {
            errorPolicy: "all"
        })
        return {
            result,
            loading,
            error,
            onError,
            errorMessage,
            showCreate,
            form,
            createTaskCategory,
            refetch,
            deleteTaskCategory,
            showEdit,
            errors,
            updateTaskCategory,
            isUpdating,
            isCreating,
        };
    },
    mounted() {

        if (this.result) {
            this.refetch()
        }

        this.onError(err => {
            this.errorMessage = err.graphQLErrors[0].message

            if (err.graphQLErrors[0].extensions['guards']) {

                alert(this.errorMessage)

                

                router.push('login')

            }
        })
    },
    methods: {
        createTaskCategory() {
            this.form.task_category_id = Number(this.form.task_category_id)
            this.createTaskCategory(this.form)
                .then((result) => {
                    if (result) {
                        if (result.errors) {

                            this.errorMessage = result.errors[0].message

                            if (result.errors[0].extensions['validation']) {
                                this.errors = result.errors[0].extensions['validation']
                            }

                        } else {
                            this.showCreate = false
                            this.refetch()
                            this.form.name = ""
                        }
                    }
                })
        },
        deleteTaskCategory(category) {
            if (confirm(`Are you sur you want to delete ${category.name}?`))

                this.deleteTaskCategory.mutate({
                    id: category.id
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
        handleTaskUpdate() {
            this.updateTaskCategory(this.form).then((result) => {
                if (result) {
                    if (result.errors) {

                        this.errorMessage = result.errors[0].message

                    } else {
                        this.showEdit = false
                        this.refetch()
                    }
                }
            })
        },
        editTaskCategory(category) {
            Object.assign(this.form, category)
            this.showEdit = true
        }
    }
}

</script>