export default [
    {
      path: '/futebol/:id?',
      name: 'FutebolPage',
      component: () => import('./views/FutebolPage.vue'), // Usando o layout principal
    },
]