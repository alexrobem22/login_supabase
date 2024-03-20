<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-12 text-center">
                <p class="text-h6">
                    Form Product
                </p>
            </div>
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-sm">
                <!-- accept="image/*" -> so aceita image nao aceita .pdf e etc -->
                <q-input 
                    v-model="img"
                    label="Image"
                    stack-label
                    type="file"
                    accept="image/*"
                />

                <q-input 
                    v-model="form.name"
                    label="Name"
                    :rules="[(val) => (val && val.length >= 3) || 'requires more than 3 characters']"
                />

                <q-editor 
                    v-model="form.description" 
                    min-height="5rem" 
                />
                <!-- quando eu boto !!val eu verifico se o valor existe -->
                <q-input 
                    v-model="form.amount"
                    label="Amount"
                    type="number"
                    :rules="[(val) => !!val || 'Amount is Requires']"
                />
                
                <q-input 
                    v-model="form.price"
                    label="Price"
                    type="number"
                    :rules="[(val) => !!val || 'Amount is Requires']"
                    prefix="R$"
                />

                <!-- emit-value -> ele pega o valor sem ele, ele pega todo o objeto-->
                <q-select
                    v-model="form.category_id"
                    :options="optionsCategory"
                    label="Category"
                    option-value="id"
                    option-label="name"
                    map-options
                    emit-value
                    :rules="[(val) => !!val || 'Category is Requires']"
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
                    :to="{ name:'product'}"
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
  name: "PageFormProduct",
  components: {
  },
  setup() {


    const { get, post, getByid, update, uploadImg } = useApi();
    const route = useRoute() // aqui eu verifico minha rota atual

    const table = 'product'
    const load = ref(false)
    const form = ref({
      name: "",
      description: '',
      amount: 0,
      price: '',
      category_id: '',
      img_url: '',
      path_img_url: ''
    });
    const img = ref([])

    let product = {}
    var optionsCategory = ref([]) // uso o ref([]) pq ele vai ser reativo

    const isUpdate = computed(() => route.params.id)

    onMounted(() => {
        if(isUpdate.value){
            handleGetById(isUpdate.value)
        }
        handleGet()
    })
    const handleSubmit = async () => {
        load.value = true

        if (img.value.length > 0) {
            const imgUrl = await uploadImg(img.value[0], 'products', form.value, 'img')
            form.value.img_url = imgUrl.publicUrl
            form.value.path_img_url = imgUrl.fileName
        }

        if(isUpdate.value){
            await update(table, form.value)
        }else{
            await post(table, form.value)
        }
        
        load.value = false
    }

    const handleGetById = async (id) => {
        product = await getByid(table, id)
        form.value = product
    }

    const labelSaveOrUpdate = computed(() => {
      return isUpdate.value ? "Update" : "Save";
    });

    const handleGet = async () => {
        optionsCategory.value = await get('category')
    }

    return {
        form,
        handleSubmit,
        load,
        handleGetById,
        labelSaveOrUpdate,
        optionsCategory,
        img
    };
  },
});
</script>