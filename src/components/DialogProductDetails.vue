<template>
    <!-- :full-width="$q.platform.is.mobile" so funciona se tiver no mobile -->
    <!-- @before-hide e um evento que e acionando quando eu vou fechar o modal -->
        <q-dialog 
            :full-width="$q.platform.is.mobile"
            :model-value="show"
            @before-hide="handleClose"
        >
            <q-card>
              <q-card-section>
                <div class="text-h6">Details</div>
              </q-card-section>
      
              <q-card-section class="q-pt-none">
               <q-img :src="product.img_url" :ratio="4/4" style="min-width: 300px;"/>
              </q-card-section>

              <q-card-section>
                <div class="text-h6">
                    {{ product.name }}
                </div>
              </q-card-section>

              <q-card-section>
                <div class="text-h6">
                    {{ formatCurrency(product.price) }}
                </div>
                <!-- to usando o v-html pq tem varias formataçao do texto e o v-html ja compila isso -->
                <div class="text-body2" v-html="product.description"/>
              </q-card-section>
      
              <q-card-actions align="right">
                <q-btn 
                    v-close-popup 
                    outline
                    label="Cancel" 
                    color="primary" 
                />

                <q-btn  
                  v-if="brand.phone"
                  label="BUY ON WHATSAPP" 
                  color="green-7" 
                  icon="mdi-whatsapp"
                  @click="handleSendWpp"
                />
              </q-card-actions>
            </q-card>
        </q-dialog>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
import useApi from "src/composables/UseApi";
  //useRouter -> aqui e onde eu direciono paras as rotas que eu quero
  //useRoute -> aqui eu pego os dado da rota que eu tou no momento
import { useRouter, useRoute } from "vue-router";
import { formatCurrency } from 'src/utils/format'
import { useQuasar, openURL } from 'quasar'

export default defineComponent({
  name: "DialogProductDetails",
  props: {
    product: {
        type: Object
    },
    show: {
        type: Boolean,
        required: true
    }
    
  },
  setup(props, { emit }) {

    const router = useRouter(); //para configurar a rota
    const route = useRoute() //pega os dados da minha rota atual
    const { brand } = useApi(); //pega o metodo login

    const filter = ref('')
    const $q = useQuasar()

    const phone = brand.value.phone
    const msg = 'Olá, fiquei interressado no produto'

    // aqui vou criar um logica para emit o resultado para o pai
    const handleClose = () => {
        emit('hideDialog')
    }

    const handleSendWpp = () => {
        const link = encodeURI(`https://api.whatsapp.com/send?55${phone}&text=${msg} - ${props.product.name} - ${props.product.price}`)
        // openURL e um facilitador para abrir minha url em outra pagina
        openURL(link) 
    }

    return {
        formatCurrency,
        handleClose,
        handleSendWpp,
        brand
    };
  },
});
</script>
<style scoped>

</style>