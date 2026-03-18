<template>
  <label
    class="wrap-input"
    :class="{
      error: error.status,
      'has-value': hasValue || isFocused,
    }"
  >
    <div class="dimensions">
      <div class="dimension-col with-separator">
        <span class="field-label p2 gray">Height</span>
        <input
          class="field-input p1"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          :value="modelValue.height"
          placeholder="0"
          @input="updateDimension('height', $event)"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </div>

      <div class="dimension-col with-separator">
        <span class="field-label p2 gray">Width</span>
        <input
          class="field-input p1"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          :value="modelValue.width"
          placeholder="0"
          @input="updateDimension('width', $event)"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </div>

      <div class="dimension-col">
        <span class="field-label p2 gray">Depth</span>
        <input
          class="field-input p1"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          :value="modelValue.depth"
          placeholder="0"
          @input="updateDimension('depth', $event)"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </div>

      <div class="dimension-col unit-col">
        <span class="field-label p2 gray">Unit</span>
        <InputSelect
          v-model="modelValue.unit"
          class="unit-select"
          placeholder="Unit"
          :items="units"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </div>
    </div>

    <span class="p2 error-message">{{ error.message }}</span>
  </label>
</template>

<script setup lang="ts">
interface DimensionsValue {
  height: string
  width: string
  depth: string
  unit: string
}

interface Props {
  error: {
    status: boolean
    message: string
  }
}

defineProps<Props>()

const modelValue = defineModel<DimensionsValue>({
  default: () => ({
    height: "",
    width: "",
    depth: "",
    unit: "in",
  }),
})

const emits = defineEmits<{
  (e: "update:modelValue", value: DimensionsValue): void
  (e: "blur" | "focus"): void
}>()

const units = ["in", "cm"]
const isFocused = ref(false)

const hasValue = computed(() => {
  return Boolean(
    modelValue.value.height ||
      modelValue.value.width ||
      modelValue.value.depth ||
      modelValue.value.unit
  )
})

const updateModel = (value: Partial<DimensionsValue>) => {
  const nextValue = {
    ...modelValue.value,
    ...value,
  }

  modelValue.value = nextValue
  emits("update:modelValue", nextValue)
}

const updateDimension = (key: "height" | "width" | "depth", event: Event) => {
  const target = event.target as HTMLInputElement
  const digitsOnly = target.value.replace(/\D/g, "")
  target.value = digitsOnly
  updateModel({ [key]: digitsOnly })
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
}
.wrap-input.has-value {
  .field-input {
    background: var(--Black-400);
  }
}
.wrap-input.error {
  margin-bottom: 1.5rem;
  .dimension-col:not(.unit-col) .field-input {
    border-color: var(--Error);
  }
  .error-message {
    opacity: 1;
  }
}
.dimensions {
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 5.5rem;
  gap: 1rem;
}
.dimension-col {
  position: relative;
  @include flex($fd: column, $g: 0.5rem);
}
.field-label {
  line-height: 1;
}
.dimension-col.with-separator::after {
  content: "";
  position: absolute;
  right: -0.75rem;
  bottom: 1.25rem;
  width: 0.5rem;
  height: 0.5rem;
  background: url("/images/icon/x.svg") center / cover no-repeat;
  pointer-events: none;
}
.field-input {
  width: 100%;
  height: 2.75rem;
  padding: 0 1rem;
  border-radius: 1.375rem;
  border: 1px solid var(--Opacity-10);
  font: inherit;
  line-height: inherit;
  color: var(--White-100);
  background: var(--Black-300);
  outline: none;
  transition: var(--transition-slow);
  transition-property: border, color, background;
  @include mobile {
    font-size: 16px;
  }
}
.unit-col {
  cursor: pointer;
}
.unit-select {
  width: 100%;
  &::before {
    content: "";
    position: absolute;
    right: 0.5rem;
    bottom: 0.625rem;
    width: 1.5rem;
    height: 1.5rem;
    background: url("/images/icon/select.svg") center / cover no-repeat;
    pointer-events: none;
    z-index: 1;
  }

  &:deep(.wrap-input) {
    margin-bottom: 0;
  }

  &:deep(.input) {
    padding-right: 2.5rem;
    border-color: var(--Opacity-10) !important;
    color: var(--White-100) !important;
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
