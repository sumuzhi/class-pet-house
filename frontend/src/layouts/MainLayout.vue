<template>
  <div class="min-h-screen text-gray-800 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-4" :style="{ backgroundColor: 'var(--theme-bg, #fef5b5)' }">
    <!-- 顶部主控面板 -->
    <div ref="topPanelRef" class="fixed top-0 left-0 right-0 z-50 pt-2 pb-1.5 px-3 sm:px-4 md:px-6 lg:px-8 pointer-events-none flex justify-center">
      <div class="w-full max-w-[1600px] 2xl:max-w-[1800px] bg-white/95 backdrop-blur-3xl rounded-[1.35rem] sm:rounded-[1.75rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3 pointer-events-auto border border-white relative overflow-hidden">
        <!-- 装饰性元素 -->
        <div class="absolute -left-10 -top-10 w-24 h-24 bg-cyan-400 rounded-full blur-[40px] opacity-20 pointer-events-none"></div>

        <!-- 第一行: 左侧班级 & 右侧操作 -->
        <div class="flex items-center justify-between gap-1 sm:gap-2 z-10 min-w-0 w-full md:w-auto md:flex-none">
          <div ref="classDropdownRef" class="relative shrink min-w-0">
            <button
              type="button"
              :disabled="classSwitching"
              @click="toggleClassDropdown"
              class="group flex w-full items-center gap-1 sm:gap-1.5 rounded-full border border-slate-100 bg-slate-50 hover:bg-slate-100 px-2 sm:px-3 py-1 text-slate-700 transition-colors disabled:cursor-wait disabled:opacity-70"
            >
              <span class="text-base sm:text-lg drop-shadow-sm shrink-0">🐾</span>
              <span class="text-xs sm:text-sm font-bold tracking-wide truncate max-w-[7rem] sm:max-w-[18rem] md:max-w-[24rem]">
                {{ classStore.currentClass?.name || '默认班级' }}
              </span>
              <span class="text-[10px] text-slate-400 shrink-0 transition-transform" :class="classDropdownOpen ? 'rotate-180' : ''">▼</span>
            </button>

            <div
              v-if="classDropdownOpen"
              class="absolute left-0 top-[calc(100%+0.45rem)] min-w-[12rem] max-w-[16rem] bg-white border border-slate-100 rounded-2xl shadow-[0_14px_30px_-12px_rgba(0,0,0,0.25)] p-1.5 z-[70]"
            >
              <button
                v-for="cls in classStore.classes"
                :key="cls.id"
                type="button"
                :disabled="classSwitching"
                @click="onClassChange(cls.id)"
                class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-sm font-semibold transition-colors disabled:cursor-wait"
                :class="cls.id === classStore.currentClass?.id ? 'bg-accent text-white' : 'text-slate-600 hover:bg-slate-50'"
              >
                <span class="truncate">{{ cls.name }}</span>
                <span v-if="cls.id === classStore.currentClass?.id" class="text-xs">✓</span>
              </button>
            </div>
          </div>

          <!-- 功能按钮 -->
          <div v-if="route.path === '/'" class="flex shrink-0 items-center justify-end gap-1 sm:gap-1.5 pl-1 ml-auto">
            <button @click="batchMode = !batchMode; if (batchMode) groupMode = false"
              class="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-sm font-bold transition-colors border"
              :class="batchMode ? 'bg-accent text-white border-accent shadow-md shadow-accent/20' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 shadow-sm'">
              <span class="text-sm sm:text-base text-[#0bc7cf]" :class="batchMode ? '!text-white' : ''">👥</span>
              <span class="hidden min-[400px]:inline">批量</span>
            </button>
            <button @click="groupMode = !groupMode; if (groupMode) batchMode = false"
              class="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-sm font-bold transition-colors border"
              :class="groupMode ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 shadow-sm'">
              <span class="text-sm sm:text-base" :class="groupMode ? 'text-white' : 'text-purple-400'">📋</span>
              <span class="hidden min-[400px]:inline">分组</span>
            </button>
            <div class="relative shrink-0">
              <select v-model="sortMode" class="appearance-none bg-sky-50 text-sky-600 border border-sky-100 rounded-full pl-2 sm:pl-3 pr-4 sm:pr-6 py-1 text-[11px] sm:text-sm font-bold outline-none cursor-pointer hover:bg-sky-100 transition-colors shadow-sm h-full flex items-center w-[4.5rem] sm:w-auto">
                <option value="manual">排序 ⇅</option>
                <option value="name">字典</option>
                <option value="food">食物</option>
                <option value="progress">进度</option>
              </select>
              <span class="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-[8px] text-sky-400">▼</span>
            </div>
          </div>
        </div>

        <!-- 搜索框 (移动端第二行，桌面端中间flex-1) -->
        <div v-if="route.path === '/'" class="relative z-10 w-full md:flex-1 md:min-w-[240px] md:max-w-md">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input v-model="searchQuery" type="text" placeholder="搜索学生..."
            class="w-full min-w-0 pl-10 pr-4 py-1.5 bg-slate-100/80 rounded-full border-none text-sm focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all font-bold text-slate-600 placeholder-slate-400" />
        </div>

        <!-- 桌面端导航链接 (仅md及以上显示) -->
        <nav class="hidden md:flex items-center gap-1 z-10 shrink-0">
          <router-link to="/"
            class="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-bold transition-all"
            :class="route.path === '/' ? 'bg-cyan-50 text-[#0bc7cf]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'">
            🏠 首页
          </router-link>
          <router-link to="/shop"
            class="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-bold transition-all"
            :class="route.path.startsWith('/shop') ? 'bg-cyan-50 text-[#0bc7cf]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'">
            🛍️ 小卖部
          </router-link>
          <router-link to="/leaderboard"
            class="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-bold transition-all"
            :class="route.path.startsWith('/leaderboard') ? 'bg-cyan-50 text-[#0bc7cf]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'">
            🏆 光荣榜
          </router-link>
          <router-link to="/settings"
            class="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-bold transition-all"
            :class="route.path.startsWith('/settings') ? 'bg-cyan-50 text-[#0bc7cf]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'">
            ⚙️ 设置
          </router-link>
        </nav>
      </div>
    </div>
    <div :style="{ height: `${topPanelHeight}px` }"></div>

    <!-- 分组筛选栏 (极简高级圆角)只在首页展示，并且在分组管理模式下隐藏 -->
    <div v-if="classStore.groups.length && route.path === '/' && !groupMode" class="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-2 sm:mt-3 mb-0 relative z-40">
      <div class="bg-white/60 backdrop-blur-md border border-white/80 rounded-full px-1.5 py-1 flex gap-1 overflow-x-auto shadow-sm w-full sm:w-auto">
        <button @click="activeGroup = null; groupMode = false"
          :class="activeGroup === null ? 'bg-accent/10 text-accent font-extrabold' : 'text-slate-500 hover:bg-white/60'"
          class="px-3.5 py-1 rounded-full text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>全部同学</span>
          <span v-if="activeGroup === null" class="text-[10px] bg-accent/20 px-1.5 py-0.5 rounded-full">{{ groupStats.allCount }}</span>
        </button>
        <button v-for="g in groupStats.groupsList" :key="g.id" @click="activeGroup = g.id; groupMode = false"
          :class="activeGroup === g.id ? 'bg-accent/10 text-accent font-extrabold' : 'text-slate-500 hover:bg-white/60'"
          class="px-3.5 py-1 rounded-full text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>{{ g.name }}</span>
          <span v-if="activeGroup === g.id" class="text-[10px] bg-accent/20 px-1.5 py-0.5 rounded-full">{{ g.count }}</span>
        </button>
        <button @click="activeGroup = 'ungrouped'; groupMode = false"
          :class="activeGroup === 'ungrouped' ? 'bg-accent/10 text-accent font-extrabold' : 'text-slate-500 hover:bg-white/60'"
          class="px-3.5 py-1 rounded-full text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>未分组</span>
          <span v-if="activeGroup === 'ungrouped'" class="text-[10px] bg-accent/20 px-1.5 py-0.5 rounded-full">{{ groupStats.ungroupedCount }}</span>
        </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 flex-1">
      <router-view
        :search-query="searchQuery"
        :batch-mode="batchMode"
        :undo-mode="undoMode"
        :active-group="activeGroup"
        :sort-mode="sortMode"
        :group-mode="groupMode"
        :selected-students="selectedStudents"
        @select-student="toggleStudent"
        @exit-group-mode="groupMode = false"
      />
    </main>

    <!-- 批量操作底栏 (浮动卡片式) 注意移动端高度需要更高以避开TabBar -->
    <div v-if="batchMode" class="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] border-2 border-white rounded-2xl px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center gap-4 md:gap-6 z-50 w-[calc(100%-1rem)] sm:w-[90%] md:w-auto max-w-sm md:max-w-none">
      <span class="font-bold text-gray-600">已选 <span class="text-accent text-xl mx-1">{{ selectedIds.length }}</span> 人</span>
      <div class="flex gap-3">
        <button @click="toggleSelectAll" class="btn-toy px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-600">
          {{ isAllSelected ? '取消全选' : '全选同学们' }}
        </button>
        <button @click="showBatchScoreModal = true" :disabled="!selectedIds.length"
          class="btn-toy px-6 py-2.5 bg-accent text-white rounded-xl text-sm font-bold disabled:opacity-50 shadow-[0_4px_0_var(--theme-shadow-hard)] flex items-center gap-2">
          <span class="text-lg">✨</span> 批量喂养
        </button>
      </div>
    </div>

    <!-- 批量喂养弹窗 -->
    <ScoreRuleModal
      v-if="showBatchScoreModal"
      :student="null"
      :batch-ids="selectedIds"
      @close="showBatchScoreModal = false"
      @scored="onBatchScored"
    />

    <!-- 随机点名 -->
    <RandomPick v-if="showRandomPick" @close="showRandomPick = false" />

    <!-- 课堂计时器 -->
    <ClassTimer v-if="showTimer" @close="showTimer = false" />

  </div>

  <!-- 底部 TabBar (仅移动端显示) -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-[999] bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-slate-100 pb-[env(safe-area-inset-bottom)]">
    <nav class="max-w-5xl mx-auto flex items-center justify-around px-2 py-2 bg-white relative">
      <router-link to="/" class="flex flex-col items-center justify-center transition-all relative group w-16 h-14 rounded-2xl" :class="route.path === '/' ? 'bg-cyan-50/80 text-[#0bc7cf] font-black scale-105' : 'text-slate-400 hover:bg-slate-50'">
        <span class="text-xl sm:text-2xl mb-1 transition-transform" :class="route.path === '/' ? 'scale-110 drop-shadow-sm' : 'opacity-70 group-hover:scale-110'">🏠</span>
        <span class="text-[10px] sm:text-[11px] leading-none font-bold" :class="route.path === '/' ? 'text-[#0bc7cf]' : ''">首页</span>
      </router-link>

      <router-link to="/shop" class="flex flex-col items-center justify-center transition-all relative group w-16 h-14 rounded-2xl" :class="route.path.startsWith('/shop') ? 'bg-cyan-50/80 text-[#0bc7cf] font-black scale-105' : 'text-slate-400 hover:bg-slate-50'">
        <span class="text-xl sm:text-2xl mb-1 transition-transform" :class="route.path.startsWith('/shop') ? 'scale-110 drop-shadow-sm' : 'opacity-70 group-hover:scale-110'">🛍️</span>
        <span class="text-[10px] sm:text-[11px] leading-none font-bold" :class="route.path.startsWith('/shop') ? 'text-[#0bc7cf]' : ''">小卖部</span>
      </router-link>

      <router-link to="/leaderboard" class="flex flex-col items-center justify-center transition-all relative group w-16 h-14 rounded-2xl" :class="route.path.startsWith('/leaderboard') ? 'bg-cyan-50/80 text-[#0bc7cf] font-black scale-105' : 'text-slate-400 hover:bg-slate-50'">
        <span class="text-xl sm:text-2xl mb-1 transition-transform" :class="route.path.startsWith('/leaderboard') ? 'scale-110 drop-shadow-sm' : 'opacity-70 group-hover:scale-110'">🏆</span>
        <span class="text-[10px] sm:text-[11px] leading-none font-bold" :class="route.path.startsWith('/leaderboard') ? 'text-[#0bc7cf]' : ''">光荣榜</span>
      </router-link>

      <router-link to="/settings" class="flex flex-col items-center justify-center transition-all relative group w-16 h-14 rounded-2xl" :class="route.path.startsWith('/settings') ? 'bg-cyan-50/80 text-[#0bc7cf] font-black scale-105' : 'text-slate-400 hover:bg-slate-50'">
        <span class="text-xl sm:text-2xl mb-1 transition-transform" :class="route.path.startsWith('/settings') ? 'scale-110 drop-shadow-sm' : 'opacity-70 group-hover:scale-110'">⚙️</span>
        <span class="text-[10px] sm:text-[11px] leading-none font-bold" :class="route.path.startsWith('/settings') ? 'text-[#0bc7cf]' : ''">设置</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useClassStore } from '../stores/class'
