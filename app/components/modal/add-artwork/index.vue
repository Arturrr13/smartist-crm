<template>
  <div
    class="add-artwork-modal"
    :class="{
      active: modalState.addArtwork && !isClosing,
    }"
    role="dialog"
    aria-modal="true"
    aria-label="Add artwork"
  >
    <div class="overlay" @click="closeModal" />

    <div class="add-artwork-modal-inner">
      <div class="add-artwork-modal-header">
        <button
          class="p3 default-btn h-44 close-btn"
          type="button"
          @click="closeModal"
        >
          Close
        </button>
        <h2 class="h3">Add artwork</h2>
        <button
          class="p3 default-btn blue h-44 save-btn"
          type="button"
          :disabled="selectedFiles.length === 0"
          @click="handleSave"
        >
          Save
        </button>
      </div>

      <div
        v-show="selectedFiles.length === 0"
        class="upload-zone"
        :class="{ 'is-drag-over': isDragOver }"
        @dragenter.prevent="isDragOver = true"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInputRef"
          type="file"
          class="hidden-input"
          multiple
          accept=".png,.jpg,.jpeg,.tiff"
          @change="handleFileChange"
        />

        <div class="upload-content">
          <div class="upload-icon" />
          <button
            class="default-btn h-44 upload-btn"
            type="button"
            @click="fileInputRef?.click()"
          >
            Upload artwork
          </button>
          <span class="p1 gray">or drag and drop</span>

          <ul class="upload-rules">
            <li class="p2 gray">Supports PNG, JPG, JPEG, TIFF up to 100MB.</li>
            <li class="p2 gray">Drag entire folders.</li>
            <li class="p2 gray">Show the artwork only, without frames.</li>
            <li class="p2 gray">No people visible in the image.</li>
            <li class="p2 gray">No watermarks, logos, or text overlays.</li>
            <li class="p2 gray">Neutral background, no interior context.</li>
          </ul>
        </div>
      </div>

      <ModalAddArtworkFillStep
        v-show="selectedFiles.length > 0"
        ref="fillStepRef"
        :files="selectedFiles"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ModalState } from "~~/shared"

const modalState = useState<ModalState>("modal")
const isClosing = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)
const selectedFiles = ref<File[]>([])
const fillStepRef = ref<{ handleSave: () => void } | null>(null)

const closeModal = () => {
  isClosing.value = true

  setTimeout(() => {
    modalState.value.addArtwork = false
    isClosing.value = false
    isDragOver.value = false
    selectedFiles.value = []
  }, 600)
}

const normalizeFiles = (files: FileList | null): File[] => {
  if (!files) {
    return []
  }

  return Array.from(files).filter((file) => file.type.startsWith("image/"))
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  selectedFiles.value = normalizeFiles(target?.files ?? null)
  if (target) target.value = ""
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  selectedFiles.value = normalizeFiles(event.dataTransfer?.files ?? null)
}

const handleSave = async () => {
  const result = await fillStepRef.value?.handleSave()
  if (result) closeModal()
}
</script>

<style scoped lang="scss">
.add-artwork-modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-slow);
  @include flex(center, center);
}
.add-artwork-modal.active {
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
.add-artwork-modal-inner {
  position: relative;
  z-index: 1;
  width: 71rem;
  height: calc(100% - 7.5rem);
  max-height: 52.5rem;
  border: 1px solid var(--Opacity-10);
  border-radius: 2.5rem;
  background: var(--Black-200);
  backdrop-filter: blur(0.5rem);
  padding-top: 1.25rem;
  @include flex($g: 0.75rem, $fd: column);
}
.add-artwork-modal-header {
  padding: 0 1.25rem;
  @include flex($ai: center, $jc: space-between);
}
.save-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}
.upload-zone {
  height: 100%;
  border: 1px dashed var(--Opacity-20);
  border-radius: 0.625rem;
  padding: 2rem 1.5rem;
  margin: 0 1.25rem 1.25rem;
  transition: border-color var(--transition-slow),
    background var(--transition-slow);
}
.upload-zone.is-drag-over {
  border-color: var(--Text-Primary);
  background: rgba(255, 255, 255, 0.02);
}
.hidden-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
.upload-content {
  height: 100%;
  @include flex(center, center, 0.5rem, column);
}
.upload-icon {
  width: 4.25rem;
  height: 4.25rem;
  background: url("/images/icon/folder.svg") center / cover no-repeat;
  margin-bottom: 0.5rem;
}
.upload-rules {
  margin-top: 3.75rem;
  padding-left: 1.5rem;
  list-style: disc;
  @include flex($g: 0.625rem, $fd: column);
}
.upload-rules li::marker {
  color: var(--Text-Muted);
}
.upload-rules li {
  text-align: left;
}
</style>
