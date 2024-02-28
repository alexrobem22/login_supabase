<template>
  <q-page class="padding">
    <p class="text-body1">
      Thanks for registering !
    </p>
    <p class="text-body1">
      Please confirrm your email to finishing registering: <strong>{{  $route.query.email }}</strong> 
    </p>
    <div class="row justify-center ">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-sm">
        <q-btn
          label="Back to login"
          color="dark"
          class="full-width"
          rounded
          :to="{name: 'login'}"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageEmailConfirmation'
})
</script>
