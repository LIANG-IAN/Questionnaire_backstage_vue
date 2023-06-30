import {createRouter, createWebHistory} from 'vue-router'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import("../views/Home.vue")
        },
        {
            path: '/overview',
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
        },
        {
            path: '/backstage',
            name: 'backstage',
            component: () => import("../views/backstage.vue"),
            redirect: '/backstage/questionnaireManage',
            children: [
                {
                    path: 'questionnaireManage',
                    component: () => import("../views/QuestionnaireManage.vue")
                },
                {
                    path: 'topic',
                    component: () => import("../views/Topic.vue")
                },
                {
                    path: 'feedback',
                    component: () => import("../views/Feedback.vue")
                },
                {
                    path: 'statistics',
                    component: () => import("../views/Statistics.vue")
                },
                {
                    path: 'detail/:userId',
                    name:'detail',
                    props:true,
                    component: () => import("../views/Detail.vue")
                },
            ]
        }
    ]
})

export default router
