<template>
  <div class="not-found-page">
    <div class="error-content">
      <h1>404</h1>
      <h2>頁面未找到</h2>
      <p>抱歉，您要查找的頁面不存在。</p>
      <router-link to="/" class="back-home-btn"> 返回首頁 </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 頁面不需要額外邏輯
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: var(--spacing-lg);
}

.error-content h1 {
  font-size: 6rem;
  color: var(--color-text-accent);
  margin-bottom: 1rem;
}

.error-content h2 {
  font-size: 2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.error-content p {
  color: var(--color-text-primary);
  margin-bottom: 2rem;
}

.back-home-btn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--color-text-accent);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  background: var(--color-text-purple);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .not-found-page {
    padding: var(--spacing-md);
  }

  .error-content h1 {
    font-size: 4rem;
  }

  .error-content h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .error-content h1 {
    font-size: 3rem;
  }

  .error-content h2 {
    font-size: 1.25rem;
  }

  .back-home-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>
