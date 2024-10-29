<template>
    <div class="modal fade" id="modal_app_details" ref="detailsModalRef" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered mw-650px">
        <div class="modal-content">
          <div class="modal-header" id="modal_app_details_header">
            <h2 class="fw-bold">Detalii Aplicație</h2>
            <div id="modal_app_details_close" data-bs-dismiss="modal" class="btn btn-icon btn-sm btn-active-icon-primary">
              <span class="svg-icon svg-icon-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="black" />
                  <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="black" />
                </svg>
              </span>
            </div>
          </div>
          
          <el-form :model="templateData">
            <div class="modal-body py-10 px-lg-17">
              <div class="scroll-y me-n7 pe-7" id="modal_app_details_scroll" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#modal_app_details_header" data-kt-scroll-wrappers="#modal_app_details_scroll" data-kt-scroll-offset="300px">
                <div v-if="templateData" class="mb-8">
                  <!-- Header cu nume și categorie -->
                  <div class="d-flex align-items-center justify-content-between mb-8">
                    <div>
                      <h2 class="fs-2x fw-bold mb-2">{{ templateData.templateName }}</h2>
                      <span class="badge badge-light-primary fs-6 fw-semibold">{{ templateData.category }}</span>
                    </div>
                    <div class="bg-light-warning rounded p-3 text-center">
                      <div class="fs-2 fw-bold text-warning mb-1">{{ templateData.rating }}/5</div>
                      <div class="fs-7 text-gray-600">Rating</div>
                    </div>
                  </div>
                  
                  <!-- Descriere -->
                  <div class="mb-8">
                    <h4 class="fs-5 text-gray-800 fw-bold mb-3">Descriere</h4>
                    <div class="fs-6 text-gray-600 bg-light rounded p-4">
                      {{ templateData.description }}
                    </div>
                  </div>
                  
                  <!-- Detalii tehnice -->
                  <div class="border rounded p-6 mb-8">
                    <div class="d-flex flex-wrap gap-5">
                      <div class="flex-grow-1">
                        <div class="fs-6 text-gray-400 mb-1">Versiune</div>
                        <div class="fs-5 fw-bold">{{ templateData.version }}</div>
                      </div>
                      
                      <div class="flex-grow-1">
                        <div class="fs-6 text-gray-400 mb-1">Data adăugării</div>
                        <div class="fs-5 fw-bold">{{ formatDate(templateData.dateAdded) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer cu butoane -->
            <div class="modal-footer flex-center">
              <button type="button" class="btn btn-light-primary btn-sm me-3" data-bs-dismiss="modal">
                <i class="fas fa-times me-2"></i>Închide
              </button>
              <button 
                type="button" 
                class="btn btn-primary btn-lg" 
                data-bs-toggle="modal" 
                data-bs-target="#modal_new_order"
                @click="openOrderModal"
              >
                <i class="fas fa-shopping-cart me-2"></i>Comandă acum
              </button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import { hideModal } from "@/core/helpers/modal";
  import Swal from 'sweetalert2/dist/sweetalert2.js';
  import axios from "@/plugins/axios";
  
  interface TemplateData {
    _id: string;
    templateName: string;
    description: string;
    shortDescription: string;
    category: string;
    rating: number;
    version: string;
    dateAdded: string;
  }
  
  export default defineComponent({
    name: 'details-modal',
    props: {
      selectedAppId: {
        type: String,
        required: true
      },
    },
    setup(props, { emit }) {
      const detailsModalRef = ref<null | HTMLElement>(null);
      const templateData = ref<TemplateData | null>(null);
      const loading = ref<boolean>(false);
  
      const fetchTemplateDetails = async () => {
        if (!props.selectedAppId) return;
        
        loading.value = true;
        try {
          const response = await axios.get(`/templates/${props.selectedAppId}`);
          templateData.value = response.data;
        } catch (error) {
          console.error('Eroare la preluarea detaliilor:', error);
          Swal.fire({
            text: 'A apărut o eroare la încărcarea detaliilor. Vă rugăm încercați din nou.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Ok, am înțeles!',
            heightAuto: false,
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
        } finally {
          loading.value = false;
        }
      };
  
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ro-RO');
      };
  
      watch(() => props.selectedAppId, (newId) => {
        if (newId) {
          fetchTemplateDetails();
        }
      }, { immediate: true });
      
      const openOrderModal = () => {
      if (templateData.value) {
        emit('open-order', {
          id: props.selectedAppId,
          templateName: templateData.value.templateName,
          version: templateData.value.version
        });
      }
      };

      return {
        templateData,
        detailsModalRef,
        loading,
        formatDate,
        openOrderModal,
      };
    },
  });
  </script>
