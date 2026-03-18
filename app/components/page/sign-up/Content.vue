<template>
  <div class="sign-up-content">
    <PageSignUpOAuthStep
      :class="{ active: stepIndex === 0 }"
      @continue="stepIndex++"
    />
    <PageSignUpGalleryStep
      :class="{ active: stepIndex === 1 }"
      @back="stepIndex--"
      @continue="stepIndex++"
    />
    <PageSignUpProfileStep
      :class="{ active: stepIndex === 2 }"
      @back="stepIndex--"
      @continue="stepIndex++"
    />
    <PageSignUpIntroduceStep
      :class="{ active: stepIndex === 3 }"
      @back="stepIndex--"
    />
  </div>
</template>

<script setup lang="ts">
const stepIndex = defineModel<number>({
  default: 0,
})
</script>

<style scoped lang="scss">
.sign-up-content {
  position: relative;
  @include flex(center, center);
}
</style>
