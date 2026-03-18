<template>
  <div
    class="switcher"
    :class="{ 'is-switched': isSwitched }"
    @click="handleClick"
  >
    <div class="switcher-inner" />
  </div>
</template>

<script setup lang="ts">
const isSwitched = defineModel<boolean>({ default: false })

const handleClick = () => (isSwitched.value = !isSwitched.value)
</script>

<style scoped lang="scss">
.switcher {
  position: relative;
  border-radius: 3.625rem;
  overflow: hidden;
  flex-shrink: 0;
  width: 5.5rem;
  height: 2.75rem;
  cursor: pointer;
  border: 1px solid var(--Black-300);
}
.switcher.is-switched {
  &::before {
    transform: translate(calc(100% + 0.5rem), -50%);
  }
  .switcher-inner::before {
    opacity: 0.5;
  }
  .switcher-inner::after {
    opacity: 1;
  }
}
.switcher::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  left: 0.25rem;
  width: calc(50% - 0.5rem);
  aspect-ratio: 1/1;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(180deg, #24242a 0%, #303038 100%);
  transition: transform var(--duration-default);
}
.switcher-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  @include flex($ai: center, $jc: space-between);
}
.switcher-inner::before,
.switcher-inner::after {
  content: "";
  display: block;
  width: 50%;
  height: 100%;
  background: url("/images/icon/grid-1.svg") center / 1.5rem no-repeat;
  transition: opacity var(--transition-slow);
}
.switcher-inner::after {
  background: url("/images/icon/grid-2.svg") center / 1.5rem no-repeat;
  opacity: 0.5;
}
</style>
