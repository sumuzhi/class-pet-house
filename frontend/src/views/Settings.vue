<template>
  <div class="w-full mx-auto flex flex-col md:flex-row gap-6 items-start pb-20 relative">
    
    <!-- 左侧/顶部 固定的菜单导航 -->
    <div class="w-full md:w-64 bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-4 shadow-sm flex-shrink-0 sticky top-[90px] md:top-0 z-30 self-start">
      <h2 class="text-xl font-bold text-gray-800 mb-4 px-2 hidden md:block">⚙️ 系统设置</h2>
      <nav class="flex flex-row md:flex-col gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          class="flex items-center gap-1.5 md:gap-3 px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-xl font-medium transition-colors whitespace-nowrap outline-none text-sm md:text-base shrink-0"
          :class="activeTab === tab.id ? 'bg-accent text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'">
          <span class="text-base md:text-lg">{{ tab.icon }}</span>
          <span>{{ tab.name }}</span>
        </button>
      </nav>
    </div>

    <!-- 右侧内容区域 -->
    <div class="flex-1 w-full min-w-0">
      
      <!--========================================
        基础设置
      =========================================-->
      <div v-if="activeTab === 'basic'" class="space-y-6 animation-fade-in">
        <div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 class="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100">🎈 界面主题</h3>
          <p class="text-sm text-gray-500 mb-2">选择全班同学们喜爱的主题配色</p>
          <div class="flex flex-wrap gap-4 pt-2">
            <button v-for="t in themes" :key="t.id" @click="currentTheme = t.id; setTheme(t.id)"
              :class="currentTheme === t.id ? 'ring-4 ring-offset-2 ring-accent scale-110' : 'hover:scale-110'"
              class="w-10 h-10 rounded-full transition-all shadow-sm" :style="{ backgroundColor: t.color }">
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 class="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100">📈 成长阶段设置</h3>
          <p class="text-sm text-gray-500 mb-2">定义宠物进化所需的食物数量阈值（以英文逗号分隔）。默认值：0,5,10,20,30,45,60,75,90,100</p>
          <input v-model="growthStagesText" type="text" placeholder="例如：0,5,10,20,30,45,60,75,90,100"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent bg-gray-50 focus:bg-white transition font-mono tracking-wider" />
        </div>

        <div v-if="enableParentShareView" class="bg-white rounded-2xl p-6 shadow-sm space-y-4 border-2 border-green-50">
          <h3 class="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100 flex items-center justify-between">
            <span>🔗 家长纯净分享视图</span>
            <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">免密围观</span>
          </h3>
          <p class="text-sm text-gray-500 mb-2">生成一个专属分享链接，发给家长群即可查看本班的最新宠物列表和排行榜。纯净模式下无编辑和评分功能，**家长无需注册登录**即可访问！</p>
          
          <div v-if="classStore.currentClass?.share_code" class="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div class="flex flex-col sm:flex-row items-center gap-2">
              <input :value="shareLink" readonly class="flex-1 w-full px-3 py-2 bg-white rounded-lg border border-slate-200 font-mono text-sm text-slate-600 outline-none select-all" />
              <div class="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button @click="copyShareLink" class="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm transition active:scale-95">复制链接</button>
              </div>
            </div>
            <div class="flex gap-2 pt-2 border-t border-slate-200 mt-2">
               <button @click="generateShare" class="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition">🔁 重新生成分享码</button>
               <button @click="disableShare" class="px-4 py-1.5 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition">⛔ 停用此链接</button>
            </div>
          </div>
          <div v-else class="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <button @click="generateShare" class="px-6 py-3 bg-accent text-white rounded-xl text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-95">🚀 点击生成专属分享链接</button>
          </div>
        </div>

        <button @click="saveSettings"
          class="w-full px-6 py-4 bg-accent text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg">
          <span>💾 保存当前全部基础设置</span>
        </button>
      </div>

      <!--========================================
        班级管理
      =========================================-->
      <div v-if="activeTab === 'classes'" class="space-y-6 animation-fade-in">
        <div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 border-gray-100">
            <div>
              <h3 class="text-lg font-bold text-gray-800">班级管理</h3>
              <p class="text-sm text-gray-500 mt-1">在这里统一维护班级名称，避免和系统设置混在一起。</p>
            </div>
            <div class="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
              当前班级：{{ classStore.currentClass?.name || '未选择' }}
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2">
            <input v-model="newClassName" type="text" placeholder="输入新班级名称..."
              class="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent bg-gray-50 focus:bg-white transition" />
            <button @click="createClass"
              class="px-5 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition whitespace-nowrap">
              ➕ 新增班级
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold text-gray-800 border-b pb-4 mb-4">已有班级</h3>

          <div v-if="classStore.classes.length === 0" class="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
            暂无班级
          </div>

          <div v-else class="space-y-3">
            <button
              v-for="cls in classStore.classes"
              :key="cls.id"
              @click="switchClass(cls)"
              class="w-full flex items-center justify-between p-4 rounded-2xl border transition text-left group"
              :class="cls.id === classStore.currentClass?.id ? 'border-accent bg-theme-light shadow-sm' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-gray-800 truncate">{{ cls.name }}</span>
                  <span v-if="cls.id === classStore.currentClass?.id" class="text-[11px] font-bold text-accent bg-white/80 px-2 py-0.5 rounded-full">当前</span>
                </div>
                <p class="text-xs text-gray-400 mt-1">点击可切换到该班级</p>
              </div>
              <button
                @click.stop="renameClass(cls)"
                class="p-2.5 text-gray-400 hover:text-sky-500 bg-white rounded-xl shadow-sm border border-gray-100 outline-none transition opacity-100 sm:opacity-0 group-hover:opacity-100"
                title="编辑班级名称"
              >
                ✏️
              </button>
            </button>
          </div>
        </div>
      </div>

      <!--========================================
        学生管理
      =========================================-->
      <div v-if="activeTab === 'students'" class="bg-white rounded-2xl p-6 shadow-sm animation-fade-in flex flex-col min-h-[400px]">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4 gap-4 flex-shrink-0">
          <h3 class="text-lg font-bold text-gray-800">学生名单管理</h3>
          <button @click="showBatchAdd = true"
            class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">批量导入学生</button>
        </div>
        
        <div class="flex gap-2 mb-4 flex-shrink-0">
          <input v-model="newStudentName" type="text" placeholder="输入新学生姓名并回车..."
            @keyup.enter="addStudent"
            class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-accent bg-gray-50 focus:bg-white transition" />
          <button @click="addStudent"
            class="px-4 sm:px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition whitespace-nowrap shrink-0">添加</button>
        </div>

        <div class="flex-1 space-y-2 pr-2">
          <div v-if="classStore.students.length === 0" class="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">暂无学生，请在上方输入姓名添加</div>
          <div v-for="s in classStore.students" :key="s.id"
            class="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-sky-50 transition border border-transparent hover:border-sky-100 group">
            <span class="font-medium text-gray-700 pl-2 select-all">{{ s.name }}</span>
            <div class="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="editStudent(s)" class="p-2 text-gray-400 hover:text-sky-500 bg-white rounded-lg shadow-sm border border-gray-100 outline-none transition" title="修改名字">✏️</button>
              <button @click="deleteStudent(s)" class="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-100 outline-none transition" title="删除学生">🗑️</button>
            </div>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-400 text-center flex-shrink-0">此页面的添加、修改和删除操作都会自动实时保存生效。</div>
      </div>

      <!--========================================
        加分项管理
      =========================================-->
      <div v-if="activeTab === 'rules'" class="bg-white rounded-2xl p-6 shadow-sm animation-fade-in flex flex-col min-h-[400px]">
        <h3 class="text-lg font-bold text-gray-800 border-b pb-4 mb-4 flex-shrink-0">奖励与扣查项目配置</h3>
        
        <div class="bg-orange-50/50 p-4 rounded-xl mb-4 border border-orange-100 flex-shrink-0">
          <h4 class="text-sm font-bold text-gray-700 mb-3">🛠️ 新增规则指令</h4>
          <div class="flex flex-wrap gap-2">
            <input v-model="newRule.name" placeholder="名称，例如: 积极发言"
              class="flex-1 min-w-[120px] px-3 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-accent bg-white" />
            <input v-model="newRule.icon" placeholder="图标" maxlength="2"
              class="w-16 px-2 py-2.5 rounded-lg border border-gray-200 outline-none text-center focus:border-accent bg-white text-lg" title="输入一个Emoji表情" />
            <input v-model.number="newRule.value" type="number" placeholder="+1或-1"
              class="w-24 px-2 py-2.5 rounded-lg border border-gray-200 outline-none text-center focus:border-accent bg-white" title="正数加分，负数扣分" />
            <button @click="addRule"
              class="px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition shadow-sm">提交新建</button>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <button
              @click="rulesFilterTab = 'add'"
              class="px-3 py-1.5 rounded-full text-xs font-bold border transition"
              :class="rulesFilterTab === 'add' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'"
            >
              + 加分项
            </button>
            <button
              @click="rulesFilterTab = 'deduct'"
              class="px-3 py-1.5 rounded-full text-xs font-bold border transition"
              :class="rulesFilterTab === 'deduct' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'"
            >
              - 扣分项
            </button>
          </div>
        </div>

        <div class="flex-1 space-y-2 pr-2">
          <div v-if="filteredRules.length === 0" class="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">当前分类下还没配置积分规则</div>
          <div v-for="r in filteredRules" :key="r.id"
             class="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-orange-50 transition border border-transparent hover:border-orange-100 group">
             <div class="flex items-center gap-4">
               <span class="text-2xl inline-flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100">{{ r.icon }}</span>
               <div class="flex items-center gap-2">
                 <span class="font-bold text-gray-700">{{ r.name }}</span>
                 <span v-if="r.is_system" class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">系统默认</span>
               </div>
               <span :class="r.value > 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'" class="px-3 py-1 rounded-full text-sm font-black border">
                 {{ r.value > 0 ? '+' : '' }}{{ r.value }}
               </span>
             </div>
             <div class="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
               <button @click="editRule(r)" class="p-2 text-gray-300 hover:text-sky-500 bg-white rounded-lg shadow-sm border border-gray-100 outline-none transition" title="编辑规则">✏️</button>
               <button v-if="!r.is_system" @click="deleteRule(r)" class="p-2 text-gray-300 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-100 outline-none transition" title="删除规则">🗑️</button>
               <span v-else class="p-2 text-slate-300 bg-white rounded-lg shadow-sm border border-gray-100 cursor-not-allowed" title="系统默认规则不可删除">🔒</span>
             </div>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-400 text-center flex-shrink-0">提示：正数分值会在点击学生时产生“喂食”金币效果，负数则是扣分。配置实时生效。</div>
      </div>

      <!--========================================
        高级工具
      =========================================-->
      <div v-if="activeTab === 'tools'" class="space-y-6 animation-fade-in">
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-6">🤖 AI 智能超级助手</h3>
          <div class="flex flex-col sm:flex-row items-center justify-between p-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-purple-100 gap-4">
            <div class="flex-1">
              <h4 class="text-lg font-bold text-purple-800 mb-1">班级自动周报与月报</h4>
              <p class="text-sm text-purple-600/80 leading-relaxed max-w-lg">利用AI深度大语言模型分析这周内全班所有积分操作明细、红黑榜与学生行为表现，提取总结出高度友好的班级总结，方便直接复制发送给家长群审阅。</p>
            </div>
            <button @click="showAiReport = true"
              class="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap">
              ✨ 立即生成周报
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-6">🛠️ 快速调整工具</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button @click="randomAssignPets"
              class="p-5 bg-teal-50 border border-teal-100 text-teal-800 rounded-2xl text-left hover:bg-teal-100 transition group flex flex-col gap-2">
              <div class="text-3xl group-hover:scale-110 transition-transform origin-left">🐾</div>
              <div class="font-bold text-lg">全班一键盲盒摸宠</div>
              <div class="text-sm opacity-75">如果同学们嫌自己一个一个挑选麻烦，点击这里，系统会为所有尚未领养宠物的同学随机发一只开局萌宠。</div>
            </button>

            <button @click="randomAssignGroups"
              class="p-5 bg-sky-50 border border-sky-100 text-sky-800 rounded-2xl text-left hover:bg-sky-100 transition group flex flex-col gap-2">
              <div class="text-3xl group-hover:scale-110 transition-transform origin-left">🎲</div>
              <div class="font-bold text-lg">打乱全班随机分组</div>
              <div class="text-sm opacity-75">上课需要重新分组？一键将当前所有同学完全打乱，随机且平均地塞回你已经建好的各个空缺小组名下。</div>
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold text-red-600 border-b border-red-100 pb-3 mb-6">⚠️ 危险与维护区</h3>
          
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-center justify-between p-5 bg-red-50 border border-red-100 rounded-2xl gap-4">
              <div class="flex-1">
                <h4 class="font-bold text-red-800">新学期·清空全班进度记录</h4>
                <p class="text-xs sm:text-sm text-red-600/80 mt-1 max-w-md">慎重！这将清空整个班级所有同学当前的食物数量，并将他们所有的宠物退化回第0阶段的幼崽形态。且不会保留任何恢复备份！</p>
              </div>
              <button @click="resetAllProgress"
                class="w-full sm:w-auto px-5 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition shadow-sm whitespace-nowrap active:scale-95">
                🧨 确定重置数据
              </button>
            </div>
            
            <div v-if="classStore.classes.length > 1" class="flex flex-col justify-start p-5 bg-gray-50 border border-gray-200 rounded-2xl gap-4">
              <div>
                <h4 class="font-bold text-gray-800">复刻其他班级配置清单</h4>
                <p class="text-sm text-gray-500 mt-1">你的账号下管理了多个平行班级？可以从指定班级完全复制“加扣分规则大全”、“小卖部奖品列表”、“成长门槛”这三项配置到本班，免去一条条录入的麻烦。</p>
              </div>
              <div class="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <select v-model="copyFromClassId" class="flex-1 px-4 py-3 rounded-xl border border-gray-300 outline-none bg-white focus:border-accent font-medium">
                  <option value=""> -- 点击选择复刻源班级 -- </option>
                  <option v-for="c in classStore.classes.filter(c => c.id !== classStore.currentClass?.id)" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <button @click="copyConfig" :disabled="!copyFromClassId"
                  class="px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 disabled:opacity-40 transition active:scale-95 whitespace-nowrap">
                  开始复刻转移
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--========================================
        账号管理
      =========================================-->
      <div v-if="activeTab === 'account'" class="bg-white rounded-2xl p-6 shadow-sm animation-fade-in flex flex-col min-h-[400px]">
        <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex-shrink-0">账号安全设置</h3>
        <p class="text-sm text-gray-500 mb-6 flex-shrink-0">管理你当前登录的教师账号密码和在线状态登录信息。若遗忘了密码只能通过向管理员索要的激活码寻回。</p>
        
        <div class="space-y-4 max-w-2xl w-full mx-auto md:mx-0 flex-1">
          <button @click="showChangePassword = true"
            class="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-800 rounded-2xl hover:shadow-md hover:from-white hover:to-gray-50 transition-all group">
            <span class="flex items-center gap-4 text-left">
              <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🔑</div>
              <div>
                <div class="font-bold text-lg">修改我的登录密码</div>
                <div class="text-sm text-gray-500 mt-0.5">需要输入旧密码，请妥善保管新密码</div>
              </div>
            </span>
            <span class="text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all">❯</span>
          </button>
          
          <button @click="handleLogout"
            class="w-full flex items-center justify-between p-5 bg-red-50/50 border border-red-100 text-red-800 rounded-2xl hover:bg-red-50 hover:shadow-md transition-all group">
            <span class="flex items-center gap-4 text-left">
              <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl text-red-500 group-hover:scale-110 transition-transform">🚪</div>
              <div>
                <div class="font-bold text-lg">安全退出系统登录</div>
                <div class="text-sm text-red-400 mt-0.5">下次访问大厅将需重新输入账号验证身份</div>
              </div>
            </span>
            <span class="text-red-200 group-hover:text-red-500 group-hover:translate-x-1 transition-all">❯</span>
          </button>
        </div>
        <div class="mt-auto pt-6 text-center text-gray-300 text-sm flex-shrink-0 font-mono">
          🐾 班级宠物屋 V1.0 - 为教育和激励打造
        </div>
      </div>

    </div>

    <!-- 弹窗挂载点 -->
    <BatchAddModal v-if="showBatchAdd" @close="showBatchAdd = false" @added="showBatchAdd = false" />
    <ChangePasswordModal v-if="showChangePassword" :show="showChangePassword" @close="showChangePassword = false" />
    <AiReportModal v-if="showAiReport" :show="showAiReport" :class-id="classStore.currentClass?.id" @close="showAiReport = false" />

    <div v-if="showEditRuleModal" class="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" @click.self="closeEditRuleModal">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-5">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-bold text-slate-800">编辑积分规则</h4>
          <button @click="closeEditRuleModal" class="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">✕</button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-500 mb-1">规则名称</label>
            <input v-model="editRuleForm.name" type="text" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-accent bg-white" />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">图标（Emoji）</label>
            <input v-model="editRuleForm.icon" type="text" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-accent bg-white" />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">分值（不能为0）</label>
            <input v-model.number="editRuleForm.value" type="number" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-accent bg-white" />
          </div>
        </div>

        <div class="mt-5 flex gap-2 justify-end">
          <button @click="closeEditRuleModal" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">取消</button>
          <button @click="submitEditRule" class="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-hover">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClassStore } from '../stores/class'
