<template>
  <q-page class="flex flex-center">
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="col-12 text-h5 text-center">Seja bem vindo!</p>
      <div class="col-md-8 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          v-model="form.email"  
          label="Email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Email is required']"
        />
        <q-input
          v-model="form.password"
          label="Password"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Password is required']"
        />

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

        <div class="full-width q-pt-md q-gutter-y-sm">
          <q-btn
            label="Register"
            color="primary"
            class="full-width"
            flat
            to="/register"
          />
          <q-btn
            label="Forgor Password"
            color="primary"
            class="full-width"
            flat
            :to="{ name: 'forgot-password' }"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>
  
  <script>
import { defineComponent, ref, onMounted } from "vue";
import userAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import useApi from 'src/composables/UseApi'

export default defineComponent({
  name: "PageLogin",

  setup() {
    const router = useRouter(); //para configurar a rota
    const { login, isLoggedIn } = userAuthUser(); //pega o metodo login
    const form = ref({
      email: "",
      password: "",
    });
    const { getBrand } = useApi()

    onMounted(() => {
      if (isLoggedIn) {
        router.push({ name: "me" });
      }
    });
    const handleLogin = async () => {
      try {
        await login(form.value);
        await getBrand()
        router.push({ name: "me" });
      } catch (error) {

        alert(error.message);
      }
    };
    return {
      form,
      handleLogin,
    };
  },
});
</script>