import { useTheme } from '../composables/useTheme'
import ScoreRuleModal from '../components/ScoreRuleModal.vue'
import RandomPick from '../components/RandomPick.vue'
import ClassTimer from '../components/ClassTimer.vue'
import Dialog from '../utils/dialog'

const classStore = useClassStore()
const route = useRoute()
const { setTheme } = useTheme()
const searchQuery = ref('')
const batchMode = ref(false)
const groupMode = ref(false)
const undoMode = ref(false)
const activeGroup = ref(null)
const sortMode = ref('manual')
const selectedIds = ref([])
const classSwitching = ref(false)
const classDropdownOpen = ref(false)
const classDropdownRef = ref(null)
const showBatchScoreModal = ref(false)
const showRandomPick = ref(false)
const showTimer = ref(false)
const topPanelRef = ref(null)
const topPanelHeight = ref(120)
let topPanelObserver = null

function updateTopPanelHeight() {
  const el = topPanelRef.value
  if (!el) return
  topPanelHeight.value = Math.ceil(el.getBoundingClientRect().height)
}

// 兼容旧的 Set 接口给子组件用
const selectedStudents = computed(() => new Set(selectedIds.value))

// 带有学生数量的分组计算属性
const groupStats = computed(() => {
  const counts = {}
  if (classStore.students) {
    classStore.students.forEach(s => {
      const gid = s.group_id || 'ungrouped'
      counts[gid] = (counts[gid] || 0) + 1
    })
  }
  
  const allCount = classStore.students?.length || 0
  const ungroupedCount = counts['ungrouped'] || 0
  
  const groupsList = classStore.groups.map(g => ({
    id: g.id,
    name: g.name,
    count: counts[g.id] || 0
  }))

  return { allCount, ungroupedCount, groupsList }
})

