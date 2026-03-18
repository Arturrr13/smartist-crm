<template>
  <div class="progress">
    <div v-for="level in 3" :key="level">
      <CommonProgressBar
        :style="{
          '--progress': stepIndex >= level ? '100%' : '0%',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stepIndex: number
}>()
</script>

<style scoped lang="scss">
.progress {
  @include flex(center, $g: 0.25rem);
}
.progress:deep(.progress-bar)::before {
  transition: transform var(--transition-slow);
}
</style>
