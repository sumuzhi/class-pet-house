<template>
  <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="close"></div>
    
    <!-- 弹窗主体 -->
    <div class="relative bg-white rounded-3xl w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-bounce-in flex flex-col max-h-[90vh]">
      
      <!-- 顶部炫彩插图区 -->
      <div class="h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative flex items-center justify-center p-6 text-center">
        <!-- 装饰性光晕 -->
        <div class="absolute top-0 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div class="absolute bottom-0 right-1/4 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>
        
        <div class="relative z-10">
          <span class="text-5xl drop-shadow-lg inline-block animate-float">🚀</span>
          <h2 class="text-3xl font-black text-white mt-2 drop-shadow-md tracking-wider">全新升级</h2>
          <p class="text-white/90 text-sm mt-1 font-medium">重磅 AI 新能力上线啦！</p>
        </div>
      </div>
      
      <!-- 内容区 -->
      <div class="p-6 sm:p-8 overflow-y-auto w-full flex-1">
        <div class="space-y-6">
          
          <!-- 功能 1 -->
          <div class="flex gap-4 items-start group">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 text-purple-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              🐾
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-1">AI 智能宠物起名</h3>
              <p class="text-sm text-gray-500 leading-relaxed">还在为给宠物取名字发愁吗？现在学生领养或更换宠物时，可以点击骰子图标，让 AI 根据宠物特性和当前阶段，一键生成创意十足的专属昵称！</p>
            </div>
          </div>
          
          <!-- 功能 2 -->
          <div class="flex gap-4 items-start group">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 text-cyan-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              📝
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-1">AI 学情洞察生成</h3>
              <p class="text-sm text-gray-500 leading-relaxed">在家校沟通时词穷？去“设置 - 超级工具”中体验一键生成全班学情报告，或点击学生头像底部的 AI 图标，自动根据 Ta 的近期加扣分记录生成个性化智能评语，直接复制发给家长！</p>
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- 底部按钮区 -->
      <div class="p-6 pt-2 bg-gray-50/80 border-t border-gray-100 flex gap-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6">
        <button @click="close"
          class="flex-1 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-2xl font-bold shadow-[0_8px_20px_-6px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-0.5 active:scale-95 text-lg">
          立即体验新功能！
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  versionKey: {
    type: String,
    default: 'v1.1.0-ai-update' // 修改这个以再次弹窗
  }
})

const show = ref(false)

onMounted(() => {
  // 检查是否已经看过此版本的更新日志
  const hasSeen = localStorage.getItem(`has_seen_update_${props.versionKey}`)
  if (!hasSeen) {
    // 延迟一点显示，体验更好
    setTimeout(() => {
      show.value = true
    }, 1000)
  }
})

function close() {
  show.value = false
  localStorage.setItem(`has_seen_update_${props.versionKey}`, 'true')
}
</script>
