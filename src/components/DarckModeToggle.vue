<template>
  <q-toggle
    v-model="darkMode"
    checked-icon="mdi-weather-night"
    color="green"
    unchecked-icon="mdi-white-balance-sunny"
    size="lg"
  />
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";
import { useQuasar } from 'quasar'

export default defineComponent({
  name: "DarckModeToggle",

  setup() {

    const $q = useQuasar()

    const darkMode = ref(false);

    watch(darkMode, (darkMode) => {
        // set status
        $q.dark.set(darkMode) // or false or "auto"
        $q.localStorage.set('darkMode', darkMode)
    })

    onMounted(() => {
        const darkModeIsActive = $q.localStorage.getItem('darkMode')
        if(darkModeIsActive){
            darkMode.value = true
        }
        
    })
    return {
      darkMode,
    };
  },
});
</script>
