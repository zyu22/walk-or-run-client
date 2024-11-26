<template>
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
  >
    <div class="w-full max-w-2xl rounded-lg bg-white shadow-lg">
      <div class="border-b p-4">
        <slot name="header">
          <h3 class="text-lg font-bold">Modal Title</h3>
        </slot>
      </div>
      <div class="p-4">
        <slot name="body"> Modal Content </slot>
      </div>
      <div class="flex justify-end border-t p-4">
        <button
          @click="$emit('close')"
          class="rounded bg-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
}
</script>
