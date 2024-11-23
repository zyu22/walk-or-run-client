<!-- components/user/myInfo.vue -->
<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="mx-auto w-2/5 p-8">
      <h1 class="font-paperlogy mb-8 text-2xl">내 정보 관리</h1>

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
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios' // axios 대신 api 인스턴스 사용
const router = useRouter()
const userStore = useUserStore()
const userInfo = reactive({
  email: '',
  name: '',
  nickname: '',
  phoneNumber: '',
})

// 유저 정보 수정
const updateUserInfo = async () => {
  //  if (!isNicknameAvailable.value && userInfo.nickname !== userStore.userNickname) {
  //    alert('닉네임 중복 확인을 해주세요.')
  //    return
  // }

  try {
    const response = await api.put(`user/${userStore.userId}`, {
      userId: userStore.userId,
      userName: userInfo.name,
      userNickname: userInfo.nickname,
      userPhoneNumber: userInfo.phoneNumber,
    })

    if (response.status === 200) {
      alert('정보가 성공적으로 수정되었습니다.')
      await getUserInfo()
    }
  } catch (error) {
    console.error('정보 업데이트 실패:', error)
    alert('정보 수정에 실패했습니다. 다시 시도해주세요.')
  }
}

// 닉네임 중복 확인 관련 상태 추가
const isCheckingNickname = ref(false)
const isNicknameAvailable = ref(false)
const nicknameMessage = ref('')

// 닉네임 중복 확인 함수
const checkNicknameDuplicate = async () => {
  console.log('userInfo : ', userInfo.nickname)
  console.log('userStore: ', userStore.userNickname)
  if (!userInfo.nickname) {
    nicknameMessage.value = '닉네임을 입력해주세요.'
    isNicknameAvailable.value = false
    return
  }

  // 현재 사용자의 닉네임과 같다면 중복 확인 불필요
  if (userInfo.nickname === userStore.userNickname) {
    nicknameMessage.value = '현재 사용 중인 닉네임입니다.'
    isNicknameAvailable.value = true
    return
  }

  isCheckingNickname.value = true
  nicknameMessage.value = ''

  try {
    const response = await api.get(`user/check-nickname/${userInfo.nickname}`)
    isNicknameAvailable.value = response.data.available
    nicknameMessage.value = response.data.available
      ? '사용 가능한 닉네임입니다.'
      : '이미 사용 중인 닉네임입니다.'
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
    console.error('유저 정보 로드 실패:', error)
  }
}

onMounted(getUserInfo)
</script>
