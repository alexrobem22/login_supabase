<template>
    <q-page class="" padding>
      <div class="row q-col-gutter-sm" >
        <div class="col-md-4 col-xs-12 col-sm-6">
          <card-deshboard 
           table="category"
           label="Categories"
           icon="category"
          />
        </div>
        <div class="col-md-4 col-xs-12 col-sm-6">
          <card-deshboard 
           table="product"
           label="Products"
           icon="inventory_2"
          />
        </div>
      </div>
      <!-- <div v-if="user">
        <pre>
        <p>Hello {{ user.email }}</p></pre>
      </div> -->
    </q-page>
  </template>
  
  <script>
  // defineAsyncComponent -> chama componente de foma asyncroma para que ele melhore a performe da nossa aplicação
  // ele so chama o card quando entra na pagina
  import { defineComponent, defineAsyncComponent } from 'vue'
  import userAuthUser from 'src/composables/UseAuthUser'
  
  export default defineComponent({
    name: 'PageMe',
    components: {
      CardDeshboard: defineAsyncComponent(() => import('components/CardDashboard.vue'))
    },

    setup() {
        const { user } = userAuthUser()

        return {
            user
        }
    }
    
  })
  </script>