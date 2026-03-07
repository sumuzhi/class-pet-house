<template>
  <div class="max-w-[1600px] mx-auto pb-4">
    <!-- 顶部分组导航与搜索区 -->
    <div class="sticky top-[4.5rem] z-40 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm mb-4 p-2 sm:p-3 flex items-center justify-between border-2 border-white">
      <nav class="flex gap-2 w-full overflow-x-auto scrollbar-hide py-1 px-1">
        <button @click="activeGroup = 'all'"
          class="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          :class="activeGroup === 'all' ? 'bg-accent text-white scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'">
          <span>🌟</span> <span>全班学生</span>
        </button>
        <button v-for="g in groups" :key="g.id" @click="activeGroup = g.id"
          class="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          :class="activeGroup === g.id ? 'bg-accent text-white scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'">
          <span>✨</span> <span>{{ g.name }}</span>
        </button>
        <button @click="activeGroup = 'ungrouped'"
          class="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          :class="activeGroup === 'ungrouped' ? 'bg-accent text-white scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'">
          <span>🏷️</span> <span>未分配</span>
        </button>
      </nav>
    </div>

    <!-- 学生卡片网格 -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4 lg:gap-6 px-1 lg:px-0">
      <StudentCard
        v-for="(s, index) in filteredStudents" :key="s.id"
        class="animate-stagger-fade-in pointer-events-none"
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
    <div v-if="filteredStudents.length === 0" class="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl mt-4 border border-white shadow-sm">
      <span class="text-6xl drop-shadow-sm mb-4">🍃</span>
      <p class="text-slate-500 font-bold text-lg">没有找到相关的学生记录哦～</p>
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
