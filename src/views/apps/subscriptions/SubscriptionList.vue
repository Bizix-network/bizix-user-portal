<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            v-model="search"
            @input="searchItems()"
            type="text"
            data-kt-subscription-table-filter="search"
            class="form-control form-control-solid w-250px ps-14"
            placeholder="Search Subscriptions"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base"
        >
          <!--begin::Export-->
          <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_subscriptions_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button>
          <!--end::Export-->

          <!--begin::Add subscription-->
          <router-link
            to="/apps/subscriptions/add-subscription"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Subscription
          </router-link>
          <!--end::Add subscription-->
        </div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewSubscriptions()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
      >
        <template v-slot:customer="{ row: vm }">
          <router-link
            to="/apps/subscriptions/view-subscription"
            class="text-gray-800 text-hover-primary mb-1"
          >
            {{ vm.name }}
          </router-link>
        </template>
        <template v-slot:status="{ row: vm }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            <div class="badge badge-light-success">
              {{ vm.status }}
            </div>
          </a>
        </template>
        <template v-slot:billing="{ row: vm }">
          <div class="badge badge-light">{{ vm.expiresAt }}</div>
        </template>
        <template v-slot:product="{ row: vm }">
          {{ vm.companyName }}
        </template>
        <template v-slot:createdDate="{ row: vm }">
          {{ vm.createdAt }}
        </template>
        <template v-slot:actions="{ row: vm }">
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
                to="/apps/customers/customer-details"
                class="menu-link px-3"
                >View</router-link
              >
            </div>
            <!--end::Menu item-->
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <a @click="deleteSubscription(vm._id)" class="menu-link px-3"
                >Delete</a
              >
            </div>
            <!--end::Menu item-->
          </div>
          <!--end::Menu-->
        </template>
      </KTDatatable>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import axios from 'axios';

interface IVM {
  _id: string;
  name: string;
  status: string;
  expiresAt: string;
  companyName: string;
  createdAt: string;
}

export default defineComponent({
  name: "kt-subscription-list",
  components: {
    KTDatatable,
  },
  setup() {
    const data = ref<Array<IVM>>([]);
    const headerConfig = ref([
      {
        columnName: "Customer",
        columnLabel: "name",
        sortEnabled: true,
      },
      {
        columnName: "Status",
        columnLabel: "status",
        sortEnabled: true,
      },
      {
        columnName: "Billing",
        columnLabel: "expiresAt",
        sortEnabled: true,
      },
      {
        columnName: "Product",
        columnLabel: "companyName",
        sortEnabled: true,
      },
      {
        columnName: "Created Date",
        columnLabel: "createdAt",
        sortEnabled: true,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
      },
    ]);

    const selectedIds = ref<Array<string>>([]);
    const deleteFewSubscriptions = () => {
      selectedIds.value.forEach((item) => {
        deleteSubscription(item);
      });
      selectedIds.value.length = 0;
    };
    const deleteSubscription = async (id: string) => {
      try {
        await axios.delete(`/api/vms/${id}`);
        data.value = data.value.filter(vm => vm._id !== id);
      } catch (error) {
        console.error('Failed to delete subscription:', error);
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
      if (search.value !== "") {
        data.value = data.value.filter(vm => 
          vm.name.toLowerCase().includes(search.value.toLowerCase())
        );
      } else {
        fetchVMs();
      }
      MenuComponent.reinitialization();
    };

    const fetchVMs = async () => {
      try {
        const response = await axios.get('/api/vms');
        data.value = response.data;
      } catch (error) {
        console.error('Failed to fetch VMs:', error);
      }
    };

    onMounted(() => {
      fetchVMs();
    });

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
      getAssetPath,
      onItemsPerPageChange: () => {
        setTimeout(() => {
          MenuComponent.reinitialization();
        }, 0);
      },
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