<template>
  <main class="main-page">
    <PageMainHeader />
    <PageMainArtworks />
    <ModalAddArtwork />
    <ModalDelete />
  </main>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.main-page {
  height: 100vh;
  padding: 3.5rem 3.5rem 0;
  @include flex($fd: column);
}
</style>
