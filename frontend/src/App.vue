<template>
  <div class="w-full max-w-[100vw] overflow-x-hidden">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (auth.token) {
    try {
      await auth.fetchUser()
      if (!auth.isActivated) router.push('/activate')
    } catch {
      auth.logout()
      router.push('/login')
    }
  }
})
</script>
