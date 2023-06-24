import {createRouter, createWebHistory} from 'vue-router'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/home',
            name: 'home',
            component: () => import("../views/Home.vue")
        },
        {
            path: '/',
            name: 'overview',
            component: () => import("../views/Overview.vue")
        },
        {
            path: '/questionnaireManage',
            name: 'questionnaireManage',
            component: () => import("../views/QuestionnaireManage.vue")
        },
        {
            path: '/fillQuestionnaire',
            name: 'fillQuestionnaire',
            component: () => import("../views/FillQuestionnaire.vue")
        },
        {
            path: '/result',
            name: 'result',
            component: () => import("../views/Result.vue")
        }
    ]
})

export default router
