
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { 
        path: 'login', 
        alias:['', 'entrar'],
        name: 'login', 
        component: () => import('pages/Login.vue') 
      },
      { 
        path: 'register', 
        alias:['registrar'],
        name: 'register', 
        component: () => import('pages/Register.vue') 
      },
      { 
        path: 'email-confirmation', 
        alias:['emailconfirmation'],
        name: 'email-confirmation', 
        component: () => import('pages/EmailConfirmation.vue') 
      },
      { 
        path: 'me', 
        // alias:['me'],
        name: 'me', 
        component: () => import('pages/Me.vue') 
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: 'home', 
        component: () => import('pages/IndexPage.vue') 
      },
      { 
        path: 'me', 
        // alias:['me'],
        name: 'me', 
        component: () => import('pages/Me.vue') 
      }
    ],
    meta: {
      requiresAuth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
