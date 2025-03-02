<template>
    <q-page padding>
    <!-- <pre>
{{ getResponseProfiles }}

</pre> -->
        <q-badge color="secondary" class="">
          Model: {{form.modelMultiple || '[]' }}
        </q-badge>

        <q-select
            v-model="form.modelMultiple"
            filled
            multiple
            :options="getResponseProfiles"
            use-chips
            stack-label
            option-value="id"
            option-label="email"
            map-options
            emit-value
            label="Multiple selection"
        />
        <q-badge color="secondary" class="q-mt-md text-subtitle1">
          exemplo:. pelada quarta, indepedente veterano, indepedente aberto
        </q-badge>
        <q-input v-model="form.text" outlined label="adicionar o nome do time ou dia" />

        <div class="col-12 q-my-md flex justify-end" >
            <q-btn color="secondary" label="salvar" :loading="loading"  @click="handleSave"/>
        </div>

        <div class="row q-my-md q-gutter-md">
            <div v-for="(item, index) in getResponseProfiles" :key="index">
                <q-card
                    class=" my-card "
                    style="width: 320px"
                >
                    <q-card-section>
                        <div class="text-h6">NOME: {{ item.name }}</div>
                        <div class="text-subtitle2">EMAIL: {{ item.email }}</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <div>TIME CADASTRADO:</div>
                        <ul>
                            <li v-for="(time, idx) in JSON.parse(item.grupo_time)" :key="idx">{{ time }}</li>
                        </ul>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup>

import userAuthUser from "src/composables/UseAuthUser";
import userApi from "src/composables/UseApi"
import ApiConfig from "../services/ApiConfig";
import { ref, onMounted, computed } from "vue";
import useNotify from "src/composables/UseNotify";

const { user } = userAuthUser();
const { getAllProfiles } = userApi();
const { update } = ApiConfig();
const form =ref({
text: '',
modelMultiple: []
})
const { notifySuccess, notifyError } = useNotify();

const getResponseProfiles = ref(null);
const loading = ref(false);
const table = 'profiles';

onMounted(async () => {

    const responseProfiles = await getAllProfiles();
    getResponseProfiles.value = responseProfiles;

});

const handleSave = async () => {

    if (!form.value.text || form.value.modelMultiple.length === 0) {
        notifyError("Selecione o email e o nome dos time");
        return;
    }
    loading.value = true;
    // Criar um array de objetos para salvar em massa
    const dataToUpsert = form.value.modelMultiple.map((id) => ({
        id,
        grupo_time: JSON.stringify(form.value.text.split(",").map(t => t.trim())) // Salvando como JSON
    }));

    const response = await update(table, dataToUpsert);
    getResponseProfiles.value = await getAllProfiles();

    // Resetando o formulário
    form.value.text = "";
    form.value.modelMultiple = [];
    loading.value = false;
}

</script>