<template>
  <div class="row g-5 g-xl-8">
    <!-- Statistici generale -->
    <div class="col-xl-4">
      <div class="card card-flush">
        <div class="card-header pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-dark">Statistici Generale</span>
          </h3>
        </div>
        <div class="card-body pt-5">
          <div class="d-flex flex-stack">
            <div class="text-gray-700">Total Issuance:</div>
            <div class="fw-bold text-gray-900">{{ totalIssuance }}</div>
          </div>
          <div class="separator my-3"></div>
          <div class="d-flex flex-stack">
            <div class="text-gray-700">Era Activă:</div>
            <div class="fw-bold text-gray-900">{{ activeEra }}</div>
          </div>
          <div class="separator my-3"></div>
          <div class="d-flex flex-stack">
            <div class="text-gray-700">Sesiune Curentă:</div>
            <div class="fw-bold text-gray-900">{{ currentSession }}</div>
          </div>
          <div class="separator my-3"></div>
          <div class="d-flex flex-stack">
            <div class="text-gray-700">Ultimul Block:</div>
            <div class="fw-bold text-gray-900">{{ lastBlockTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Grafic pentru numărul de blocuri -->
    <div class="col-xl-6">
      <div class="card card-flush h-xl-100">
        <div class="card-header pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-dark">Evoluție Blocuri</span>
            <span class="text-gray-400 mt-1 fw-semibold fs-6">Ultimele 50 de blocuri</span>
          </h3>
        </div>
        <div class="card-body">
          <apexchart
            type="line"
            :options="blockChartOptions"
            :series="blockSeries"
            height="350"
          ></apexchart>
        </div>
      </div>
    </div>

    <!-- Grafic pentru numărul de tranzacții -->
    <div class="col-xl-6">
      <div class="card card-flush h-xl-100">
        <div class="card-header pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-dark">Tranzacții per Bloc</span>
            <span class="text-gray-400 mt-1 fw-semibold fs-6">Ultimele 50 de blocuri</span>
          </h3>
        </div>
        <div class="card-body">
          <apexchart
            type="line"
            :options="txChartOptions" 
            :series="txSeries"
            height="350"
          ></apexchart>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import ApexCharts from 'vue3-apexcharts';
import { ApiPromise, WsProvider } from '@polkadot/api';

export default defineComponent({
  name: 'BlockchainStats',
  components: {
    apexchart: ApexCharts,
  },
  setup() {
    const blockSeries = ref<{ name: string; data: number[] }[]>([{ name: 'Număr Bloc', data: [] }]);
    const txSeries = ref<{ name: string; data: number[] }[]>([{ name: 'Tranzacții', data: [] }]);
    const totalValidators = ref<number>(0);
    const currentEra = ref<number>(0);
    const currentSession = ref<number>(0);
    const totalIssuance = ref<string>('0');
    const activeEra = ref<number>(0);
    const totalStaked = ref<string>('0');
    const lastBlockTime = ref<string>('');

    const blockChartOptions = ref({
      chart: { id: 'blocks-chart', animations: { enabled: true } },
      xaxis: { categories: [] as string[] },
      stroke: { curve: 'smooth', width: 2 },
      colors: ['#50CD89'],
      title: { text: 'Evoluție Blocuri', align: 'left' }
    });

    const txChartOptions = ref({
      chart: { id: 'tx-chart', animations: { enabled: true } },
      xaxis: { categories: [] as string[] },
      stroke: { curve: 'smooth', width: 2 },
      colors: ['#009EF7'],
      title: { text: 'Tranzacții per Bloc', align: 'left' }
    });

    let api: ApiPromise | null = null;
    let unsubscribe: (() => void) | null = null;

    const formatBalance = (balance: string): string => {
      const num = parseFloat(balance);
      if (num >= 1000000000000) {
        return (num / 1000000000000).toFixed(2) + ' T';
      }
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + ' B';
      }
      if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + ' M';
      }
      return num.toFixed(2);
    };

    const fetchBlockchainData = async () => {
      try {
        const wsProvider = new WsProvider('wss://rpc.bizix.network');
        api = await ApiPromise.create({ provider: wsProvider });

        // Obține statistici generale disponibile
        const [
          issuance,
          activeEraInfo,
          currentIndex
        ] = await Promise.all([
          api.query.balances?.totalIssuance(),
          api.query.staking?.activeEra(),
          api.query.session?.currentIndex(),
        ].filter(query => query !== undefined));

        // Actualizează valorile doar dacă sunt disponibile
        if (issuance) {
          totalIssuance.value = formatBalance(issuance.toString());
        }

        if (activeEraInfo) {
          const activeEraData = activeEraInfo.toJSON() as any;
          activeEra.value = activeEraData.index;
        }

        if (currentIndex) {
          currentSession.value = Number(currentIndex.toString());
        }

        // Subscrie la blocuri noi
        unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
          if (!api) return;

          const blockNumber = header.number.toNumber();
          const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
          const block = await api.rpc.chain.getBlock(blockHash);
          const timestamp = await api.query.timestamp.now();
          
          lastBlockTime.value = new Date(Number(timestamp.toString())).toLocaleString();
          
          // Actualizează seria de blocuri
          blockSeries.value[0].data.push(blockNumber);
          if (blockSeries.value[0].data.length > 50) {
            blockSeries.value[0].data.shift();
          }
          
          // Actualizează seria de tranzacții
          const txCount = block.block.extrinsics.length;
          txSeries.value[0].data.push(txCount);
          if (txSeries.value[0].data.length > 50) {
            txSeries.value[0].data.shift();
          }

          // Actualizează categoriile pentru ambele grafice
          const newCategory = header.hash.toString().slice(0, 6);
          blockChartOptions.value.xaxis.categories.push(newCategory);
          txChartOptions.value.xaxis.categories.push(newCategory);
          if (blockChartOptions.value.xaxis.categories.length > 50) {
            blockChartOptions.value.xaxis.categories.shift();
            txChartOptions.value.xaxis.categories.shift();
          }
        });
      } catch (error) {
        console.error('Eroare la conectarea la blockchain:', error);
      }
    };

    onMounted(() => {
      fetchBlockchainData();
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
      blockSeries,
      txSeries,
      blockChartOptions,
      txChartOptions,
      totalValidators,
      currentEra,
      currentSession,
      totalIssuance,
      activeEra,
      totalStaked,
      lastBlockTime,
    };
  },
});
</script> 