import { useAuthStore } from '../stores/auth'
import api from '../utils/api'
import BatchAddModal from '../components/BatchAddModal.vue'
import AiReportModal from '../components/AiReportModal.vue'
import ChangePasswordModal from '../components/ChangePasswordModal.vue'
import { useTheme } from '../composables/useTheme'
import { PETS } from '../utils/pets'
import Dialog from '../utils/dialog'

const router = useRouter()
const classStore = useClassStore()
const authStore = useAuthStore()
const { setTheme } = useTheme()

// 定义左侧标签页结构
const tabs = [
  { id: 'basic', name: '基本设置', icon: '⚙️' },
  { id: 'classes', name: '班级管理', icon: '🏫' },
  { id: 'students', name: '学生管理', icon: '👨‍🎓' },
  { id: 'rules', name: '积分规则', icon: '📋' },
  { id: 'tools', name: '超级工具', icon: '🛠️' },
  { id: 'account', name: '账号中心', icon: '👤' },
]
const activeTab = ref('basic')

const newClassName = ref('')
const newStudentName = ref('')
const showBatchAdd = ref(false)
const rules = computed(() => classStore.scoreRules || [])
const currentTheme = ref('pink')
const newRule = ref({ name: '', icon: '⭐', value: 1 })
const growthStagesText = ref('')
const copyFromClassId = ref('')
const showAiReport = ref(false)
const showChangePassword = ref(false)
const rulesFilterTab = ref('add')
const showEditRuleModal = ref(false)
const editingRuleId = ref(null)
const editRuleForm = ref({ name: '', icon: '⭐', value: 1 })
const enableParentShareView = ['1', 'true', 'yes', 'on'].includes(
  String(import.meta.env.VITE_ENABLE_PARENT_SHARE_VIEW || 'false').toLowerCase()
)

