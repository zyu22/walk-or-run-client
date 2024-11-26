<!-- components/common/NotifyModal.vue -->
<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      :class="[
        'fixed z-[60]', // z-index 증가
        position === 'center' ? 'inset-0 flex items-center justify-center' : 'right-4 top-4',
      ]"
    >
      <div
        class="rounded-lg px-4 py-3 shadow-lg"
        :class="{
          'border border-green-200 bg-green-50': type === 'success',
          'border border-red-200 bg-red-50': type === 'error',
        }"
      >
        <div class="flex items-start space-x-3">
          <!-- 성공 아이콘 -->
          <svg
            v-if="type === 'success'"
            class="mt-0.5 h-6 w-6 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>

          <!-- 에러 아이콘 -->
          <svg
            v-if="type === 'error'"
            class="mt-0.5 h-6 w-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>

          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ title }}</p>
            <p class="mt-1 whitespace-pre-line text-sm text-gray-500">{{ message }}</p>
          </div>
          <button @click="close" class="text-gray-400 hover:text-gray-500">✕</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useAlertStore } from '@/stores/alert'

const store = useAlertStore()
const isOpen = computed(() => store.notify.isOpen)
const title = computed(() => store.notify.title)
const message = computed(() => store.notify.message)
const type = computed(() => store.notify.type)
const position = computed(() => store.notify.position)

const close = () => store.closeNotify()
</script>
