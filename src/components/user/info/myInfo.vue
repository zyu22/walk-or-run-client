<!-- components/user/myInfo.vue -->
<template>
  <div>
    <header class="mb-8 flex items-center justify-between overflow-hidden">
      <div>
        <h1 class="bg-white font-paperlogy text-5xl font-bold text-gray-900">내 정보 관리</h1>
        <p class="mt-2 text-sm text-gray-600">내 정보를 수정할 수 있어요!</p>
      </div>
    </header>

    <div class="flex h-full flex-col rounded-lg bg-white p-10 shadow-lg">
      <div class="mx-auto my-auto w-2/5 p-6">
        <form @submit.prevent="updateUserInfo" class="w-full space-y-6">
          <div class="grid grid-cols-1 gap-8">
            <!-- 이메일 필드 -->
            <div class="flex flex-col space-y-1">
              <label for="email" class="mb-2 block text-sm">이메일</label>
              <input
                readonly="true"
                id="email"
                v-model="userInfo.email"
                type="email"
                class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <!-- w-96 h-[50px] px-3 py-3 -->
            </div>

            <!-- 이름 필드 -->
            <div class="flex flex-col space-y-1">
              <label for="name" class="mb-2 block text-sm">이름</label>
              <input
                id="name"
                v-model="userInfo.name"
                type="text"
                class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <!-- 닉네임 필드 -->
            <div class="flex flex-col space-y-1">
              <label for="nickname" class="mb-2 block text-sm">닉네임</label>
              <div class="flex gap-2">
                <!-- 입력창과 버튼을 감싸는 flex 컨테이너 -->
                <input
                  id="nickname"
                  v-model="userInfo.nickname"
                  type="text"
                  class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  @click="checkNicknameDuplicate"
                  class="whitespace-nowrap rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                  :disabled="!userInfo.nickname || isCheckingNickname"
                >
                  {{ isCheckingNickname ? '확인 중...' : '중복 확인' }}
                </button>
              </div>
              <!-- 중복 확인 결과 메시지 -->
              <p
                v-if="nicknameMessage"
                :class="[
                  'text-sm',
                  { 'text-green-500': isNicknameAvailable, 'text-red-500': !isNicknameAvailable },
                ]"
              >
                {{ nicknameMessage }}
              </p>
            </div>

            <!-- 전화번호 필드 -->
            <div class="flex flex-col space-y-1">
              <label for="phone" class="mb-2 block text-sm">전화번호</label>
              <input
                id="phone"
                v-model="userInfo.phoneNumber"
                type="tel"
                class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <!-- 버튼 그룹 -->
          <div class="flex justify-center space-x-4 pt-4">
            <button
              type="submit"
              class="rounded-lg bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600"
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()

// 닉네임 중복 확인 관련 상태 추가
const isCheckingNickname = ref(false)
const isNicknameAvailable = ref(false)
const nicknameMessage = ref('')

const userStore = useUserStore()
const userInfo = reactive({
  email: '',
  name: '',
  nickname: '',
  phoneNumber: '',
})

// 유저 정보 수정
const updateUserInfo = async () => {
  if (!isNicknameAvailable.value && userInfo.nickname !== userStore.userNickname) {
    nicknameMessage.value = '닉네임 중복확인을 해주세요.'
    return
  }

  try {
    const response = await api.put(`user/${userStore.userId}`, {
      userId: userStore.userId,
      userName: userInfo.name,
      userNickname: userInfo.nickname,
      userPhoneNumber: userInfo.phoneNumber,
    })

    if (response.status === 200) {
      alertStore.showNotify('성공', '정보가 성공적으로 수정되었습니다.', 'success', 'top-right')
      await getUserInfo()
    }
  } catch (error) {
    console.error('정보 업데이트 실패:', error)
    alertStore.showNotify('오류', '정보 수정에 실패하였습니다.', 'error', 'top-right')
  }
}

// 닉네임 중복 확인 함수
const checkNicknameDuplicate = async () => {
  if (!userInfo.nickname) {
    nicknameMessage.value = '닉네임을 입력해주세요.'
    return
  }
  isCheckingNickname.value = true
  nicknameMessage.value = ''

  try {
    const response = await api.get('auth/valid-nickname', {
      params: {
        nickname: userInfo.nickname,
      },
    })

    if (response.data.message == 1) {
      nicknameMessage.value = '이미 사용 중인 닉네임입니다.'
      isNicknameAvailable.value = false
    } else {
      nicknameMessage.value = '사용 가능한 닉네임입니다.'
      isNicknameAvailable.value = true
    }
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error)
    nicknameMessage.value = '중복 확인에 실패했습니다. 다시 시도해주세요.'
    isNicknameAvailable.value = false
  } finally {
    isCheckingNickname.value = false
  }
}

// 유저 정보 조회
const getUserInfo = async () => {
  try {
    const response = await api.get(`user/${userStore.userId}`)
    if (response.status === 200) {
      userInfo.email = response.data.userEmail
      userInfo.name = response.data.userName
      userInfo.nickname = response.data.userNickname
      userInfo.phoneNumber = response.data.userPhoneNumber
    }
  } catch (error) {
    alertStore.showNotify({
      title: '알림',
      message: '유저 정보를 조회해오지 못하였습니다.',
      type: 'error',
      position: 'top-right',
    })
  }
}

onMounted(getUserInfo)
</script>
