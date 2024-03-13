import { ref } from 'vue';
import useSupabase from 'src/boot/supabase';
import useNotify from './UseNotify';
import UseAuthUser from './UseAuthUser';
import { useRouter } from "vue-router";

export default function useApi () {
    const { supabase } = useSupabase()
    const { user } = UseAuthUser()
    const { notifySuccess, notifyError } = useNotify()
    const router = useRouter(); //para configurar a rota

    const get = async (table) => {
        try {
            const { data, error } = await supabase
            .from(table)
            .select('*')
            if (error) throw error;
            return data
        } catch (error) {
            console.error("Erro ao fazer get:", error.message);
            notifyError(error.message)
        }
    }
    const getByid = async (table, id) => {
        try {
            const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            if (error) throw error;
            return data[0]
        } catch (error) {
            console.error("Erro ao fazer getByid:", error.message);
        }
    }
    const post = async (table, form) => {
        try {
            const { data, error } = await supabase
            .from(table)
            .insert([{
                ...form,
                user_id: user.value.id
            }])
            if (error) throw error;
            notifySuccess('Saved Successfully')
            router.push({ name: table})
            return data
        } catch (error) {
            console.error("Erro ao fazer post:", error.message);
            notifyError(error.message)
        }
           
    }
    const update = async (table, form) => {
        try {
            const { data, error } = await supabase
            .from(table)
            .update({ ...form })
            // .match( {id: form.id } ) // como o profersso fez 
            .eq( 'id', form.id  ) // na documentação ta assim 
            if (error) throw error;
            notifySuccess('Saved Update Successfully')
            router.push({ name: table})
            return data
        } catch (error) {
            console.error("Erro ao fazer update:", error.message);
            notifyError(error.message)
        }
    }
    const remove = async (table, id) => {
        try {
            const { data, error } = await supabase
            .from(table)
            .delete()
            .match({ id: id })
            if (error) throw error;
            notifySuccess('Deleted Successfully')
            return data
        } catch (error) {
            console.error("Erro ao fazer remove:", error.message);
            notifyError(error.message)
        }
    }

    return{
        get,
        getByid,
        post,
        update,
        remove
    }
}