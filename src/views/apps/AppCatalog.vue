<template>
  <div class="app-catalog">
       
    <div class="filters">
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input 
          v-model="searchQuery" 
          placeholder="Caută aplicații..." 
          class="search-input"
        />
      </div>
      <select v-model="selectedCategory" class="category-select">
        <option value="">Toate categoriile</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div class="app-grid">
      <div
        v-for="app in filteredApps"
        :key="app.id"
        class="app-card"
      >
      <div class="app-card-header">
        <div class="app-icon">
          <i class="fas fa-cube app-default-icon"></i>
        </div>
        <div class="app-badge">{{ app.category }}</div>
      </div>

        <div class="app-card-content">
          <h2 class="app-title">{{ app.templateName }}</h2>
          <div class="app-version">
            <i class="fas fa-code-branch"></i>
            <span>{{ app.version }}</span>
          </div>
          <p class="app-description">{{ app.description }}</p>
        </div>

        <div class="app-card-footer">
          <button 
            type="button"
            class="btn-details"
            data-bs-toggle="modal"
            data-bs-target="#modal_app_details"
            @click="openDetailsModal(app)"
          >
            <i class="fas fa-info-circle"></i>
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
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.app-catalog-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e1e2d;
  margin-bottom: 2rem;
  text-align: center;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #5e6278;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e4e6ef;
  border-radius: 0.475rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #009ef7;
  outline: none;
}

.category-select {
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid #e4e6ef;
  border-radius: 0.475rem;
  font-size: 1rem;
  background-color: #ffffff;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.app-card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 30px rgba(0,0,0,0.1);
}

.app-card-header {
  padding: 1.5rem;
  background: linear-gradient(45deg, #f8f9fa 0%, #f1f1f4 100%);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.app-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #009ef7 0%, #0095e8 100%);
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-default-icon {
  font-size: 1.75rem;
  color: #ffffff;
}

.app-badge {
  background: #009ef7;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.app-card-content {
  padding: 1.5rem;
  flex: 1;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e1e2d;
  margin-bottom: 0.5rem;
}

.app-version {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7e8299;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.app-description {
  color: #5e6278;
  font-size: 0.875rem;
  line-height: 1.5;
}

.app-card-footer {
  padding: 1.5rem;
  border-top: 1px solid #f1f1f4;
}

.btn-details {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #009ef7;
  color: #ffffff;
  border: none;
  border-radius: 0.475rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.btn-details:hover {
  background: #0095e8;
}

@media (max-width: 768px) {
  .app-catalog {
    padding: 1rem;
  }
  
  .app-catalog-title {
    font-size: 2rem;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .search-box, 
  .category-select {
    width: 100%;
  }
}
</style>
