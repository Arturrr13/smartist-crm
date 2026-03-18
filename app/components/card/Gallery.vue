<template>
  <div class="gallery-card">
    <div class="gallery-card-img">
      <img :src="artwork.image" :alt="artwork.title" />
    </div>
    <div class="gallery-card-text">
      <span class="p2 primary">{{ artwork.title }}</span>
      <span class="p2 gray">
        {{ artwork.size.height }} x {{ artwork.size.width }} x
        {{ artwork.size.depth || "0" }} {{ artwork.size.unit }}
      </span>
      <span
        class="p2-medium"
        v-html="
          `${artwork.price.currency} ${artwork.price.amount.toLocaleString()}`
        "
      />
      <div class="submenu-wrap">
        <button
          type="button"
          class="submenu-button"
          @click="emit('activeSubmenu', index)"
          @blur="handleBlur"
        />

        <div
          class="submenu"
          :class="{
            active: activeCardIndex === index,
          }"
        >
          <button class="p1 edit-button">Edit</button>
          <button
            class="p1 delete-button"
            @click="handleDelete(artwork.id, artwork.title)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Artwork, ModalState } from "~~/shared"

defineProps<{
  artwork: Artwork
  index: number
  activeCardIndex: number
}>()

const emit = defineEmits<{
  (e: "activeSubmenu", index: number): void
  (e: "closeSubmenu"): void
  (e: "deleteArtwork", id: string): void
}>()

const modal = useState<ModalState>("modal")

const handleBlur = () => {
  setTimeout(() => {
    emit("closeSubmenu")
  }, 250)
}

const handleDelete = (id: string, title: string) => {
  modal.value.deleteArtwork = { id, title }
}
</script>

<style scoped lang="scss">
.gallery-card {
  @include flex($g: 0.5rem, $fd: column);
}
.gallery-card-img {
  width: 100%;
}
.gallery-card-img img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
.gallery-card-text {
  position: relative;
  @include flex($g: 0.25rem, $fd: column);
}
.submenu-wrap {
  position: absolute;
  top: 0;
  right: 0;
  @include flex(center, center);
}
.submenu-button {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.5rem;
  opacity: 0.5;
  transition: opacity var(--transition-slow);
  @include flex(center, center);

  @include hover {
    &:hover {
      opacity: 1;
    }
  }
}
.submenu-button::before {
  content: "";
  display: block;
  width: 0.5rem;
  height: 0.75rem;
  background: url("/images/icon/dots.svg") center / contain no-repeat;
}
.submenu {
  position: absolute;
  top: 0;
  right: 1.5rem;
  z-index: 1;
  width: 9.375rem;
  height: 5.5rem;
  background: var(--Black-150);
  border-radius: 0.5rem;
  border: 1px solid var(--Stroke-Primary);
  border-bottom: 1px solid transparent;
  display: grid;
  grid-template-rows: 1fr 1fr;
  pointer-events: none;
  opacity: 0;
  transform: translateX(100%);
  transition: var(--transition-slow);
  transition-property: transform, opacity;
}
.submenu.active {
  pointer-events: auto;
  opacity: 1;
  transform: translateX(0);
}
.edit-button,
.delete-button {
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  transition: background var(--transition-slow);
  @include flex(center, flex-start, 0.5rem);

  @include hover {
    &:hover {
      background: var(--Opacity-10);
    }
  }
}
.delete-button {
  border-top: 1px solid var(--Stroke-Primary);
  color: var(--Error);
}
.edit-button::before,
.delete-button::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/edit.svg") center / cover no-repeat;
}
.delete-button::before {
  background: url("/images/icon/trash.svg") center / cover no-repeat;
}
</style>
