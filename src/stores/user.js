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
        this.userId = tokenPayload.userId
        this.userRole = tokenPayload.userRole
        this.userEmail = tokenPayload.sub
      }
    },
    clearUserInfo() {
      // localStorage 키 이름을 일관되게 수정
      console.log('사라지기전: ', localStorage.getItem('accessToken'))
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      console.log('사라지고: ', localStorage.getItem('accessToken'))
      // store 상태 초기화
      this.userId = null
      this.userRole = null
      this.userEmail = null
    },
  },
})
