import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import userAuthUser from 'src/composables/UseAuthUser'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  //validar rota logado
  Router.beforeEach((to) => {
    // to and from are both route objects. must call `next`.
    const { isLoggedIn } = userAuthUser() //pega o metodo se tou logado

    // aqui verifico o type para onde vai e pego o hash e depois pego o token e no return mando para onde vai
    if (to.hash.includes('type=recovery')) {
      // Extrai o token da URL
      const urlParams = new URLSearchParams(to.hash.replace('#', '?')); // Corrigido para lidar com '#' em vez de '?'
      const token = urlParams.get('access_token');
      return { name: 'reset-password', query: { token } }
    }

    // '!Object.keys(to.query).includes('fromEmail') => aqui eu falou se na query no caso no link tiver  fromEmail deixe logar
    if(!isLoggedIn() && to.meta.requiresAuth && !Object.keys(to.query).includes('fromEmail')){
      return { name: 'login' }
    }
  })
  // validar rota logado -> comentei esse pq e simple e pratico e vou usar no meu codigo
  // Router.beforeEach((to) => {
  //   // to and from are both route objects. must call `next`.
  //   const { isLoggedIn } = userAuthUser() //pega o metodo se tou logado

  //   // '!Object.keys(to.query).includes('fromEmail') => aqui eu falou se na query no caso no link tiver  fromEmail deixe logar
  //   if(!isLoggedIn() && to.meta.requiresAuth && !Object.keys(to.query).includes('fromEmail')){
  //     return { name: 'login' }
  //   }
  // })
  return Router
})
