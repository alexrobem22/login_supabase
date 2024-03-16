<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Estoque
        </q-toolbar-title>

        <q-btn-dropdown flat color="white" icon="person">
          <q-list>
            <q-item v-close-popup clickable>
              <q-item-section>
                <q-item-label @click="handleLogout">Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
    
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import userAuthUser from 'src/composables/UseAuthUser'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'

const linksList = [
  {
    title: 'Home',
    caption: 'Pagina inicial',
    icon: 'home',
    routeName: 'me'
  },
  {
    title: 'Category',
    caption: 'Categoria',
    icon: 'category',
    routeName: 'category'
  },
  {
    title: 'Product',
    caption: 'Produtos',
    icon: 'inventory_2',
    routeName: 'product'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {

    const { logout } = userAuthUser()
    const router = useRouter()
    const $q = useQuasar()
   // returns Object
    const leftDrawerOpen = ref(false)

    const handleLogout = async () => {
      $q.dialog({
      title: 'Logout',
      message: 'Do you really want to leave',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      await logout()
      // router.push({ name: 'login'}) //push ele vai inpilhando a rotas
      router.replace({ name: 'login'}) //replace ele zera a rota
    }).onCancel(() => {
      // console.log('Cancel')
    }) 
      
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      handleLogout
    }
  }
})
</script>
