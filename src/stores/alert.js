import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state: () => ({
    // 알림용
    notify: {
      isOpen: false,
      title: '',
      message: '',
      type: 'success',
      position: 'top-right',
    },
    // 확인용
    confirm: {
      isOpen: false,
      title: '',
      message: '',
      type: '', // type 추가 (success, error, 또는 빈 문자열)
      onConfirm: null,
      onCancel: null,
    },
  }),

  actions: {
    showNotify({ title, message, type = 'success', position = 'top-right' }) {
      this.notify = { isOpen: true, title, message, type, position }

      if (position === 'top-right') {
        setTimeout(() => this.closeNotify(), 3000)
      }
    },

    showConfirm({ title, message, type = '', onConfirm, onCancel }) {
      // type 매개변수 추가
      this.confirm = { isOpen: true, title, message, type, onConfirm, onCancel }
    },

    closeNotify() {
      this.notify.isOpen = false
    },

    closeConfirm(confirmed = false) {
      if (confirmed && this.confirm.onConfirm) {
        this.confirm.onConfirm()
      } else if (!confirmed && this.confirm.onCancel) {
        this.confirm.onCancel()
      }
      this.confirm.isOpen = false
    },
  },
})
