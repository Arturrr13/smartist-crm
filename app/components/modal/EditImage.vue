<template>
  <div
    class="edit-image-modal"
    :class="{
      active: image && !isClosing,
      'is-circle-mode': isCircleMode,
    }"
  >
    <div class="overlay" @click="handleClose" />

    <div class="edit-image-modal-inner">
      <div class="edit-image-header">
        <button
          class="p3 default-btn h-44 close-btn"
          type="button"
          @click="handleClose"
        >
          Close
        </button>
        <h2 class="h3">Edit artwork</h2>
        <button
          class="p3 default-btn blue h-44 save-btn"
          type="button"
          @click="handleSave"
        >
          Save
        </button>
      </div>

      <div class="edit-image-content">
        <div class="image-stage">
          <ClientOnly>
            <VueCropper
              v-if="imgCopy"
              ref="cropperRef"
              :src="imgCopy"
              alt="Source Image"
              :guides="false"
              :center="true"
              :highlight="true"
              :background="true"
              :crop-box-movable="false"
              :movable="true"
              :drag-mode="'move'"
              :class="[
                'cropper-instance',
                { 'is-remove-bg-mode': isRemoveBgMode },
              ]"
            />
          </ClientOnly>
          <div v-if="isRemovingBackground" class="loader-overlay">
            <div class="loader-spinner" />
          </div>
        </div>

        <div class="circle-size-control">
          <input
            v-model.number="circleCropSize"
            class="circle-size-slider"
            type="range"
            min="20"
            max="100"
            step="1"
          />
        </div>

        <InputSwitcher v-model="isCircleMode" class="image-mode-switcher" />
      </div>

      <div class="edit-image-actions">
        <InputSwitcher v-model="isRemoveBgMode" class="p3 action-switcher" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueCropper from "vue-cropperjs"
import "cropperjs/dist/cropper.css"
import { removeBackground as imglyRemoveBackground } from "@imgly/background-removal"

const { image } = defineProps<{
  image: string | null
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "save", value: string): void
}>()

const isClosing = ref(false)
const isRemovingBackground = ref(false)
const isCircleMode = ref(false)
const isRemoveBgMode = ref(false)
const circleCropSize = ref(50)
const cropperRef = ref<InstanceType<typeof VueCropper> | null>(null)
const imgCopy = ref<string>(image ?? "")

const handleClose = () => {
  isClosing.value = true

  setTimeout(() => {
    isClosing.value = false
    isCircleMode.value = false
    isRemoveBgMode.value = false
    emit("close")
  }, 1000)
}

const handleSave = () => {
  if (!isRemoveBgMode.value) cropImage()

  nextTick(() => {
    emit("save", imgCopy.value)
    handleClose()
  })
}

const getRoundedCanvas = (canvas: HTMLCanvasElement) => {
  const width = canvas.width
  const height = canvas.height
  const radius = Math.min(width, height) / 2
  const centerX = width / 2
  const centerY = height / 2

  const roundedCanvas = document.createElement("canvas")
  roundedCanvas.width = width
  roundedCanvas.height = height

  const roundedCtx = roundedCanvas.getContext("2d")
  if (!roundedCtx) return null

  roundedCtx.clearRect(0, 0, width, height)
  roundedCtx.save()
  roundedCtx.beginPath()
  roundedCtx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  roundedCtx.closePath()
  roundedCtx.clip()
  roundedCtx.drawImage(canvas, 0, 0, width, height)
  roundedCtx.restore()

  return roundedCanvas
}

const handleRemoveBackground = async () => {
  isRemovingBackground.value = true

  imglyRemoveBackground(imgCopy.value ?? "")
    .then((blob: Blob) => {
      const url = URL.createObjectURL(blob)
      imgCopy.value = url
      cropperRef.value?.replace(url)
    })
    .finally(() => {
      isRemovingBackground.value = false
    })
}

const cropImage = () => {
  const cropper = cropperRef.value
  if (!cropper) return

  let croppedCanvas = cropper.getCroppedCanvas()
  if (isCircleMode.value) {
    croppedCanvas = getRoundedCanvas(croppedCanvas)
  }
  if (!croppedCanvas) return

  const image = croppedCanvas.toDataURL("image/png")
  imgCopy.value = image
  cropper.replace(image)
}

