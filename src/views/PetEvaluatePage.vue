<template>
  <div class="pet-evaluate-view">
    <PetEvaluateMain />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PetEvaluateMain from '../../modules/pet-evaluate/components/PetEvaluateMain.vue'
import { setPageMeta, pageMeta } from '../../modules/shared/utils/seo'
import { trackPageView } from '../../modules/shared/utils/analytics'

onMounted(() => {
  // Set page meta tags
  setPageMeta(pageMeta.petEvaluate)

  // Track page view
  trackPageView('pet-evaluate', 'Pet Evaluation System - LineageW Calculator')
})
</script>

<style scoped>
.pet-evaluate-view {
  min-height: 100vh;
}
</style>
