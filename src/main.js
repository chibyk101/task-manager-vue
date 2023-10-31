import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, concat } from '@apollo/client/core';
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import { store } from "./store"

const cache = new InMemoryCache()


const httpLink = new HttpLink({ uri: process.env.VUE_APP_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: `Bearer ${store.token}`,
        }
    }));

    return forward(operation);
})

const client = new ApolloClient({
    cache: cache,
    link: concat(authMiddleware, httpLink),
});


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp({
    setup() {
        provide(DefaultApolloClient, client)
    },

    render: () => h(App),
})

app.use(router).use(vuetify).mount('#app');