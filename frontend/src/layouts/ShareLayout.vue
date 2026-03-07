<template>
  <div class="min-h-screen text-gray-800 pb-20" :style="{ backgroundColor: themeColor }">
    <!-- 顶部主控面板 (只读精简版) -->
    <div class="sticky top-0 left-0 right-0 z-50 pt-2 pb-1.5 px-3 sm:px-4 md:px-6 pointer-events-none flex justify-center">
      <div class="w-full max-w-[1600px] bg-white/95 backdrop-blur-3xl rounded-[1.35rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] px-4 py-3 flex items-center justify-between pointer-events-auto border border-white">
        
        <div class="flex items-center gap-2">
          <span class="text-xl sm:text-2xl drop-shadow-sm">🐾</span> 
          <div class="flex flex-col">
            <span class="text-sm border-b-2 border-accent inline-block font-bold text-accent">{{ classInfo?.system_name || '班级宠物屋' }}</span>
            <span class="text-base sm:text-lg font-black tracking-wide text-slate-700">{{ classInfo?.name || '加载中...' }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- 搜索栏 -->
          <div class="relative w-full sm:w-48 md:w-64 shrink-0">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span class="text-slate-400 text-sm">🔍</span>
            </div>
            <input v-model="searchQuery" type="text" placeholder="搜索宝宝姓名..."
              class="w-full pl-9 pr-4 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all shadow-inner font-medium text-slate-700 placeholder-slate-400" />
            <button v-if="searchQuery" @click="searchQuery = ''"
              class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
              ✕
            </button>
          </div>

          <nav class="flex items-center gap-1">
            <router-link :to="`/share/${route.params.share_code}`"
              class="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all"
              :class="route.path === `/share/${route.params.share_code}` ? 'bg-cyan-50 text-[#0bc7cf]' : 'text-slate-500 hover:bg-slate-50'">
              🏠 <span class="hidden sm:inline">动态</span>
            </router-link>
            <router-link :to="`/share/${route.params.share_code}/leaderboard`"
              class="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all"
              :class="route.path.endsWith('/leaderboard') ? 'bg-cyan-50 text-[#0bc7cf]' : 'text-slate-500 hover:bg-slate-50'">
              🏆 <span class="hidden sm:inline">排行</span>
            </router-link>
          </nav>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <main v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin text-4xl text-accent">🐾</div>
    </main>
    <main v-else-if="error" class="flex justify-center items-center py-20">
      <div class="text-center bg-white p-8 rounded-3xl shadow-sm">
        <div class="text-6xl mb-4">😿</div>
        <div class="text-lg font-bold text-gray-700">{{ error }}</div>
      </div>
    </main>
    <main v-else class="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 py-4">
      <router-view v-if="classInfo" :class-info="classInfo" :students="students" :groups="groups" :search-query="searchQuery" />
    </main>
    
    <!-- 底部标识 -->
    <div class="fixed bottom-4 left-0 right-0 text-center text-xs font-bold text-black/20 pointer-events-none">
      只读展示模式 · 家长围观专用
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import api from '../utils/api'

const route = useRoute()
const classInfo = ref(null)
const students = ref([])
const groups = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')

const themeColor = computed(() => {
  const theme = classInfo.value?.theme || 'pink'
  const colors = {
    pink: '#fef5b5', blue: '#e0f2fe', green: '#dcfce7',
    purple: '#f3e8ff', orange: '#ffedd5', red: '#fee2e2',
    teal: '#ccfbf1', yellow: '#fef9c3'
  }
  return colors[theme] || '#fef5b5'
})

onMounted(async () => {
  const code = route.params.share_code
  try {
    const res = await api.get(`/public/${code}/class`)
    classInfo.value = res.classInfo
    students.value = res.students
    groups.value = res.groups
  } catch (err) {
    error.value = err.error || '无法加载班级信息，链接可能已失效。'
  } finally {
    loading.value = false
  }
})
</script>
