<template>
  <div class="w-full max-w-full min-h-screen">
    <router-view />
    <UpdateNoticeModal v-if="auth.token" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import UpdateNoticeModal from './components/UpdateNoticeModal.vue'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (auth.token) {
    try {
      await auth.fetchUser()
    } catch {
      auth.logout()
      router.push('/login')
    }
  }
})
</script>
