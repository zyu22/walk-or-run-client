<template>
  <div>
    <div
      @click="showModal = true"
      class="transform cursor-pointer rounded-lg bg-white p-6 shadow-md transition duration-300 hover:scale-105"
    >
      <h2 class="mb-4 text-2xl font-bold text-green-600">챌린지 참여하기</h2>
      <p class="text-gray-700">
        운동 챌린지에 참여하고, 다른 참가자를 응원하며, 동기부여를 받으세요.
      </p>
    </div>

    <Modal :showModal="showModal" @close="showModal = false" style="z-index: 9999">
      <template v-slot:header>
        <h3>챌린지 참여하기</h3>
      </template>

      <template v-slot:body>
        <div class="p-4">
          <p v-if="!participated" class="mb-4">5월 30일까지 100km 달리기에 참여하시겠습니까?</p>
          <button
            v-if="!participated"
            @click="participate"
            class="rounded bg-green-500 px-4 py-2 text-white"
          >
            참여하기
          </button>
          <p v-else class="font-bold text-green-600">챌린지에 참여했습니다! 파이팅!! 🏃‍♂️</p>
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
      participated: false,
    }
  },
  methods: {
    participate() {
      this.participated = true
    },
  },
}
</script>
