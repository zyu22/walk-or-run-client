import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { decodeJWT } from '@/util/jwt'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    userRole: null,
    userEmail: null
  }),
  actions: {
    updateUserInfo(accessToken) {
      const tokenPayload = decodeJWT(accessToken);
      if (tokenPayload) {
        this.userId = tokenPayload.userId;
        this.userRole = tokenPayload.userRole;
        this.userEmail = tokenPayload.userEmail;
      }
    },
    clearUserInfo() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.userId = null;
      this.userRole = null;
      this.userEmail = null;
    }
  }
})