import { Notify } from "quasar";
export default function useNotify() {
  const notifySuccess = (message) => {
    Notify.create({
      position: "top",
      type: "positive",
      message: message || "All right !",
      timeout: 2000,
    });
  };

  const notifyError = (message) => {
    Notify.create({
      position: "top",
      type: "negative",
      message: message || "Falid",
      timeout: 2000,
    });
  };

  return {
    notifySuccess,
    notifyError,
  };
}
