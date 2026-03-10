<template>
  <div class="mx-auto max-w-[1320px] pb-4 overflow-x-clip">
    <!-- 顶部分组导航与搜索区 -->
    <section class="sticky top-[124px] z-40 mb-4 sm:top-[146px] sm:mb-6">
      <div class="overflow-hidden rounded-[1.75rem] border border-white/65 bg-white/78 p-2 shadow-[0_18px_48px_-30px_rgba(15,23,42,0.35)] backdrop-blur-2xl transition-all">
        <div class="flex items-center justify-between gap-3 px-2 pb-2 pt-1 sm:px-3">
          <div>
            <p class="text-[11px] font-black uppercase tracking-[0.22em] text-accent">班级分组</p>
            <p class="mt-1 text-sm font-semibold text-slate-400">左右滑动切换查看范围</p>
          </div>
          <div class="rounded-full bg-slate-100/80 px-3 py-1.5 text-xs font-black tracking-[0.14em] text-slate-500">
            {{ filteredStudents.length }} 位
          </div>
        </div>

        <nav class="flex w-full gap-2 overflow-x-auto overscroll-x-contain px-2 pb-1 pt-1 [scrollbar-width:none] [-ms-overflow-style:none]">
          <button
            @click="activeGroup = 'all'"
            class="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-[13px] font-black transition-all duration-300 sm:text-sm"
            :class="activeGroup === 'all' ? 'bg-accent text-white shadow-[0_16px_26px_-18px_rgba(14,165,233,0.8)]' : 'bg-slate-50/90 text-slate-500 hover:bg-slate-100 hover:text-slate-700'"
          >
            <span class="text-base sm:text-lg">🌟</span>
            <span>全班学生</span>
          </button>
          <button
            v-for="g in groups"
            :key="g.id"
            @click="activeGroup = g.id"
            class="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-[13px] font-black transition-all duration-300 sm:text-sm"
            :class="activeGroup === g.id ? 'bg-accent text-white shadow-[0_16px_26px_-18px_rgba(14,165,233,0.8)]' : 'bg-slate-50/90 text-slate-500 hover:bg-slate-100 hover:text-slate-700'"
          >
            <span class="text-base sm:text-lg">✨</span>
            <span>{{ g.name }}</span>
          </button>
          <button
            @click="activeGroup = 'ungrouped'"
            class="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-[13px] font-black transition-all duration-300 sm:text-sm"
            :class="activeGroup === 'ungrouped' ? 'bg-accent text-white shadow-[0_16px_26px_-18px_rgba(14,165,233,0.8)]' : 'bg-slate-50/90 text-slate-500 hover:bg-slate-100 hover:text-slate-700'"
          >
            <span class="text-base sm:text-lg">🏷️</span>
            <span>未分配</span>
          </button>
        </nav>
      </div>
    </section>

    <!-- 学生卡片网格 -->
    <div class="grid grid-cols-2 gap-3 px-0.5 sm:gap-4 md:grid-cols-3 md:px-0 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-6">
      <StudentCard
        v-for="(s, index) in filteredStudents" :key="s.id"
        class="animate-stagger-fade-in pointer-events-none hover:!scale-100 hover:!shadow-none"
        :style="{ animationDelay: `${index * 0.04}s` }"
        :student="s"
        :batch-mode="false"
        :undo-mode="false"
        :selected="false"
        :read-only="true"
        :growth-stages="classInfo?.growth_stages || defaultStages"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="filteredStudents.length === 0" class="mx-1 mt-4 flex flex-col items-center justify-center rounded-[2rem] border border-white/50 bg-white/40 py-24 shadow-sm backdrop-blur-md sm:mx-0">
      <span class="text-7xl drop-shadow-sm mb-6 animate-bounce">🍃</span>
      <p class="text-slate-500 font-bold text-lg px-6 text-center">没有找到相关的学生记录哦～</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StudentCard from '../components/StudentCard.vue'

const props = defineProps({
  classInfo: Object,
  students: Array,
  groups: Array,
  searchQuery: {
    type: String,
    default: ''
  }
})

const activeGroup = ref('all')
const defaultStages = [0, 5, 10, 20, 30, 45, 60, 75, 90, 100]

const filteredStudents = computed(() => {
  if (!props.students) return []
  
  let list = [...props.students]

  // Search filter
  if (props.searchQuery) {
    const q = props.searchQuery.toLowerCase()
    list = list.filter(s => s.name.toLowerCase().includes(q))
  }

  // Group filter
  if (activeGroup.value === 'ungrouped') {
    list = list.filter(s => !s.group_id)
  } else if (activeGroup.value !== 'all') {
    list = list.filter(s => s.group_id === activeGroup.value)
  }

  // Same sorting logic as HomeView
  list.sort((a, b) => {
      // First by pet existence, then by score descending, then by name
      const hasPetA = a.pet_type ? 1 : 0
      const hasPetB = b.pet_type ? 1 : 0
      if (hasPetA !== hasPetB) return hasPetB - hasPetA
      
      const sA = Number(a.food_count) || 0
      const sB = Number(b.food_count) || 0
      if (sB !== sA) return sB - sA
      return a.name.localeCompare(b.name, 'zh-Hans-CN')
  })

  return list
})
</script>
