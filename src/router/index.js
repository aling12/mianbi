import { createRouter, createWebHistory } from "vue-router";
import LoginPages from "../views/LoginPages.vue";
import ManageBackstage from "../views/ManageBackstage.vue";
import UsersList from "../views/UsersList.vue";
import QuestionBank from "../views/QuestionBank.vue";
import HomePages from "../views/HomePages.vue";
import TeachingTool from "../views/TeachingTool.vue";
import NoteList from "../views/NoteList.vue";
import NoteCreate from "../views/NoteCreate.vue";
import NoteEdit from '../views/NoteEdit.vue'
import NoteDetails from '../views/NoteDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: LoginPages,
    },
    {
      path: "/review",
      component: ManageBackstage,
      children: [
        {
          path: "/users",
          component: UsersList,
        },
        {
          path: "/bank",
          component: QuestionBank,
        },
        {
          path: "/home",
          component: HomePages,
        },
        {
          path: "/board",
          component: TeachingTool,
        },
        {
          path: "/notes",
          component: NoteList,
        },
        {
          path: '/notes/create',
          component: NoteCreate,
        },
        {
          path: '/notes/:id/edit',
          component: NoteEdit,
        },
        {
          path: '/notes/:id',
          component: NoteDetails,
        },
      ],
    },
  ],
});

export default router;
