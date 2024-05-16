<template>
    <div class="app-catalog">
      <h1>Catalog Aplicații</h1>
      <div class="filters">
        <input v-model="searchQuery" placeholder="Caută aplicații..." />
        <select v-model="selectedCategory">
          <option value="">Toate categoriile</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="app-list">
        <div v-for="app in filteredApps" :key="app.id" class="app-card">
          <img :src="app.image" alt="App image" />
          <h2>{{ app.name }}</h2>
          <p>{{ app.description }}</p>
          <router-link :to="`/app/${app.id}`">Detalii</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
        selectedCategory: '',
        categories: ['CRM', 'ERP', 'Project Management', 'HR', 'Finance'],
        apps: [
          { id: 1, name: 'CRM Pro', description: 'Unelte avansate de gestionare a relațiilor cu clienții.', image: 'link_catre_imagine_crm_pro', category: 'CRM' },
          { id: 2, name: 'ERP Plus', description: 'Soluție completă de planificare a resurselor întreprinderii.', image: 'link_catre_imagine_erp_plus', category: 'ERP' },
          // Adaugă mai multe aplicații după necesități
        ],
      };
    },
    computed: {
      filteredApps() {
        return this.apps.filter(app => {
          return (
            app.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
            (this.selectedCategory ? app.category === this.selectedCategory : true)
          );
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .app-catalog {
    padding: 20px;
  }
  .filters {
    margin-bottom: 20px;
  }
  .app-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .app-card {
    border: 1px solid #ddd;
    padding: 20px;
    width: 200px;
    text-align: center;
  }
  </style>
  