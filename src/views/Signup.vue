<template>
    <v-card
      class="mx-auto"
      max-width="344"
      title="User Registration"
    >
      <v-container>
        <v-alert v-if="error" :text="errorMessage"></v-alert>
        <v-text-field
          v-model="form.name"
          color="primary"
          label="Full name"
          variant="underlined"
          :error-messages="errors.name"
          ></v-text-field>
          
          <v-text-field
          v-model="form.email"
          color="primary"
          label="Email"
          variant="underlined"
          :error-messages="errors.email"
          ></v-text-field>
          
          <v-text-field
          v-model="form.password"
          color="primary"
          label="Password"
          placeholder="Enter your password"
          variant="underlined"
          :error-messages="errors.password"
          type="password"
        ></v-text-field>
      </v-container>
  
      <v-divider></v-divider>
  
      <v-card-actions>
        <v-spacer></v-spacer>
  
        <v-btn :loading="isLoading" @click="register" color="success">
          Complete Registration
  
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  <script >
import router from '@/router';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref } from 'vue';

    export default {
        setup(){
            const form = ref({
              name: "",
              email: "",
              password: "",
            })

            const { mutate: registerUser, loading: isLoading, error} = useMutation(gql`
                mutation registerUser ($name: String, $email: String, $password: String){
                    registerUser(name: $name, email: $email, password: $password)
                }
            `,{errorPolicy:"all"})

            const errorMessage = ref('')

            const errors = ref({})
            return {
                form,
                registerUser,
                isLoading,
                error,
                errors
            }
        },
        methods: {
            register(){
                this.registerUser(this.form).then((result) => {
                    if (result) {
                        if (result.errors) {

                            this.errorMessage = result.errors[0].message

                            if (result.errors[0].extensions['validation']) {
                                this.errors = result.errors[0].extensions['validation']
                            }

                        } else {
                            localStorage.setItem('task_manager_token',result.data.registerUser)
                            router.push('/')
                        }
                    }
                })
            }
        }
    }
  </script>