const themes = [
  { id: 'pink', color: '#f472b6' },
  { id: 'blue', color: '#60a5fa' },
  { id: 'green', color: '#4ade80' },
  { id: 'purple', color: '#a78bfa' },
  { id: 'orange', color: '#fb923c' },
  { id: 'red', color: '#f87171' },
  { id: 'teal', color: '#2dd4bf' },
  { id: 'yellow', color: '#facc15' },
]

const filteredRules = computed(() => {
  if (!rules.value?.length) return []
  if (rulesFilterTab.value === 'deduct') return rules.value.filter(r => Number(r.value) < 0)
  return rules.value.filter(r => Number(r.value) > 0)
})

watch(() => classStore.currentClass?.id, async (classId) => {
  if (!classId || !classStore.currentClass) return
  currentTheme.value = classStore.currentClass.theme || 'pink'
  growthStagesText.value = (classStore.currentClass.growth_stages || [0,5,10,20,30,45,60,75,90,100]).join(',')
  await classStore.fetchScoreRules()
}, { immediate: true })

// === 班级管理 ===
async function createClass() {
  if (!newClassName.value.trim()) return
  try {
    const created = await api.post('/classes', { name: newClassName.value.trim() })
    newClassName.value = ''
    await classStore.fetchClasses()
    const target = classStore.classes.find(c => c.id === created.id)
    if (target) {
      await classStore.switchClass(target)
    }
    Dialog.alert('新班级已创建')
  } catch (err) { Dialog.alert(err.error || '创建班级失败') }
}

