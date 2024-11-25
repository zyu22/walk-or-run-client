import { ref } from 'vue'

export const useValidation = () => {
  const isStartDateValid = ref(true)
  const isEndDateValid = ref(true)

  const validateDates = (startDate, endDate) => {
    isStartDateValid.value = startDate !== ''
    isEndDateValid.value = endDate !== ''

    if (!isStartDateValid.value) {
      return { isValid: false, message: '시작일을 선택해주세요.' }
    }

    if (!isEndDateValid.value) {
      return { isValid: false, message: '종료일을 선택해주세요.' }
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end < start) {
      isStartDateValid.value = false
      isEndDateValid.value = false
      return { isValid: false, message: '시작일은 종료일 이전이어야 합니다.' }
    }

    return { isValid: true }
  }

  return {
    isStartDateValid,
    isEndDateValid,
    validateDates,
  }
}