const setCircleCropBoxSize = (sizePercent: number) => {
  const cropper = cropperRef.value
  if (!cropper) return

  const containerData = cropper.getContainerData()
  const clampedSize = Math.min(100, Math.max(20, sizePercent))
  const width = containerData.width * (clampedSize / 100)
  const height = containerData.height * (clampedSize / 100)

  cropper.setCropBoxData({
    width,
    height,
    left: (containerData.width - width) / 2,
    top: (containerData.height - height) / 2,
  })
}

watch(
  () => image,
  (newImage) => {
    imgCopy.value = newImage ?? ""
  }
)

watch(isCircleMode, (newIsCircleMode) => {
  if (newIsCircleMode) {
    nextTick(() => {
      setCircleCropBoxSize(circleCropSize.value)
    })
  }
})

watch(circleCropSize, (newSize) => {
  if (!isCircleMode.value) return

  setCircleCropBoxSize(newSize)
})

watch(isRemoveBgMode, (newIsRemoveBgMode) => {
  if (newIsRemoveBgMode) {
    handleRemoveBackground()
  } else {
    imgCopy.value = image ?? ""
    cropperRef.value?.replace(image ?? "")
  }
})
</script>

<style scoped lang="scss">
.edit-image-modal {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-modal) + 1);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-slow);
  @include flex(center, center);
}
.edit-image-modal.active {
  pointer-events: all;
  opacity: 1;

  .overlay {
    opacity: 0.9;
  }
}
.edit-image-modal.is-circle-mode {
  .image-stage:deep(.cropper-view-box) {
    border-radius: 50%;
    outline-color: transparent;
  }
  .image-stage:deep(.cropper-point.point-ne),
  .image-stage:deep(.cropper-point.point-nw),
  .image-stage:deep(.cropper-point.point-se),
  .image-stage:deep(.cropper-point.point-sw),
  .image-stage:deep(.cropper-point.point-n),
  .image-stage:deep(.cropper-point.point-s),
  .image-stage:deep(.cropper-point.point-e),
  .image-stage:deep(.cropper-point.point-w) {
    opacity: 0;
    pointer-events: none;
  }
  .circle-size-control {
    opacity: 1;
    height: auto;
  }
  .edit-image-content {
    gap: 2rem;
  }
}
.overlay {
  position: absolute;
  inset: 0;
  background: var(--Black-100);
  opacity: 0;
  transition: opacity var(--transition-slow);
}
.edit-image-modal-inner {
  position: relative;
  z-index: 1;
  width: 37.5rem;
  border: 1px solid var(--Opacity-10);
  border-radius: 2.5rem;
  background: var(--Black-200);
  backdrop-filter: blur(0.5rem);
  padding: 1.25rem;
  @include flex($g: 2rem, $fd: column);
}
.edit-image-header {
  @include flex($ai: center, $jc: space-between);
}
.edit-image-content {
  position: relative;
  transition: gap var(--transition-slow);
  @include flex($ai: center, $jc: center, $g: 0, $fd: column);
}
.circle-size-control {
  width: 26rem;
  opacity: 0;
  height: 0;
  transition: opacity var(--transition-slow), height var(--transition-slow);
}
.circle-size-slider {
  width: 100%;
  height: 1.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  -webkit-appearance: none !important;
  appearance: none !important;
}
.circle-size-slider::-webkit-slider-runnable-track {
  height: 0.25rem;
  background: #3f3f49;
}
.circle-size-slider::-moz-range-track {
  height: 0.25rem;
  background: #3f3f49;
}
.circle-size-slider::-moz-range-progress {
  height: 0.25rem;
  background: #3f3f49;
}
.circle-size-slider::-webkit-slider-thumb {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: -0.5rem;
  border-radius: 50%;
  background: var(--White-100) !important;
  -webkit-appearance: none;
  appearance: none;
}
.circle-size-slider::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
}
.circle-size-slider::-ms-track {
  height: 0.25rem;
}
.image-stage {
  position: relative;
  width: 26rem;
  aspect-ratio: 1/1;
  border-radius: 0.625rem;
  background: linear-gradient(180deg, #5a4d3f 0%, #2f2a25 100%);
  overflow: hidden;
  @include flex(center, center);
}
.loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: rgb(10 10 18 / 55%);
  backdrop-filter: blur(2px);
  @include flex(center, center);
}
.loader-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 0.1875rem solid rgb(255 255 255 / 25%);
  border-top-color: var(--White-100);
  animation: spin 0.8s linear infinite;
}
.cropper-instance {
  width: 100%;
  height: 100%;
}
.cropper-instance.is-remove-bg-mode:deep(.cropper-crop-box),
.cropper-instance.is-remove-bg-mode:deep(.cropper-view-box),
.cropper-instance.is-remove-bg-mode:deep(.cropper-point),
.cropper-instance.is-remove-bg-mode:deep(.cropper-modal) {
  opacity: 0;
}
.image-stage:deep(.cropper-container) {
  width: 100% !important;
  height: 100% !important;
}
.image-stage:deep(.cropper-view-box) {
  outline: 3px solid var(--White-100);
  outline-color: var(--White-100);
}
.image-stage:deep(.cropper-face) {
  opacity: 0 !important;
  background: transparent !important;
}
.image-stage:deep(.cropper-crop-box) {
  border: 0;
}
.image-stage:deep(.cropper-dashed),
.image-stage:deep(.cropper-center),
.image-stage:deep(.cropper-line) {
  display: none;
}
.image-stage:deep(.cropper-point) {
  z-index: 2;
  width: 1.25rem;
  height: 1.25rem;
  opacity: 1;
  border-radius: 1.25rem;
  background: var(--White-100);
}
.image-stage:deep(.cropper-point.point-n),
.image-stage:deep(.cropper-point.point-s) {
  width: 1.625rem;
  height: 0.5rem;
  margin-left: -0.8125rem;
}
.image-stage:deep(.cropper-point.point-n) {
  top: -0.375rem;
}
.image-stage:deep(.cropper-point.point-s) {
  bottom: -0.375rem;
}
.image-stage:deep(.cropper-point.point-e),
.image-stage:deep(.cropper-point.point-w) {
  width: 0.5rem;
  height: 1.625rem;
  margin-top: -0.8125rem;
}
.image-stage:deep(.cropper-point.point-e) {
  right: -0.375rem;
}
.image-stage:deep(.cropper-point.point-w) {
  left: -0.375rem;
}
.image-stage:deep(.cropper-point.point-ne),
.image-stage:deep(.cropper-point.point-nw),
.image-stage:deep(.cropper-point.point-se),
.image-stage:deep(.cropper-point.point-sw) {
  width: 1.25rem;
  height: 1.25rem;
}
.image-stage:deep(.cropper-point.point-ne) {
  top: -0.625rem;
  right: -0.625rem;
}
.image-stage:deep(.cropper-point.point-nw) {
  top: -0.625rem;
  left: -0.625rem;
}
.image-stage:deep(.cropper-point.point-se) {
  bottom: -0.625rem;
  right: -0.625rem;
}
.image-stage:deep(.cropper-point.point-sw) {
  bottom: -0.625rem;
  left: -0.625rem;
}
.image-mode-switcher {
  position: absolute;
  top: 50%;
  right: -1.5rem;
  z-index: 1;
  transform: translateY(-50%) rotate(90deg);
}
.image-mode-switcher:deep(.switcher-inner::before) {
  background-image: url("/images/icon/wall.svg");
}
.image-mode-switcher:deep(.switcher-inner::after) {
  background-image: url("/images/icon/circle.svg");
}
.edit-image-actions {
  @include flex($ai: center, $jc: center, $g: 0.75rem);
}
.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.action-switcher {
  width: 20.5rem;
  height: 3.25rem;
}
.action-switcher::before {
  border-radius: 3.625rem;
  aspect-ratio: unset;
  height: calc(100% - 0.5rem);
}
.action-switcher:deep(.switcher-inner::before),
.action-switcher:deep(.switcher-inner::after) {
  width: 50%;
  background-size: 1.5rem;
  @include flex($ai: center, $jc: center);
}
.action-switcher:deep(.switcher-inner::before) {
  content: "CROP";
  background-image: url("/images/icon/crop.svg");
  background-position: 2.5rem center;
  padding-left: 1rem;
}
.action-switcher:deep(.switcher-inner::after) {
  content: "REMOVE BG";
  background-image: url("/images/icon/remove-bg.svg");
  background-position: 1.5rem center;
  padding-left: 1.25rem;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
