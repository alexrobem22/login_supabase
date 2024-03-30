<template>
    <q-page class="padding">
      <q-form class="row justify-center">
        <p class="col-12 text-h5 text-center">Forgot Password</p>
        <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
          <q-input v-model="form.email" label="Email"  />
  
          <div class="full-width q-pt-md q-gutter-y-sm">
            <q-btn
              label="Send"
              color="primary"
              class="full-width"
              outline
              rounded
              :loading="desable"
              @click="handleForgotPassword"
            />
            
            <q-btn
              label="Back"
              color="dark"
              class="full-width"
              rounded
              flat
              :to="{name: 'login'}"
            />
          </div>
        </div>
      </q-form>
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue'
  import userAuthUser from 'src/composables/UseAuthUser'
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'ForgotPasswordPage',
  
    setup() {
  
      const router = useRouter() //para configurar a rota
      const desable = ref(false)

      const { sendPassowrdRestEmail } = userAuthUser() //pega o metodo login
  
      const form = ref({
        email: ''
      });
  
      const handleForgotPassword = async () => {
        try {
            desable.value = true
          await sendPassowrdRestEmail(form.value.email)
          desable.value = false
        } catch (error) {
            desable.value = false

          alert(error.message)
        }
      };
  
      return {
          form,
          handleForgotPassword,
          desable
      }
    },
  
  })
  </script>
  