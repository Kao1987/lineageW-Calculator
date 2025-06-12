<template>
  <div class="help-tabs-container">
    <!-- 標籤按鈕 -->
    <div class="help-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['help-tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.title }}
      </button>
    </div>

    <!-- 標籤內容 -->
    <div class="help-tab-content">
      <!-- 使用方法標籤 -->
      <div v-if="activeTab === 'usage'" class="tab-panel">
        <h3>{{ helpContent.usage.title }}</h3>
        <div class="steps">
          <div
            v-for="step in helpContent.usage.steps"
            :key="step.num"
            class="step-item"
          >
            <span class="step-num">{{ step.num }}</span>
            <div class="step-text">{{ step.text }}</div>
          </div>
        </div>
      </div>

      <!-- 計算原理標籤 -->
      <div v-if="activeTab === 'calculation'" class="tab-panel">
        <h3>{{ helpContent.calculation.title }}</h3>
        
        <!-- 升級機率區塊 -->
        <div class="calc-section">
          <h4>升級機率</h4>
          <div class="probability-section">
            <div class="prob-item">
              <strong>主屬性：{{ helpContent.calculation.upgradeRates.mainStat }}</strong>
              <br>
              <span>{{ helpContent.calculation.upgradeRates.mainExpected }}</span>
            </div>
            <div class="prob-item">
              <strong>副屬性：{{ helpContent.calculation.upgradeRates.subStat }}</strong>
              <br>
              <span>{{ helpContent.calculation.upgradeRates.subExpected }}</span>
            </div>
          </div>
        </div>

        <!-- 評分公式區塊 -->
        <div class="calc-section">
          <h4>評分公式</h4>
          <div class="formula">
            <div
              v-for="item in helpContent.calculation.formula"
              :key="item.step"
              class="formula-step"
            >
              <strong>{{ item.step }}. {{ item.title }}</strong>
              <br>
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </div>

        <!-- 寵物基礎數據區塊 -->
        <div class="calc-section">
          <h4>🎯 寵物基礎數據</h4>
          <table class="base-table">
            <thead>
              <tr>
                <th>寵物</th>
                <th>忍耐力</th>
                <th>忠誠心</th>
                <th>速度</th>
                <th>積極性</th>
                <th>體力</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="pet in helpContent.calculation.baseData"
                :key="pet.pet"
              >
                <td>{{ pet.pet }}</td>
                <td :class="{ 'main-stat': pet.endurance > 6 }">{{ pet.endurance }}</td>
                <td :class="{ 'main-stat': pet.loyalty > 6 }">{{ pet.loyalty }}</td>
                <td :class="{ 'main-stat': pet.speed > 6 }">{{ pet.speed }}</td>
                <td>{{ pet.aggressiveness }}</td>
                <td :class="{ 'main-stat': pet.hp > 6 }">{{ pet.hp }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 評價等級標籤 -->
      <div v-if="activeTab === 'rating'" class="tab-panel">
        <h3>{{ helpContent.rating.title }}</h3>
        
        <!-- 個別屬性評級 -->
        <div class="calc-section">
          <h4>📊 個別屬性評級</h4>
          <div class="rating-list">
            <div
              v-for="rating in helpContent.rating.individual"
              :key="rating.level"
              :class="['rating-item', rating.level]"
            >
              <span class="rating-badge">{{ rating.badge }}</span>
              <span class="rating-desc">{{ rating.desc }}</span>
            </div>
          </div>
        </div>

        <!-- 整體評價門檻 -->
        <div class="calc-section">
          <h4>🎯 整體評價門檻</h4>
          <div class="rating-list">
            <div
              v-for="rating in helpContent.rating.overall"
              :key="rating.level"
              :class="['rating-item', rating.level]"
            >
              <span class="rating-badge">{{ rating.badge }}</span>
              <span class="rating-desc">{{ rating.desc }}</span>
            </div>
          </div>
        </div>

        <!-- 角色加成效果 -->
        <div class="calc-section">
          <h4>💪 角色加成效果</h4>
          <div class="bonus-info">
            <ul>
              <li v-for="effect in helpContent.rating.bonusEffects" :key="effect">
                {{ effect }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { petEvaluateHelpContent } from '../composables/useModal'

const helpContent = petEvaluateHelpContent

const tabs = [
  { id: 'usage', title: '使用方法' },
  { id: 'calculation', title: '計算原理' },
  { id: 'rating', title: '評價等級' }
]

const activeTab = ref('usage')
</script>

<style scoped>
.help-tabs-container {
  width: 100%;
}

/* 標籤按鈕 */
.help-tabs {
  display: flex;
  border-bottom: 2px solid var(--border-color, #e1e5e9);
  margin-bottom: 20px;
}

.help-tab-btn {
  background: none;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--text-secondary, #718096);
}

.help-tab-btn:hover {
  background: var(--bg-hover, #f7fafc);
  color: var(--text-primary, #2d3748);
}

.help-tab-btn.active {
  color: var(--text-accent, #667eea);
  border-bottom-color: var(--text-accent, #667eea);
  background: var(--bg-accent-light, #f0f4ff);
}

/* 標籤內容 */
.help-tab-content {
  min-height: 300px;
}

.tab-panel h3 {
  color: var(--text-primary, #2d3748);
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.tab-panel h4 {
  color: var(--text-primary, #2d3748);
  margin: 24px 0 12px 0;
  font-size: 1.1rem;
}

/* 使用步驟 */
.steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--bg-secondary, #f8f9fa);
  border-radius: 8px;
  border-left: 4px solid var(--text-accent, #667eea);
}

.step-num {
  background: var(--text-accent, #667eea);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.step-text {
  color: var(--text-primary, #2d3748);
  line-height: 1.5;
}

/* 計算區塊 */
.calc-section {
  margin-bottom: 24px;
}

.probability-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prob-item {
  padding: 12px;
  background: var(--bg-secondary, #f8f9fa);
  border-radius: 6px;
  border-left: 3px solid var(--text-success, #48bb78);
}

.formula {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.formula-step {
  padding: 12px;
  background: var(--bg-secondary, #f8f9fa);
  border-radius: 6px;
  border-left: 3px solid var(--text-info, #4299e1);
}

/* 基礎數據表格 */
.base-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.base-table th,
.base-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid var(--border-color, #e1e5e9);
}

.base-table th {
  background: var(--bg-secondary, #f8f9fa);
  font-weight: 600;
  color: var(--text-primary, #2d3748);
}

.base-table .main-stat {
  font-weight: bold;
  color: var(--text-accent, #667eea);
  background: var(--bg-accent-light, #f0f4ff);
}

/* 評價列表 */
.rating-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid;
}

.rating-badge {
  background: var(--text-primary, #2d3748);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

.rating-desc {
  flex: 1;
  color: var(--text-primary, #2d3748);
  line-height: 1.4;
}

/* 評價等級顏色 */
.rating-item.excellent {
  background: #f0fff4;
  border-color: #48bb78;
}

.rating-item.excellent .rating-badge {
  background: #48bb78;
}

.rating-item.good {
  background: #f7fafc;
  border-color: #4299e1;
}

.rating-item.good .rating-badge {
  background: #4299e1;
}

.rating-item.average {
  background: #fffaf0;
  border-color: #ed8936;
}

.rating-item.average .rating-badge {
  background: #ed8936;
}

.rating-item.normal {
  background: #fefefe;
  border-color: #a0aec0;
}

.rating-item.normal .rating-badge {
  background: #a0aec0;
}

.rating-item.poor,
.rating-item.tragic,
.rating-item.needImprovement {
  background: #fff5f5;
  border-color: #f56565;
}

.rating-item.poor .rating-badge,
.rating-item.tragic .rating-badge,
.rating-item.needImprovement .rating-badge {
  background: #f56565;
}

.rating-item.fixed,
.rating-item.godTier,
.rating-item.highQuality,
.rating-item.normalPet {
  background: #f0f4ff;
  border-color: #667eea;
}

.rating-item.fixed .rating-badge,
.rating-item.godTier .rating-badge,
.rating-item.highQuality .rating-badge,
.rating-item.normalPet .rating-badge {
  background: #667eea;
}

/* 加成效果 */
.bonus-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bonus-info li {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light, #f1f5f9);
  color: var(--text-primary, #2d3748);
}

.bonus-info li:last-child {
  border-bottom: none;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .help-tabs {
    flex-wrap: wrap;
  }
  
  .help-tab-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .base-table {
    font-size: 0.85rem;
  }
  
  .base-table th,
  .base-table td {
    padding: 8px 6px;
  }
  
  .step-item {
    padding: 12px;
  }
  
  .rating-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .rating-badge {
    align-self: flex-start;
  }
}
</style> 