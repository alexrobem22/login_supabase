<template>
    <div class="box q-pa-md">
        <q-table
            style="width: 100%"
            :title="title"
            :rows="players"
            :columns="columns"
            row-key="name"
            binary-state-sort
            :filter="filter"
            :rows-per-page-options="[10, 15, 20, 25, 50]"
            :rows-per-page-label="'Registros por página'"
        >
            <template v-slot:top-right>
            <q-input v-model="filter" borderless dense debounce="300" placeholder="Buscar">
                <template v-slot:append>
                <q-icon name="search" />
                </template>
            </q-input>
            </template>
        </q-table>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiFutebol from "../services/ApiFutebol";
import { useRouter, useRoute } from "vue-router";

const { updatePlayers, getPlayers } = apiFutebol();
const route = useRoute() //pega os dados da minha rota atual

const players = ref([]);
const title = ref(null);
const filter = ref('');

onMounted( async () => {
    if (route.params.time){

    title.value = route.params.time.replace(/_/g, ' ');

    players.value = await getPlayers([title.value]);

    }

});

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nome Atleta',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'golfeito', 
    align: 'center', 
    label: 'Gol Feito',
    field: 'golfeito',
    sortable: true 
  },
  { 
    name: 'assistencia',
    align: 'center', 
    label: 'Assistencia',
    field: 'assistencia',
    sortable: true, 
  },
  { 
    name: 'cartaoAmarelo',
    align: 'center', 
    label: 'Cartão Amarelo',
    field: 'cartaoAmarelo',
  },
  { 
    name: 'cartaoVermelho',
    align: 'center', 
    label: 'Cartão Vermelho',
    field: 'cartaoVermelho',
  },
];
</script>

<style> 
.box{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;    
    align-items: center;
    background-color: #f5f5f5;
}
</style>