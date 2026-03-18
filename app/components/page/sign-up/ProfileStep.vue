<template>
  <div class="gallery-step">
    <button class="default-btn back-btn" @click="emit('back')" />

    <h2 class="h2 title">Define your gallery’s public profile</h2>

    <div class="inputs">
      <div class="logo-wrap">
        <p class="p2 gray">Add Logo</p>
        <div class="logo-upload-row">
          <div
            class="logo-preview"
            :class="{ filled: Boolean(form.logo.value) }"
            :style="logoPreviewStyle"
          >
            <div v-if="!form.logo.value" class="logo-placeholder" />
          </div>

          <div class="logo-actions">
            <button
              class="p1-medium default-btn upload-btn h-44"
              type="button"
              @click="openLogoPicker"
            >
              Upload photo
            </button>
            <p class="p1 gray logo-hint">Max file size: 5 MB</p>
          </div>

          <input
            ref="logoInputRef"
            class="logo-input"
            type="file"
            accept="image/*"
            @change="handleLogoChange"
          />
        </div>
      </div>
      <InputText
        v-model="form.website.value"
        :label="form.website.label"
        :placeholder="form.website.placeholder"
        :error="form.website.error"
        @blur="form.website.error.status = !validateLink(form.website.value)"
        @focus="form.website.error.status = false"
      />
      <InputText
        v-model="form.instagram.value"
        :label="form.instagram.label"
        :placeholder="form.instagram.placeholder"
        :error="form.instagram.error"
        @blur="
          form.instagram.error.status = !validateInstagram(form.instagram.value)
        "
        @focus="form.instagram.error.status = false"
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

const MAX_LOGO_SIZE = 5 * 1024 * 1024

const logoInputRef = ref<HTMLInputElement | null>(null)

const logoPreviewStyle = computed(() =>
  form.logo.value ? { backgroundImage: `url("${form.logo.value}")` } : undefined
)

const form = reactive({
  logo: {
    value: "",
    error: {
      status: true,
    },
  },
  website: {
    value: "",
    label: "Web Site",
    placeholder: "Enter gallery website URL",
    error: {
      status: false,
      message: "Invalid website URL",
    },
  },
  instagram: {
    value: "",
    label: "Instagram",
    placeholder: "@username",
    error: {
      status: false,
      message: "Invalid Instagram username",
    },
  },
})

const openLogoPicker = () => {
  logoInputRef.value?.click()
}

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file.")
    target.value = ""
    form.logo.error.status = true
    return
  }
  if (file.size > MAX_LOGO_SIZE) {
    alert("Max file size is 5 MB.")
    target.value = ""
    form.logo.error.status = true
    return
  }

  if (form.logo.value) {
    URL.revokeObjectURL(form.logo.value)
  }

  form.logo.value = URL.createObjectURL(file)
  form.logo.error.status = false
}

onBeforeUnmount(() => {
  if (form.logo.value) {
    URL.revokeObjectURL(form.logo.value)
    form.logo.error.status = true
  }
})

const handleContinue = () => {
  form.website.error.status = !validateLink(form.website.value)
  form.instagram.error.status = !validateInstagram(form.instagram.value)

  if (
    form.website.error.status ||
    form.instagram.error.status ||
    form.logo.error.status
  ) {
    return
  }

  profile.value.logo = form.logo.value
  profile.value.website = form.website.value
  profile.value.instagram = form.instagram.value

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
.logo-wrap {
  @include flex($g: 1rem, $fd: column);
}
.logo-upload-row {
  @include flex($ai: center, $g: 1.25rem);
}
.logo-preview {
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--Black-300);
  background-position: center;
  background-size: cover;
  @include flex($ai: center, $jc: center);
}
.logo-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
}
.logo-placeholder::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background: url("/images/icon/user.svg") center / cover no-repeat;
}
.logo-actions {
  @include flex($fd: column, $g: 0.5rem);
}
.upload-btn {
  padding: 0.9rem 2rem;
}
.logo-hint {
  color: var(--Text-Muted);
}
.logo-input {
  display: none;
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
