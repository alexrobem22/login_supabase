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
                    label="Name"
                    v-model="form.name"
                    :rules="[(val) => (val && val.length >= 3) || 'requires more than 3 characters']"
                />

                <q-btn 
                    label="Save"
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
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useApi from "src/composables/UseApi";

export default defineComponent({
  name: "PageFormCategory",
  components: {
  },
  setup() {


    const { post } = useApi(); //pega o metodo login

    const table = 'category'
    const load = ref(false)
    const form = ref({
      name: "",
    });

    const handleSubmit = async () => {
        load.value = true
        await post(table, form.value)
        load.value = false
    }

    return {
        form,
        handleSubmit,
        load
    };
  },
});
</script>