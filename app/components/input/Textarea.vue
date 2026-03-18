<template>
  <label
    ref="textareaRef"
    class="wrap-input"
    :class="{ error: error.status, 'has-value': modelValue || isFocused }"
  >
    <span v-if="label" class="p2 gray">{{ label }}</span>

    <textarea
      v-model="modelValue"
      class="textarea p1"
      :placeholder="placeholder"
      name="message"
      maxlength="500"
      rows="1"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <span class="p2 error-message">{{ error.message }}</span>

    <button
      v-if="withDictate"
      type="button"
      class="dictate-btn"
      @click.prevent="handleDictate"
    />
  </label>
</template>

<script setup lang="ts">
type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onsoundstart: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}
type SpeechRecognitionResultEventLike = Event & {
  resultIndex: number
  results: SpeechRecognitionResultList
}
type SpeechRecognitionErrorEventLike = Event & {
  error: string
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

interface Props {
  label?: string
  placeholder: string
  error: {
    status: boolean
    message: string
  }
  withDictate?: boolean
}

defineProps<Props>()

const modelValue = defineModel<string>({
  default: "",
})
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "blur" | "focus"): void
}>()

const textareaRef = ref<HTMLLabelElement | null>(null)
let dictatePulseTween: ReturnType<typeof gsap.to> | null = null
const isFocused = ref(false)

const handleBlur = () => {
  isFocused.value = false
  emits("blur")
}

const handleFocus = () => {
  isFocused.value = true
  emits("focus")
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement

  emits("update:modelValue", target.value)
}

const handleDictate = () => {
  const SILENCE_TIMEOUT = 3000
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  const SpeechRecognition =
    speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition

  if (!SpeechRecognition) return

  let finalTranscript = modelValue.value
  const recognition = new SpeechRecognition()
  let silenceTimer: number | null = null

  const resetSilenceTimer = () => {
    if (silenceTimer) clearTimeout(silenceTimer)
    silenceTimer = window.setTimeout(() => {
      recognition.stop()
    }, SILENCE_TIMEOUT)
  }

  recognition.lang = "en-US"
  recognition.interimResults = true
  recognition.continuous = true
  recognition.onresult = (event) => {
    let interimTranscript = ""
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i]
      const transcript = result?.[0]?.transcript ?? ""

      if (result?.isFinal) {
        finalTranscript += transcript
      } else {
        interimTranscript += transcript
      }
    }

    modelValue.value = finalTranscript + interimTranscript + " "
    resetSilenceTimer()
  }
  recognition.onerror = (event) => console.error("Помилка:", event.error)
  recognition.onsoundstart = () => {
    const dictateBtn = textareaRef.value?.querySelector(".dictate-btn")

    if (!dictateBtn) return

    dictatePulseTween?.kill()
    dictatePulseTween = gsap.to(dictateBtn, {
      scale: 0.75,
      opacity: 0.5,
      duration: 1,
      ease: "ease-in-out",
      repeat: -1,
      yoyo: true,
    })
  }
  recognition.onend = () => {
    if (silenceTimer) clearTimeout(silenceTimer)

    const dictateBtn = textareaRef.value?.querySelector(".dictate-btn")

    if (!dictateBtn) return

    dictatePulseTween?.kill()
    dictatePulseTween = null
    gsap.to(dictateBtn, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "ease-in-out",
    })
  }

  try {
    recognition.start()
  } catch (err) {
    console.error(err)
  }
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
  .textarea {
    background: var(--Black-400);
  }
}
.wrap-input.error {
  margin-bottom: 1.5rem;
  .textarea {
    border-color: var(--Error);
    color: var(--Error);
  }
  .error-message {
    opacity: 1;
  }
}
.textarea {
  color: var(--White-100);
  width: 100%;
  height: 10.75rem;
  padding: 0.875rem 1rem;
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
.dictate-btn {
  position: absolute;
  bottom: 0.875rem;
  right: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/micro.svg") center / cover no-repeat;
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
