<template>
  <div class="max-w-2xl mx-auto flex flex-col pb-20">
    <div class="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-black text-slate-800">🎖️ 光荣榜</h2>
          <p class="text-sm font-bold text-slate-400 mt-1">这里展示了全班同学的徽章大比拼！</p>
        </div>
      </div>

      <div class="space-y-3 relative">
        <div v-if="loading" class="py-10 text-center animate-pulse text-slate-400 font-bold">榜单加载中...</div>
        
        <div v-for="(student, index) in filteredLeaderboardData" :key="student.id"
             class="flex items-center p-3 sm:p-4 rounded-2xl transition-all duration-300 bg-slate-50 border border-slate-100 hover:scale-[1.02] hover:shadow-md hover:bg-white relative overflow-hidden group">
          
          <div class="absolute top-0 left-0 w-1.5 h-full bg-slate-200" 
              :class="{'!bg-yellow-400': student.rank===0, '!bg-slate-300': student.rank===1, '!bg-orange-300': student.rank===2}"></div>

          <div class="w-8 sm:w-12 text-center font-black flex-shrink-0"
               :class="{
                 'text-3xl sm:text-4xl text-yellow-500 drop-shadow-md': student.rank === 0,
                 'text-2xl sm:text-3xl text-slate-400': student.rank === 1,
                 'text-xl sm:text-2xl text-orange-400': student.rank === 2,
                 'text-lg text-slate-300': student.rank > 2
               }">
            <span v-if="student.rank === 0">🥇</span>
            <span v-else-if="student.rank === 1">🥈</span>
            <span v-else-if="student.rank === 2">🥉</span>
            <span v-else>{{ student.rank + 1 }}</span>
          </div>
          
          <div class="w-10 h-10 sm:w-14 sm:h-14 ml-2 sm:ml-4 flex-shrink-0 relative">
            <img v-if="student.pet_type" :src="getImageUrl(student.pet_type, student.food_count)" class="w-full h-full object-contain drop-shadow-sm" />
            <div v-else class="w-full h-full rounded-xl bg-slate-200 flex items-center justify-center font-black text-slate-400 text-lg">
              {{ student.name.charAt(0) }}
            </div>
          </div>
          
          <div class="ml-3 sm:ml-5 flex-1 min-w-0">
            <h3 class="text-base sm:text-lg font-black text-slate-700 truncate pr-2">{{ student.name }}</h3>
            <p v-if="student.pet_name" class="text-[10px] sm:text-xs font-bold text-slate-400 truncate">{{ student.pet_name }}</p>
          </div>
          
          <div class="flex items-center gap-1.5 bg-orange-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-orange-100 shrink-0">
            <span class="text-xs sm:text-sm">🏅</span>
            <span class="font-black text-orange-600 text-sm sm:text-base">{{ student.food_count }}</span>
          </div>
        </div>

        <div v-if="filteredLeaderboardData.length === 0 && !loading" class="text-center py-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-2xl">
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
