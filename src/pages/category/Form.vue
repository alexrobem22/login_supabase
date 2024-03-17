<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-12 text-center">
                <p class="text-h6">
                    Form Category
                </p>
            </div>
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-sm">
                <q-input 
                    v-model="form.name"
                    label="Name"
                    :rules="[(val) => (val && val.length >= 3) || 'requires more than 3 characters']"
                />

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

export default defineComponent({
  name: "PageFormCategory",
  components: {
  },
  setup() {


    const { post, getByid, update } = useApi();
    const route = useRoute() // aqui eu verifico minha rota atual

    const table = 'category'
    const load = ref(false)
    const form = ref({
      name: "",
    });
    let category = {}

    const isUpdate = computed(() => route.params.id)

    onMounted(() => {
        if(isUpdate.value){
            handleGetById(isUpdate.value)
        }
    })
    const handleSubmit = async () => {
        load.value = true
        if(isUpdate.value){
            await update(table, form.value)
        }else{
            await post(table, form.value)
        }
        
        load.value = false
    }

    const handleGetById = async (id) => {
        category = await getByid(table, id)
        form.value = category
    }

    const labelSaveOrUpdate = computed(() => {
      return isUpdate.value ? "Update" : "Save";
    });

    return {
        form,
        handleSubmit,
        load,
        handleGetById,
        labelSaveOrUpdate
    };
  },
});
</script>