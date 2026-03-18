<template>
  <header class="header">
    <div class="logo" />

    <div class="left-block">
      <button class="profile-button" />
      <button class="default-btn exit-button" @click="handleExit" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { ProfileState } from "~~/shared"

const profileCookie = useCookie<ProfileState | null>("profile")

const handleExit = () => {
  profileCookie.value = null
  navigateTo("/sign-up")
}
</script>

<style scoped lang="scss">
.header {
  @include flex($ai: center, $jc: space-between);
}
.logo {
  width: 8.5rem;
  height: 2rem;
  background: url("/images/common/logo.svg") center / cover no-repeat;
}
.left-block {
  @include flex($g: 0.5rem);
}
.profile-button,
.exit-button {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  overflow: hidden;
}
.profile-button {
  background: url("/images/icon/user.svg") center / cover no-repeat;
}
.exit-button {
  padding: 0;
}
.exit-button::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/exit.svg") center / cover no-repeat;
}
</style>
