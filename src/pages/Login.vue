<template>
  <q-page class="flex flex-center">
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="col-12 text-h5 text-center">Seja bem vindo!</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input label="Email" v-model="form.email" />
        <q-input label="Password" v-model="form.password" />

        <div class="full-width q-pt-md">
          <q-btn
            label="Login"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
          />
        </div>

        <div class="full-width q-pt-md">
          <q-btn
            label="Register"
            color="primary"
            class="full-width"
            flat
            to="/register"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>
  
  <script>
import { defineComponent, ref } from "vue";
  import userAuthUser from 'src/composables/UseAuthUser'
  import { useRouter } from 'vue-router';

export default defineComponent({
  name: "PageLogin",

  setup() {
    const router = useRouter() //para configurar a rota
    const { login } = userAuthUser() //pega o metodo login
    const form = ref({
      email: '',
      password: '',
    });

    const handleLogin = async () => {
        try {
            await login(form.value)
            router.push({ name: 'me' })
        } catch (error) {
            console.log('error',error)
            alert(error.message)
        }
    }
    return {
        form,
        handleLogin
    }
  },
});
</script>