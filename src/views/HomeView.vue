<template>
  <div class="flex min-h-screen bg-gray-50">
    <SideBar />
    
    <div class="flex-1 p-8">
      <div class="flex justify-between items-center mb-8">
        <div class="flex gap-4">
          <DatePicker v-model="startDate" />
          <DatePicker v-model="endDate" />
        </div>
        <div class="flex items-center">
          <button class="text-gray-600 hover:text-gray-900">
            <span>안녕하세요, 포미님!</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="총 걸음 수"
          value="2500"
          subtitle="총 걸음"
          icon="👣"
        />
        <MetricCard
          title="평균 걸음"
          value="250"
          subtitle="일일 평균"
          icon="📊"
        />
        <MetricCard
          title="평균 심박수"
          value="1.5"
          subtitle="BPM"
          icon="❤️"
        />
        <MetricCard
          title="소비 칼로리"
          value="250"
          subtitle="총 칼로리"
          icon="🔥"
        />
      </div>

      <div class="grid grid-cols-3 gap-6 mb-8">
        <DonutChart title="체중 감량" percentage="81" />
        <DonutChart title="Customer Growth" percentage="22" />
        <DonutChart title="Total Revenue" percentage="62" />
      </div>

      <div class="grid grid-cols-2 gap-6">
        <LineChart title="걸음수" />
        <BarChart title="Customer Map" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SideBar from '../components/SideBar.vue';
import MetricCard from '../components/MetricCard.vue';
import DonutChart from '../components/DonutChart.vue';
import LineChart from '../components/LineChart.vue';
import BarChart from '../components/BarChart.vue';
 // import DatePicker from '../components/DatePicker.vue';

const startDate = ref(new Date('2024-10-15'));
const endDate = ref(new Date('2024-10-22'));
</script>