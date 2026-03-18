<template>
  <div class="gallery-step">
    <button class="default-btn back-btn" @click="emit('back')" />

    <h2 class="h2 title">Tell us about your gallery to get started</h2>

    <div class="inputs">
      <InputText
        v-model="form.galleryName.value"
        :label="form.galleryName.label"
        :placeholder="form.galleryName.placeholder"
        :error="form.galleryName.error"
        @blur="validateTextValue('galleryName')"
        @focus="form.galleryName.error.status = false"
      />
      <InputSelect
        v-model="form.location.value"
        :label="form.location.label"
        :placeholder="form.location.placeholder"
        :error="form.location.error"
        :items="form.location.items"
        @blur="validateSelectValue"
        @focus="form.location.error.status = false"
      />
      <InputText
        v-model="form.boothNumber.value"
        :label="form.boothNumber.label"
        :placeholder="form.boothNumber.placeholder"
        :error="form.boothNumber.error"
        @blur="validateTextValue('boothNumber')"
        @focus="form.boothNumber.error.status = false"
      />
    </div>

    <button class="btn-text-2 default-btn blue" @click="handleContinue">
      Continue
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ProfileState } from "~~/shared"

const emit = defineEmits<{
  (e: "back" | "continue"): void
}>()

const profile = useState<ProfileState>("profile")

const form = reactive({
  galleryName: {
    value: "",
    label: "Gallery name",
    placeholder: "e.g., Modern Art Collective",
    error: {
      status: false,
      message: "Invalid gallery name",
    },
  },
  location: {
    value: "",
    label: "Location",
    placeholder: "Select location",
    error: {
      status: false,
      message: "Invalid location",
    },
    items: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
  },
  boothNumber: {
    value: "",
    label: "Booth number",
    placeholder: "e.g., B27",
    error: {
      status: false,
      message: "Invalid booth number",
    },
  },
})

const validateTextValue = (key: "galleryName" | "boothNumber") => {
  form[key].error.status = !validateStringByLength(form[key].value, {
    min: 2,
  })
}

const validateSelectValue = () => {
  form.location.error.status = !form.location.value
}

const handleContinue = () => {
  validateTextValue("galleryName")
  validateTextValue("boothNumber")
  validateSelectValue()

  if (
    form.galleryName.error.status ||
    form.location.error.status ||
    form.boothNumber.error.status
  ) {
    return
  }

  profile.value.name = form.galleryName.value
  profile.value.location = form.location.value
  profile.value.boothNumber = form.boothNumber.value
  emit("continue")
}
</script>

<style scoped lang="scss">
.gallery-step {
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
.gallery-step.active {
  pointer-events: auto;
  opacity: 1;
}
.title {
  width: 21.875rem;
  text-align: center;
}
.inputs {
  width: 100%;
  margin: 2rem 0 2.5rem;
  @include flex($g: 1.25rem, $fd: column);
}
.default-btn.blue {
  margin-left: auto;
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
