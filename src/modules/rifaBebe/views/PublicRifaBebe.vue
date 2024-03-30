<template>
  <q-page padding class="img-Fundo" :style="{ backgroundImage: `url(${configRifaBebe.img_url_rifaBebe})`}"> 
    <div class="row">
      <div class="col-12 text-center text-h4" color="red-10">
        {{ configRifaBebe.name }}
      </div>

    </div>

    <div class="row q-my-lg flex flex-center">
      <div class="col-md-8 col-xs-12 q-gutter-xs flex flex-center">
        <div 
          v-for="(numero, index) in configRifaBebe.quantidadeNumero" 
          :key="index" 
          class="number cursor-pointer" 
        > 

          <div v-if="itemIsInRifaConfirm(numero)" class="preenchido">
            ok
          </div>
          <div v-else @click="handleModal(numero)">
            {{ numero }}
          </div>

        </div>

      </div>
    </div>
    <div class="row q-my-lg flex flex-center">
      <div v-for="(item, index) in configRifaBebe.fralda" :key="index" class="col-12 flex flex-center">
        <div v-if="item.de" class="col-12 flex flex-center">
          <p>De: {{item.de}} <q-icon name="mdi-arrow-right-bold-outline" /></p>  <p class="q-mx-md">Ate: {{item.ate}} <q-icon name="mdi-arrow-right-bold-outline"/> </p>  <p>Tamanho: {{item.tamanho}}</p>
        </div>
      </div>
    </div>

      <q-dialog ref="dialogRef" v-model="card" >
        <q-card class="my-card" style="width: 340px;">
          <div class="col-12 text-center text-h5 ">
            Prencha os dados
          </div>
          <div class="col-12 text-center text-caption text-blue-grey">
            Voce Esconlheu o <strong class="text-green-5">NUMERO: {{ formCard.number }} TAMANHO: {{formCard.diaperSize}}</strong>
          </div>
          <q-card-section class="q-pt-none">
            <q-input 
              ref="refsName"
              v-model="formCard.name"
              label="Seu Nome"
              :rules="[(val) => (val && val.length >= 3) || 'requires more than 3 characters']"
            />

            <q-input 
              ref="refsPhone"
              v-model="formCard.phone"
              label="Telefone Whatsapp"
              mask="(##)#####-####"
              unmasked-value
              :rules="[(val) => (val && val.length > 10) || 'Please set value to maximum 11']"
            />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle1">
              Deixe sua nota sobre a rifa
            </div>
            <q-rating v-model="formCard.stars" :max="5" size="32px" />
          </q-card-section>
  
          <q-separator />
  
          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" label="VOLTAR" />
            <q-btn flat color="primary" label="CONFIRMA" @click="handleConfirm($refs.dialogRef)"/>
          </q-card-actions>
          {{ formCard }}
        </q-card>
      </q-dialog>
  </q-page>
</template>
  
<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import useApi from "src/composables/UseApi";
import UserAuthUser from 'src/composables/UseAuthUser'
  //useRouter -> aqui e onde eu direciono paras as rotas que eu quero
  //useRoute -> aqui eu pego os dado da rota que eu tou no momento
import { useRouter, useRoute } from "vue-router";
import ApiSupabase from "../services/ApiSupabase";


export default defineComponent({
  name: "PublicRifaBebe",
  props:{
    form: {
      type:Object,
      required: false,
      default: () => ({}) // Fornecendo um objeto vazio como valor padrão
    }
  },

  setup(props){
    const router = useRouter(); //para configurar a rota
    const route = useRoute() //pega os dados da minha rota atual
    const { user } = UserAuthUser()
    const { getPublic } = useApi(); //pega o metodo login
    const { post, update } = ApiSupabase();

    const table = 'configRifaBebe'
    const tableConfirm = 'rifaConfirm'
    const configRifaBebe = ref([])
    const card = ref(false)
    const formCard = ref({
      name: '',
      phone: '',
      stars: 0,
      number: '',
      diaperSize: ''
    })
    const rifaConfirm = ref([])

    const refsName = ref(null)
    const refsPhone = ref(null)

    onMounted(() => {
      if (route.params.id && !!props.form){

        handleGet(route.params.id)
      }

      configRifaBebe.value = props.form
    });

    const handleGet = async (userId) => {
      const result = await getPublic(table, userId)
      configRifaBebe.value = result[0]

      const result1 = await getPublic(tableConfirm, route.params.id)
      rifaConfirm.value = result1

    }
    const handleModal = async (numero) => {

      formCard.value.number = numero

      formCard.value.diaperSize = handleTamanhoFralda(numero)
      card.value = true
    }

    const handleTamanhoFralda = (numero) => {
      let tamanhoFralda = ""; // Inicializa a variável para armazenar o tamanho da fralda

      // Itera sobre o array fralda para encontrar o tamanho apropriado
      for (const item of configRifaBebe.value.fralda) {
        // Verifica se o número está dentro do intervalo especificado por 'de' e 'ate'
        if (numero >= item.de && numero <= item.ate) {
          tamanhoFralda = item.tamanho; // Atribui o tamanho da fralda correspondente
          break; // Sai do loop assim que o tamanho é encontrado
        }
      }

      return tamanhoFralda; // Retorna o tamanho da fralda
    }

    const handleConfirm = async (ref) => {

      
      if( await rules()){
        await post(tableConfirm, formCard.value, route.params.id)

        const result = await getPublic(tableConfirm, route.params.id)
        rifaConfirm.value  = result

        ref.hide()
        formCard.value = {
          name: '',
          phone: '',
          stars: 0,
          number: '',
          diaperSize: ''
        }
      }

    }

    const rules = async () => {

      refsName.value.validate()
      refsPhone.value.validate()

      if (refsName.value.hasError || refsPhone.value.hasError) {
          // form has error
          return false
        }

      return true
    }

  
      const itemIsInRifaConfirm = (numero) => {
        return rifaConfirm.value.some(item => item.number === numero)
      }
  
    return {
      configRifaBebe,
      rifaConfirm,
      card,
      formCard,
      refsName,
      refsPhone,
      handleModal,
      handleConfirm,
      itemIsInRifaConfirm
    }
  }
});
</script>

<style>
.img-Fundo{
  width: 100% !important; /* largura total da tela */
  height: 100vh !important; /* altura total da tela */
  background-repeat: no-repeat !important;/*para nao repetir*/
  background-size: cover !important;/*tenta deixar a imagem na melhor forma ou uso o auto  */
  background-position: center center !important;/*o primeiro paramentro posso passar letf,top etc para direcionar a imagem*/
}

.border {
  border: 1px solid red;
  height: max-content;
}
.number{
  width: 30px;
  height: 30px;
  background-color: rgba(0, 0, 255, 0.363);
  display: flex;
  justify-content: center;
  align-items: center;
}
.preenchido{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
}


</style>