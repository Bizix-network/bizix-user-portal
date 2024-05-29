<template>
  <div class="profile">
    <h1>Profilul Utilizatorului</h1>
    <form @submit.prevent="updateProfile">
      <div>
        <label>Prenume</label>
        <input v-model="profile.firstName" type="text" />
      </div>
      <div>
        <label>Nume</label>
        <input v-model="profile.lastName" type="text" />
      </div>
      <div>
        <label>Adresă</label>
        <input v-model="profile.address" type="text" />
      </div>
      <div>
        <label>Oraș</label>
        <input v-model="profile.city" type="text" />
      </div>
      <div>
        <label>Județ</label>
        <input v-model="profile.state" type="text" />
      </div>
      <div>
        <label>Cod Poștal</label>
        <input v-model="profile.zip" type="text" />
      </div>
      <div>
        <label>Țară</label>
        <input v-model="profile.country" type="text" />
      </div>
      <div>
        <label>Telefon</label>
        <input v-model="profile.phone" type="text" />
      </div>
      <div>
        <label>Monedă</label>
        <input v-model="profile.currency" type="text" />
      </div>
      <button type="submit">Actualizează Profilul</button>
    </form>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  data() {
    return {
      profile: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        currency: 'RON'
      }
    };
  },
  methods: {
    async updateProfile() {
      try {
        const response = await axios.put('/users/profile', this.profile, {
          headers: {
            Authorization: `Bearer ${this.getToken()}` // Presupunem că există o funcție getToken() care returnează token-ul JWT
          }
        });
        alert('Profil actualizat cu succes!');
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('A apărut o eroare la actualizarea profilului.');
      }
    },
    getToken() {
      // Implementați logica pentru a obține token-ul JWT (de exemplu, din localStorage)
      return localStorage.getItem('token');
    }
  },
  created() {
    // Presupunem că există un endpoint pentru a obține datele de profil ale utilizatorului
    axios.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }).then(response => {
      this.profile = response.data.billing;
    }).catch(error => {
      console.error('Failed to fetch profile data:', error);
    });
  }
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.profile h1 {
  margin-bottom: 20px;
}
.profile form div {
  margin-bottom: 10px;
}
.profile form label {
  display: block;
  margin-bottom: 5px;
}
.profile form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.profile form button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>