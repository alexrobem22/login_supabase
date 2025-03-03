import useNotify from "src/composables/UseNotify";
import UseAuthUser from "src/composables/UseAuthUser";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from 'quasar'
import useSupabase from "src/boot/supabase";

export default function ApiFutebol() {

    const { supabase } = useSupabase();
    const { user } = UseAuthUser();
    const { notifySuccess, notifyError } = useNotify();
    const router = useRouter(); //para direcionar para onde vai
    const route = useRoute(); //aqui e pegos os paramentros da rota
    const $q = useQuasar()

    const updatePlayers = async (table, form) => {
        try {
            // Enviando tudo de uma vez para o banco
            const { data, error } = await supabase
            .from(table)
            .upsert(form)
            .select();

            if (error) throw error;
            notifySuccess("Saved Update Successfully"); 

            return data;
        } catch (error) {
            console.error("Erro ao fazer update:", error.message);
            notifyError(error.message);
        }
    };

    const getPlayers = async (timesArray = null) => {
        try {

            let query = supabase.from('players').select('*');

            if (timesArray){
                query = query.in('time', timesArray);
            } 
            
            const { data, error } = await query;

            if (error) {
                throw error; // Lançar o erro caso exista
            }

            return data; 
        } catch (error) {
        console.error('Erro ao obter o getPlayers:', error);
        return null;
        }

    }

    return {
        updatePlayers,
        getPlayers
    }

}