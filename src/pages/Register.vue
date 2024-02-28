<template>
  <q-page class="padding">
    <q-form class="row justify-center">
      <p class="col-12 text-h5 text-center">Register</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input label="Name" v-model="form.name" />
        <q-input label="Email" v-model="form.email" />
        <q-input label="Password" v-model="form.password" />

        <div class="full-width q-pt-md q-gutter-y-sm">
          <q-btn
            label="Register"
            color="primary"
            class="full-width"
            outline
            rounded
            @click="handleRegister"
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
  name: 'RegisterPage',

  setup() {

    const router = useRouter() //para configurar a rota

    const { register } = userAuthUser() //pega o metodo login

    const form = ref({
      name: '',
      email: '',
      password: '',
    });

    const handleRegister = async () => {
      try {
        await register(form.value)
        router.push({ 
          name: 'email-confirmation',
          query: { email: form.value.email }
        })
      } catch (error) {
        console.log('handleRegister',error)
        alert(error.message)
      }
      // Lógica para registrar o usuário aqui
      // Você pode acessar os dados do formulário usando 'form.value'
      // Exemplo de como você pode acessar os dados:
      console.log('Nome:', form.value.name);
      console.log('Email:', form.value.email);
      console.log('Senha:', form.value.password);
    };

    return {
        form,
        handleRegister
    }
  },

})
</script>
