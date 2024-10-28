<template>
  <!--begin::Row-->
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <!--begin::Col-->
    <div class="col-xl-8">
      <Widget10 className="h-md-100" />
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div class="col-md-6 col-lg-6 col-xl-4 col-xxl-4 mb-md-5 mb-xl-10">
      <Widget2
        className="h-md-100 mb-5 mb-xl-10"
        :blockNumber="currentBlockNumber"
        :blockHash="currentBlockHash"
      />
    </div>
    <!--end::Col-->
  </div>
  <!--end::Row-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { ApiPromise, WsProvider } from '@polkadot/api';
import Widget2 from "@/components/dashboard-default-widgets/Widget2.vue";
import Widget10 from "@/components/dashboard-default-widgets/Widget10.vue";

export default defineComponent({
  name: "main-dashboard",
  components: {
    Widget2,
    Widget10,
  },
  setup() {
    const currentBlockNumber = ref('...');
    const currentBlockHash = ref('...');
    
    let api: ApiPromise | null = null;
    let unsubscribe: (() => void) | null = null;

    const connectToSubstrate = async () => {
      const wsProvider = new WsProvider('wss://rpc.bizix.network');
      api = await ApiPromise.create({ provider: wsProvider });

      unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
        currentBlockNumber.value = header.number.toString();
        currentBlockHash.value = header.hash.toString();
      });
    };

    onMounted(() => {
      connectToSubstrate();
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (api) {
        api.disconnect();
      }
    });

    return {
      currentBlockNumber,
      currentBlockHash
    };
  },
});
</script>
