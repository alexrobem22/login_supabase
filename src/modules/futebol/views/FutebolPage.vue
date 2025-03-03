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

             <q-input v-model="name" filled bottom-slots label="Label" dense>

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
            <q-btn 
              v-close-popup 
              color="primary" 
              flat 
              label="cadastrar" 
              :loading="loading"
              :disable="form.name.length >= 1 ? false : true" 
              @click="cadastrar"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-card>

 <div v-for="(players, team) in groupedTeams" :key="team">

      <q-table
        class="q-mt-md"
        flat
        bordered
        :title="team"
        :rows="players"
        :columns="columns"
        row-key="id"
        binary-state-sort
        :filter="filter"
        :rows-per-page-options="[10, 15, 20, 25, 50]"
        :rows-per-page-label="'Registros por página'"
      >
        <template v-slot:top>
          <span class="text-h6">{{ team }}</span>
          <q-btn
            label="Copy Link"
            dense
            outiline
            class="q-ml-sm"
            icon="mdi-content-copy"
            color="primary"
            @click="handleCopyPublicUrl(team)"
          />
        </template>
        <template v-slot:top-right>
          <q-input v-model="filter" borderless dense debounce="300" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">{{ props.row.name }}</q-td> 
            <q-td key="golfeito" :props="props">
              {{ props.row.golfeito }}
              <q-popup-edit v-slot="scope" v-model="props.row.golfeito" title="Update gol feito" buttons label-set="SALVAR" @save="updatePlayersLine(props.row)">
                <q-input v-model="scope.value" type="number" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="assistencia" :props="props">
              {{ props.row.assistencia }}
              <q-popup-edit v-slot="scope" v-model="props.row.assistencia" title="Update assistência" buttons label-set="SALVAR" @save="updatePlayersLine(props.row)">
                <q-input v-model="scope.value" type="number" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="cartaoAmarelo" :props="props">
              {{ props.row.cartaoAmarelo }}
              <q-popup-edit v-slot="scope" v-model="props.row.cartaoAmarelo" title="Update cartão Amarelo" buttons label-set="SALVAR" @save="updatePlayersLine(props.row)">
                <q-input v-model="scope.value" type="number" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="cartaoVermelho" :props="props">
              {{ props.row.cartaoVermelho }}
              <q-popup-edit v-slot="scope" v-model="props.row.cartaoVermelho" title="Update cartão Vermelho" buttons label-set="SALVAR" @save="updatePlayersLine(props.row)">
                <q-input v-model="scope.value" type="number" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td  key="actions" class="cursor-pointer" :props="props">
              <q-icon name="delete" style="color: red;"/>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import userAuthUser from "src/composables/UseAuthUser";
import useApi from "src/composables/UseApi";
import apiFutebol from "../services/ApiFutebol";
import useNotify from "src/composables/UseNotify";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, openURL, copyToClipboard } from "quasar";

const {user, logout } = userAuthUser();
const { getAllProfiles } = useApi();
const { updatePlayers, getPlayers } = apiFutebol();
const { notifySuccess, notifyError } = useNotify();
const router = useRouter(); //para configurar a rota

const filter = ref('');
const profileUser = ref(null);
const players = ref(null);
const cadastrarJogadorDialog = ref(false);
const name = ref('');
const loading = ref(false);
const form = ref({
  time: '',
  name: []
});

onMounted(async () => {
  profileUser.value = await getAllProfiles(user.value?.email);
  players.value = await getPlayers(JSON.parse(profileUser.value.grupo_time));
});

const groupedTeams = computed(() => {
  return (players.value ?? []).reduce((acc, jogador) => {
    if (!acc[jogador.time]) {
      acc[jogador.time] = [];
    }
    acc[jogador.time].push(jogador);
    return acc;
  }, {});
});

const adcionarJogador = () => {
  form.value.name.push(name.value);
  name.value = '';
}
const updatePlayersLine = async (player) => {

  // Converte golfeito para número, se for uma string
  player.golfeito = Number(player.golfeito);
  player.assistencia = Number(player.assistencia);
  player.cartaoAmarelo = Number(player.cartaoAmarelo);
  player.cartaoVermelho = Number(player.cartaoVermelho);

  const form = [player]; // Envia o jogador atualizado para o upsert

  await updatePlayers('players', form);

  players.value = await getPlayers(JSON.parse(profileUser.value.grupo_time));
}

const cadastrar = async () => {

  loading.value = true;

  const dataToUpsert = form.value.name.map(name => ({
    time: form.value.time,
    name,
  }));

  await updatePlayers('players', dataToUpsert);
  players.value = await getPlayers(JSON.parse(profileUser.value.grupo_time));

  form.value.name = [];
  
  loading.value = false;
}

const handleCopyPublicUrl = (time) => {

  const formattedTime = time.replace(/\s+/g, '_')

  const url = router.resolve({
    name: "PageJogadores",
    params: { time: formattedTime },
  }).href;
  console.log(url);
  const externalLink = window.origin + url

  copyToClipboard(externalLink)
    .then(() => {
      notifySuccess('Successfully copied')
    })
    .catch(() => {
      notifyError('Error copied link')
    })

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
  { 
    name: 'actions',
    align: 'center', 
    label: 'AÇÕES',
    field: 'AÇÕES',
  },
];

</script>