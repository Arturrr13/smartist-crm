<template>
  <main class="sign-up-page" :class="{ 'first-step-done': stepIndex > 0 }">
    <div class="top-block">
      <div class="logo" />

      <PageSignUpProgress :step-index="stepIndex" />
    </div>

    <PageSignUpContent v-model="stepIndex" />

    <div class="l1 gray contact-block">
      Need help?
      <a
        href="/"
        target="_blank"
        aria-label="Contact us"
        class="underline-reverse"
      >
        Contact us
      </a>
    </div>
  </main>
</template>

<script setup lang="ts">
const stepIndex = ref(0)
</script>

<style scoped lang="scss">
.sign-up-page {
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: 60rem;
  @include flex($ai: center, $jc: center);
}
.sign-up-page.first-step-done {
  &::before {
    width: 57.625rem;
  }
  .top-block {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  .contact-block {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
.sign-up-page::before {
  content: "";
  position: absolute;
  top: -24.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: auto;
  aspect-ratio: 1440 / 1700;
  background: url("/images/common/bg-gradient.webp") center / cover no-repeat;
  transition: var(--transition-slow);
  transition-property: width;
}
.top-block {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translate(-50%, -100%);
  opacity: 0;
  transition: var(--transition-slow);
  transition-property: transform, opacity;
  @include flex($ai: center, $g: 2.5rem, $fd: column);
}
.logo {
  width: 8.5rem;
  height: 2rem;
}
.logo::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background: url("/images/common/logo.svg") center / cover no-repeat;
}
.contact-block {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%, 100%);
  opacity: 0;
  transition: var(--transition-slow);
  transition-property: transform, opacity;
}
.underline-reverse {
  display: inline;
}
</style>
