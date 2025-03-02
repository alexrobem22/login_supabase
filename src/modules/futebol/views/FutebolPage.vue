<template>
  <q-page padding>

     <q-card class="my-card q-my-md">
      <q-card-section>
        <q-btn label="CADASTRAR JOGADORES" color="primary" @click="cadastrarJogadorDialog = true" />
      </q-card-section>

      <q-dialog v-model="cadastrarJogadorDialog">
        <q-card>

          <q-card-section>
            <div class="text-h6">Cadastre seus jogadores ao time</div>
          </q-card-section>

          <q-card-section class="q-pt-none q-gutter-md">
            <q-select
              v-model="form.time"
              filled
              :options="JSON.parse(profileUser.grupo_time)"
              stack-label
              label="SELECIONE O TIME"
            />

             <q-input v-model="name" filled bottom-slots label="Label" :dense="dense">

              <template v-slot:after>
                <q-btn round dense flat icon="add" :disable="name.length >= 3 ? false : true"  @click="adcionarJogador" />
              </template>

            </q-input>

          </q-card-section>

          <q-card-section v-if="form.name.length">
            <q-list bordered>
              <q-item v-for="item in form.name" :key="item">
                <q-item-section>{{ item }}</q-item-section>
                <q-item-section side top>
                  <q-btn flat round dense icon="delete" @click="form.name.splice(form.name.indexOf(item), 1)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup color="primary" flat label="cadastrar" @click="cadastrar"/>
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-card>

    <q-table
      flat
      bordered
      title="futebol"
      :rows="rows"
      :columns="columns"
      row-key="name"
      binary-state-sort
      :filter="filter"
      :rows-per-page-options="[10, 15, 20, 25, 50]"
      :rows-per-page-label="'Registros por página'"
    >
      <template v-slot:top-right>
        <q-input v-model="filter" borderless dense debounce="300" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td> 
          <q-td key="golfeito" :props="props">
            {{ props.row.golfeito }}
            <q-popup-edit
              v-slot="scope"
              v-model="props.row.golfeito"
              title="Update gol feito"
              buttons
              label-set="SALVAR"
            >
              <q-input v-model="scope.value" type="number" dense autofocus />
            </q-popup-edit>
          </q-td>

          <q-td key="assistencia" :props="props">
            {{ props.row.assistencia }}
            <q-popup-edit
              v-slot="scope"
              v-model="props.row.assistencia"
              title="Update assistencia"
              buttons
              label-set="SALVAR"
            >
              <q-input v-model="scope.value" type="number" dense autofocus />
            </q-popup-edit>
          </q-td>

          <q-td key="cartaoAmarelo" :props="props">
            {{ props.row.cartaoAmarelo }}
            <q-popup-edit
              v-slot="scope"
              v-model="props.row.cartaoAmarelo"
              title="Update cartão Amarelo"
              buttons
              label-set="SALVAR"
            >
              <q-input v-model="scope.value" type="number" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="cartaoVermelho" :props="props">
            {{ props.row.cartaoVermelho }}
            <q-popup-edit
              v-slot="scope"
              v-model="props.row.cartaoVermelho"
              title="Update cartão Vermelho"
              buttons
              label-set="SALVAR"
            >
              <q-input v-model="scope.value" type="number" dense autofocus />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
{{ profileUser }}
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import userAuthUser from "src/composables/UseAuthUser";
import useApi from "src/composables/UseApi";
import apiFutebol from "../services/ApiFutebol";

const {user, logout } = userAuthUser();
const { getAllProfiles } = useApi();
const { update } = apiFutebol();

const filter = ref('');
const profileUser = ref(null);
const cadastrarJogadorDialog = ref(false);
const name = ref('');
const form = ref({
  time: '',
  name: []
});

onMounted(async () => {
  profileUser.value = await getAllProfiles(user.value?.email);
});

const adcionarJogador = () => {
  form.value.name.push(name.value);
  name.value = '';
}

const cadastrar = () => {

  console.log(form.value);

}

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

const rows = ref([
  {
    name: 'alex',
    golfeito: 1,
    assistencia: 1,
    cartaoAmarelo: 1,
    cartaoVermelho: 1,
  },
  {
    name: 'gabriel4',
    golfeito: 2,
    assistencia: 2,
    cartaoAmarelo: 2,
    cartaoVermelho: 2,
  },
  {
    name: 'gabriel3',
    golfeito: 2,
    assistencia: 2,
    cartaoAmarelo: 2,
    cartaoVermelho: 2,
  },
  {
    name: 'gabriel2',
    golfeito: 2,
    assistencia: 2,
    cartaoAmarelo: 2,
    cartaoVermelho: 2,
  },
  {
    name: 'artu',
    golfeito: 2,
    assistencia: 2,
    cartaoAmarelo: 2,
    cartaoVermelho: 2,
  },
  {
    name: 'artu1',
    golfeito: 2,
    assistencia: 2,
    cartaoAmarelo: 2,
    cartaoVermelho: 2,
  }
]);


</script>