import type { ProfileState } from "~~/shared"

export default defineNuxtRouteMiddleware(() => {
  const profileCookie = useCookie<ProfileState | null>("profile")

  if (!profileCookie.value) {
    return navigateTo("/sign-up")
  }
})
