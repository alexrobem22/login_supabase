
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
        path: 'forgot-password', 
        alias:['forgotpassword'],
        name: 'forgot-password', 
        component: () => import('pages/ForgotPassword.vue') 
      },
      { 
        path: 'reset-password', 
        alias:['resetpassword'],
        name: 'reset-password', 
        component: () => import('pages/ResetPassword.vue') 
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { 
      //   path: 'home', 
      //   component: () => import('pages/IndexPage.vue') 
      // },
      { 
        path: 'me', 
        // alias:['me'],
        name: 'me', 
        component: () => import('pages/Me.vue') 
      },
      { 
        path: 'category', 
        alias:['categoria'],
        name: 'category', 
        component: () => import('pages/category/List.vue') 
      },
      { 
        path: 'form-category', 
        alias:['form-categoria'],
        name: 'form-category', 
        component: () => import('pages/category/Form.vue') 
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
