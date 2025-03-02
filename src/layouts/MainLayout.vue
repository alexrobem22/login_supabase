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
        <q-toolbar-title> Estoque </q-toolbar-title>

        <darck-mode-toggle />

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

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- enter-active-class="animated fadeInUp slower delay-5s repeat-2"aqui eu configuro como deixa rapido repitir etc -->
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeInUp slower"
          leave-active-class="animated fadeOutDown"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import userAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import useApi from "src/composables/UseApi";
import DarckModeToggle from "src/components/DarckModeToggle.vue";

const linksList = [
  {
    title: "Home",
    caption: "Pagina inicial",
    icon: "home",
    routeName: "me",
    admin: [1,2,3]
  },
  {
    title: "Category",
    caption: "Categoria",
    icon: "category",
    routeName: "category",
    admin: [1,2,3]
  },
  {
    title: "Product",
    caption: "Produtos",
    icon: "inventory_2",
    routeName: "product",
    admin: [1,2,3]
  },
  {
    title: "Config",
    caption: "Configuração",
    icon: "mdi-cog",
    routeName: "form-config",
    admin: [1,2,3]
  },
  {
    title: "Config Rifa",
    caption: "Configuração",
    icon: "mdi-baby",
    routeName: "PageFormRifa",
    admin: [1,2,3]
  },
  {
    title: "Wednesday football",
    caption: "Futebol",
    icon: "sports_soccer",
    routeName: "FutebolPage",
    admin: [0,1,2,3]
  },
  {
    title: "Config User",
    caption: "configurar usuario",
    icon: "mdi-cog",
    routeName: "ConfigUser",
    admin: [1,2,3]
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    DarckModeToggle,
  },

  setup() {
    const {user, logout } = userAuthUser();
    const router = useRouter();
    const $q = useQuasar();
    // returns Object
    const leftDrawerOpen = ref(false);
    const profileUser = ref(null);
    const { getBrand, getAllProfiles } = useApi();

    onMounted(async () => {
      await getBrand();
      profileUser.value = await getAllProfiles(user.value?.email);
    });
    const handleLogout = async () => {
      $q.dialog({
        title: "Logout",
        message: "Do you really want to leave",
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          await logout();
          // router.push({ name: 'login'}) //push ele vai inpilhando a rotas
          router.replace({ name: "login" }); //replace ele zera a rota
        })
        .onCancel(() => {});
    };

    const filteredLinks = computed(() => {
      return linksList.filter(link => {
        if (link.admin.includes(profileUser.value?.admin)) {
          return true;
        }

        return false;
      });
    });

    return {
      essentialLinks: filteredLinks,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      handleLogout,
      user
    };
  },
});
</script>
