// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

// const vuetify = createVuetify({
//   components,
//   directives,
// })
// createApp(App).use(router, vuetify).mount('#app')

import 'vuetify/styles'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)
const vuetify = createVuetify({
  components,
  directives,
})

app.use(vuetify)
app.use(router)
app.mount('#app')