async function renameClass(cls) {
  const name = await Dialog.prompt('修改班级名称', cls.name)
  if (!name || name === cls.name) return
  try {
    await api.put(`/classes/${cls.id}`, { name })
    await classStore.fetchClasses()
    if (classStore.currentClass?.id === cls.id) {
      const current = classStore.classes.find(c => c.id === cls.id)
      if (current) classStore.currentClass = current
    }
    Dialog.alert('班级名称已更新')
  } catch (err) { Dialog.alert(err.error || '修改班级名称失败') }
}

async function switchClass(cls) {
  try {
    await classStore.switchClass(cls)
  } catch (err) { Dialog.alert(err.error || '切换班级失败') }
}

// === 学生名单管理 ===
async function addStudent() {
  const trimmedName = newStudentName.value.trim()
  if (!trimmedName) return
  if (classStore.students.some(s => (s.name || '').trim() === trimmedName)) {
    Dialog.alert('该班级已有同名学生')
    return
  }
  try {
    await api.post('/students', {
      class_id: classStore.currentClass.id,
      name: trimmedName
    })
    newStudentName.value = ''
    await classStore.fetchStudents()
  } catch (err) { Dialog.alert(err.error || '添加失败') }
}

async function editStudent(s) {
  const name = await Dialog.prompt('修改学生姓名', s.name)
  const trimmedName = (name || '').trim()
  if (!trimmedName || trimmedName === s.name) return
  if (classStore.students.some(x => x.id !== s.id && (x.name || '').trim() === trimmedName)) {
    Dialog.alert('该班级已有同名学生')
    return
  }
  try {
    await api.put(`/students/${s.id}`, { name: trimmedName })
    await classStore.fetchStudents()
  } catch (err) { Dialog.alert(err.error || '修改失败') }
}

