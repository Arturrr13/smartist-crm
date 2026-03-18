<template>
  <div class="progress-bar" />
</template>

<style lang="scss" scoped>
.progress-bar {
  --progress: 0%;

  overflow: hidden;
  position: relative;
  width: 5rem;
  height: 2px;
  background: var(--Opacity-10);
  border-radius: 0.75rem;
}
.progress-bar.vertical {
  width: 2px;
  height: 5rem;

  &::before {
    left: 0;
    transform: translateY(calc(-100% + var(--progress)));
  }
}
.progress-bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: -1px;
  width: 100%;
  height: 100%;
  background: var(--White-100);
  transform: translateX(calc(-100% + var(--progress)));
}
</style>
