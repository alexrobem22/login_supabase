<template>
    <q-page class="padding">
      <q-form class="row justify-center">
        <p class="col-12 text-h5 text-center">Password Reset</p>
        <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
          <q-input label="Password" v-model="form.password" />
  
          <div class="full-width q-pt-md q-gutter-y-sm">
            <q-btn
              label="Send"
              color="primary"
              class="full-width"
              outline
              rounded
              :loading="desable"
              @click="handlePasswordReset"
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
  //useRouter -> aqui e onde eu direciono paras as rotas que eu quero
  //useRoute -> aqui eu pego os dado da rota que eu tou no momento
  import { useRouter, useRoute } from 'vue-router';
  
  export default defineComponent({
    name: 'ResetPasswordPage',
  
    setup() {
  
      const router = useRouter() //para configurar a rota e redirecionar meu usuario
      const route = useRoute() //pega os dados da minha rota atual
      const desable = ref(false)
    //   const token = router.query.token
      const { resetPassword } = userAuthUser() //pega o metodo login
  
      const form = ref({
        password: ''
      });
  
      const handlePasswordReset = async () => {
        try {
            desable.value = true
            
            await resetPassword(form.value.password)
            desable.value = false
            router.push({ name: 'login'})
        } catch (error) {
            desable.value = false
            console.log('handleRegister',error)
            alert(error.message)
        }
      };
  
      return {
          form,
          handlePasswordReset,
          desable
      }
    },
  
  })
  </script>
  