function toggleStudent(id) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

const validStudents = computed(() => classStore.students.filter(s => s.pet_type))

const isAllSelected = computed(() => {
  return validStudents.value.length > 0 && selectedIds.value.length === validStudents.value.length
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = validStudents.value.map(s => s.id)
  }
}

function toggleClassDropdown() {
  classDropdownOpen.value = !classDropdownOpen.value
}

async function onClassChange(classId) {
  const normalizedId = Number(classId)
  classDropdownOpen.value = false
  if (!normalizedId) return
  const target = classStore.classes.find(c => c.id === normalizedId)
  if (!target || target.id === classStore.currentClass?.id) return

  try {
    classSwitching.value = true
    await classStore.switchClass(target)
  } catch (err) {
    Dialog.alert(err.error || '切换班级失败')
  } finally {
    classSwitching.value = false
  }
}

function handleClickOutsideClassDropdown(e) {
  if (!classDropdownOpen.value) return
  if (!classDropdownRef.value) return
  if (!classDropdownRef.value.contains(e.target)) {
    classDropdownOpen.value = false
  }
}

function exitBatch() {
  batchMode.value = false
  selectedIds.value = []
}

async function onBatchScored() {
  showBatchScoreModal.value = false
  try { await classStore.fetchStudents() } catch {}
  exitBatch()
}

onMounted(async () => {
  await nextTick()
  updateTopPanelHeight()
  window.addEventListener('resize', updateTopPanelHeight)
  if (typeof ResizeObserver !== 'undefined' && topPanelRef.value) {
    topPanelObserver = new ResizeObserver(updateTopPanelHeight)
    topPanelObserver.observe(topPanelRef.value)
  }
  window.addEventListener('mousedown', handleClickOutsideClassDropdown)
  window.addEventListener('touchstart', handleClickOutsideClassDropdown)

  try {
    await classStore.fetchClasses()
    if (classStore.currentClass) {
      await Promise.all([
        classStore.fetchStudents(),
        classStore.fetchGroups(),
        classStore.fetchScoreRules()
      ])
    }
  } catch {}
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTopPanelHeight)
  window.removeEventListener('mousedown', handleClickOutsideClassDropdown)
  window.removeEventListener('touchstart', handleClickOutsideClassDropdown)
  topPanelObserver?.disconnect()
  topPanelObserver = null
})
</script>
