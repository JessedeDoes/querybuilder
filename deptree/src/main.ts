import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
//import ContextMenu from '@imengyu/vue3-context-menu'

import reportBoxDirective from './box-watching/v-report-box.ts';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('report-box', reportBoxDirective);
// app.use(ContextMenu)
app.mount('#app')
