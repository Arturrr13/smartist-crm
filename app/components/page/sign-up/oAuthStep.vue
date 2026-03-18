<template>
  <div class="o-auth-step">
    <img
      class="sign-up-logo"
      src="/images/common/texture-logo.png"
      alt="Smartist logo"
    />

    <div class="sign-up-content">
      <h1 class="h1">Welcome to Smartist</h1>
      <p class="p1 primary subtitle">Begin by creating an account</p>

      <button
        class="p1-medium google-btn"
        type="button"
        @click="handleContinue"
      >
        Continue with Google
      </button>

      <p class="l1 gray terms">
        By signing up, you agree to our <br />
        <a
          href="/"
          target="_blank"
          aria-label="Privacy Policy"
          class="underline-reverse"
        >
          Privacy Policy
        </a>
        &nbsp;and&nbsp;
        <a
          href="/"
          target="_blank"
          aria-label="Terms of Use"
          class="underline-reverse"
        >
          Terms of Use
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProfileState } from "~~/shared"

const emit = defineEmits<{
  (e: "continue"): void
}>()

const profile = useState<ProfileState>("profile")

const handleContinue = () => {
  profile.value.email = "test@test.com"
  emit("continue")
}
</script>

<style scoped lang="scss">
.o-auth-step {
  position: absolute;
  width: 37.5rem;
  height: 49.5rem;
  padding: 5rem 2.5rem 3.25rem;
  border-radius: 2.5rem;
  visibility: hidden;
  pointer-events: none;
  transition: var(--transition-slow);
  transition-property: visibility;
  @include flex($ai: center, $fd: column);
}
.o-auth-step::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid var(--Opacity-10);
  border-top: 1px solid transparent;
  background: rgba(0, 0, 0, 0.8);
  opacity: 0;
  transition: var(--transition-slow);
  transition-property: opacity;
}
.o-auth-step.active {
  visibility: visible;
  pointer-events: auto;
}
.o-auth-step.active::before {
  opacity: 1;
}
.sign-up-logo {
  position: relative;
  z-index: 1;
  width: 23.25rem;
  height: 23.5rem;
  mix-blend-mode: exclusion;
  opacity: 0;
  transition: var(--transition-slow);
  transition-property: opacity;
}
.sign-up-content {
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: 2rem;
  opacity: 0;
  transition: var(--transition-slow);
  transition-property: opacity;
  @include flex($fd: column, $ai: center);
}
.o-auth-step.active .sign-up-logo,
.o-auth-step.active .sign-up-content {
  opacity: 1;
}
.subtitle {
  margin-top: 1rem;
}
.google-btn {
  margin: 3.5rem 0 1.5rem;
  border-radius: 3.125rem;
  background: var(--White-100);
  color: var(--Black-100);
  padding: 1rem 3rem;
  transition: transform var(--transition-slow);
  @include flex($ai: center, $g: 0.5rem);

  @include hover {
    &:hover {
      transform: translateY(-0.25rem);
    }
  }
}
.google-btn::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/google.svg") center / cover no-repeat;
}
.terms {
  text-align: center;
}
.underline-reverse {
  --link-color: var(--Text-Muted);
  display: inline;
}
</style>
