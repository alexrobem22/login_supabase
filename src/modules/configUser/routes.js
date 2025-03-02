export default [
    // {
    //   path: '/login',
    //   name: 'LoginApp',
    //   component: () => import('./views/LoginApp.vue'), // Usando o layout principal
    // },
    {
      path: '/configurar-usuario',
      name: 'ConfigUser',
      component: () => import('./views/ConfigUser.vue'), // Usando o layout principal
    },
]