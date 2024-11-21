// components/Modal.vue
<template>
  <div>
    <!-- 배경 오버레이 -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="handleBackdropClick"
    >
      <!-- 모달 컨텐츠 -->
      <div 
        class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto mx-4"
        @click.stop
      >
        <!-- 모달 헤더 -->
        <div class="flex justify-end p-4">
          <button 
            @click="$emit('close')" 
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg 
              class="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- 모달 내용 -->
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close']);

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close');
  }
};
</script>

<style scoped>
/* 모달이 열릴 때 스크롤 방지 */
:deep(body.modal-open) {
  overflow: hidden;
}
</style>