<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-8">파일 업로드</h1>
    
    <!-- CSV 파일 업로드 폼 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 class="text-lg font-medium mb-4">CSV 파일 업로드</h2>
      
      <form @submit.prevent="handleCsvUpload" class="space-y-4">
        <div class="flex flex-col space-y-2">
          <label for="csvFile" class="text-sm text-gray-600">
            CSV 파일을 선택해주세요
          </label>
          <div class="flex items-center space-x-4">
            <input
              type="file"
              id="csvFile"
              ref="fileInput"
              accept=".csv"
              class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              @change="handleFileChange"
            />
            <button
              type="submit"
              class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              :disabled="!selectedFile || isUploading"
            >
              {{ isUploading ? '업로드 중...' : '업로드' }}
            </button>
          </div>
        </div>
      </form>
      
      <!-- 업로드 상태 표시 -->
      <div v-if="uploadStatus" class="mt-4">
        <div
          :class="{
            'text-green-500': uploadStatus.type === 'success',
            'text-red-500': uploadStatus.type === 'error'
          }"
          class="text-sm"
        >
          {{ uploadStatus.message }}
        </div>
      </div>
    </div>
    
    <!-- 업로드 이력 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-medium mb-4">업로드 이력</h2>
      
      <div class="divide-y divide-gray-100">
        <div
          v-for="(file, index) in uploadHistory"
          :key="index"
          class="py-4 flex justify-between items-center"
        >
          <div>
            <div class="font-medium">{{ file.name }}</div>
            <div class="text-sm text-gray-500">{{ file.uploadedAt }}</div>
          </div>
          <div class="text-sm text-gray-500">
            {{ file.status }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'

const userStore = useUserStore()
const selectedFile = ref(null)
const isUploading = ref(false)
const uploadStatus = ref(null)
const uploadHistory = ref([])

console.log("userStore 정보:", {
  userId: userStore.userId,
  token: localStorage.getItem('accessToken')
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file && file.name.endsWith('.csv')) {
    selectedFile.value = file
    uploadStatus.value = null
    console.log("선택된 파일:", selectedFile.value)
  } else {
    selectedFile.value = null
    uploadStatus.value = {
      type: 'error',
      message: 'CSV 파일만 업로드할 수 있습니다.'
    }
  }
}

const handleCsvUpload = async (event) => {
  if (!selectedFile.value) return
  
  isUploading.value = true
  const formData = new FormData()
  formData.append('csv', selectedFile.value)
  
  const token = localStorage.getItem('accessToken')
  console.log("업로드 시작:", {
    file: selectedFile.value,
    token: token
  })

  try {
    const response = await api.post(
      `/user/${userStore.userId}/record/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    console.log("업로드 응답:", response)
    
    uploadStatus.value = {
      type: 'success',
      message: '파일이 성공적으로 업로드되었습니다.'
    }

    // 업로드 이력에 추가
    uploadHistory.value.unshift({
      name: selectedFile.value.name,
      uploadedAt: new Date().toLocaleString(),
      status: '완료'
    })

    selectedFile.value = null
    // 파일 input 초기화
    event.target.reset()

  } catch (error) {
    console.error('업로드 에러:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    
    uploadStatus.value = {
      type: 'error',
      message: error.response?.data?.message || '파일 업로드에 실패했습니다.'
    }
  } finally {
    isUploading.value = false
  }
}
</script>