<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      歡迎來到 Lineage W 計算器實驗室！
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  msg: string
}

defineProps<Props>()
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 2rem;
}

.hello h1 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.hello p {
  color: var(--color-text);
}
</style> 