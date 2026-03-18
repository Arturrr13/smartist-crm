<template>
  <label
    class="wrap-input"
    :class="{
      error: error?.status ?? false,
      'has-value': modelValue || isFocused,
    }"
  >
    <span v-if="label" class="p2 gray">{{ label }}</span>

    <input
      v-model="modelValue"
      class="input p1"
      type="text"
      :name="label || placeholder"
      :placeholder="placeholder"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <span v-if="error" class="p2 error-message">{{ error.message }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  placeholder: string
  error?: {
    status: boolean
    message: string
  }
}

defineProps<Props>()

const modelValue = defineModel<string>({
  default: "",
})
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "blur" | "focus" | "input"): void
}>()

const isFocused = ref(false)

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement

  emits("update:modelValue", target.value)
  emits("input")
}

const handleBlur = () => {
  isFocused.value = false
  emits("blur")
}

const handleFocus = () => {
  isFocused.value = true
  emits("focus")
}
</script>

<style scoped lang="scss">
.wrap-input {
  position: relative;
  width: 100%;
  transition: margin-bottom var(--transition-slow);
  @include flex($g: 0.375rem, $fd: column);
}
.wrap-input.has-value {
  .input {
    background: var(--Black-400);
  }
}
.wrap-input.error {
  margin-bottom: 1.5rem;
  .input {
    border-color: var(--Error);
    color: var(--Error);
  }
  .error-message {
    opacity: 1;
  }
}
.input {
  color: var(--White-100);
  width: 100%;
  height: 2.75rem;
  padding: 0 1rem;
  border-radius: 1.375rem;
  border: 1px solid transparent;
  border-top: 1px solid var(--Opacity-10);
  background: var(--Black-300);
  transition: var(--transition-slow);
  transition-property: border, color, background;

  @include mobile {
    font-size: 16px;
  }
}
.error-message {
  position: absolute;
  bottom: -0.375rem;
  left: 0;
  color: var(--Error);
  transform: translateY(100%);
  opacity: 0;
  transition: var(--transition-slow);
  @include flex($ai: center, $g: 0.5rem);
}
.error-message::before {
  content: "";
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  background: url("/images/icon/info-error.svg") center / cover no-repeat;
}
</style>
