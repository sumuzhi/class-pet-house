<template>
  <div
    class="relative min-h-screen overflow-x-clip pb-[calc(96px+max(env(safe-area-inset-bottom),18px))] text-gray-800"
    :style="{ backgroundColor: themeColor }"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.52),transparent_62%)]"></div>
    <div class="pointer-events-none absolute -left-20 top-24 h-40 w-40 rounded-full bg-white/25 blur-3xl"></div>
    <div class="pointer-events-none absolute -right-12 top-32 h-52 w-52 rounded-full bg-accent/10 blur-3xl"></div>

    <!-- 顶部主控面板 (只读精简版) -->
    <div class="sticky top-0 left-0 right-0 z-50 px-3 pb-2 pt-3 sm:px-4 md:px-6 pointer-events-none flex justify-center">
      <div class="pointer-events-auto w-full max-w-[1320px] overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/86 px-4 py-4 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur-3xl sm:px-5 sm:py-5">
        <div class="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
          <div class="flex min-w-0 items-start justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-[0_10px_24px_-18px_rgba(14,165,233,0.9)] ring-1 ring-white/80">
                <span class="text-2xl drop-shadow-sm">🐾</span>
              </div>
              <div class="min-w-0">
                <div class="mb-1 flex items-center gap-2">
                  <span class="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-accent">
                    {{ classInfo?.system_name || '班级宠物屋' }}
                  </span>
                  <span class="hidden sm:inline text-[11px] font-bold tracking-[0.18em] text-slate-400">PARENT SHARE</span>
                </div>
                <div class="truncate text-lg font-black tracking-tight text-slate-800 sm:text-2xl">
                  {{ classInfo?.name || '加载中...' }}
                </div>
                <p class="mt-1 text-xs font-semibold text-slate-400 sm:text-sm">
                  家长查看模式 · 只读展示 · 实时同步班级宠物成长
                </p>
              </div>
            </div>
            <div class="md:hidden shrink-0 rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-slate-500 shadow-sm">
              家长端
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-3 md:w-auto md:min-w-[440px] md:flex-row md:items-center md:justify-end">
            <div class="relative min-w-0 flex-1 md:max-w-sm">
              <div class="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M14.166 14.167 17.5 17.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <circle cx="8.75" cy="8.75" r="5.75" stroke="currentColor" stroke-width="1.8"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索宝宝姓名..."
                class="h-12 w-full rounded-[1.1rem] border border-white/70 bg-slate-50/85 pl-11 pr-10 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-accent/60 focus:bg-white focus:ring-[4px] focus:ring-accent/12"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition-colors hover:text-slate-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <!-- 桌面端导航 -->
            <nav class="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/85 p-1.5 md:flex">
              <router-link
                :to="homePath"
                class="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black transition-all duration-300"
                :class="isHome ? 'bg-white text-accent shadow-[0_8px_20px_-12px_rgba(14,165,233,0.8)] ring-1 ring-accent/10' : 'text-slate-500 hover:text-slate-800'"
              >
                <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4.75 10.75 12 4l7.25 6.75V19a1.25 1.25 0 0 1-1.25 1.25h-3.5V14.5h-5V20.25H6A1.25 1.25 0 0 1 4.75 19v-8.25Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                </svg>
                动态
              </router-link>
              <router-link
                :to="leaderboardPath"
                class="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black transition-all duration-300"
                :class="isLeaderboard ? 'bg-white text-accent shadow-[0_8px_20px_-12px_rgba(14,165,233,0.8)] ring-1 ring-accent/10' : 'text-slate-500 hover:text-slate-800'"
              >
                <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 19.25V10.75M12 19.25V5.75M18 19.25V13.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M4.75 19.25h14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
                排行
              </router-link>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <main v-if="loading" class="flex justify-center items-center py-32">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-bounce text-5xl text-accent drop-shadow-lg">🐾</div>
        <p class="text-slate-500 font-bold animate-pulse">正在加载班级信息...</p>
      </div>
    </main>
    <main v-else-if="error" class="flex justify-center items-center min-h-[60vh] px-4">
      <div class="text-center bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-white max-w-md w-full">
        <div class="text-7xl mb-6 drop-shadow-md">😿</div>
        <h3 class="text-xl font-black text-slate-800 mb-2">出错了</h3>
        <p class="text-base font-medium text-slate-500">{{ error }}</p>
      </div>
    </main>
    <main v-else class="relative z-10 mx-auto w-full max-w-[1320px] px-3 py-2 sm:px-4 sm:py-4 md:px-6">
      <router-view v-if="classInfo" :class-info="classInfo" :students="students" :groups="groups" :search-query="searchQuery" />
    </main>
    
    <!-- 移动端底部 TabBar -->
    <div class="pointer-events-none fixed inset-x-0 bottom-[max(env(safe-area-inset-bottom),12px)] z-50 flex justify-center px-3 md:hidden">
      <nav class="pointer-events-auto grid w-full max-w-md grid-cols-2 gap-2 rounded-[1.9rem] border border-white/65 bg-white/80 p-2 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
        <router-link
          :to="homePath"
          class="group relative flex min-w-0 items-center justify-center rounded-[1.45rem] px-3 py-3 transition-all duration-300"
          :class="isHome ? 'bg-accent text-white shadow-[0_16px_28px_-18px_rgba(14,165,233,0.85)]' : 'text-slate-500 hover:bg-white/70'"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300"
              :class="isHome ? 'bg-white/18 shadow-inner' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70'"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4.75 10.75 12 4l7.25 6.75V19a1.25 1.25 0 0 1-1.25 1.25h-3.5V14.5h-5V20.25H6A1.25 1.25 0 0 1 4.75 19v-8.25Z" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="min-w-0 text-left">
              <div class="text-[13px] font-black tracking-[0.08em]">动态</div>
              <div class="text-[10px] font-bold opacity-75">全班成长</div>
            </div>
          </div>
        </router-link>

        <router-link
          :to="leaderboardPath"
          class="group relative flex min-w-0 items-center justify-center rounded-[1.45rem] px-3 py-3 transition-all duration-300"
          :class="isLeaderboard ? 'bg-accent text-white shadow-[0_16px_28px_-18px_rgba(14,165,233,0.85)]' : 'text-slate-500 hover:bg-white/70'"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300"
              :class="isLeaderboard ? 'bg-white/18 shadow-inner' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70'"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 19.25V10.75M12 19.25V5.75M18 19.25V13.75" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
                <path d="M4.75 19.25h14.5" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="min-w-0 text-left">
              <div class="text-[13px] font-black tracking-[0.08em]">排行</div>
              <div class="text-[10px] font-bold opacity-75">光荣榜单</div>
            </div>
          </div>
        </router-link>
      </nav>
    </div>

    <!-- 底部标识 (由于有了 TabBar，移动端隐藏，桌面端保留) -->
    <div class="hidden md:block fixed bottom-4 left-0 right-0 text-center text-[10px] sm:text-xs font-bold text-black/20 pointer-events-none tracking-widest z-0">
      只读展示模式 · 家长围观专用
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../utils/api'

const route = useRoute()
const classInfo = ref(null)
const students = ref([])
const groups = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const homePath = computed(() => `/share/${route.params.share_code}`)
const leaderboardPath = computed(() => `/share/${route.params.share_code}/leaderboard`)
const isHome = computed(() => route.path === homePath.value)
const isLeaderboard = computed(() => route.path.endsWith('/leaderboard'))

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
