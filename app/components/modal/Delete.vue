<template>
  <div
    class="delete-modal"
    :class="{ active: deletePayload && !isClosing }"
    role="dialog"
    aria-modal="true"
    aria-label="Delete artwork confirmation"
  >
    <div class="overlay" @click="closeModal" />

    <div class="delete-modal-inner">
      <h2 class="h3 title">Are you sure?</h2>
      <p class="p1 gray description">
        You want to delete ‘{{ deletePayload?.title ?? "this artwork" }}’. This
        action cannot be undone.
      </p>

      <div class="actions">
        <button
          class="default-btn h-44 btn-text-2 action-btn"
          type="button"
          @click="closeModal"
        >
          CANCEL
        </button>
        <button
          class="default-btn h-44 red btn-text-2 action-btn"
          type="button"
          @click="confirmDelete"
        >
          YES,DELETE
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Artwork, ModalState } from "~~/shared"

const modal = useState<ModalState>("modal")
const artworks = useState<Artwork[]>("artworks")
const isClosing = ref(false)

const deletePayload = computed(() => {
  const payload = modal.value.deleteArtwork
  return payload && typeof payload === "object" ? payload : null
})

const closeModal = () => {
  isClosing.value = true

  setTimeout(() => {
    modal.value.deleteArtwork = false
    isClosing.value = false
  }, 400)
}

const confirmDelete = () => {
  const payload = deletePayload.value
  if (!payload) return

  artworks.value = artworks.value.filter((artwork) => artwork.id !== payload.id)
  closeModal()
}
</script>

<style scoped lang="scss">
.delete-modal {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-modal) + 2);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-slow);
  @include flex(center, center);
}
.delete-modal.active {
  pointer-events: all;
  opacity: 1;

  .overlay {
    opacity: 0.9;
  }
}
.overlay {
  position: absolute;
  inset: 0;
  background: var(--Black-100);
  opacity: 0;
  transition: opacity var(--transition-slow);
}
.delete-modal-inner {
  position: relative;
  z-index: 1;
  width: 25.75rem;
  border: 1px solid var(--Opacity-10);
  border-radius: 2rem;
  background: var(--Black-200);
  backdrop-filter: blur(0.5rem);
  padding: 2rem;
  @include flex($ai: center, $g: 2rem, $fd: column);
}
.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
}
.description {
  width: 18.5rem;
  text-align: center;
}
.actions {
  @include flex($g: 1rem);
}
.action-btn {
  width: 10.375rem;
}
</style>
