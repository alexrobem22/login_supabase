import { ref } from "vue";
import useSupabase from "src/boot/supabase";
import useNotify from "./UseNotify";
import UseAuthUser from "./UseAuthUser";
import { useRouter, useRoute } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import useBrand from 'src/composables/UseBrand'
import { useQuasar } from 'quasar'

const brand = ref({
  name: "",
  phone: "",
  primary: "",
  secondary: "",
})
export default function useApi() {
  const { supabase } = useSupabase();
  const { user } = UseAuthUser();
  const { notifySuccess, notifyError } = useNotify();
  const router = useRouter(); //para direcionar para onde vai
  const route = useRoute(); //aqui e pegos os paramentros da rota
  const { setBrand } = useBrand()
  const $q = useQuasar()

  const get = async (table) => {
    try {
      const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", user.value.id);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao fazer get:", error.message);
      notifyError(error.message);
    }
  };
  const getPublic = async (table, userId, columnFilter = '', filter = '') => {
    try {
      const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .eq(columnFilter, filter)
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao fazer getPublic:", error.message);
      notifyError(error.message);
    }
  };
  const fetchCount = async (table, userId) => {
    try {
      const { data, error, count } = await supabase
      .from(table)
      .select("*", { count: 'exact'})
      .eq("user_id", userId)
      if (error) throw error;
      return {
        data,
        count
      }
    } catch (error) {
      console.error("Erro ao fazer getPublic:", error.message);
      notifyError(error.message);
    }
  };
  const getByid = async (table, id) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id);
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Erro ao fazer getByid:", error.message);
    }
  };
  const post = async (table, form, goToroute) => {
    try {
       var goRoute = goToroute ? goToroute : table
      const { data, error } = await supabase.from(table).insert([
        {
          ...form,
          user_id: user.value.id,
        },
      ]);
      if (error) throw error;
      notifySuccess("Saved Successfully");
      router.push({ name: goRoute });
      return data;
    } catch (error) {
      console.error("Erro ao fazer post:", error.message);
      notifyError(error.message);
    }
  };
  const update = async (table, form, goToroute) => {
    try {
      var goRoute = goToroute ? goToroute : table
      const { data, error } = await supabase
        .from(table)
        .update({ ...form })
        // .match( {id: form.id } ) // como o profersso fez
        .eq("id", form.id); // na documentação ta assim
      if (error) throw error;
      notifySuccess("Saved Update Successfully");
      router.push({ name: goRoute });
      return data;
    } catch (error) {
      console.error("Erro ao fazer update:", error.message);
      notifyError(error.message);
    }
  };
  const remove = async (table, id) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .match({ id: id });
      if (error) throw error;
      notifySuccess("Deleted Successfully");
      return data;
    } catch (error) {
      console.error("Erro ao fazer remove:", error.message);
      notifyError(error.message);
    }
  };
    // inserindo o file no bucket   
  const uploadImg = async (file, storage, form, imgOrParalax) => {
    try {

        const fileName = imgOrParalax == 'img' ? `img/${uuidv4()}` : `paralax/${uuidv4()}`;
        const imgParalax = imgOrParalax == 'img' ? form.path_img_url : form.path_img_url_paralax
        
        const { error } = await supabase.storage
            .from(storage)
            .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
            });

        const publicUrl = await getUrlPublic(fileName, storage); // Obtenha a URL pública
        
        if (error) throw error;// Verifique se a URL pública foi obtida com sucesso

        if(imgParalax){
            removeBucket(imgParalax, storage)
        }

        // Retorna um objeto contendo a URL pública e o nome do arquivo
        return { publicUrl, fileName};

    } catch (error) {

      console.error("Erro ao fazer uploadImg:", error.message);
      notifyError(error.message);

    }
  };
    // pegando a url no bucket   
  const getUrlPublic = async (fileName, storage) => {
    try {
      const { data, error } = supabase.storage
        .from(storage)
        .getPublicUrl(fileName);
      if (error) throw error;

      return data.publicUrl;

    } catch (error) {
      console.error("Erro ao fazer getUrlPublic:", error.message);
      notifyError(error.message);
    }
  };
    // removendo a imagem antiga do bucket para nao ficar lixo   
  const removeBucket = async (fileName, storage) => {
    try {
      const { data, error } = await supabase
        .storage
        .from(storage)
        .remove([fileName])

      if (error) throw error;

      return data

    } catch (error) {
        console.error("Erro ao fazer removeBucket:", error.message);
        notifyError(error.message);
    }

  }

  const getBrand = async () => {
    const id = route.params.id || user?.value?.id
    if (id){
      try {
        $q.loading.show()
        const { data, error } = await supabase
          .from('config')
          .select("*")
          .eq("user_id", id);
        if (error) throw error;

        if (data.length > 0){

          brand.value = data[0]
          setBrand(brand.value.primary, brand.value.secondary)
        }
        $q.loading.hide()
        return brand
      } catch (error) {
        console.error("Erro ao fazer getBrand:", error.message);
      }
    }
  }

  return {
    get,
    getPublic,
    getByid,
    post,
    update,
    remove,
    uploadImg,
    getBrand,
    brand,
    fetchCount
  };
}
