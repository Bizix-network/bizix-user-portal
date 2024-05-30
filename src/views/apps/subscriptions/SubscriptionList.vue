<template>
  <div class="card">
    <div class="card-body pt-0">
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
      >
        <template v-slot:vmname="{ row: subscription }">
          <router-link
            :to="`/apps/subscriptions/view-subscription/${subscription._id}`"
            class="text-gray-800 text-hover-primary mb-1"
          >
            {{ subscription.name }}
          </router-link>
        </template>
        <template v-slot:status="{ row: subscription }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            <div :class="`badge badge-light-${getStatusColor(subscription.status)}`">
              {{ subscription.status }}
            </div>
          </a>
        </template>
        <template v-slot:node="{ row: subscription }">
          <div class="badge badge-light">{{ subscription.node }}</div>
        </template>
        <template v-slot:userId="{ row: subscription }">
          {{ subscription.userId }}
        </template>
        <template v-slot:createdDate="{ row: subscription }">
          {{ formatDate(subscription.createdAt) }}
        </template>
        <template v-slot:publicURL="{ row: subscription }">
          <a :href="subscription.publicURL" target="_blank">{{ subscription.publicURL }}</a>
        </template>
        <template v-slot:templateId="{ row: subscription }">
          {{ subscription.templateId }}
        </template>
        <template v-slot:actions="{ row: subscription }">
          <a
            href="#"
            class="btn btn-sm btn-light btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >Actions
            <KTIcon icon-name="down" icon-class="fs-5 m-0" />
          </a>
          <!--begin::Menu-->
          <div
            class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
            data-kt-menu="true"
          >
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <router-link
                :to="`/apps/subscriptions/view-subscription/${subscription._id}`"
                class="menu-link px-3"
              >View</router-link>
            </div>
            <!--end::Menu item-->
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <a @click.prevent="deleteSubscription(subscription._id)" class="menu-link px-3"
              >Delete</a>
            </div>
            <!--end::Menu item-->
          </div>
          <!--end::Menu-->
        </template>
      </KTDatatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import axios from "@/plugins/axios";

interface ISubscription {
  _id: string;
  vmid: number;
  userId: string;
  name: string;
  node: string;
  publicURL: string;
  templateId: string;
  companyName: string;
  expiresAt: string;
  status: string;
  createdAt: string;
  __v: number;
}

export default defineComponent({
  name: "kt-subscription-list",
  components: {
    KTDatatable,
  },
  setup() {
    const data = ref<Array<ISubscription>>([]);
    const initData = ref<Array<ISubscription>>([]);
    const headerConfig = ref([
      {
        columnName: "VM Name",
        columnLabel: "vmname",
        sortEnabled: true,
      },
      {
        columnName: "Status",
        columnLabel: "status",
        sortEnabled: true,
      },
      {
        columnName: "Node",
        columnLabel: "node",
        sortEnabled: true,
      },
      {
        columnName: "userId",
        columnLabel: "userId",
        sortEnabled: true,
      },
      {
        columnName: "Application ID",
        columnLabel: "templateId",
        sortEnabled: true,
      },
      {
        columnName: "Created Date",
        columnLabel: "createdDate",
        sortEnabled: true,
      },
      {
        columnName: "Public URL",
        columnLabel: "publicURL",
        sortEnabled: true,
      },
        {
        columnName: "Actions",
        columnLabel: "actions",
      },
    ]);

    onMounted(async () => {
      await fetchSubscriptions();
    });

    const selectedIds = ref<Array<string>>([]);

    const deleteFewSubscriptions = () => {
      selectedIds.value.forEach((id) => {
        deleteSubscription(id);
      });
      selectedIds.value.length = 0;
    };

    const deleteSubscription = async (id: string) => {
      try {
        await axios.delete(`/vms/${id}`);
        data.value = data.value.filter((subscription) => subscription._id !== id);
      } catch (error) {
        console.error("Failed to delete subscription:", error);
      }
    };

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(data.value, sort.label, { reverse });
      }
    };

    const onItemSelect = (selectedItems: Array<string>) => {
      selectedIds.value = selectedItems;
    };

    const search = ref<string>("");

    const searchItems = () => {
      data.value = [...initData.value];
      if (search.value !== "") {
        const results = data.value.filter((subscription) =>
          Object.values(subscription).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(search.value.toLowerCase())
          )
        );
        data.value = [...results];
      }
      MenuComponent.reinitialization();
    };

    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get("/vms");
        data.value = response.data;
        initData.value = [...response.data];
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      }
    };

    const formatDate = (dateString: string): string => {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
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

    const onItemsPerPageChange = () => {
      setTimeout(() => {
        MenuComponent.reinitialization();
      }, 0);
    };

    return {
      search,
      searchItems,
      data,
      headerConfig,
      sort,
      onItemSelect,
      selectedIds,
      deleteFewSubscriptions,
      deleteSubscription,
      formatDate,
      getStatusColor,
      onItemsPerPageChange,
      fetchSubscriptions,
    };
  },
});
</script>