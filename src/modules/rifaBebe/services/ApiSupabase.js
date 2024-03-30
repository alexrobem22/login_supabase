import { useQuasar } from 'quasar'
import useSupabase from "src/boot/supabase";
import useNotify from "src/composables/UseNotify";
import UseAuthUser from "src/composables/UseAuthUser";
import { useRouter, useRoute } from "vue-router";

export default function ApiSupabaseRifaBebe() {

    const { supabase } = useSupabase();
    const { user } = UseAuthUser();
    const { notifySuccess, notifyError } = useNotify();
    const router = useRouter(); //para direcionar para onde vai
    const route = useRoute(); //aqui e pegos os paramentros da rota
    const $q = useQuasar()

    const post = async (table, form, paramsnId) => {
        try {
            const userId = paramsnId ? paramsnId : user.value.id
            const { data, error } = await supabase.from(table).insert([
            {
                ...form,
                user_id: userId,
            },
            ]);
            if (error) throw error;
            notifySuccess("Saved Successfully");
            return data;
        } catch (error) {
            console.error("Erro ao fazer post:", error.message);
            notifyError(error.message);
        }
    };
    const update = async (table, form) => {
        try {
            const { data, error } = await supabase
            .from(table)
            .update({ ...form })
            // .match( {id: form.id } ) // como o profersso fez
            .eq("id", form.id); // na documentação ta assim
            if (error) throw error;
            notifySuccess("Saved Update Successfully"); 
            return data;
        } catch (error) {
            console.error("Erro ao fazer update:", error.message);
            notifyError(error.message);
        }
    };

    return {
        post,
        update
    }
}