async function deleteStudent(s) {
  if (!(await Dialog.confirm(`确定要在名单中彻底除名 "${s.name}" 吗？该学生的所有历史积分数据将被抹去。`))) return
  try {
    await api.delete(`/students/${s.id}`)
    await classStore.fetchStudents()
  } catch (err) { Dialog.alert(err.error || '删除失败') }
}

// === 加分规则管理 ===
async function deleteRule(r) {
  if (!(await Dialog.confirm(`你想删掉 "${r.name}" 这组规则吗？`))) return
  try {
    await api.delete(`/score-rules/${r.id}`)
    await classStore.fetchScoreRules()
  } catch (err) { Dialog.alert(err.error || '删除失败，请稍后重试') }
}

async function addRule() {
  const ruleName = (newRule.value.name || '').trim()
  const ruleValue = Number(newRule.value.value)
  if (!ruleName || !Number.isInteger(ruleValue) || ruleValue === 0) {
    Dialog.alert('规则名称不能为空，分值必须是非0整数')
    return
  }
  try {
    await api.post('/score-rules', {
      class_id: classStore.currentClass.id,
      name: ruleName,
      icon: (newRule.value.icon || '⭐').trim() || '⭐',
      value: ruleValue
    })
    await classStore.fetchScoreRules()
    newRule.value = { name: '', icon: '⭐', value: 1 } // Reset to ready defaults
  } catch (err) { Dialog.alert(err.error || '添加规则失败') }
}

