import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import JwtService from "@/core/services/JwtService";
import router from '@/router';

// Creează o instanță Axios
const instance = axios.create({
  baseURL: 'https://api.bizix.ro/api', // Schimbă baza URL-ului după cum este necesar
});

// Adaugă un interceptor pentru a include token-ul JWT în antet
instance.interceptors.request.use(
  config => {
    const token = JwtService.getToken();
    //const token = authStore.token; // Presupunem că token-ul este stocat în store-ul Vuex
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Adaugă un interceptor pentru răspunsuri
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Token expirat - cod 401
      if (error.response.status === 401) {
        const authStore = useAuthStore();
        authStore.logout();
        router.push('/sign-in');
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
