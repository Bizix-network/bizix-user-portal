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
      <div v-for="app in filteredApps" :key="app._id" class="app-card">
        <h2>{{ app.templateName }}</h2>
        <p>{{ app.version }}</p>
        <p><router-link :to="`/app/${app._id}`">Detalii</router-link></p>
      <p><a
          href="#"
          class="btn btn-sm fw-bold btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modal_new_order"
          >Comanda</a
        >
      </p>
      </div>
    </div>
  </div>


  <AddCustomerModal></AddCustomerModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AddCustomerModal from "@/components/modals/forms/AddCustomerModal.vue";
import { getIllustrationsPath } from "@/core/helpers/assets";
import axios from 'axios';

export default defineComponent({
  name: "getting-started",
  components: {
    AddCustomerModal,
  },
  setup() {
    return {
      getIllustrationsPath, // Presupunând că ai nevoie de asta în continuare
    };
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      categories: ['CRM', 'ERP', 'Project Management', 'HR', 'Finance'],
      apps: [],
    };
  },
  computed: {
    filteredApps() {
      return this.apps.filter(app => {
        return (
          app.templateName.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          (this.selectedCategory ? app.category === this.selectedCategory : true)
        );
      });
    },
  },
  methods: {
    async fetchTemplates() {
      try {
        const response = await axios.get('/api/templates');
        this.apps = response.data.map(template => ({
          _id: template._id,
          templateName: template.templateName,
          version: template.version,
          category: template.category || 'Uncategorized',
          image: 'link_catre_imagine_standard', 
        }));
      } catch (error) {
        console.error('Eroare la preluarea template-urilor:', error);
      }
    },
  },
  created() {
    this.fetchTemplates();
  },
});
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