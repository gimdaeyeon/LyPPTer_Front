import {createApp} from 'vue'
import '@/style.css'
import App from "@/App.vue";
import {router} from "@/routes/index.js";
import {createPinia} from "pinia";
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
    faAlignCenter,
    faAlignJustify,
    faAlignLeft,
    faAlignRight, faBold, faPalette,
    faUpload,
    faX
} from '@fortawesome/free-solid-svg-icons';
import {faImage}from '@fortawesome/free-regular-svg-icons';

library.add(faX,faAlignLeft,faAlignCenter,faAlignRight,
    faUpload,faPalette,faImage,faBold
    );

createApp(App)
    .use(router)
    .use(createPinia())
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
