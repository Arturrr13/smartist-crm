<template>
  <div class="introduce-step">
    <button class="default-btn back-btn" @click="emit('back')" />

    <h2 class="h2 title">Introduce your gallery to visitors</h2>

    <InputTextarea
      v-model="form.message.value"
      :placeholder="form.message.placeholder"
      :error="form.message.error"
      with-dictate
      @blur="validateMessageValue"
      @focus="form.message.error.status = false"
    />

    <button class="btn-text-2 default-btn blue" @click="handleContinue">
      Done
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ProfileState } from "~~/shared"

const emit = defineEmits<{
  (e: "back" | "continue"): void
}>()

const profile = useState<ProfileState>("profile")
const profileCookie = useCookie<ProfileState | null>("profile")

const form = reactive({
  message: {
    value: "",
    placeholder:
      "e.g., Describe your gallery’s story, style, and artistic direction.",
    error: {
      status: false,
      message: "Invalid message",
    },
  },
})

const validateMessageValue = () => {
  form.message.error.status = !validateStringByLength(form.message.value, {
    min: 10,
  })
}

const handleContinue = () => {
  validateMessageValue()

  if (form.message.error.status) return

  profile.value.about = form.message.value

  profileCookie.value = profile.value

  navigateTo("/")
}
</script>

<style scoped lang="scss">
.introduce-step {
  position: absolute;
  width: 37.5rem;
  border-radius: 2.5rem;
  border: 1px solid var(--Opacity-10);
  background: var(--Black-200);
  backdrop-filter: blur(1rem);
  padding: 5rem 2.5rem 3.25rem;
  pointer-events: none;
  opacity: 0;
  transition: var(--transition-slow);
  transition-property: opacity;
  @include flex($ai: center, $fd: column);
}
.introduce-step.active {
  pointer-events: auto;
  opacity: 1;
}
.title {
  width: 21.875rem;
  text-align: center;
  margin-bottom: 2rem;
}
.default-btn.blue {
  margin: 2.5rem 0 0 auto;
  width: 7.5rem;
}
.back-btn {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  padding: 0;
}
.back-btn::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/back.svg") center / cover no-repeat;
  transform: translateX(-2px);
}
</style>
