import { useQuasar } from 'quasar'
import useSupabase from "src/boot/supabase";
import useNotify from "./UseNotify";
import UseAuthUser from "./UseAuthUser";
import { useRouter, useRoute } from "vue-router";

export default function ApiSupabaseRifaBebe() {

    const { supabase } = useSupabase();
    const { user } = UseAuthUser();
    const { notifySuccess, notifyError } = useNotify();
    const router = useRouter(); //para direcionar para onde vai
    const route = useRoute(); //aqui e pegos os paramentros da rota
    const $q = useQuasar()
    
    return {

    }
}