<template>
  <div class="mx-auto flex max-w-3xl flex-col pb-24">
    <div class="overflow-hidden rounded-[2.3rem] border border-white/80 bg-white/88 p-5 shadow-[0_24px_64px_-32px_rgba(15,23,42,0.38)] backdrop-blur-2xl sm:p-8">
      <div class="mb-7 flex items-center justify-between gap-4 sm:mb-10">
        <div class="min-w-0">
          <div class="mb-2 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-accent">
            荣誉榜单
          </div>
          <h2 class="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">本周闪亮排行</h2>
          <p class="mt-2 text-sm font-bold text-slate-400">按宠物成长值展示全班进度，家长可快速查看孩子在班级中的位置。</p>
        </div>
        <div class="hidden shrink-0 rounded-[1.4rem] border border-white/80 bg-slate-50/90 px-4 py-3 text-right shadow-sm sm:block">
          <div class="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">Visible Rank</div>
          <div class="mt-1 text-2xl font-black tracking-tight text-slate-700">{{ filteredLeaderboardData.length }}</div>
        </div>
      </div>

      <div class="relative space-y-3 sm:space-y-4">
        <div v-if="loading" class="py-16 flex flex-col items-center justify-center">
          <div class="animate-spin text-3xl mb-3 text-slate-300">🏅</div>
          <div class="text-slate-400 font-bold animate-pulse tracking-widest text-sm">榜单揭晓中...</div>
        </div>
        
        <div v-for="(student, index) in filteredLeaderboardData" :key="student.id"
             class="group relative flex items-center overflow-hidden rounded-[1.6rem] p-3 transition-all duration-300 sm:p-5"
             :class="{
               'bg-gradient-to-r from-yellow-50 to-white border border-yellow-100 shadow-[0_4px_20px_-4px_rgba(250,204,21,0.2)]': student.rank === 0,
               'bg-gradient-to-r from-slate-50 to-white border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.15)]': student.rank === 1,
               'bg-gradient-to-r from-orange-50/50 to-white border border-orange-100/50 shadow-[0_4px_20px_-4px_rgba(251,146,60,0.1)]': student.rank === 2,
               'bg-white border border-slate-100/50 hover:bg-slate-50/50 hover:border-slate-200': student.rank > 2
             }">
          
          <div class="absolute top-0 left-0 w-1.5 h-full transition-colors" 
              :class="{'bg-yellow-400': student.rank===0, 'bg-slate-300': student.rank===1, 'bg-orange-300/80': student.rank===2, 'bg-slate-100 group-hover:bg-slate-200': student.rank > 2}"></div>

          <div class="flex w-10 shrink-0 items-center justify-center text-center font-black sm:w-14"
               :class="{
                 'text-[2.5rem] sm:text-5xl drop-shadow-md pb-1 sm:pb-2': student.rank === 0,
                 'text-3xl sm:text-4xl pb-1': student.rank === 1,
                 'text-2xl sm:text-3xl pb-0.5': student.rank === 2,
                 'text-lg sm:text-xl text-slate-300 font-bold': student.rank > 2
               }">
            <span v-if="student.rank === 0" class="leading-none">🥇</span>
            <span v-else-if="student.rank === 1" class="leading-none">🥈</span>
            <span v-else-if="student.rank === 2" class="leading-none">🥉</span>
            <span v-else>{{ student.rank + 1 }}</span>
          </div>
          
          <div class="relative ml-2 h-12 w-12 shrink-0 sm:ml-4 sm:h-16 sm:w-16">
            <div v-if="student.rank < 3" class="absolute inset-0 rounded-full animate-ping opacity-20"
                 :class="{'bg-yellow-400': student.rank===0, 'bg-slate-400': student.rank===1, 'bg-orange-400': student.rank===2}"></div>
            <img v-if="student.pet_type" :src="getImageUrl(student.pet_type, student.food_count)" class="w-full h-full object-contain relative z-10 drop-shadow-sm hover:scale-110 transition-transform duration-300 origin-bottom" />
            <div v-else class="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xl border border-slate-200 relative z-10">
              {{ student.name.charAt(0) }}
            </div>
          </div>
          
          <div class="ml-3 min-w-0 flex-1 sm:ml-6">
            <h3 class="text-lg sm:text-xl font-black text-slate-800 truncate pr-2 tracking-tight">{{ student.name }}</h3>
            <p v-if="student.pet_name" class="mt-0.5 truncate text-[11px] font-bold text-slate-400 sm:text-xs">{{ student.pet_name }}</p>
            <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 sm:hidden">
              No.{{ student.rank + 1 }}
            </p>
          </div>
          
          <div class="ml-2 flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2 transition-colors sm:px-5 sm:py-2.5"
               :class="{
                 'bg-yellow-100/80 border border-yellow-200/50 text-yellow-700': student.rank === 0,
                 'bg-slate-100/80 border border-slate-200/50 text-slate-600': student.rank === 1,
                 'bg-orange-100/50 border border-orange-200/50 text-orange-600': student.rank === 2,
                 'bg-slate-50 border border-slate-100 text-slate-500': student.rank > 2
               }">
            <span class="text-sm sm:text-base drop-shadow-sm">🏅</span>
            <span class="font-black text-base sm:text-lg tracking-tight">{{ student.food_count }}</span>
          </div>
        </div>

        <div v-if="filteredLeaderboardData.length === 0 && !loading" class="text-center py-20 text-slate-400 font-bold border-2 border-dashed border-slate-200/60 rounded-[2rem] bg-slate-50/50">
          <div class="text-5xl mb-4 grayscale opacity-50">🏆</div>
          目前还没有数据哦～
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../utils/api'
import { PETS, getPetImageUrl } from '../utils/pets'

const props = defineProps({
  classInfo: Object,
  students: Array,
  searchQuery: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const leaderboardData = ref([])
const loading = ref(true)

const filteredLeaderboardData = computed(() => {
  if (!props.searchQuery) return leaderboardData.value
  const q = props.searchQuery.toLowerCase()
  return leaderboardData.value.filter(s => s.name.toLowerCase().includes(q))
})

function getStage(foodCount) {
  if (!props.classInfo?.growth_stages) return 1
  const stages = props.classInfo.growth_stages
  for (let i = stages.length - 1; i >= 0; i--) {
    if (foodCount >= stages[i]) return i + 1
  }
  return 1
}

function getImageUrl(petTypeCode, foodCount) {
  const p = PETS.find(p => p.id === petTypeCode || p.name === petTypeCode)
  const folder = p ? p.folder : petTypeCode
  const stage = getStage(foodCount)
  return getPetImageUrl(folder, stage)
}

onMounted(async () => {
  try {
    const code = route.params.share_code
    const data = await api.get(`/public/${code}/leaderboard`)
    // Pre-calculate rank so it stays correct when filtering by name
    leaderboardData.value = data.map((student, idx) => ({
      ...student,
      rank: idx
    }))
  } catch (err) {
    console.error('Failed to load leaderboard', err)
  } finally {
    loading.value = false
  }
})
</script>
