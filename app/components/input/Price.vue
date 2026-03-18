<template>
  <label
    class="wrap-input"
    :class="{
      error: error?.status ?? false,
      'has-value': hasValue || isFocused,
    }"
  >
    <span v-if="label" class="p2 gray">{{ label }}</span>

    <div class="price-row">
      <div class="price-col currency-col">
        <InputSelect
          v-model="modelValue.currency"
          class="currency-select"
          placeholder="Currency"
          :items="currencies"
          without-focus
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </div>

      <div class="price-col amount-col">
        <input
          class="field-input amount-input p1"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          :value="modelValue.amount"
          placeholder="e.g. 100"
          @input="handleAmountInput"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </div>
    </div>

    <span class="p2 error-message">{{ error.message }}</span>
  </label>
</template>

<script setup lang="ts">
interface PriceValue {
  currency: string
  amount: string
}

interface Props {
  label?: string
  error: {
    status: boolean
    message: string
  }
}

defineProps<Props>()

const modelValue = defineModel<PriceValue>({
  default: () => ({
    currency: "USD",
    amount: "",
  }),
})

const emits = defineEmits<{
  (e: "update:modelValue", value: PriceValue): void
  (e: "blur" | "focus"): void
}>()

const currencies = ["USD", "EUR"]
const isFocused = ref(false)

const hasValue = computed(() => {
  return Boolean(modelValue.value.currency || modelValue.value.amount)
})

const updateModel = (value: Partial<PriceValue>) => {
  const nextValue = {
    ...modelValue.value,
    ...value,
  }

  modelValue.value = nextValue
  emits("update:modelValue", nextValue)
}

const handleAmountInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const digitsOnly = target.value.replace(/\D/g, "")
  target.value = digitsOnly
  updateModel({ amount: digitsOnly })
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
  .field-input {
    background: var(--Black-400);
  }
}
.wrap-input.error {
  margin-bottom: 1.5rem;
  .amount-input {
    border-color: var(--Error);
  }
  .error-message {
    opacity: 1;
  }
}
.price-row {
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: 0.5rem;
}
.price-col {
  position: relative;
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
.currency-select {
  width: 100%;

  &::before {
    content: "";
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
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