async function editRule(rule) {
  editingRuleId.value = rule.id
  editRuleForm.value = {
    name: rule.name || '',
    icon: rule.icon || '⭐',
    value: Number(rule.value)
  }
  showEditRuleModal.value = true
}

function closeEditRuleModal() {
  showEditRuleModal.value = false
  editingRuleId.value = null
}

async function submitEditRule() {
  const trimmedName = (editRuleForm.value.name || '').trim()
  const trimmedIcon = (editRuleForm.value.icon || '').trim() || '⭐'
  const value = Number(editRuleForm.value.value)

  if (!trimmedName) {
    Dialog.alert('规则名称不能为空')
    return
  }
  if (!Number.isInteger(value) || value === 0) {
    Dialog.alert('分值必须是非0整数')
    return
  }
  if (!editingRuleId.value) {
    Dialog.alert('未找到要编辑的规则')
    return
  }

  try {
    await api.put(`/score-rules/${editingRuleId.value}`, {
      name: trimmedName,
      icon: trimmedIcon,
      value
    })
    await classStore.fetchScoreRules()
    closeEditRuleModal()
  } catch (err) {
    Dialog.alert(err.error || '编辑规则失败')
  }
}

// === 基础设置与杂项保存 ===
async function saveSettings() {
  try {
    const updateData = {
      theme: currentTheme.value
    }
    // 解析成长阶段
    if (growthStagesText.value) {
      const stages = growthStagesText.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
      if (stages.length >= 2) updateData.growth_stages = stages
    }
    await api.put(`/classes/${classStore.currentClass.id}`, updateData)
    await classStore.fetchClasses()
    Dialog.alert('基础配置保存成功！刷新或返回前台即可生效。')
  } catch (err) { Dialog.alert(err.error || '保存遇到网络故障') }
}

