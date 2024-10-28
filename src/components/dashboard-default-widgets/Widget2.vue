<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Amount-->
        <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{{ blockNumber }}</span>
        <!--end::Amount-->

        <!--begin::Subtitle-->
        <span class="text-gray-500 pt-1 fw-semibold fs-6">Numărul blocului curent</span>
        <!--end::Subtitle-->
      </div>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body pt-2">
      <!--begin::Title-->
      <span class="fs-6 fw-bolder text-gray-800 d-block mb-2">Hash-ul blocului curent</span>
      <!--end::Title-->

      <!--begin::Hash-->
      <span class="text-gray-500 fw-semibold fs-6">{{ blockHash }}</span>
      <!--end::Hash-->

    </div>
    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "default-dashboard-widget-2",
  props: {
    className: { type: String, required: false },
    blockNumber: { type: String, required: true },
    blockHash: { type: String, required: true },
  },
});
</script>
