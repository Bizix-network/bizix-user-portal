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
      <div
        v-for="app in filteredApps"
        :key="app.id"
        class="app-card"
        @click="openOrderModal(app.id)"
      >
        
        <h2>{{ app.templateName }}</h2>
        <p>{{ app.version }}</p>
        <div class="app-actions">
          <router-link :to="'/app/' + app.id" class="btn btn-primary">
            Detalii
          </router-link>
            <a
            href="#"
            class="btn btn-sm fw-bold btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modal_new_order"
            >Comanda</a>
        </div>
      </div>
    </div>
  </div>

  <OrderModal :selected-app-id="selectedAppId" />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import OrderModal from "@/components/modals/forms/OrderModal.vue";
import axios from "@/plugins/axios";

interface App {
  id: string;
  templateName: string;
  version: string;
  category: string;
  image: string;
}

export default defineComponent({
  name: 'AppCatalog',
  components: {
    OrderModal,
  },
  setup() {
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const categories = ref(['CRM', 'ERP', 'Project Management', 'HR', 'Finance']);
    const apps = ref<App[]>([]);
    const selectedAppId = ref<string | null>(null);

    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/templates');
        apps.value = response.data.map((template: any) => ({
          id: template._id,
          templateName: template.templateName,
          version: template.version,
          category: template.category || 'Uncategorized',
          image: template.image || 'default_image.jpg',
        }));
      } catch (error) {
        console.error('Eroare la preluarea template-urilor:', error);
      }
    };

    const openOrderModal = (appId: string) => {
      selectedAppId.value = appId;
    };

    const filteredApps = computed(() => {
      return apps.value.filter((app) => {
        const nameMatch = app.templateName
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());
        const categoryMatch = selectedCategory.value
          ? app.category === selectedCategory.value
          : true;
        return nameMatch && categoryMatch;
      });
    });

    fetchTemplates();

    return {
      searchQuery,
      selectedCategory,
      categories,
      apps,
      selectedAppId,
      fetchTemplates,
      openOrderModal,
      filteredApps,
    };
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