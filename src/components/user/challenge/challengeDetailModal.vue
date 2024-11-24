// components/ChallengeDetailModal.vue
<template>
  <Modal @close="$emit('close')">
    <div class="p-6">
      <!-- 챌린지 정보 -->
      <div class="border-b pb-6">
        <h3 class="mb-4 text-xl font-bold">{{ challenge.title }}</h3>
        <div class="mb-4">
          <span
            class="rounded-full px-3 py-1 text-sm"
            :class="getChallengeTypeColor(challenge.type)"
          >
            {{ challenge.type }}
          </span>
        </div>
        <p class="mb-4 text-gray-600">{{ challenge.description }}</p>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">기간</span>
            <span>{{ challenge.period }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">참여자</span>
            <span>{{ challenge.participants.toLocaleString() }}명</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">달성률</span>
            <span>{{ challenge.progress }}%</span>
          </div>
        </div>
      </div>

      <!-- 참여하기 버튼 -->
      <div class="border-b py-4">
        <button
          class="w-full rounded-lg bg-[#ff6f3b] py-2 text-white transition-colors hover:bg-[#ff825c]"
        >
          참여하기
        </button>
      </div>

      <!-- 댓글 입력 -->
      <div class="border-b py-4">
        <div class="flex gap-2">
          <input
            v-model="newComment"
            type="text"
            placeholder="댓글을 입력하세요"
            class="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            @keyup.enter="addComment"
          />
          <button
            @click="addComment"
            class="rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            등록
          </button>
        </div>
      </div>

      <!-- 댓글 목록 -->
      <div class="space-y-4 py-4">
        <div v-if="comments.length === 0" class="py-8 text-center text-gray-500">
          첫 댓글을 작성해보세요!
        </div>
        <div
          v-for="comment in paginatedComments"
          :key="comment.id"
          class="border-b pb-4 last:border-0"
        >
          <div class="mb-2 flex items-start justify-between">
            <div>
              <span class="font-semibold">{{ comment.username }}</span>
              <span class="ml-2 text-sm text-gray-500">{{ comment.date }}</span>
            </div>
            <button
              v-if="comment.isMyComment"
              @click="deleteComment(comment.id)"
              class="text-sm text-gray-500 hover:text-red-500"
            >
              삭제
            </button>
          </div>
          <p class="text-gray-700">{{ comment.content }}</p>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="comments.length > 0" class="flex justify-center gap-2 pt-4">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="rounded px-3 py-1"
            :class="
              currentPage === page
                ? 'bg-[#ff6f3b] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            "
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import Modal from '@/components/user/dashboard/modal.vue'

const props = defineProps({
  challenge: {
    type: Object,
    required: true,
  },
})

// 댓글 관련 상태
const newComment = ref('')
const currentPage = ref(1)
const commentsPerPage = 5

// 샘플 댓글 데이터
const comments = ref([
  {
    id: 1,
    username: 'Runner001',
    content: '이번 챌린지 꼭 완주하고 싶어요! 화이팅!',
    date: '2024-03-21 10:30',
    isMyComment: true,
  },
  {
    id: 2,
    username: 'healthyLife',
    content: '저번에도 참여했는데 정말 좋았어요. 이번에도 참여합니다!',
    date: '2024-03-21 11:15',
    isMyComment: false,
  },
  {
    id: 3,
    username: 'walkingQueen',
    content: '함께하실 분 구해요~',
    date: '2024-03-21 12:00',
    isMyComment: false,
  },
])

// 페이지네이션된 댓글
const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * commentsPerPage
  const end = start + commentsPerPage
  return comments.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(comments.value.length / commentsPerPage))

// 댓글 추가
const addComment = () => {
  if (!newComment.value.trim()) return

  comments.value.unshift({
    id: Date.now(),
    username: '현재사용자', // 실제로는 로그인된 사용자 정보 사용
    content: newComment.value,
    date: new Date().toLocaleString(),
    isMyComment: true,
  })

  newComment.value = ''
  currentPage.value = 1
}

// 댓글 삭제
const deleteComment = (commentId) => {
  const confirm = window.confirm('댓글을 삭제하시겠습니까?')
  if (confirm) {
    comments.value = comments.value.filter((comment) => comment.id !== commentId)

    // 페이지 조정
    const maxPage = Math.ceil(comments.value.length / commentsPerPage)
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage || 1
    }
  }
}

// 챌린지 타입별 색상
const getChallengeTypeColor = (type) => {
  const colors = {
    Daily: 'bg-orange-100 text-orange-600',
    Weekly: 'bg-green-100 text-green-600',
    Monthly: 'bg-blue-100 text-blue-600',
    Event: 'bg-purple-100 text-purple-600',
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}
</script>