// === 分享连接管理 ===
const shareLink = computed(() => {
  return classStore.currentClass?.share_code ? `${window.location.origin}/share/${classStore.currentClass.share_code}` : ''
})

async function generateShare() {
  try {
    const res = await api.post(`/classes/${classStore.currentClass.id}/generate-share`)
    // UI reactive update
    if (classStore.currentClass) {
       classStore.currentClass.share_code = res.share_code
    }
    await classStore.fetchClasses()
    Dialog.alert('已生成全新的纯净分享链接！')
  } catch (err) { Dialog.alert(err.error || '生成失败') }
}

async function disableShare() {
  if (!(await Dialog.confirm('停用后，之前发给家长的所有链接都会立即失效。确定停用此班级的分享吗？'))) return
  try {
    await api.post(`/classes/${classStore.currentClass.id}/disable-share`)
    // UI reactive update
    if (classStore.currentClass) {
       classStore.currentClass.share_code = null
    }
    await classStore.fetchClasses()
    Dialog.alert('班级纯净分享已立刻关闭访问权限！')
  } catch (err) { Dialog.alert(err.error || '关闭失败') }
}

async function copyShareLink() {
  if (!shareLink.value) return
  try {
    await navigator.clipboard.writeText(shareLink.value)
    Dialog.alert('✅ 分享链接已复制到剪贴板！快去发给家长群吧。')
  } catch (err) {
    Dialog.alert('复制失败，请手动全选文本框内容复制。')
  }
}

// === 面板特权动作 ===
async function randomAssignPets() {
  if (!(await Dialog.confirm('确定一键随机为班上目前还没开盲盒的学生发送宠物吗？'))) return
  try {
    await api.post('/students/random-pets', {
      class_id: classStore.currentClass.id,
      pets: PETS
    })
    await classStore.fetchStudents()
    Dialog.alert('已给没宠物的孩子们完成了派发！')
  } catch (err) { Dialog.alert(err.error || '系统派发异常，请稍后再试') }
}

async function randomAssignGroups() {
  if (!(await Dialog.confirm('打乱所有学生目前所属的小组，进行天命重新发配！是否继续？'))) return
  try {
    await api.post('/groups/random-assign', {
      class_id: classStore.currentClass.id
    })
    await classStore.fetchGroups()
    await classStore.fetchStudents()
    Dialog.alert('重新乱序列队！分组洗牌完毕🎲')
  } catch (err) { Dialog.alert(err.error || '洗牌失败') }
}

async function resetAllProgress() {
  if (!(await Dialog.confirm('🚨 危险提醒：此操作将清空所选班级所有人的现有宠物进度和历史积分累计，恢复如初，通常用于新学期排雷！继续执行？'))) return
  try {
    await api.post('/students/reset-all', {
      class_id: classStore.currentClass.id
    })
    await classStore.fetchStudents()
    Dialog.alert('班级全员进度已重置')
  } catch (err) { Dialog.alert(err.error || '服务端拒绝了你的重置命令') }
}

async function copyConfig() {
  if (!copyFromClassId.value) return
  if (!(await Dialog.confirm('即将强行覆盖本班的 积分项、商品项配置 为来源班级规则，确定执行？'))) return
  try {
    await api.post('/classes/copy-config', {
      from_class_id: copyFromClassId.value,
      to_class_id: classStore.currentClass.id
    })
    await classStore.fetchClasses()
    await classStore.fetchScoreRules()
    Dialog.alert('一键传功复制圆满成功！')
  } catch (err) { Dialog.alert(err.error || '无法完成云端配置转移') }
}

// === 闭合退出 ===
function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.animation-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}

/* 隐藏横向滚动框的默认 UI 并留出美观留白 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 允许优美的自定义细长滚动条 (主要针对表单内部长清单的 Webkit)为主 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>
