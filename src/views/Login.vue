<template>
    <v-row justify="center">
        <v-col>
            <v-form @submit.prevent="handleLogin">
                <v-card width="600" class="mx-auto" title="Login">
                    <template #text v-if="errorMessage">
                        <v-alert type="error">{{ errorMessage }}</v-alert>
                    </template>
                    <v-card-item>
                        <v-text-field variant="underlined" v-model="form.email" label="Email" type="email"
                            :error-messages="errors.email"></v-text-field>
                        <v-text-field variant="underlined" v-model="form.password" label="Password" type="password"
                            :error-messages="errors.password"></v-text-field>
                    </v-card-item>
                    <template #actions>
                        <router-link to="/signup">Sign up</router-link>
                        <v-spacer></v-spacer>
                        <v-btn type="submit" :loading="loading">login</v-btn>
                    </template>
                </v-card>

            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import { store } from "../store";
export default {
    setup() {
        const form = ref({
            email: "",
            password: ""
        })

        const { mutate: login, loading } = useMutation(gql`
            mutation login ($email: String, $password: String){
                login(email: $email, password: $password)
            }
        `, {
            errorPolicy: "all"
        })

        const errors = ref({})
        const errorMessage = ref("")

        return {
            form,
            login,
            loading,
            errors,
            errorMessage
        }
    },
    methods: {
        handleLogin() {
            this.login({
                email: this.form.email,
                password: this.form.password
            }).catch((reason) => {
                alert(reason)
            }).then((result) => {
                if (result) {
                    if (result.errors) {

                        this.errorMessage = result.errors[0].message

                        if (result.errors[0].extensions['validation']) {
                            this.errors = result.errors[0].extensions['validation']
                        }

                    } else {
                        store.token = result.data.login
                        localStorage.setItem('task_manager_token', result.data.login)
                        this.$router.push('/')
                    }
                }
            })
        }
    },
}
</script>