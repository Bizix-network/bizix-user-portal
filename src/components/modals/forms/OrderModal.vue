<template>
  <div class="modal fade" id="modal_new_order" ref="addCustomerModalRef" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="modal_new_order_header">
          <h2 class="fw-bold">Plasează o comandă</h2>
          <div id="modal_new_order_close" data-bs-dismiss="modal" class="btn btn-icon btn-sm btn-active-icon-primary">
            <span class="svg-icon svg-icon-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="black" />
                <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="black" />
              </svg>
            </span>
          </div>
        </div>
        <el-form @submit.prevent="submit()" :model="formData" :rules="rules" ref="formRef">
          <div class="modal-body py-10 px-lg-17">
            <div class="scroll-y me-n7 pe-7" id="modal_new_order_scroll" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#modal_new_order_header" data-kt-scroll-wrappers="#modal_new_order_scroll" data-kt-scroll-offset="300px">
              <div class="mb-8">
  <h3>Rezumat comandă</h3>
  <p><strong>Nume template:</strong> {{ selectedAppTemplateName }}</p>
  <p><strong>Versiune:</strong> {{ selectedAppVersion }}</p>
</div>
              <div class="mb-8">
                <h3>Detalii facturare</h3>
                <el-form-item label="Nume companie" prop="companyName">
                  <el-input v-model="formData.companyName" />
                </el-form-item>
                <el-form-item label="CUI" prop="companyID">
                  <el-input v-model="formData.companyID" />
                </el-form-item>
                <el-form-item label="Prenume" prop="firstName">
                  <el-input v-model="formData.firstName" />
                </el-form-item>
                <el-form-item label="Nume" prop="lastName">
                  <el-input v-model="formData.lastName" />
                </el-form-item>
                <el-form-item label="Adresă" prop="address">
                  <el-input v-model="formData.address" />
                </el-form-item>
                <el-form-item label="Oraș" prop="city">
                  <el-input v-model="formData.city" />
                </el-form-item>
                <el-form-item label="Județ" prop="state">
                  <el-input v-model="formData.state" />
                </el-form-item>
                <el-form-item label="Cod poștal" prop="zip">
                  <el-input v-model="formData.zip" />
                </el-form-item>
                <el-form-item label="Țară" prop="country">
                  <el-input v-model="formData.country" />
                </el-form-item>
                <el-form-item label="Telefon" prop="phone">
                  <el-input v-model="formData.phone" />
                </el-form-item>
                <el-form-item label="Moneda" prop="currency">
                  <el-input v-model="formData.currency" />
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="modal-footer flex-center">
            <button type="reset" id="modal_new_order_cancel" class="btn btn-light me-3" data-bs-dismiss="modal">Renunță</button>
            <button :data-kt-indicator="loading ? 'on' : null" class="btn btn-lg btn-primary" type="submit">
              <span v-if="!loading" class="indicator-label">
                Plasează comanda
                <span class="svg-icon svg-icon-3 ms-2 me-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect opacity="0.5" x="18" y="13" width="13" height="2" rx="1" transform="rotate(-180 18 13)" fill="black" />
                    <path d="M15.4343 12.5657L11.25 16.75C10.8358 17.1642 10.8358 17.8358 11.25 18.25C11.6642 18.6642 12.3358 18.6642 12.75 18.25L18.2929 12.7071C18.6834 12.3166 18.6834 11.6834 18.2929 11.2929L12.75 5.75C12.3358 5.33579 11.6642 5.33579 11.25 5.75C10.8358 6.16421 10.8358 6.83579 11.25 7.25L15.4343 11.4343C15.7467 11.7467 15.7467 12.2533 15.4343 12.5657Z" fill="black" />
                  </svg>
                </span>
              </span>
              <span v-if="loading" class="indicator-progress">
                Se procesează...
                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
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

interface FormData {
  companyName: string;
  companyID: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  currency: string;
}

