<template>
  <q-page padding>
    <div v-if="!loadSkeleton" class="row" >
      <q-table :rows="categories" :columns="columns" row-key="id" class="col-12">
        <template v-slot:top>
          <span class="text-h6">Category</span>
          <q-space />
          <q-btn 
            v-if="$q.platform.is.desktop"
            icon="add" 
            color="primary" 
            label="Add New" 
            dense
            :to="{ name:'form-category' }"
          />
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn icon="edit" color="info" dense size="sm" @click="handleEdit(props.row)">
              <q-tooltip> Edit </q-tooltip>
            </q-btn>
            <q-btn icon="delete" color="negative" dense size="sm" @click="handleDeleteCategory(props.row)">
              <q-tooltip> Delete </q-tooltip>
            </q-btn>
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
        :to="{ name:'form-category' }"
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
import { columnsCategory } from "./table"

const columns = columnsCategory

export default defineComponent({
  name: "PageListCategory",
  components: {
    skeleton,
  },
  setup() {

    const router = useRouter(); //para configurar a rota
    const { get, remove } = useApi(); //pega o metodo login
    const $q = useQuasar()

    const categories = ref([])
    const loadSkeleton = ref(true)
    const table = "category"

    const handleListCategory = async () => {

      categories.value = await get(table)
      loadSkeleton.value = false
    }

    const handleEdit = (category) => {
      router.push({ name: 'form-category', params: { id: category.id}})
    }

    const handleDeleteCategory = (category) => {
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
        handleListCategory()
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
      
    }

    onMounted(() => {
      handleListCategory()
    });

    return {
      columns,
      categories,
      loadSkeleton,
      handleEdit,
      handleDeleteCategory
    };
  },
});
</script>