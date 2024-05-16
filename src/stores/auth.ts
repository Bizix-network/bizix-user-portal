import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  api_token: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authData: any) {
    isAuthenticated.value = true;
    user.value = authData.user;
    errors.value = {};
    console.log("setAuth - Token received:", authData.token); // Debug
    JwtService.saveToken(authData.token);
    console.log("setAuth - Token saved in localStorage:", JwtService.getToken()); // Debug
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = {};
    JwtService.destroyToken();
  }

  async function login(credentials: User) {
    try {
      const { data } = await ApiService.post("login", credentials);
      setAuth(data);
    } catch ({ response }) {
      setError(response.data.errors || { message: "Login failed" });
    }
  }

  function logout() {
    purgeAuth();
  }

  async function register(credentials: User) {
    try {
      const { data } = await ApiService.post("register", credentials);
      setAuth(data);
    } catch ({ response }) {
      setError(response.data.errors || { message: "Registration failed" });
    }
  }

  async function forgotPassword(email: string) {
    try {
      await ApiService.post("forgot_password", { email });
      setError({});
    } catch ({ response }) {
      setError(response.data.errors || { message: "Forgot password request failed" });
    }
  }

  function verifyAuth() {
    const token = JwtService.getToken();
    console.log("Token:", token); // Debug
    if (token) {
      ApiService.setHeader();
      ApiService.post("verify_token", { api_token: token })
        .then(({ data }) => {
          //setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors || { message: "Token verification failed" });
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
  };
});
