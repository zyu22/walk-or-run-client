<template>
  <div>
    <div
      @click="showModal = true"
      class="transform cursor-pointer rounded-lg bg-white p-6 shadow-md transition duration-300 hover:scale-105"
    >
      <h2 class="mb-4 text-2xl font-bold text-purple-600">목표 설정하기</h2>
      <p class="text-gray-700">
        카테고리, 시간, 거리를 선택하여 걷기나 달리기 목표를 쉽게 설정하세요.
      </p>
    </div>

    <Modal :showModal="showModal" @close="showModal = false" style="z-index: 9999">
      <template v-slot:header>
        <h3>목표 설정하기</h3>
      </template>

      <template v-slot:body>
        <div class="p-4">
          <div class="mb-4">
            <label>운동 종류</label>
            <select v-model="category" class="ml-2 rounded border">
              <option>걷기</option>
              <option>달리기</option>
            </select>
          </div>
          <div class="mb-4 flex items-center">
            <label>목표 시간</label>
            <input v-model="goalTime" type="number" min="0" class="ml-2 w-20 rounded border" />
            <span class="ml-1">분</span>
          </div>
          <div class="mb-4 flex items-center">
            <label>목표 거리</label>
            <input
              v-model="goalDistance"
              type="number"
              min="0"
              step="0.1"
              class="ml-2 w-20 rounded border"
            />
            <span class="ml-1">km</span>
          </div>
          <div class="text-center">
            <button
              v-if="!goalSet"
              @click="setGoal"
              class="rounded bg-purple-500 px-4 py-2 text-white"
            >
              목표 설정
            </button>
            <div v-else class="flex items-center justify-center font-bold text-purple-600">
              <span>목표가 설정되었습니다!</span>
              <span class="ml-2">🤔💭</span>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/authentication/Modal.vue'

export default {
  components: {
    Modal,
  },
  data() {
    return {
      showModal: false,
      category: '걷기',
      goalTime: 0,
      goalDistance: 0,
      goalSet: false,
    }
  },
  methods: {
    setGoal() {
      // 실제 목표 설정 로직
      this.goalSet = true
    },
  },
}
</script>
