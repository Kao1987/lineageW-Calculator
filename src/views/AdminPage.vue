<template>
  <div class="admin-page">
    <h1>公告管理</h1>
    <p class="description">
      在此頁面更新所有語言的公告。完成後，點擊「產生並下載 JSON」，並將下載的 `announcements.json`
      檔案覆蓋到 `public/` 目錄下。
    </p>

    <div class="form-container">
      <div class="form-group">
        <label for="publishDate">發布日期</label>
        <input type="date" id="publishDate" v-model="announcement.date" />
      </div>

      <div class="language-group">
        <h2>繁體中文 (zh-TW)</h2>
        <div class="form-group">
          <label for="title-zh-TW">標題</label>
          <input
            type="text"
            id="title-zh-TW"
            v-model="announcement.zhTW.title"
            placeholder="請輸入繁中標題"
          />
        </div>
        <div class="form-group">
          <label for="content-zh-TW">內容</label>
          <textarea
            id="content-zh-TW"
            v-model="announcement.zhTW.content"
            placeholder="請輸入繁中內容"
            rows="5"
          ></textarea>
        </div>
      </div>

      <div class="language-group">
        <h2>English (en)</h2>
        <div class="form-group">
          <label for="title-en">Title</label>
          <input
            type="text"
            id="title-en"
            v-model="announcement.en.title"
            placeholder="Enter English title"
          />
        </div>
        <div class="form-group">
          <label for="content-en">Content</label>
          <textarea
            id="content-en"
            v-model="announcement.en.content"
            placeholder="Enter English content"
            rows="5"
          ></textarea>
        </div>
      </div>

      <div class="language-group">
        <h2>한국어 (ko)</h2>
        <div class="form-group">
          <label for="title-ko">제목</label>
          <input
            type="text"
            id="title-ko"
            v-model="announcement.ko.title"
            placeholder="한국어 제목을 입력하세요"
          />
        </div>
        <div class="form-group">
          <label for="content-ko">내용</label>
          <textarea
            id="content-ko"
            v-model="announcement.ko.content"
            placeholder="한국어 내용을 입력하세요"
            rows="5"
          ></textarea>
        </div>
      </div>

      <button @click="saveAnnouncements" class="generate-btn">儲存公告</button>

      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const announcement = ref({
  date: new Date().toISOString().split('T')[0],
  zhTW: { title: '', content: '' },
  en: { title: '', content: '' },
  ko: { title: '', content: '' },
})

const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 在元件掛載時，嘗試讀取現有的 announcements.json
onMounted(async () => {
  try {
    const response = await fetch('/announcements.json')
    if (response.ok) {
      const data = await response.json()
      announcement.value.date = data.date || new Date().toISOString().split('T')[0]
      announcement.value.zhTW = data['zh-TW'] || { title: '', content: '' }
      announcement.value.en = data.en || { title: '', content: '' }
      announcement.value.ko = data.ko || { title: '', content: '' }
    }
  } catch (error) {
    console.warn('無法讀取現有的 announcements.json，將使用空白表單。', error)
  }
})

async function saveAnnouncements() {
  message.value = ''
  const dataToSave = {
    date: announcement.value.date,
    'zh-TW': announcement.value.zhTW,
    en: announcement.value.en,
    ko: announcement.value.ko,
  }

  try {
    const response = await fetch('/api/update-announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    })

    const result = await response.json()

    if (response.ok) {
      message.value = result.message
      messageType.value = 'success'
    } else {
      throw new Error(result.message || '儲存失敗')
    }
  } catch (error) {
    message.value = `儲存失敗：${(error as Error).message}`
    messageType.value = 'error'
  }
}
</script>

<style scoped>
.admin-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #282c34;
  border: 1px solid #3e4451;
  border-radius: 8px;
  color: #abb2bf;
}

h1 {
  text-align: center;
  color: #61dafb;
  border-bottom: 2px solid #61dafb;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.description {
  text-align: center;
  margin-bottom: 30px;
  color: #9ca3af;
  font-style: italic;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.language-group {
  padding: 20px;
  border: 1px dashed #4a5160;
  border-radius: 8px;
}

.language-group h2 {
  color: #e5c07b;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

label {
  font-weight: 500;
  color: #d1d5db;
}

input[type='text'],
input[type='date'],
textarea {
  width: 100%;
  padding: 10px;
  background: #1f2328;
  border: 1px solid #3e4451;
  border-radius: 4px;
  color: #e2e8f0;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #61dafb;
}

textarea {
  resize: vertical;
}

.generate-btn {
  padding: 12px 20px;
  background-color: #61dafb;
  color: #282c34;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: center;
}

.generate-btn:hover {
  background-color: #25a1c4;
}

.message {
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
}

.message.success {
  background-color: #314a38;
  color: #98c379;
}

.message.error {
  background-color: #4a3133;
  color: #e06c75;
}
</style>
