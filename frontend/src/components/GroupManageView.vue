<template>
  <div class="space-y-2 px-2 pb-[calc(9.5rem+env(safe-area-inset-bottom))] md:pb-24">
    <!-- Header Area - Ultra Compact -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-0.5">
      <div class="flex items-center gap-2">
        <div>
          <h3 class="text-lg font-bold text-slate-800 tracking-tight leading-none">分组管理</h3>
          <p class="text-[10px] font-medium text-slate-400 mt-0.5">拖拽分配</p>
        </div>
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <button @click="showAddGroup = true"
          class="flex-1 sm:flex-none px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium transition-all hover:bg-slate-800">
          添加分组
        </button>
        <button @click="$emit('close')"
          class="px-3 py-1.5 bg-white text-slate-600 rounded-md text-xs font-medium border border-slate-200 transition-all hover:bg-slate-50">
          完成
        </button>
      </div>
    </div>

    <!-- Add Group Form - Compact -->
    <div v-if="showAddGroup" class="flex flex-col sm:flex-row gap-2 items-center bg-white rounded-lg p-2 shadow-sm animate-fade-in border border-slate-100">
      <div class="w-full sm:w-auto flex-1 relative group">
        <input v-model="newGroupName" type="text" placeholder="输入分组名称..." maxlength="20"
          @keyup.enter="createGroup"
          class="w-full px-3 py-1.5 rounded bg-slate-50 text-xs font-medium text-slate-800 outline-none focus:bg-white border border-transparent" />
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <button @click="createGroup" class="flex-1 sm:flex-none px-4 py-1.5 bg-slate-800 text-white rounded text-xs transition-colors hover:bg-slate-900">
          保存
        </button>
        <button @click="showAddGroup = false; newGroupName = ''" class="px-3 py-1.5 bg-slate-100 text-slate-500 rounded text-xs hover:bg-slate-200">
          取消
        </button>
      </div>
    </div>

    <!-- Groups Grid - High Density -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 auto-rows-max">
      
      <!-- Existing Groups -->
      <div v-for="(group, idx) in groupsWithStudents" :key="group.id"
        class="group-container relative rounded-lg bg-white shadow-sm flex flex-col overflow-hidden border border-slate-100/60"
        :class="getGroupBorderClass(idx)">
        
        <!-- Group Header - Tight -->
        <div class="flex items-center justify-between px-2 py-1.5 shrink-0 z-10 border-b border-slate-50 min-h-[32px]">
          <template v-if="editingGroupId !== group.id">
            <div class="flex items-center gap-1.5 min-w-0">
              <h4 class="text-xs font-bold text-slate-700 truncate leading-tight">{{ group.name }}</h4>
              <span class="text-[9px] font-bold bg-slate-100 text-slate-400 px-1 rounded">{{ group.students.length }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button @click="startEditGroup(group)" class="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-purple-500 rounded transition-colors" title="编辑">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button @click="deleteGroup(group)" class="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-red-500 rounded transition-colors" title="删除">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </template>
          <template v-else>
            <input v-model="editingGroupName" type="text" maxlength="20" @keyup.enter="saveGroupName(group)"
              class="flex-1 w-full px-1.5 py-0.5 text-xs font-bold text-slate-800 bg-slate-50 border border-purple-300 rounded outline-none focus:ring-1 focus:ring-purple-400 mr-1" autofocus />
            <div class="flex items-center gap-1 shrink-0">
              <button @click="saveGroupName(group)" class="w-5 h-5 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 rounded transition-colors" title="保存">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              </button>
              <button @click="cancelEditGroup" class="w-5 h-5 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded transition-colors" title="取消">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </template>
        </div>

        <!-- Draggable Content Area - Dense -->
        <div class="flex-1 flex flex-col relative min-h-[60px] bg-slate-50/20">
          <div v-if="group.students.length === 0" class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span class="text-[10px] font-medium text-slate-200">空</span>
          </div>
          
          <draggable
            v-model="group.students"
            group="students"
            item-key="id"
            :animation="250"
            :force-fallback="true"
            :fallback-on-body="true"
            :touch-start-threshold="3"
            :id="`group-${group.id}`"
            class="flex-1 h-full p-1.5 space-y-1 pb-2 relative z-10"
            ghost-class="sortable-ghost"
            drag-class="sortable-drag"
            @change="(evt) => onDragChange(evt, group.id)">
            
            <template #item="{ element }">
              <div :data-id="element.id" class="student-token bg-white group/student hover:bg-slate-50 w-full rounded border border-slate-100/40 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div class="flex items-center gap-1.5 w-full px-1.5 py-1">
                  <div class="w-6 h-6 shrink-0 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                    <img v-if="element.pet_type" :src="getPetImage(element)" class="w-5 h-5 object-contain" />
                    <span v-else class="text-[10px] font-bold text-slate-400">{{ element.name ? element.name.charAt(0) : '' }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-medium text-slate-600 truncate leading-none">{{ element.name }}</div>
                  </div>
                  <!-- Visual Cue Only -->
                  <div class="w-3.5 h-3.5 shrink-0 flex items-center justify-end text-slate-100 group-hover/student:text-slate-200">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>

  <!-- FIXED UNGROUPED STUDENTS DOCK - High Density -->
  <div class="fixed left-0 right-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-0 z-[100] pointer-events-none">
    <div class="bg-white/95 backdrop-blur-md border-t border-slate-200/60 shadow-[0_-2px_15px_rgba(0,0,0,0.03)] pointer-events-auto">
      <div class="flex items-center justify-between px-3 py-1 border-b border-slate-50 text-slate-400">
        <span class="text-[9px] font-bold tracking-wider uppercase">待分配 ({{ ungroupedStudents.length }})</span>
        <span class="text-[9px]">滑动 ➜</span>
      </div>

      <div class="w-full overflow-x-auto custom-scrollbar">
        <draggable
          v-model="ungroupedStudents"
          group="students"
          item-key="id"
          :animation="200"
          :sort="false"
          :delay="180"
          :delay-on-touch-only="true"
          :touch-start-threshold="10"
          :force-fallback="true"
          :fallback-on-body="true"
          id="group-null"
          class="flex flex-row gap-1.5 px-3 py-1.5 pb-3 w-max min-w-full min-h-[50px]"
          ghost-class="sortable-ghost"
          drag-class="sortable-drag"
          @change="(evt) => onDragChange(evt, null)">
          
          <template #item="{ element }">
            <div :data-id="element.id" class="student-token-dock bg-white group/student hover:bg-slate-50 shrink-0 rounded border border-slate-100">
              <div class="flex flex-col items-center gap-0.5 w-[52px] sm:w-[58px] py-1 px-0.5">
                <div class="w-8 h-8 shrink-0 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-50">
                  <img v-if="element.pet_type" :src="getPetImage(element)" class="w-6 h-6 object-contain" />
                  <span v-else class="text-xs font-bold text-slate-400">{{ element.name ? element.name.charAt(0) : '' }}</span>
                </div>
                <div class="w-full text-center px-0.5">
                  <div class="text-[9px] font-bold text-slate-600 truncate group-hover/student:text-slate-800">{{ element.name }}</div>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { useClassStore } from '../stores/class.js'
import { PETS, getPetImageUrl } from '../utils/pets.js'
import api from '../utils/api.js'
import Dialog from '../utils/dialog'

const emit = defineEmits(['close'])
const classStore = useClassStore()

const showAddGroup = ref(false)
const newGroupName = ref('')

const groupsWithStudents = ref([])
const ungroupedStudents = ref([])

const editingGroupId = ref(null)
const editingGroupName = ref('')

// Minimalist top borders only
const groupBorderClasses = [
  'border-t-2 border-primary',
  'border-t-2 border-emerald-400',
  'border-t-2 border-amber-400',
  'border-t-2 border-purple-400',
  'border-t-2 border-rose-400',
  'border-t-2 border-sky-400'
]

function getGroupBorderClass(index) {
  return groupBorderClasses[index % groupBorderClasses.length]
}

function rebuildLists() {
  groupsWithStudents.value = classStore.groups.map(g => ({
    id: g.id,
    name: g.name,
    students: classStore.students.filter(s => s.group_id === g.id)
  }))
  ungroupedStudents.value = classStore.students.filter(s => !s.group_id)
}

onMounted(() => {
  rebuildLists()
})

const getPetImage = (student) => {
  if (!student || !student.pet_type) return ''
  const pet = PETS.find(p => p.id === student.pet_type)
  if (!pet) return ''
  const stages = classStore.currentClass?.growthConfig?.stages || [0,5,10,20,30,45,60,75,90,100]
  let stage = 1
  for (let i = stages.length - 1; i >= 0; i--) {
    if (student.food_count >= stages[i]) { stage = i + 1; break }
  }
  return getPetImageUrl(pet.folder, stage)
}

// Watch for store changes to keep local lists synced
watch(() => classStore.students, () => {
  rebuildLists()
}, { deep: true })
watch(() => classStore.groups, () => {
  rebuildLists()
}, { deep: true })

async function onDragChange(evt, groupId) {
  if (evt.added) {
    const student = evt.added.element
    try {
      await api.put(`/students/${student.id}`, { group_id: groupId })
      await classStore.fetchStudents()
      rebuildLists()
    } catch (err) {
      Dialog.alert('分组配置保存失败')
      await classStore.fetchStudents()
      rebuildLists() // revert on fail
    }
  }
}

async function createGroup() {
  if (!newGroupName.value.trim()) return
  try {
    await api.post('/groups', {
      class_id: classStore.currentClass.id,
      name: newGroupName.value.trim()
    })
    await classStore.fetchGroups()
    newGroupName.value = ''
    showAddGroup.value = false
    rebuildLists()
  } catch (err) {
    Dialog.alert(err.error || '创建失败')
  }
}

function startEditGroup(group) {
  editingGroupId.value = group.id
  editingGroupName.value = group.name
}

function cancelEditGroup() {
  editingGroupId.value = null
  editingGroupName.value = ''
}

async function saveGroupName(group) {
  const newName = editingGroupName.value.trim()
  if (!newName) {
    Dialog.alert('分组名称不能为空')
    return
  }
  if (newName === group.name) {
    cancelEditGroup()
    return
  }
  try {
    await api.put(`/groups/${group.id}`, { name: newName })
    await classStore.fetchGroups()
    cancelEditGroup()
  } catch (err) {
    Dialog.alert(err.error || '重命名失败')
  }
}

async function deleteGroup(group) {
  if (!(await Dialog.confirm(`确认删除分组「${group.name}」吗？组内的同学将回到未分组状态。`))) return
  try {
    await api.delete(`/groups/${group.id}`)
    await classStore.fetchGroups()
    await classStore.fetchStudents()
    rebuildLists()
  } catch (err) {
    Dialog.alert(err.error || '删除失败')
  }
}
</script>

<style scoped>
/* Clean & Elegant Token Styling */
.student-token {
  display: flex;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: 0 4px 20px -2px rgba(0,0,0,0.03), 0 0 3px rgba(0,0,0,0.01);
  cursor: grab;
  user-select: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.student-token:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.02);
  border-color: rgba(255,255,255,1);
}
.student-token:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}

