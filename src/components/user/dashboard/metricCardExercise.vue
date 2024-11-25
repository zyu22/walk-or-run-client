<template>
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div>
        <div class="flex items-center gap-2 mb-4">
          <h3 class="text-lg font-semibold text-gray-700">
            {{ title }}
          </h3>
        </div>
   
        <div class="flex flex-col items-center justify-center p-3 text-center pt-10 mt-7">
          <!-- 연속일수 -->
          <div class="flex items-center gap-2">
            <span class="text-4xl font-bold text-[#FF6F3B]">{{ calculateStreak }}일</span>
            <span class="text-2xl">🔥</span>
          </div>
   
          <!-- 상태 메시지 -->
          <p class="text-sm text-gray-500 mt-2">{{ streakStatus }}</p>
   
          <!-- 하단 배지 -->
          <div class="mt-3">
            <span class="text-xs px-3 py-1 rounded-full bg-orange-100 text-[#FF6F3B]">
              연속 운동중
            </span>
          </div>
        </div>
      </div>
    </div>
   </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    title: {
        type: String,
        required: true
    },
    records: {
      type: Array,
      required: true
    }
  });
  
  const calculateStreak = computed(() => {
    if (!props.records?.length) return 0;
  
    const exerciseDates = [...new Set(props.records
      .map(record => record.endTime.split(' ')[0]))]
      .sort()
      .reverse();
  
    if (exerciseDates.length === 0) return 0;
  
    let streak = 1;
    let lastExerciseDate = exerciseDates[0];
  
    for (let i = 1; i < exerciseDates.length; i++) {
      const currentDate = exerciseDates[i];
      
      const date1 = new Date(lastExerciseDate);
      const date2 = new Date(currentDate);
      const diffTime = Math.abs(date1 - date2);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
      if (diffDays === 1) {
        streak++;
        lastExerciseDate = currentDate;
      } else {
        break;
      }
    }
  
    return streak;
  });
  
  const streakStatus = computed(() => {
    return calculateStreak.value > 0 ? '목표 달성중' : '아직 기록이 없습니다';
  });
  </script>