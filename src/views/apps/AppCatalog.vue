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
      >
        <h2>{{ app.templateName }}</h2>
        <p>{{ app.version }}</p>
        <p>{{ app.description }}</p>
        <div class="app-actions">
          <button 
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modal_app_details"
            @click="openDetailsModal(app)"
          >
            Detalii
          </button>
          
         
        </div>
      </div>
    </div>
  </div>
  <DetailsModal 
      :selected-app-id="selectedAppId"
      @open-order="handleOpenOrder"
    />
    <OrderModal
      :selected-app-id="selectedAppId"
      :selected-app-template-name="selectedAppTemplateName"
      :selected-app-version="selectedAppVersion"
    />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import OrderModal from "@/components/modals/forms/OrderModal.vue";
import DetailsModal from "@/components/modals/forms/DetailsModal.vue";
import axios from "@/plugins/axios";

interface App {
  id: string;
  templateName: string;
  version: string;
  category: string;
  image: string;
  description: string;
}

export default defineComponent({
  name: 'AppCatalog',
  components: {
    OrderModal,
    DetailsModal,
  },
  setup() {
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const categories = ref(['CRM', 'ERP', 'Project Management', 'HR', 'Finance']);
    const apps = ref<App[]>([]);
    const selectedAppId = ref<string>('');
    const selectedAppTemplateName = ref('');
    const selectedAppVersion = ref('');

    const openDetailsModal = (app: App) => {
      selectedAppId.value = app.id;
    };

    const handleOpenOrder = (data: { id: string; templateName: string; version: string }) => {
      selectedAppId.value = data.id;
      selectedAppTemplateName.value = data.templateName;
      selectedAppVersion.value = data.version;
    };

    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/templates');
        apps.value = response.data.map((template: any) => ({
          id: template._id,
          templateName: template.templateName,
          description: template.description,
          version: template.version,
          category: template.category || 'Uncategorized',
          image: template.image || 'default_image.jpg',
        }));
      } catch (error) {
        console.error('Eroare la preluarea template-urilor:', error);
      }
    };

    const openOrderModal = (app: App, event: Event) => {
      event.preventDefault();
      console.log('Valori setate:', {
          id: app.id,
          name: app.templateName,
          version: app.version
      });
      selectedAppId.value = app.id;
      selectedAppTemplateName.value = app.templateName;
      selectedAppVersion.value = app.version;
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
      selectedAppTemplateName,
      selectedAppVersion,
      openDetailsModal,
      handleOpenOrder,
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
