import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/LyricsToPPTView.vue'),
        },
    ]
});

// router.beforeEach((to, from, next) => {
//     const auth = useAuth();
//     if (to.meta.auth && !auth.isLogin) {
//         console.log('인증이 필요합니다.');
//         next('/login');
//         return;
//     }
//     next();
// });

export {router}