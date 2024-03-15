<template>
    <q-page padding>
      <div class="row" v-if="!loadSkeleton">
        <q-table 
            :rows="products" 
            :columns="columns" 
            :filter="filter"
            row-key="name" 
            class="col-12"
            grid
        >
            <template v-slot:top>
                <span class="text-h6">Product</span>
                <q-space />
                <!-- debounce="300" serve para ele demorar um pouco antes de fazer o filter -->
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                    </q-input>
            </template>

            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                  <q-card flat bordered>
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
      <skeleton 
        :colunas="columns.length" 
        :linhas="columns.length"
        :load="loadSkeleton"
      />
    </q-page>
  </template>
  <script>
  import { defineComponent, ref, onMounted } from "vue";
  import useApi from "src/composables/UseApi";
    //useRouter -> aqui e onde eu direciono paras as rotas que eu quero
    //useRoute -> aqui eu pego os dado da rota que eu tou no momento
  import { useRouter, useRoute } from "vue-router";
  import skeleton from "src/components/Skeleton.vue"
  import { columnsProduct } from "./table"
  import { formatCurrency } from 'src/utils/format'
  
  const columns = columnsProduct
  
  export default defineComponent({
    name: "PageProductPublic",
    components: {
      skeleton,
    },
    setup() {
  
      const router = useRouter(); //para configurar a rota
      const route = useRoute() //pega os dados da minha rota atual
      const { getPublic } = useApi(); //pega o metodo login
  
      const products = ref([])
      const loadSkeleton = ref(true)
      const table = "product"
      const filter = ref('')

      const handleListProducts = async (userId) => {
        console.log('public', route)
        products.value = await getPublic(table, userId)
        loadSkeleton.value = false
      }
  
      onMounted(() => {
        if (route.params.id){
            handleListProducts(route.params.id)
        }
        
      });
  
      return {
        columns,
        products,
        loadSkeleton,
        filter,
        formatCurrency
      };
    },
  });
  </script>
  <style scoped>
  
  </style>