<template>
  <div
    class="add-checkbox p2"
    :class="{ error: !!errorMessage, editing: isEditing }"
  >
    <button
      class="add-chip"
      type="button"
      :tabindex="isEditing ? -1 : 0"
      @click="startEditing"
    >
      Add tag
    </button>
    <div class="add-chip-input-wrap">
      <input
        ref="inputRef"
        v-model="value"
        class="add-chip-input p2"
        type="text"
        placeholder="Enter tag"
        :disabled="!isEditing"
        @keydown.enter.prevent="submit"
        @keydown.esc.prevent="cancelEditing"
        @blur="handleBlur"
      />
    </div>
    <span class="error-message">{{ errorMessage }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  existingNames: string[]
}>()

const emit = defineEmits<{
  add: [name: string]
}>()

const isEditing = ref(false)
const value = ref("")
const errorMessage = ref("")
const inputRef = ref<HTMLInputElement | null>(null)

const submit = () => {
  const normalizedName = value.value.trim().replace(/\s+/g, " ")

  if (!normalizedName) {
    errorMessage.value = "Enter name"
    return
  }

  const exists = props.existingNames.some(
    (name) => name.toLowerCase() === normalizedName.toLowerCase()
  )

  if (exists) {
    errorMessage.value = "Already exists"
    return
  }

  emit("add", normalizedName)
  isEditing.value = false
  value.value = ""
  errorMessage.value = ""
}

const startEditing = async () => {
  isEditing.value = true
  errorMessage.value = ""
  await nextTick()
  inputRef.value?.focus()
}

const cancelEditing = () => {
  isEditing.value = false
  value.value = ""
  errorMessage.value = ""
}

const handleBlur = () => {
  if (!value.value.trim()) {
    cancelEditing()
    return
  }

  submit()
}

watch(value, (nextValue) => {
  if (nextValue && errorMessage.value) {
    errorMessage.value = ""
  }
})
</script>

<style scoped lang="scss">
.add-checkbox {
  position: relative;
  width: 7.375rem;
  height: 2.5rem;
  transition: margin-bottom var(--transition-slow);
}
.add-checkbox.error {
  margin-bottom: 1.5rem;
  .add-chip-input {
    border-color: var(--Error);
    color: var(--Error);
  }
  .error-message {
    opacity: 1;
  }
}
.add-chip {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 2.5rem;
  padding: 0 1.25rem 0 1rem;
  border-radius: 1.375rem;
  border: 1px solid var(--Black-300);
  background: transparent;
  color: var(--White-100);
  transition: var(--transition-slow);
  transition-property: opacity, background;
  @include flex($ai: center, $g: 0.5rem);

  @include hover {
    &:hover {
      background: var(--Opacity-10);
    }
  }
}
.add-chip::before {
  content: "";
  display: block;
  width: 1rem;
  height: 1rem;
  background: url("/images/icon/plus.svg") center / cover no-repeat;
}
.add-chip-input-wrap {
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-slow);
}
.add-chip-input {
  width: 100%;
  height: 2.5rem;
  border-radius: 1.375rem;
  border: 1px solid var(--Black-300);
  background: transparent;
  color: var(--White-100);
  padding: 0 1rem;
  transition: var(--transition-slow);
  transition-property: border, color;

  @include mobile {
    font-size: 16px;
  }
}
.add-checkbox.editing {
  .add-chip {
    opacity: 0;
    pointer-events: none;
  }
  .add-chip-input-wrap {
    opacity: 1;
    pointer-events: auto;
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
