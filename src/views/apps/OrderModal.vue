<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal">
        <h2>Inițiază Comanda pentru {{ app.templateName }}</h2>
        <form @submit.prevent="submitOrder">
          <div>
            <label for="companyName">Nume Companie</label>
            <input type="text" v-model="companyName" required />
          </div>
          <div>
            <label for="expiresAt">Data Expirării</label>
            <input type="date" v-model="expiresAt" required />
          </div>
          <div>
            <label for="node">Nod</label>
            <input type="text" v-model="node" required />
          </div>
          <button type="submit">Trimite Comanda</button>
          <button type="button" @click="close">Anulează</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      app: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        companyName: '',
        expiresAt: '',
        node: ''
      };
    },
    methods: {
      close() {
        this.$emit('close');
      },
      submitOrder() {
        const orderDetails = {
          userId: this.$store.state.user.id, // Presupunem că userId-ul este stocat în state-ul Vuex
          templateId: this.app._id,
          companyName: this.companyName,
          expiresAt: this.expiresAt,
          node: this.node,
          vmName: this.app.templateName,
          vmVersion: this.app.version
        };
        this.$emit('submit', orderDetails);
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Asigură-te că modalul este deasupra altor elemente */
  }
  .modal {
    display: flex;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  </style>