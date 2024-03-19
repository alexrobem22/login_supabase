<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-12 text-center">
                <p class="text-h6">
                    Form Config
                </p>
            </div>
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-sm">
                <q-input 
                    v-model="form.name"
                    label="Store Name"
                    :rules="[(val) => (val && val.length >= 3) || 'requires more than 3 characters']"
                />
                <!--unmasked-value pega o valor sem ser formatado so os numeros  -->
                <q-input 
                    v-model="form.phone"
                    label="Phone"
                    mask="(##)#####-####"
                    unmasked-value
                />
                
                <div class="row justify-center q-gutter-md q-pa-md">

                    <q-color v-model="form.primary" class="col-md-4 col-sm-4 col-xs-12" />

                    <q-color v-model="form.secondary" class="col-md-4 col-sm-4 col-xs-12" />

                </div>

                <q-btn 
                    :label="labelSaveOrUpdate"
                    color="primary"
                    class="full-width"
                    rounded
                    :loading="load"
                    @click="handleSubmit"
                />

                <q-btn 
                    label="CANCEL"
                    color="primary"
                    class="full-width"
                    rounded
                    flat
                    :to="{ name:'category'}"
                />
            </div>
            
        </div>
    </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useApi from "src/composables/UseApi";
import useBrand from 'src/composables/UseBrand'
import UserAuthUser from 'src/composables/UseAuthUser'

export default defineComponent({
  name: "PageFormConfig",
  components: {
  },
  setup() {


    const { post, get, update } = useApi();
    const route = useRoute() // aqui eu verifico minha rota atual
    const { setBrand } = useBrand()
    const { user } = UserAuthUser()

    const table = 'config'
    const load = ref(false)
    const form = ref({
      name: "",
      phone: "",
      primary: "",
      secondary: "",
      user_id: user.id
    });
    var config = {}

    const isUpdate = computed(() => route.params.id)

    onMounted(() => {
        handleGetConfig()
    })
    const handleSubmit = async () => {
        load.value = true

        if(form.value.id){
            console.log(form.value)
            await update(table, form.value, 'me')
        }else{
            await post(table, form.value, 'me')
        }
        setBrand(form.value.primary, form.value.secondary)

        load.value = false
    }

    const handleGetConfig = async () => {
        config = await get(table)
        if(config.length > 0){
            form.value = config[0]
        }
        
        
    }

    const labelSaveOrUpdate = computed(() => {
      return form.value.id ? "Update" : "Save";
    });

    return {
        form,
        handleSubmit,
        load,
        labelSaveOrUpdate,
    };
  },
});
</script>