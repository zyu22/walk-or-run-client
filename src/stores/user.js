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
    updateUserInfo(accessToken) {
      const tokenPayload = decodeJWT(accessToken)
      if (tokenPayload) {
        this.userId = tokenPayload.userId
        this.userRole = tokenPayload.userRole
        this.userEmail = tokenPayload.sub

        console.log('userId:', this.userId)
        console.log('userRole:', this.userRole)
        console.log('userEmail:', this.userEmail)
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
