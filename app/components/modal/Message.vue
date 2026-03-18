<template>
  <div
    class="message-modal"
    :class="{
      active: modal.message && !isClosing,
      success: modal.message === 'success',
      error: modal.message === 'error',
    }"
    role="status"
    aria-live="polite"
  >
    <span class="p1">{{ messageText }}</span>
    <button class="close-btn" type="button" @click="hideMessage" />
  </div>
</template>

<script setup lang="ts">
import type { ModalState } from "~~/shared"

let timer: ReturnType<typeof setTimeout> | null = null

const modal = useState<ModalState>("modal")

const isClosing = ref(false)
const messageText = computed(() => {
  if (modal.value.message === "success") {
    return "Your artworks successfully has been added."
  }

  if (modal.value.message === "error") {
    return "Please fill in all required fields."
  }

  return ""
})

const hideMessage = () => {
  isClosing.value = true
  setTimeout(() => {
    modal.value.message = false
    isClosing.value = false
  }, 600)
}

watch(
  () => modal.value.message,
  (type) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (type !== "success" && type !== "error") return

    timer = setTimeout(() => {
      hideMessage()
    }, 5000)
  }
)

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style scoped lang="scss">
.message-modal {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: var(--z-modal);
  isolation: isolate;
  width: 26.875rem;
  border-radius: 1rem;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.9) -0.55%,
    rgba(24, 24, 28, 0.9) 100%
  );
  backdrop-filter: blur(1.5rem);
  padding: 1.25rem 1rem;
  opacity: 0;
  transform: translateX(100%);
  pointer-events: none;
  transition: var(--transition-slow);
  transition-property: opacity, transform;
  @include flex($ai: center, $g: 0.75rem);
}
.message-modal.active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: all;
}
.message-modal.error::before {
  background-image: url("/images/icon/error.svg");
}
.message-modal.success {
  --message-border-gradient: linear-gradient(
    90deg,
    rgba(76, 217, 100, 0) 0%,
    rgba(76, 217, 100, 0.48) 50%,
    rgba(76, 217, 100, 0) 100%
  );
}
.message-modal.error {
  --message-border-gradient: linear-gradient(
    90deg,
    rgba(217, 79, 116, 0) 0%,
    rgba(217, 79, 116, 0.58) 50%,
    rgba(217, 79, 116, 0) 100%
  );
}
.message-modal::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  background-image: url("/images/icon/success.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.message-modal::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: var(--message-border-gradient, transparent);
  pointer-events: none;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
.message-text {
  flex: 1;
}
.close-btn {
  width: 1.5rem;
  height: 1.5rem;
  margin-left: auto;
  transition: opacity var(--transition-slow);
  @include flex(center, center);

  @include hover {
    &:hover {
      opacity: 0.5;
    }
  }
}
.close-btn::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background: url("/images/icon/close.svg") center / cover no-repeat;
}
</style>
