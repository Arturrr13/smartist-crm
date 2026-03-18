<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import type { Artwork, ModalState } from "~~/shared"

const fakeData: Artwork[] = [
  {
    id: "1",
    title: "Artwork 1",
    description: "Description 1",
    image: "/images/artworks/0.webp",
    size: {
      height: "100",
      width: "100",
      depth: "100",
      unit: "cm",
    },
    rarity: "rare",
    status: "available",
    materials: "paper",
    medium: "painting",
    subject: "landscape",
    styles: ["abstract", "colorful"],
    tags: ["art", "painting"],
    price: {
      currency: "USD",
      amount: 100,
    },
  },
  {
    id: "2",
    title: "Artwork 2",
    description: "Description 1",
    image: "/images/artworks/1.webp",
    size: {
      height: "100",
      width: "100",
      depth: "100",
      unit: "cm",
    },
    rarity: "rare",
    status: "available",
    materials: "paper",
    medium: "painting",
    subject: "landscape",
    styles: ["abstract", "colorful"],
    tags: ["art", "painting"],
    price: {
      currency: "USD",
      amount: 100,
    },
  },
]

useState("artworks", () => [])
useState<ModalState>("modal", () => ({
  addArtwork: false,
  deleteArtwork: false,
}))
</script>
