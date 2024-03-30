export default [
    // {
    //   path: '/rifa-bebe/:id?',
    //   name: 'PageRifaBebe',
    //   component: () => import('./views/PublicRifaBebe.vue'), // Usando o layout principal
    // },
    {
      path: '/form-config-rifa/:id?',
      name: 'PageFormRifa',
      component: () => import('./views/FormRifa.vue'), // Usando o layout principal
    },
]