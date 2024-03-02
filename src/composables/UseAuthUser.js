import { ref } from "vue";
import useSupabase from "src/boot/supabase";
import useNotify from "./UseNotify";

const user = ref(null);

export default function useAuthUser() {
  const { supabase } = useSupabase();
  const { notifySuccess, notifyError } = useNotify();
  // fazendo o login
  const login = async ({ email, password }) => {
    try {
      console.log("login", email, password);
      const { user, error, status } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      // const { user, error, status } = await supabase.auth.signInWithOtp({ email: email }) //fazer login so com email
      if (error) throw error;
      notifySuccess("login success");
      return user;
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      notifyError(error.message);
      // throw new Error('Ocorreu um erro ao fazer login. Por favor, tente novamente.')
    }
  };

  // fazer login com redes social
  const loginWithSocialProvider = async (provider) => {
    try {
      const { user, error, status } = await supabase.auth.signIn({ provider });
      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Erro ao fazer login Social:", error);
      throw new Error(
        "Ocorreu um erro ao fazer login Social. Por favor, tente novamente."
      );
    }
  };

  // delogar da aplicação
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw new Error(
        "Ocorreu um erro ao fazer logout. Por favor, tente novamente."
      );
    }
  };

  // aqui e pra saber se o usuario ta logado
  const isLoggedIn = () => {
    return user.value;
  };

  // registrar o usuario
  const register = async ({ name, email, password, ...meta }) => {
    try {
      console.log("cheguei", name, email, password);
      // console.log('supabase', supabase.auth.signUp())

      // const { user, error, status } = await supabase.auth.signUp({ email: email, password: password });
      const { user, error, status } = await supabase.auth.signUp(
        { email: email, password: password },
        {
          data: meta,
          redirectTo: `${window.location.origin}/me?fromEmail=registrationConfirmation`,
        }
      );
      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Erro ao fazer register:", error);
      throw new Error(
        "Ocorreu um erro ao fazer register. Por favor, tente novamente."
      );
    }
  };

  // fazer update
  const update = async (data) => {
    try {
      const { user, error, status } = await supabase.auth.update(data);
      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Erro ao fazer update:", error);
      throw new Error(
        "Ocorreu um erro ao fazer update. Por favor, tente novamente."
      );
    }
  };

  // resetar senha
  const sendPassowrdRestEmail = async (email) => {
    try {
      const { user, error, status } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: "http://localhost:9001/reset-password" }
      );

      if (error) throw error; //essa linha serve para eu jogar para o CATCH o error
      notifySuccess("resend email success");
      return user;
    } catch (error) {
      console.error("Erro ao fazer o resete da senha:", error);
      notifyError(error.message);
      // throw new Error('Ocorreu um erro ao fazer resete. Por favor, tente novamente.')
    }
  };

  const resetPassword = async (accessToken, new_Password) => {
    try {
      const { user, error, status } = await supabase.auth.updateUser(
        accessToken,
        {
          password: new_Password,
        }
      );
      if (error) throw error;
      notifySuccess("password accomplished success");
      return user;
    } catch (error) {
      console.error("Erro ao fazer o resete da senha:", error);
      notifyError(error.message);
      // throw new Error('Ocorreu um erro ao fazer resete. Por favor, tente novamente.')
    }
  };

  return {
    user,
    login,
    loginWithSocialProvider,
    logout,
    isLoggedIn,
    register,
    update,
    sendPassowrdRestEmail,
    resetPassword,
  };
}
