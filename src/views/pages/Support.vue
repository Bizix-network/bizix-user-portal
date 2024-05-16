<template>
    <div class="support-page">
      <h1>Suport</h1>
      <div class="support-sections">
        <section>
          <h2>Documentație</h2>
          <p>Găsește răspunsuri rapide și detalii tehnice în documentația noastră completă.</p>
          <router-link to="/documentation">Accesează documentația</router-link>
        </section>
        <section>
          <h2>FAQ</h2>
          <p>Consultați întrebările frecvente pentru a găsi rapid răspunsuri la cele mai comune probleme.</p>
          <router-link to="/faq">Vizualizează FAQ</router-link>
        </section>
        <section>
          <h2>Contact Asistență</h2>
          <p>Ai nevoie de ajutor suplimentar? Contactează echipa noastră de suport.</p>
          <form @submit.prevent="submitSupportRequest">
            <div>
              <label for="name">Nume</label>
              <input type="text" id="name" v-model="name" required />
            </div>
            <div>
              <label for="email">Email</label>
              <input type="email" id="email" v-model="email" required />
            </div>
            <div>
              <label for="message">Mesaj</label>
              <textarea id="message" v-model="message" required></textarea>
            </div>
            <button type="submit">Trimite</button>
          </form>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        message: ''
      };
    },
    methods: {
      submitSupportRequest() {
        // Trimite cererea de suport
        const supportRequest = {
          name: this.name,
          email: this.email,
          message: this.message
        };
        // Trimite request-ul la backend (API)
        console.log('Support request submitted:', supportRequest);
        alert('Cererea ta a fost trimisă. Te vom contacta în curând.');
        // Resetează formularul
        this.name = '';
        this.email = '';
        this.message = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .support-page {
    padding: 20px;
  }
  .support-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  form div {
    margin-bottom: 10px;
  }
  form label {
    display: block;
    margin-bottom: 5px;
  }
  form input, form textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  form button {
    padding: 10px 15px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  </style>
  