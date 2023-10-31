<template>
    <v-app id="inspire">
        <v-app-bar flat>
            <v-container class="mx-auto d-flex align-center justify-center">
                <v-menu>
                    <template #activator="{ props }">
                        <v-btn icon="mdi-account" v-bind="props"></v-btn>
                    </template>
                    <v-list density="compact" flat>
                        <v-list-item @click.prevent="handleLogout" link>
                            <template #prepend>
                                <v-icon start icon="mdi-logout"></v-icon>
                            </template>
                            <v-list-item-title>logout</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>


                <v-btn to="/" variant="text" text="Tasks"></v-btn>
                <v-btn to="task-categories" variant="text" text="Categories"></v-btn>
                <v-spacer></v-spacer>

                <v-responsive max-width="160">
                    <v-text-field density="compact" flat hide-details label="Search" rounded="lg" single-line
                        variant="solo-filled"></v-text-field>
                </v-responsive>
            </v-container>
        </v-app-bar>

        <v-main class="bg-grey-darken-3">
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>
  
<script>
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useTheme } from 'vuetify/lib/framework.mjs';

export default {
    setup() {
        const theme = useTheme();
        const { mutate: logout } = useMutation(gql`
        mutation logout {
            logout{
                id
                name
            }
            }
        `, { errorPolicy: "all" });
        return {
            theme,
            logout
        }
    },
    mounted() {
        this.theme.global.name.value = 'dark'

    },
    methods: {
        handleLogout() {
            this.logout().then((result => {
                if (!result.errors) {
                    localStorage.removeItem('task_manager_token')
                    this.$router.push('login')
                }
            }))
        }
    }

}
</script>
  