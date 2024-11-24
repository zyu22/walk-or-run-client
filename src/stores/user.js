import { defineStore } from 'pinia'
import { decodeJWT } from '@/util/jwt'

export const useUserStore = defineStore('user', {
  persist: true,
  state: () => ({
    userId: null,
    userRole: null,
    userEmail: null,
  }),
  actions: {
    async updateUserInfo(accessToken) {
      const tokenPayload = decodeJWT(accessToken)
      console.log('Token Payload:', tokenPayload) // 토큰 내용 먼저 확인
      if (tokenPayload) {
        // 값 할당 전에 로깅
        console.log('About to update store with:', {
          userId: tokenPayload.userId,
          userRole: tokenPayload.userRole,
          email: tokenPayload.sub,
        })

        // 개별적으로 값 할당하면서 확인
        this.userId = tokenPayload.userId
        console.log('After userId update:', this.userId)

        this.userRole = tokenPayload.userRole
        console.log('After userRole update:', this.userRole)

        this.userEmail = tokenPayload.sub
        console.log('After userEmail update:', this.userEmail)
      }
    },
    clearUserInfo() {
      // localStorage 키 이름을 일관되게 수정
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      // store 상태 초기화
      this.userId = null
      this.userRole = null
      this.userEmail = null
    },
  },
})
