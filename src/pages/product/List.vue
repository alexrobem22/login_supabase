<template>
  <q-page padding>
    <div class="row" v-if="!loadSkeleton">
      <q-table :rows="products" :columns="columns" row-key="id" class="col-12">
        <template v-slot:top>
          <span class="text-h6">Product</span>
          <q-space />
          <q-btn 
            v-if="$q.platform.is.desktop"
            icon="add" 
            color="primary" 
            label="Add New" 
            dense
            :to="{ name:'form-product' }"
          />
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn icon="edit" color="info" dense size="sm" @click="handleEdit(props.row)">
              <q-tooltip> Edit </q-tooltip>
            </q-btn>
            <q-btn icon="delete" color="negative" dense size="sm" @click="handleDeleteProducts(props.row)">
              <q-tooltip> Delete </q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-img_url="props">
          <q-td :props="props">
            <q-avatar v-if="props.row.img_url">
              <img :src="props.row.img_url">
            </q-avatar>
            <q-avatar 
              v-else
              color="grey" 
              text-color="white" 
              icon="hide_image" 
            />
          </q-td>
        </template>

      </q-table>
    </div>
    <skeleton 
      :colunas="columns.length" 
      :linhas="columns.length"
      :load="loadSkeleton"
    />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn 
        v-if="$q.platform.is.mobile"
        fab 
        icon="add" 
        color="primary" 
        :to="{ name:'form-product' }"
      />
    </q-page-sticky>
  </q-page>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
import useApi from "src/composables/UseApi";
import { useRouter, useRoute } from "vue-router";
import skeleton from "src/components/Skeleton.vue"
import { useQuasar } from 'quasar'
import { columnsProduct } from "./table"

const columns = columnsProduct

export default defineComponent({
  name: "PageListProduct",
  components: {
    skeleton,
  },
  setup() {

    const router = useRouter(); //para configurar a rota
    const { get, remove } = useApi(); //pega o metodo login
    const $q = useQuasar()

    const products = ref([])
    const loadSkeleton = ref(true)
    const table = "product"

    const handleListProducts = async () => {

      products.value = await get(table)
      loadSkeleton.value = false
    }

    const handleEdit = (category) => {
      router.push({ name: 'form-product', params: { id: category.id}})
    }

    const handleDeleteProducts = (category) => {
      $q.dialog({
        title: 'Confirm',
        message: `Do you really delete ${category.name} ?`,
        ok: {
          push: true,
          color: 'primary'
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(async () => {
        await remove(table, category.id)
        handleListProducts()
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
      
    }

    onMounted(() => {
      handleListProducts()
    });

    return {
      columns,
      products,
      loadSkeleton,
      handleEdit,
      handleDeleteProducts
    };
  },
});
</script>