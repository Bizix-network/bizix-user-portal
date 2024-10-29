<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-7">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Abonamente BiziX</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">
          abonat la {{ subscriptions.length }} aplicații
        </span>
      </h3>
      <!--end::Title-->

      <!--begin::Toolbar-->
      <div class="card-toolbar">
        <router-link to="/apps/subscriptions" class="btn btn-sm btn-light">
          Istoric
        </router-link>
      </div>
      <!--end::Toolbar-->
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-6">
      <!--begin::Table container-->
      <div class="table-responsive">
        <!--begin::Table-->
        <table class="table table-row-dashed align-middle gs-0 gy-3 my-0">
          <!--begin::Table head-->
          <thead>
            <tr class="fs-7 fw-bold text-gray-500 border-bottom-0">
              <th class="p-0 pb-3 min-w-175px text-start">Aplicatie</th>
              <th class="p-0 pb-3 min-w-100px text-end">Start</th>
              <th class="p-0 pb-3 min-w-100px text-end">Expira</th>
              <th class="p-0 pb-3 min-w-175px text-end pe-12">Status</th>
              <th class="p-0 pb-3 w-50px text-end">Acceseaza</th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-for="(subscription, i) in subscriptions" :key="i">
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-50px me-3">
                      <div class="symbol-label fs-2 fw-semibold bg-light-primary text-primary">
                        <KTIcon icon-name="abstract-24" icon-class="fs-1" />
                      </div>
                    </div>

                    <div class="d-flex justify-content-start flex-column">
                      <router-link
                        :to="`/apps/subscriptions/view-subscription/${subscription._id}`"
                        class="text-gray-800 fw-bold text-hover-primary mb-1 fs-6"
                      >
                        {{ subscription.name }}
                      </router-link>
                      <span class="text-gray-500 fw-semibold d-block fs-7">
                        {{ subscription.node }}
                      </span>
                    </div>
                  </div>
                </td>

                <td class="text-end pe-0">
                  <span class="text-gray-600 fw-bold fs-6">
                    {{ formatDate(subscription.createdAt) }}
                  </span>
                </td>

                <td class="text-end pe-0">
                  <span class="text-gray-600 fw-bold fs-6">
                    {{ formatDate(subscription.expiresAt) }}
                  </span>
                </td>

                <td class="text-end pe-12">
                  <span
                    :class="`badge py-3 px-4 fs-7 badge-light-${getStatusColor(subscription.status)}`"
                  >
                    {{ subscription.status }}
                  </span>
                </td>

                <td class="text-end">
                  <a
                    :href="subscription.publicURL"
                    target="_blank"
                    class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary w-30px h-30px"
                  >
                    <KTIcon
                      icon-name="black-right"
                      icon-class="fs-5 text-gray-700"
                    />
                  </a>
                </td>
              </tr>
            </template>
          </tbody>
          <!--end::Table body-->
        </table>
      </div>
      <!--end::Table-->
    </div>
    <!--end: Card Body-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "@/plugins/axios";

interface Subscription {
  _id: string;
  name: string;
  node: string;
  createdAt: string;
  expiresAt: string;
  status: string;
  publicURL: string;
}

export default defineComponent({
  name: "default-dashboard-widget-10",
  props: {
    className: { type: String, required: false },
  },
  setup() {
    const subscriptions = ref<Subscription[]>([]);

    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get("/vms");
        subscriptions.value = response.data;
      } catch (error) {
        console.error("Eroare la preluarea abonamentelor:", error);
      }
    };

    const formatDate = (dateString: string): string => {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString("ro-RO", options);
    };

    const getStatusColor = (status: string): string => {
      switch (status) {
        case "created":
          return "success";
        case "pending":
          return "warning";
        case "failed":
          return "danger";
        default:
          return "light";
      }
    };

    onMounted(() => {
      fetchSubscriptions();
    });

    return {
      subscriptions,
      formatDate,
      getStatusColor,
    };
  },
});
</script>
