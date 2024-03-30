<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">CHÁ RIFA DE FRALDA</p>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12">
        <q-stepper
          ref="stepper"
          v-model="step"
          header-nav
          :contracted="$q.platform.is.mobile"
          :alternative-labels="$q.platform.is.mobile"
          color="primary"
          animated
        >
          <q-step :name="1" title="Configurar" icon="mdi-cog" :done="step > 1">
           
            <div class="q-gutter-md">
              <!-- <q-input
                v-model="imgFundo"
                label="Imagem Fundo"
                stack-label
                type="file"
                accept="image/*"
                @update:model-value="imgUpload"
              /> -->
              <q-file 
                v-model="imgFundo" 
                label="Imagem Fundo" 
                filled 
                accept="image/*"
                @update:model-value="imgUpload"
              />

              <q-img
                v-if="form.img_url_rifaBebe"
                label="oi"
                :src="form.img_url_rifaBebe"
                spinner-color="white"
                style="height: 200px; max-width: 300px"
                >
                <div class="absolute-top text-center">
                  {{ form.nameImg }}
                </div>
              </q-img>

              <q-input
                v-model="form.name"
                label="Titulo"
                :rules="[
                  (val) =>
                    (val && val.length >= 3) ||
                    'requires more than 3 characters',
                ]"
              />

              <q-input
                v-model.number="form.quantidadeNumero"
                label="Quantidade de numeros da Rifa"
                type="number"
                filled
                style="max-width: 250px"
              />

              <q-date v-model="form.date" mask="YYYY-MM-DD" />

              <q-card bordered>
                <q-card-section>
                  <div class="text-h6 text-center">
                    Escola o numero e o tamanho da frauda
                  </div>
                </q-card-section>

                <q-card-section
                  v-for="(item, index ) in form.fralda"
                  :key="index"
                  class="flex q-gutter-sm"
                >
                  <q-input
                    v-model.number="item.de"
                    label="De"
                    type="number"
                    filled
                    style="max-width: 250px"
                  />

                  <q-input
                    v-model.number="item.ate"
                    label="Ate"
                    type="number"
                    filled
                    style="max-width: 250px"
                  />

                  <q-input
                    v-model="item.tamanho"
                    label="Tamanho da fralda"
                  />
                </q-card-section>
              </q-card>
            </div>
            <pre>
                <!-- {{ form }} -->
              </pre
            >
          </q-step>

          <q-step
            :name="2"
            title="Visualizar"
            icon="visibility"
            :done="step > 2"
          >

            <public-rifa-bebe
              :form="form"
            />

          </q-step>

          <q-step :name="3" title="Create an ad" icon="share">
            <q-btn
            label="Copy Link"
            dense
            outiline
            class="q-ml-sm"
            icon="mdi-content-copy"
            color="primary"
            @click="handleCopyPublicUrl"
          />
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation align="right">
              <q-btn
                color="primary"
                :label="step === 3 ? 'Finish' : 'Continue'"
                :loading="load"
                @click="hendleSubimit(step, $refs.stepper)"
              />
              <q-btn
                v-if="step > 1"
                flat
                color="primary"
                label="Back"
                class="q-ml-sm"
                :loading="load"
                @click="hendleBack(step, $refs.stepper)"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useQuasar, openURL, copyToClipboard } from "quasar";
import useApi from "src/composables/UseApi";
import ApiSupabase from "../services/ApiSupabase";
import PublicRifaBebe from "./PublicRifaBebe.vue";
import UserAuthUser from 'src/composables/UseAuthUser'
import { useRouter, useRoute } from "vue-router";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageFormConfigRifa",
  components: {
    PublicRifaBebe
  },
  setup() {
    const step = ref(1);
    const $q = useQuasar();
    const { get, uploadImg } = useApi();
    const { post, update } = ApiSupabase();
    const { user } = UserAuthUser()
    const router = useRouter(); //para configurar a rota
    const route = useRoute() //pega os dados da minha rota atual
    const { notifySuccess, notifyError } = useNotify();

    const load = ref(false);
    // const currentDate = new Date().toISOString().substr(0, 10);
    const currentDate = new Date().toISOString().substr(0, 10);
    const numeros = ref([1, 2, 3, 4, 5]);
    const table = "configRifaBebe";

    const form = ref({
      name: "",
      date: currentDate,
      quantidadeNumero: "",
      nameImg: '',
      img_url_rifaBebe: "",
      path_img_url: "",
      fralda: [],
    });

    const imgFundo = ref([]);
    var config = {};

    onMounted(() => {
      handleGetConfig();
    });

    const handleGetConfig = async () => {
      config = await get(table);
      if (config.length > 0) {
        form.value = config[0];
        if(!form.value.fralda){
          form.value.fralda = [
            {de: '', ate: '', tamanho: ''},
            {de: '', ate: '', tamanho: ''},
            {de: '', ate: '', tamanho: ''},
            {de: '', ate: '', tamanho: ''},
            {de: '', ate: '', tamanho: ''},
          ]
        }
      }
    };

    const imgUpload = async () => {

      if (imgFundo.value) {
        const imgUrl = await uploadImg(
          imgFundo.value,
          "configImg",
          form.value,
          "img"
        );
        form.value.nameImg = imgFundo.value.name;
        form.value.img_url_rifaBebe = imgUrl.publicUrl;
        form.value.path_img_url = imgUrl.fileName;
      }

      if (form.value.id) {
        await update(table, form.value);
      } else {
        await post(table, form.value);
      }
        

    }
    const hendleSubimit = async (valueStep, stepper) => {
      load.value = true;

      if ((valueStep = 2)) {

        if (form.value.id) {
          await update(table, form.value);
        } else {
          await post(table, form.value);
        }

        // Simulação de um atraso de 1 segundo para demonstração
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      load.value = false;

      // Avançar para a próxima etapa após o processamento
      stepper.next();
    };

    const hendleBack = async (valueStep, stepper) => {

      stepper.previous();
    };

    const handleCopyPublicUrl = () => {
      const idUser = user.value.id;

      const url = router.resolve({
        name: "PageRifaBebe",
        params: { id: idUser },
      }).href;

      const externalLink = window.origin + url

      copyToClipboard(externalLink)
        .then(() => {
          notifySuccess('Successfully copied')
        })
        .catch(() => {
          notifyError('Error copied link')
        })

    }

    return {
      step,
      form,
      imgFundo,
      numeros,
      load,
      hendleSubimit,
      hendleBack,
      imgUpload,
      handleCopyPublicUrl,
    };
  },
});
</script>

<style>
.borda {
  border: 1px solid red;
}

.q-stepper__label {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 5px !important;
}
</style>