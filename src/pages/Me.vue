<template>
    <q-page class="flex flex-center">
      <div v-if="user">
        <p>Hello {{ user.user_metadata.name }}</p>
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