
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
      },
      { 
        path: 'product-public/:id', //:id? sem a interogação o id se torna obrigatorio
        alias:['produtos-publico'],
        name: 'product-public', 
        component: () => import('pages/product/Public.vue') 
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
      //route categoria
      { 
        path: 'category', 
        alias:['categoria'],
        name: 'category', 
        component: () => import('pages/category/List.vue') 
      },
      { 
        path: 'form-category/:id?', //quando eu boto ? o campo vira opcional
        alias:['form-categoria'],
        name: 'form-category', 
        component: () => import('pages/category/Form.vue') 
      },
      //route produtos
      { 
        path: 'product', 
        alias:['produtos'],
        name: 'product', 
        component: () => import('pages/product/List.vue') 
      },
      { 
        path: 'form-product/:id?', //quando eu boto ? o campo vira opcional
        alias:['form-produtos'],
        name: 'form-product', 
        component: () => import('pages/product/Form.vue') 
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
