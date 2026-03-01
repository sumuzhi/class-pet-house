<template>
  <div class="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-[1.8rem] shadow-2xl w-full max-w-[420px] p-5 sm:p-6 max-h-[92vh] flex flex-col relative overflow-hidden animate-slide-up-fade">
      
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-6 relative z-10 pt-2">
        <p class="text-sm font-bold text-slate-400 mb-2">选择项目</p>
        <h3 class="font-black text-slate-800 text-2xl tracking-wide flex items-center gap-1.5">
          给 <span class="text-accent">{{ student ? student.name : `批量操作 (${batchIds.length}人)` }}</span> 加分/扣分
        </h3>
        
        <button @click="$emit('close')" class="absolute right-0 -top-2 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-lg">
          ✕
        </button>
      </div>

      <!-- 搜索栏占位 (竞品设计中有一个很长的圆角搜索框) -->
      <div class="mb-5 relative z-10 px-1 w-full">
        <div class="w-full flex items-center bg-white border-2 border-indigo-400/50 rounded-full py-3 px-5 transition-colors shadow-sm focus-within:border-indigo-500 focus-within:shadow-md">
          <span class="text-indigo-500 mr-2 text-lg">🔍</span>
          <input ref="searchInput" v-model="filterKeyword" type="text" placeholder="搜索项目 (支持首字母如 'cd' 搜 '迟到')" class="w-full bg-transparent text-sm text-slate-700 outline-none placeholder-slate-400" />
        </div>
      </div>

      <!-- 加分项标题 (带闪光图标) -->
      <div class="flex items-center gap-2 mb-4 px-2">
        <span class="text-green-500 text-lg">✨</span>
        <span class="text-sm font-bold text-green-700">打分项</span>
        <div class="flex-1 h-px bg-green-200/50 ml-2"></div>
      </div>

      <!-- 规则网格 (极简白底，细边边框，带微阴影) -->
      <div class="grid grid-cols-2 gap-4 overflow-y-auto pr-1 pb-4 custom-scrollbar relative z-10 content-start flex-1 min-h-[300px]">
        <button v-for="rule in rules" :key="rule.id"
          @click="applyRule(rule)"
          class="group flex flex-col items-center justify-between py-5 px-3 rounded-[1.5rem] bg-white border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 hover:shadow-md focus:outline-none"
          :class="rule.value > 0 ? 'border-green-100 hover:border-green-300' : 'border-red-100 hover:border-red-300'">
          
          <!-- 图标底座 (淡色圆角方块) -->
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center text-3xl sm:text-4xl mb-3 transition-transform group-hover:scale-110"
            :class="rule.value > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'">
            {{ rule.icon || (rule.value > 0 ? '🌟' : '⚠️') }}
          </div>
          
          <div class="font-bold text-slate-700 text-sm sm:text-base text-center w-full leading-snug mb-3 truncate tracking-wide">{{ rule.name }}</div>
          
          <!-- 分值胶囊 (无边框，填色底) -->
          <div class="mt-auto font-black text-xs sm:text-sm px-3.5 py-1 rounded-full flex items-center gap-1"
            :class="rule.value > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'">
            <span>{{ rule.value > 0 ? '+' : '' }}{{ rule.value }}</span> <span class="text-[14px]">🍖</span>
          </div>
        </button>
      </div>
      
      <!-- 底部提示 -->
      <div class="mt-2 text-center text-xs text-slate-400 flex justify-center items-center gap-1">
        <span class="text-yellow-400">✨</span> 点击项目直接操作
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClassStore } from '../stores/class'
import { useEscClose } from '../composables/useEscClose'
import api from '../utils/api'
import Dialog from '../utils/dialog'
import { pinyin } from 'pinyin-pro'
import { fireGrandConfetti, firePopConfetti } from '../utils/confetti'
import { audioManager } from '../utils/audio'

const props = defineProps({
  student: Object,
  batchIds: { type: Array, default: () => [] }
})
const emit = defineEmits(['close', 'scored'])
useEscClose(emit)
const classStore = useClassStore()

const filterKeyword = ref('')
const searchInput = ref(null)

const rules = computed(() => {
  const allRules = classStore.scoreRules || []
  if (!filterKeyword.value) return allRules
  const lowerKwd = filterKeyword.value.toLowerCase().trim()
  
  return allRules.filter(r => {
    const name = (r.name || '').toLowerCase()
    
    // 生成首字母缩写 (例如: "迟到" -> "cd")
    const pyFirstLetters = pinyin(name, { pattern: 'first', toneType: 'none', type: 'array' }).join('').toLowerCase()
    // 生成全拼 (例如: "迟到" -> "chidao")
    const pyFull = pinyin(name, { toneType: 'none', type: 'array' }).join('').toLowerCase()
    
    return name.includes(lowerKwd) || pyFirstLetters.includes(lowerKwd) || pyFull.includes(lowerKwd)
  })
})

onMounted(async () => {
  // 延迟一小段确保弹窗动画执行完毕后再获取焦点
  setTimeout(() => {
    if (searchInput.value) searchInput.value.focus()
  }, 100)

  if (!classStore.scoreRules.length && classStore.currentClass) {
    await classStore.fetchScoreRules()
  }
})

async function applyRule(rule) {
  audioManager.playPop() // 播放选中汽泡音
  const targetName = props.student ? props.student.name : `已选的 ${props.batchIds.length} 名学生`
  
  if (await Dialog.confirm(`确定要给 ${targetName} 使用规则【${rule.name}】(${rule.value}分) 吗？`)) {
    try {
      if (rule.value > 0) {
        audioManager.playScore()
        if (rule.value >= 10) fireGrandConfetti()
        else firePopConfetti()
      } else if (rule.value < 0) {
        audioManager.playPop() // 扣分只播放气泡音
      }

      const ids = props.batchIds.length
        ? props.batchIds
        : [props.student.id]
      await api.post('/history', {
        class_id: classStore.currentClass.id,
        student_ids: ids,
        rule_id: rule.id
      })
      emit('scored')
    } catch (err) {
      Dialog.alert(err.error || '操作失败')
    }
  }
}
</script>
