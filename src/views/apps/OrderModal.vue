<template>
  <!--begin::Modal - Order-->
  <div
    class="modal fade"
    id="kt_modal_order"
    ref="orderModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content rounded">
        <!--begin::Modal header-->
        <div class="modal-header pb-0 border-0 justify-content-end">
          <!--begin::Close-->
          <div
            class="btn btn-sm btn-icon btn-active-color-primary"
            data-bs-dismiss="modal"
            @click="close"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Modal body-->
        <div class="modal-body scroll-y px-10 px-lg-15 pt-0 pb-15">
          <!--begin:Form-->
          <el-form
            id="kt_modal_order_form"
            @submit.prevent="submitOrder"
            :model="orderData"
            :rules="rules"
            ref="formRef"
            class="form"
          >
            <!--begin::Heading-->
            <div class="mb-13 text-center">
              <!--begin::Title-->
              <h1 class="mb-3">Inițiază Comandă pentru {{ app.templateName }}</h1>
              <!--end::Title-->

              <!--begin::Description-->
              <div class="text-gray-500 fw-semibold fs-5">
                Dacă aveți nevoie de mai multe informații, vă rugăm să verificați
                <a href="#" class="fw-bold link-primary">Ghidul Bixzix</a>.
              </div>
              <!--end::Description-->
            </div>
            <!--end::Heading-->

            <!--begin::Input group-->
            <div class="d-flex flex-column mb-8 fv-row">
              <!--begin::Label-->
              <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                <span class="required">Nume Companie</span>
              </label>
              <!--end::Label-->

              <el-form-item prop="companyName">
                <el-input
                  v-model="orderData.companyName"
                  placeholder="Introduceți Numele Companiei"
                  name="companyName"
                ></el-input>
              </el-form-item>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="d-flex flex-column mb-8 fv-row">
              <!--begin::Label-->
              <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                <span class="required">Data Expirării</span>
              </label>
              <!--end::Label-->

              <el-form-item prop="expiresAt">
                <el-date-picker
                  v-model="orderData.expiresAt"
                  type="date"
                  placeholder="Selectați Data"
                  :teleported="false"
                  popper-class="override-styles"
                  name="expiresAt"
                />
              </el-form-item>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="d-flex flex-column mb-8 fv-row">
              <!--begin::Label-->
              <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                <span class="required">Nod</span>
              </label>
              <!--end::Label-->

              <el-form-item prop="node">
                <el-input
                  v-model="orderData.node"
                  placeholder="Introduceți Nodul"
                  name="node"
                ></el-input>
              </el-form-item>
            </div>
            <!--end::Input group-->

            <!--begin::Actions-->
            <div class="text-center">
              <button
                type="reset"
                id="kt_modal_order_cancel"
                class="btn btn-light me-3"
                @click="close"
              >
                Anulează
              </button>

              <!--begin::Button-->
              <button
                :data-kt-indicator="loading ? 'on' : null"
                class="btn btn-lg btn-primary"
                type="submit"
              >
                <span v-if="!loading" class="indicator-label">
                  Trimite
                  <KTIcon icon-name="arrow-right" icon-class="fs-3 ms-2 me-0" />
                </span>
                <span v-if="loading" class="indicator-progress">
                  Vă rugăm să așteptați...
                  <span
                    class="spinner-border spinner-border-sm align-middle ms-2```vue
                  "></span>
                </span>
              </button>
              <!--end::Button-->
            </div>
            <!--end::Actions-->
          </el-form>
          <!--end:Form-->
        </div>
        <!--end::Modal body-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
  <!--end::Modal - Order-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { hideModal } from "@/core/helpers/modal";
import Swal from "sweetalert2/dist/sweetalert2.js";

interface OrderData {
  companyName: string;
  expiresAt: string;
  node: string;
}

export default defineComponent({
  name: "OrderModal",
  props: {
    app: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const formRef = ref<null | HTMLFormElement>(null);
    const orderModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);

    const orderData = ref<OrderData>({
      companyName: "",
      expiresAt: "",
      node: "",
    });

    const rules = ref({
      companyName: [
        {
          required: true,
          message: "Introduceți Numele Companiei",
          trigger: "blur",
        },
      ],
      expiresAt: [
        {
          required: true,
          message: "Selectați Data",
          trigger: "change",
        },
      ],
      node: [
        {
          required: true,
          message: "Introduceți Nodul",
          trigger: "blur",
        },
      ],
    });

    const submitOrder = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid: boolean) => {
        if (valid) {
          loading.value = true;

          setTimeout(() => {
            loading.value = false;

            Swal.fire({
              text: "Formularul a fost trimis cu succes!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok, am înțeles!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn btn-primary",
              },
            }).then(() => {
              hideModal(orderModalRef.value);
            });
          }, 2000);
        } else {
          Swal.fire({
            text: "Ne pare rău, se pare că există erori, vă rugăm să încercați din nou.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, am înțeles!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          return false;
        }
      });
    };

    const close = () => {
      hideModal(orderModalRef.value);
    };

    return {
      orderData,
      submitOrder,
      close,
      loading,
      formRef,
      rules,
      orderModalRef,
    };
  },
});
</script>

<style lang="scss">
.el-select {
  width: 100%;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

.override-styles {
  z-index: 99999 !important;
  pointer-events: initial;
}
</style>