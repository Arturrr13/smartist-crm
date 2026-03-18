<template>
  <label
    class="p1 wrap-input"
    :class="{
      error: error?.status ?? false,
      'has-value': (modelValue || isFocused) && !withoutFocus,
    }"
    @mouseenter="activeList = true"
    @mouseleave="activeList = false"
  >
    <span v-if="label" class="p2 gray">{{ label }}</span>

    <input
      v-model="modelValue"
      class="input p1"
      type="text"
      :name="label || placeholder"
      :placeholder="placeholder"
      readonly
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <div class="dropdown-wrap" :class="{ active: activeList }">
      <div class="dropdown">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="dropdown-item p1"
          @click="handleSelect(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <span v-if="error" class="p2 error-message">{{ error.message }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  placeholder: string
  items: string[]
  error?: {
    status: boolean
    message: string
  }
  withoutFocus?: boolean
}

defineProps<Props>()

const modelValue = defineModel<string>({
  default: "",
})
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "blur" | "focus"): void
}>()

const isFocused = ref(false)
const activeList = ref(false)

const handleBlur = () => {
  isFocused.value = false
  emits("blur")
}

const handleFocus = () => {
  isFocused.value = true
  emits("focus")
}

const handleSelect = (item: string) => {
  modelValue.value = item
  activeList.value = false
  emits("blur")
}
</script>

<style scoped lang="scss">
.wrap-input {
  cursor: pointer;
  position: relative;
  width: 100%;
  height: fit-content;
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
  pointer-events: none;
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
.dropdown-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  padding-top: 0.5rem;
  transform: translateY(100%);
  clip-path: polygon(0 0, 100% 0, 100% 0%, 0 0%);
  transition: clip-path var(--transition-slow);
}
.dropdown-wrap.active {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
.dropdown {
  width: 100%;
  max-height: 7.5rem;
  background: var(--Black-400);
  border-radius: 0.375rem;
  color: var(--White-100);
  overflow-y: auto;
  border-top: 1px solid var(--Opacity-10);
  @include flex($fd: column);
}
.dropdown-item {
  width: 100%;
  height: 2.5rem;
  padding: 0 1rem;
  flex-shrink: 0;
  transition: background var(--transition-slow);
  @include flex(center);

  @include hover {
    &:hover {
      background: var(--Opacity-10);
    }
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
  pointer-events: none;
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
