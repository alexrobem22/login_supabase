<template>
    <q-page class="flex flex-center">
      <div v-if="user">
        <pre>
        <p>Hello {{ user.email }}</p></pre>
      </div>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import userAuthUser from 'src/composables/UseAuthUser'
  
  export default defineComponent({
    name: 'PageMe',

    setup() {
        const { user } = userAuthUser()

        return {
            user
        }
    }
    
  })
  </script>