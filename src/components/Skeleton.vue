<template>
  <div v-if="load" class="row" >
    <q-markup-table class="col-12">
      <thead>
        <tr>
          <th 
            v-for="(index) in colunas" :key="index"
            class="text-right align" 
            style="width: 150px"
          >
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="n in linhas" :key="n">
          <td 
            v-for="(index) in colunas" :key="index"
            class="text-left"
          >
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "PageListCategory",
  props:{
    colunas: {
      type: Number,
      default: 3,
      required: false
    },
    linhas: {
      type: Number,
      default: 3,
      required: false
    },
    load: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  setup() {

    const disable = true

    return {
        disable
    };
  },
});
</script>
