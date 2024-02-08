<template>
  <q-page class="padding">
    <p class="text-body1">
      Thanks for registering !
    </p>
    <p class="text-body1">
      Please confirrm your email to finishing registering: <strong>{{  $route.query.email }}</strong> 
    </p>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageEmailConfirmation'
})
</script>
