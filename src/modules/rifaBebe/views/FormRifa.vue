<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">RIFA DE FRALDA</p>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 ">
        <q-stepper  
            ref="stepper"
            v-model="step" 
            header-nav
            :contracted="$q.platform.is.mobile"
            :alternative-labels="$q.platform.is.mobile"
            color="primary" 
            animated
        >
        
          <q-step
            :name="1"
            title="Configurar"
            icon="mdi-cog"
            :done="step > 1"
          >

            <q-input 
                v-model="form.name"
                label="Titulo"
                :rules="[(val) => (val && val.length >= 3) || 'requires more than 3 characters']"
            />

            <q-input
                v-model.number="model"
                label="Quantidade de numeros da Rifa"
                type="number"
                filled
                style="max-width: 250px"
            />

            <q-date 
                v-model="form.date"
                mask="YYYY-MM-DD" 
            />
        {{ form.date }}
          </q-step>

          <q-step
            :name="2"
            title="Visualizar"
            icon="visibility"
            :done="step > 2"
            
          >

            An ad group contains one or more ads which target a shared set of
            keywords.

          </q-step>

          <q-step 
            :name="3" 
            title="Create an ad" 
            icon="share"
          >

            Try out different ad text to see what brings in the most customers,
            and learn how to enhance your ads using features like ad extensions.
            If you run into any problems with your ads, find out how to tell if
            they're running and how to resolve approval issues.

          </q-step>

          <template v-slot:navigation >
            <q-stepper-navigation align="right">
              <q-btn
                color="primary"
                :label="step === 3 ? 'Finish' : 'Continue'"
                @click="$refs.stepper.next()"
              />
              <q-btn
                v-if="step > 1"
                flat
                color="primary"
                label="Back"
                class="q-ml-sm"
                @click="$refs.stepper.previous()"
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
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageFormConfigRifa",
  components: {},
  setup() {

    const step = ref(1)
    const $q = useQuasar();
    // const currentDate = new Date().toISOString().substr(0, 10);
    const currentDate = new Date().toISOString().substr(0, 10);

    const form = ref({
        name: '',
        date: currentDate
    })

    return {
      step,
      form,
    };
  },
});
</script>

<style>
.borda{
    border: 1px solid red;
}

.q-stepper__label{
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 5px !important;
}

</style>