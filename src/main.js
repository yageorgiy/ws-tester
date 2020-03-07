import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.use(VueCodemirror);

import 'codemirror/lib/codemirror.css'

Vue.config.productionTip = false;


new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app');
