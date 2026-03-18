<template>
  <label class="wrap-input" :class="{ active: modelValue, disabled }">
    <input
      v-model="modelValue"
      class="input"
      type="checkbox"
      name="checkbox"
      :checked="modelValue"
      :value="name"
      :disabled="disabled"
    />
    <span class="p2 checkbox-inner">{{ name }}</span>
  </label>
</template>

<script setup lang="ts">
const { name, disabled } = defineProps<{
  name: string
  checked?: boolean
  disabled?: boolean
}>()

const modelValue = defineModel<boolean>({ default: false })
</script>

<style scoped lang="scss">
.wrap-input {
  position: relative;
  transition: opacity var(--transition-slow);

  @include hover {
    &:hover {
      .checkbox-inner {
        background: var(--Opacity-10);
      }
    }
  }
}
.wrap-input.disabled {
  opacity: 0.45;
}
.wrap-input.active {
  .checkbox-inner {
    background: var(--Black-300);
  }
  .checkbox-inner::before {
    transform: rotate(-45deg);
  }

  @include hover {
    &:hover {
      .checkbox-inner {
        background: var(--Black-200);
      }
    }
  }
}
.input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.input:disabled {
  cursor: not-allowed;
}
.checkbox-inner {
  display: block;
  color: var(--White-100);
  width: fit-content;
  height: 2.5rem;
  padding: 0 1.5rem 0 1rem;
  border-radius: 1.375rem;
  border: 1px solid var(--Black-300);
  background: transparent;
  transition: background var(--transition-slow);
  @include flex($ai: center, $g: 0.5rem);
}
.checkbox-inner::before {
  content: "";
  display: block;
  width: 1rem;
  height: 1rem;
  background: url("/images/icon/plus.svg") center / cover no-repeat;
  transition: transform var(--transition-slow);
}
</style>