/* Dragging state with elegant diffuse shadow */
.sortable-drag {
  opacity: 1 !important;
  z-index: 9999 !important;
  transform: scale(1.04) rotate(1.5deg) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0,0,0,0.05) !important;
  cursor: grabbing !important;
  border-color: rgba(255,255,255,1) !important;
  background-color: rgba(255,255,255,0.95) !important;
  backdrop-filter: blur(12px) !important;
}

/* Drop target placeholder - subtle and clean */
.sortable-ghost {
  opacity: 0.5 !important;
  transform: scale(0.98) !important;
  background-color: rgba(248, 250, 252, 0.6) !important; /* slate-50/60 */
  box-shadow: none !important;
  border: 2px dashed rgba(203, 213, 225, 0.8) !important; /* slate-300 */
}

/* Animation for the Add Group form */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Dock styling */
.student-token-dock {
  border-radius: 1rem;
  cursor: grab;
  user-select: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.student-token-dock:hover {
  transform: translateY(-4px);
}
.student-token-dock:active {
  transform: translateY(0) scale(0.95);
}

/* Elegant scrollbar for PC, hidden on mobile */
.custom-scrollbar {
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 1024px) {
  .custom-scrollbar::-webkit-scrollbar {
    height: 8px;
    display: block;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f8fafc; /* slate-50 */
    border-radius: 10px;
    border: 1px solid #f1f5f9;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1; /* slate-300 */
    border-radius: 10px;
    border: 2px solid #f8fafc; /* Create some gap */
    transition: background 0.2s;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8; /* slate-400 */
  }
}

@media (max-width: 1023px) {
  .custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }
}
</style>
