// stores/alert.js
import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state: () => ({
    isNotifyOpen: false,
    notifyTitle: '',
    notifyMessage: '',
    notifyType: 'success',
    notifyPosition: 'top-right', // 기본값
  }),

  actions: {
    showNotify(title, message, type = 'success', position = 'top-right') {
      this.isNotifyOpen = true
      this.notifyTitle = title
      this.notifyMessage = message
      this.notifyType = type
      this.notifyPosition = position // 이 부분이 제대로 설정되어 있는지 확인

      // position이 top-right일 때만 자동으로 닫히도록 수정
      if (position === 'top-right') {
        setTimeout(() => {
          this.closeNotify()
        }, 3000)
      }
    },

    closeNotify() {
      this.isNotifyOpen = false
      this.notifyTitle = ''
      this.notifyMessage = ''
      this.notifyType = 'success'
      this.notifyPosition = 'top-right'
    },
  },
})