export default defineComponent({
  name: 'order-modal',
  props: {
    selectedAppId: {
      type: String,
      default: null,
    },
    selectedAppTemplateName: {
      type: String,
      default: '', 
    },
    selectedAppVersion: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    console.log('Props primite:', {
      id: props.selectedAppId,
      name: props.selectedAppTemplateName,
      version: props.selectedAppVersion
    });
    const formRef = ref<null | HTMLFormElement>(null);
    const addCustomerModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    const formData = ref<FormData>({
      companyName: '',
      companyID: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      currency: '',
    });
    const selectedApp = ref<any>(null);
    const userId = ref('');

    // Adăugăm un listener pentru evenimentele modalului
    onMounted(() => {
      const modalElement = document.getElementById('modal_new_order');
      if (modalElement) {
        modalElement.addEventListener('show.bs.modal', () => {
          // Se execută când modalul începe să se deschidă
          initializeData();
        });

        modalElement.addEventListener('hidden.bs.modal', () => {
          // Se execută când modalul este complet închis
          formData.value = {
            companyName: '',
            companyID: '',
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            phone: '',
            currency: '',
          };
        });
      }
    });

    // Eliminăm watch-ul anterior pentru selectedAppId deoarece nu mai este necesar
    // Eliminăm și apelul inițial la initializeData din onMounted

    const initializeData = async () => {
      try {
        const [userResponse, profileResponse] = await Promise.all([
          axios.get('/user'),
          axios.get('/users/profile')
        ]);

        userId.value = userResponse.data.userId;
        const { billing } = profileResponse.data;
        
        if (billing) {
          formData.value = {
            companyName: billing.companyName || '',
            companyID: billing.companyID || '',
            firstName: billing.firstName || '',
            lastName: billing.lastName || '',
            address: billing.address || '',
            city: billing.city || '',
            state: billing.state || '',
            zip: billing.zip || '',
            country: billing.country || '',
            phone: billing.phone || '',
            currency: billing.currency || '',
          };
        }
      } catch (error) {
        console.error('Eroare la inițializarea datelor:', error);
        Swal.fire({
          text: 'A apărut o eroare la încărcarea datelor. Vă rugăm încercați din nou.',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok, am înțeles!',
          heightAuto: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      }
    };

    const rules = ref({
      companyName: [
        {
          required: true,
          message: 'Numele companiei este obligatoriu',
          trigger: 'change',
        },
      ],
      companyID: [
        {
          required: true,
          message: 'CUI-ul este obligatoriu',
          trigger: 'change',
        },
      ],
      firstName: [
        {
          required: true,
          message: 'Prenumele este obligatoriu',
          trigger: 'change',
        },
      ],
      lastName: [
        {
          required: true,
          message: 'Numele este obligatoriu',
          trigger: 'change',
        },
      ],
      address: [
        {
          required: true,
          message: 'Adresa este obligatorie',
          trigger: 'change',
        },
      ],
      city: [
        {
          required: true,
          message: 'Orașul este obligatoriu',
          trigger: 'change',
        },
      ],
      state: [
        {
          required: true,
          message: 'Județul este obligatoriu',
          trigger: 'change',
        },
      ],
      zip: [
        {
          required: true,
          message: 'Codul poștal este obligatoriu',
          trigger: 'change',
        },
      ],
      country: [
        {
          required: true,
          message: 'Țara este obligatorie',
          trigger: 'change',
        },
      ],
      phone: [
        {
          required: true,
          message: 'Numărul de telefon este obligatoriu',
          trigger: 'change',
        },
      ],
      currency: [
        {
          required: true,
          message: 'Moneda este obligatorie',
          trigger: 'change',
        },
      ],
    });

    const submit = async () => {
      if (!formRef.value) {
        return;
      }

      await formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          loading.value = true;

          try {
            const response = await axios.post('/orders/create-order', {
              userId,
              templateId: props.selectedAppId,
              billingDetails: {
                companyName: formData.value.companyName,
                companyID: formData.value.companyID,
                firstName: formData.value.firstName,
                lastName: formData.value.lastName,
                address: formData.value.address,
                city: formData.value.city,
                state: formData.value.state,
                zip: formData.value.zip,
                country: formData.value.country,
                phone: formData.value.phone,
              },
              amount: 1,
              currency: formData.value.currency,
              node: 'm11486',
              vmName: props.selectedAppTemplateName,
              vmVersion: props.selectedAppVersion,
            });

            if (response.data.url) {
              window.location.href = response.data.url;
            } else {
              throw new Error('Nu s-a primit URL-ul de redirecționare de la server.');
            }

            loading.value = false;

            Swal.fire({
              text: 'Comanda a fost plasată cu succes!',
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Ok, am înțeles!',
              heightAuto: false,
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            }).then(() => {
              hideModal(addCustomerModalRef.value);
            });
          } catch (error) {
            loading.value = false;
            console.error('Eroare la crearea comenzii:', error);
            Swal.fire({
              text: 'Ne pare rău, a apărut o eroare la procesarea comenzii. Vă rugăm încercați din nou.',
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Ok, am înțeles!',
              heightAuto: false,
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            });
          }
        } else {
          Swal.fire({
            text: 'Vă rugăm să completați toate câmpurile obligatorii și să încercați din nou.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Ok, am înțeles!',
            heightAuto: false,
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
          return false;
        }
      });
    };

    return {
      formData,
      rules,
      submit,
      formRef,
      loading,
      addCustomerModalRef,
      selectedApp,
      userId,
    };
  },
});
</script>
  

