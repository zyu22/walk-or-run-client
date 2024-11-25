<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" />
      <div class="relative w-96 rounded-lg bg-white p-4 shadow-lg">
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

          <!-- 기본 아이콘 (물음표) -->
          <svg
            v-if="!type"
            class="mt-0.5 h-6 w-6 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <div class="flex-1">
            <h3 class="text-lg font-medium">{{ title }}</h3>
            <p class="mt-2 whitespace-pre-line text-sm text-gray-500">{{ message }}</p>
          </div>
        </div>

        <div class="mt-4 flex justify-end space-x-2">
          <button
            class="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            @click="close(false)"
          >
            취소
          </button>
          <button
            class="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            @click="close(true)"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useAlertStore } from '@/stores/alert'

const store = useAlertStore()
const isOpen = computed(() => store.confirm.isOpen)
const title = computed(() => store.confirm.title)
const message = computed(() => store.confirm.message)
const type = computed(() => store.confirm.type) // type 추가

const close = (confirmed) => store.closeConfirm(confirmed)
</script>
