<template>
    <q-page padding>
      <div v-if="brand.name" class="row">
        <div class="col-12 text-center text-h4">
          {{ brand.name }}
        </div>
      </div>
      <div v-if="!loadSkeleton" class="row" >

        <!-- clearable ele pertime eu limpa o que eu selecionei no select-->
        <!--  @update:model-value se ouver alguma modificação no model so chama a function -->
        <q-select 
          v-model="categoryId" 
          label="Category"  
          outlined 
          :options="optionsCategories"
          option-label="name"
          option-value="id"
          class="col-12" 
          dense
          map-options
          emit-value
          clearable
          @update:model-value="handleListProducts(route.params.id)"
        />

        <!-- v-model:pagination="initialPagination" isso e para pega a paginação na tabela -->
        <!-- hide-pagination aqui eu tipo a paginação da propria tabela -->
        <q-table 
          v-model:pagination="initialPagination"
          :rows="products" 
          :columns="columns" 
          :filter="filter"
          row-key="name" 
          class="col-12"
          grid
          hide-pagination
        >
            <template v-slot:top>
                <span class="text-h6">Product</span>
                <q-space />
                <!-- debounce="300" serve para ele demorar um pouco antes de fazer o filter -->
                <q-input v-model="filter" borderless dense debounce="300" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                    </q-input>
            </template>

            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                  <!-- v-ripple:primary da um efeito de clike  -->
                  <q-card v-ripple:primary flat bordered class="cursor-pointer" @click="handleShowDetails(props.row)">
                    <q-img :src="props.row.img_url" :ratio="4/4"/>
                    <q-card-section class="text-center">
                      <div class="text-h6">{{ props.row.name }}</div>
                      <div class="text-subtitle2">{{ formatCurrency(props.row.price) }}</div>
                    </q-card-section>
                  </q-card>
                </div>
            </template>
  
        </q-table>

      </div>
      <div class="row justify-center q-mt-md">
        <q-pagination
          v-model="initialPagination.page"
          :max="pagesNumber"
          direction-links
          @update:model-value="hadleScrollToTop"
        />
      </div>
      <skeleton 
        :colunas="columns.length" 
        :linhas="columns.length"
        :load="loadSkeleton"
      />
      <dialog-product-details 
        :show="showDialogDetails"
        :product="productDetails"
        @hide-dialog="showDialogDetails = false"
      />
    </q-page>
  </template>
  <script>
  import { defineComponent, ref, onMounted, computed } from "vue";
  import useApi from "src/composables/UseApi";
    //useRouter -> aqui e onde eu direciono paras as rotas que eu quero
    //useRoute -> aqui eu pego os dado da rota que eu tou no momento
  import { useRouter, useRoute } from "vue-router";
  import skeleton from "src/components/Skeleton.vue"
  import DialogProductDetails from "src/components/DialogProductDetails.vue"
  import { columnsProduct, initialPagination } from "./table"
  import { formatCurrency } from 'src/utils/format'
  
  const columns = columnsProduct
  
  export default defineComponent({
    name: "PageProductPublic",
    components: {
      skeleton,
      DialogProductDetails
    },
    setup() {
  
      const router = useRouter(); //para configurar a rota
      const route = useRoute() //pega os dados da minha rota atual
      const { getPublic, brand } = useApi(); //pega o metodo login
  
      const products = ref([])
      const loadSkeleton = ref(true)
      const table = "product"
      const filter = ref('')
      const showDialogDetails = ref(false)
      const productDetails = ref({})
      const optionsCategories = ref([])
      const categoryId = ref('')

      const handleListProducts = async (userId) => {
        products.value = categoryId.value ? await getPublic(table, userId, 'category_id', categoryId.value) : await getPublic(table, userId)
        loadSkeleton.value = false
      }
  
      onMounted(() => {
        if (route.params.id){
            handleListProducts(route.params.id)
            handleListCategories(route.params.id)
        }
        
      });

      const handleShowDetails = (product) => {
        productDetails.value = product
        showDialogDetails.value = true
      }

      const handleListCategories = async (userId) => {
        optionsCategories.value = await getPublic('category', userId)
      }

      const hadleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
  
      return {
        columns,
        products,
        loadSkeleton,
        filter,
        formatCurrency,
        showDialogDetails,
        productDetails,
        handleShowDetails,
        brand,
        optionsCategories,
        categoryId,
        route,
        handleListProducts,
        hadleScrollToTop,
        initialPagination,
        pagesNumber: computed(() => Math.ceil(products.value.length / initialPagination.value.rowPerPage))
      };
    },
  });
  </script>
  <style scoped>
  
  </style>