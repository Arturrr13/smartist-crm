<template>
  <div class="fill-step">
    <div v-if="artworkForms.length > 0" class="left-col">
      <div class="preview-wrap">
        <div class="preview-image">
          <img
            :src="getArtwork(activeIndex).previewUrl"
            alt="Artwork preview"
          />
        </div>
        <button
          class="default-btn h-44 edit-btn"
          type="button"
          @click="activeEditImage = getArtwork(activeIndex).previewUrl"
        >
          Edit
        </button>
      </div>

      <InputText
        v-model="getArtwork(activeIndex).title.value"
        :label="getArtwork(activeIndex).title.label"
        :placeholder="getArtwork(activeIndex).title.placeholder"
        :error="getArtwork(activeIndex).title.error"
        @blur="validateTextValue('title')"
        @focus="getArtwork(activeIndex).title.error.status = false"
      />
      <InputTextarea
        v-model="getArtwork(activeIndex).description.value"
        :label="getArtwork(activeIndex).description.label"
        :placeholder="getArtwork(activeIndex).description.placeholder"
        :error="getArtwork(activeIndex).description.error"
        @blur="validateTextValue('description')"
        @focus="getArtwork(activeIndex).description.error.status = false"
      />
      <InputDimensions
        v-model="getArtwork(activeIndex).dimensions.value"
        :error="getArtwork(activeIndex).dimensions.error"
        @blur="validateDimensionsValue"
        @focus="getArtwork(activeIndex).dimensions.error.status = false"
      />
      <InputPrice
        v-model="getArtwork(activeIndex).price.value"
        :label="getArtwork(activeIndex).price.label"
        :error="getArtwork(activeIndex).price.error"
        @blur="validatePriceValue(getArtwork(activeIndex).price.value.amount)"
        @focus="getArtwork(activeIndex).price.error.status = false"
      />
      <InputSelect
        v-model="getArtwork(activeIndex).rarity.value"
        class="select-with-icon"
        :label="getArtwork(activeIndex).rarity.label"
        :placeholder="getArtwork(activeIndex).rarity.placeholder"
        :error="getArtwork(activeIndex).rarity.error"
        :items="getArtwork(activeIndex).rarity.items"
        @blur="validateSelectValue('rarity')"
        @focus="getArtwork(activeIndex).rarity.error.status = false"
      />
      <InputSelect
        v-model="getArtwork(activeIndex).status.value"
        class="select-with-icon"
        :label="getArtwork(activeIndex).status.label"
        :placeholder="getArtwork(activeIndex).status.placeholder"
        :error="getArtwork(activeIndex).status.error"
        :items="getArtwork(activeIndex).status.items"
        @blur="validateSelectValue('status')"
        @focus="getArtwork(activeIndex).status.error.status = false"
      />
      <InputText
        v-model="getArtwork(activeIndex).materials.value"
        :label="getArtwork(activeIndex).materials.label"
        :placeholder="getArtwork(activeIndex).materials.placeholder"
        :error="getArtwork(activeIndex).materials.error"
        @blur="validateTextValue('materials')"
        @focus="getArtwork(activeIndex).materials.error.status = false"
      />
      <InputSelect
        v-model="getArtwork(activeIndex).medium.value"
        class="select-with-icon"
        :label="getArtwork(activeIndex).medium.label"
        :placeholder="getArtwork(activeIndex).medium.placeholder"
        :error="getArtwork(activeIndex).medium.error"
        :items="getArtwork(activeIndex).medium.items"
        @blur="validateSelectValue('medium')"
        @focus="getArtwork(activeIndex).medium.error.status = false"
      />
      <InputSelect
        v-model="getArtwork(activeIndex).subject.value"
        class="select-with-icon"
        :label="getArtwork(activeIndex).subject.label"
        :placeholder="getArtwork(activeIndex).subject.placeholder"
        :error="getArtwork(activeIndex).subject.error"
        :items="getArtwork(activeIndex).subject.items"
        @blur="validateSelectValue('subject')"
        @focus="getArtwork(activeIndex).subject.error.status = false"
      />

      <div class="checkbox-list">
        <span class="p2 gray label-text">Styles (up to 3)</span>

        <InputCheckbox
          v-for="style in getArtwork(activeIndex).styles"
          :key="style.name"
          :model-value="style.value"
          :name="style.name"
          :disabled="isStyleDisabled(style)"
          @update:model-value="updateStyleValue(style, $event)"
        />
      </div>

      <div class="add-tag-wrap">
        <span class="p2 gray label-text">Tags (up to 5)</span>
        <InputCheckbox
          v-for="tag in getArtwork(activeIndex).tags"
          :key="tag.name"
          :model-value="tag.value"
          :name="tag.name"
          :disabled="isTagDisabled(tag)"
          @update:model-value="updateTagValue(tag, $event)"
        />
        <InputAddCheckbox
          :existing-names="getArtwork(activeIndex).tags.map((tag) => tag.name)"
          @add="addTag"
        />
      </div>

      <div class="scroll-up-wrap">
        <button
          class="p1 gray scroll-up-btn"
          type="button"
          @click="handleScrollUp"
        >
          Scroll up
        </button>
      </div>
    </div>

    <div class="right-col">
      <span class="p1 gray">{{ artworkForms.length }} artworks added</span>

      <div class="files-list">
        <button
          v-for="(artwork, index) in artworkForms"
          :key="`${artwork.file?.name ?? 'artwork'}-${index}`"
          class="file-item"
          :class="{ active: index === activeIndex, error: artwork.isError }"
          type="button"
          @click="activeIndex = index"
        >
          <img
            v-if="artwork.previewUrl"
            class="file-thumb"
            :src="artwork.previewUrl"
            :alt="artwork.file?.name ?? 'Artwork image'"
          />
          <span class="p1 file-name">Image {{ index + 1 }}</span>
          <span class="delete-btn-wrap">
            <button
              class="default-btn delete-btn"
              type="button"
              aria-label="Remove artwork image"
              @click.stop="removeFile(index)"
            />
          </span>
        </button>
      </div>

      <button
        class="add-more-btn"
        type="button"
        @click="appendInputRef?.click()"
      />

      <input
        ref="appendInputRef"
        type="file"
        class="hidden-input"
        multiple
        accept=".png,.jpg,.jpeg,.tiff"
        @change="appendFiles"
      />
    </div>

    <Teleport to="body">
      <ModalEditImage
        :image="activeEditImage"
        @close="activeEditImage = null"
        @save="updateEditImage"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Artwork } from "~~/shared"

const { files } = defineProps<{
  files: File[]
}>()

const artworks = useState<Artwork[]>("artworks")

const createArtworkForm = (file?: File) => ({
  isError: false,
  file: file ?? null,
  previewUrl: file ? URL.createObjectURL(file) : "",
  title: {
    value: "",
    label: "Artwork title",
    placeholder: "e.g. Oil on canvas",
    error: {
      status: false,
      message: "Please add artwork title",
    },
  },
  description: {
    value: "",
    label: "Artwork description",
    placeholder: "Tell us about your piece",
    error: {
      status: false,
      message: "Please add artwork description",
    },
  },
  dimensions: {
    value: {
      height: "",
      width: "",
      depth: "",
      unit: "in",
    },
    error: {
      status: false,
      message: "Please add artwork dimensions",
    },
  },
  price: {
    value: {
      currency: "USD",
      amount: "",
    },
    label: "Price",
    placeholder: "e.g. 100",
    error: {
      status: false,
      message: "Please add artwork price",
    },
  },
  rarity: {
    value: "",
    label: "Rarity",
    placeholder: "Select rarity level",
    error: {
      status: false,
      message: "Please add artwork rarity",
    },
    items: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
  },
  status: {
    value: "",
    label: "Status",
    placeholder: "Select availability status",
    error: {
      status: false,
      message: "Please add artwork status",
    },
    items: ["Available", "Sold", "Reserved"],
  },
  materials: {
    value: "",
    label: "Materials",
    placeholder: "e.g., Acrylic wall mural",
    error: {
      status: false,
      message: "Please add artwork materials",
    },
  },
  medium: {
    value: "",
    label: "Medium",
    placeholder: "Select medium",
    error: {
      status: false,
      message: "Please add artwork medium",
    },
    items: ["Acrylic", "Oil", "Watercolor", "Mixed Media", "Other"],
  },
  subject: {
    value: "",
    label: "Subject",
    placeholder: "Select subject",
    error: {
      status: false,
      message: "Please add artwork subject",
    },
    items: ["Portrait", "Landscape", "Still Life", "Abstract", "Other"],
  },
  styles: [
    {
      value: false,
      name: "Abstract",
    },
    {
      value: false,
      name: "Fine Art",
    },
    {
      value: false,
      name: "Chip Text Words",
    },
    {
      value: false,
      name: "Pixel Art",
    },
    {
      value: false,
      name: "Digital Art",
    },
    {
      value: false,
      name: "3D Art",
    },
  ],
  tags: [] as Array<{
    value: boolean
    name: string
  }>,
})

type ArtworkForm = ReturnType<typeof createArtworkForm>

const activeIndex = ref(0)
const artworkForms = ref<ArtworkForm[]>([])
const appendInputRef = ref<HTMLInputElement | null>(null)
const maxSelectedStyles = 3
const maxSelectedTags = 5
const activeEditImage = ref<string | null>(null)

const getArtwork = (index: number): ArtworkForm =>
  artworkForms.value[index] as ArtworkForm

const selectedStylesCount = computed(
  () =>
    artworkForms.value[activeIndex.value]?.styles.filter((style) => style.value)
      .length ?? 0
)

const selectedTagsCount = computed(
  () =>
    artworkForms.value[activeIndex.value]?.tags.filter((tag) => tag.value)
      .length ?? 0
)

const isStyleDisabled = (style: ArtworkForm["styles"][number]) =>
  !style.value && selectedStylesCount.value >= maxSelectedStyles

const updateStyleValue = (
  style: ArtworkForm["styles"][number],
  nextValue: boolean
) => {
  if (
    nextValue &&
    !style.value &&
    selectedStylesCount.value >= maxSelectedStyles
  ) {
    return
  }

  style.value = nextValue
}

const isTagDisabled = (tag: ArtworkForm["tags"][number]) =>
  !tag.value && selectedTagsCount.value >= maxSelectedTags

const updateTagValue = (
  tag: ArtworkForm["tags"][number],
  nextValue: boolean
) => {
  if (nextValue && !tag.value && selectedTagsCount.value >= maxSelectedTags) {
    return
  }

  tag.value = nextValue
}

const addTag = (name: string) => {
  const artwork = artworkForms.value[activeIndex.value]
  if (!artwork) {
    return
  }

  const selectedTags = artwork.tags.filter((tag) => tag.value).length
  if (selectedTags >= maxSelectedTags) {
    return
  }

  artwork.tags.push({
    value: true,
    name,
  })
}

const handleScrollUp = () => {
  gsap.to(".add-artwork-modal .left-col", {
    scrollTo: { y: 0, offsetY: 0 },
    duration: 1.5,
    ease: "power2.inOut",
  })
}

const revokePreviewUrl = (url: string) => {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}

const validateTextValue = (
  key: "title" | "description" | "materials",
  value?: string,
  form?: ArtworkForm
) => {
  const artwork = form ?? artworkForms.value[activeIndex.value]
  if (!artwork) {
    return
  }

  artwork[key].error.status = !validateStringByLength(
    value ?? artwork[key].value,
    {
      min: 2,
    }
  )
}

const validatePriceValue = (value?: string, form?: ArtworkForm) => {
  const artwork = form ?? artworkForms.value[activeIndex.value]
  if (!artwork) {
    return
  }

  artwork.price.error.status = !validateStringByLength(
    value ?? artwork.price.value.amount,
    {
      min: 1,
      max: 15,
    }
  )
}

const validateSelectValue = (
  key: "rarity" | "status" | "medium" | "subject",
  value?: string,
  form?: ArtworkForm
) => {
  const artwork = form ?? artworkForms.value[activeIndex.value]
  if (!artwork) {
    return
  }

  artwork[key].error.status = !(value ?? artwork[key].value)
}

const validateDimensionsValue = (
  value?: ArtworkForm["dimensions"]["value"],
  form?: ArtworkForm
) => {
  const artwork = form ?? artworkForms.value[activeIndex.value]
  if (!artwork) {
    return
  }

  const dimensions = value ?? artwork.dimensions.value

  artwork.dimensions.error.status =
    dimensions.height === "" ||
    dimensions.width === "" ||
    dimensions.depth === ""
}

const normalizeFiles = (filesList: FileList | null): File[] => {
  if (!filesList) {
    return []
  }

  return Array.from(filesList).filter((file) => file.type.startsWith("image/"))
}

const removeFile = (index: number) => {
  const artworkToRemove = artworkForms.value[index]
  if (artworkToRemove) {
    revokePreviewUrl(artworkToRemove.previewUrl)
  }

  artworkForms.value.splice(index, 1)

  if (activeIndex.value > artworkForms.value.length - 1) {
    activeIndex.value = Math.max(0, artworkForms.value.length - 1)
  }
}

const appendFiles = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const nextFiles = normalizeFiles(target?.files ?? null)

  if (nextFiles.length === 0) {
    return
  }

  artworkForms.value.push(...nextFiles.map((file) => createArtworkForm(file)))

  if (target) {
    target.value = ""
  }
}

const updateEditImage = (image: string) => {
  const artwork = artworkForms.value[activeIndex.value]
  if (!artwork) {
    activeEditImage.value = null
    return
  }

  revokePreviewUrl(artwork.previewUrl)
  artwork.previewUrl = image
  activeEditImage.value = null
}

const handleSave = () => {
  artworkForms.value.forEach((form) => {
    validateTextValue("title", form.title.value, form)
    validateTextValue("description", form.description.value, form)
    validateTextValue("materials", form.materials.value, form)
    validatePriceValue(form.price.value.amount, form)
    validateSelectValue("rarity", form.rarity.value, form)
    validateSelectValue("status", form.status.value, form)
    validateSelectValue("medium", form.medium.value, form)
    validateSelectValue("subject", form.subject.value, form)
    validateDimensionsValue(form.dimensions.value, form)
    form.isError =
      form.title.error.status ||
      form.description.error.status ||
      form.materials.error.status ||
      form.price.error.status ||
      form.rarity.error.status ||
      form.status.error.status ||
      form.medium.error.status ||
      form.subject.error.status ||
      form.dimensions.error.status
  })

  if (artworkForms.value.every((form) => form.isError)) return false

  const nextArtworks = artworkForms.value.map((form) => ({
    id: crypto.randomUUID(),
    image: form.previewUrl ?? "",
    title: form.title.value ?? "",
    description: form.description.value ?? "",
    rarity: form.rarity.value ?? "",
    status: form.status.value ?? "",
    materials: form.materials.value ?? "",
    medium: form.medium.value ?? "",
    subject: form.subject.value ?? "",
    styles: form.styles
      .filter((style) => style.value)
      .map((style) => style.name),
    tags: form.tags.filter((tag) => tag.value).map((tag) => tag.name),
    price: {
      currency: form.price.value.currency ?? "",
      amount: Number(form.price.value.amount ?? 0),
    },
    size: {
      height: form.dimensions.value.height ?? "",
      width: form.dimensions.value.width ?? "",
      depth: form.dimensions.value.depth ?? "",
      unit: form.dimensions.value.unit ?? "",
    },
  }))

  artworks.value = [...(artworks.value ?? []), ...nextArtworks]
  artworkForms.value = []

  return true
}

watch(
  () => files,
  (nextFiles) => {
    const syncedForms = nextFiles.map((file, index) => {
      const existingForm = artworkForms.value[index]

      if (!existingForm) {
        return createArtworkForm(file)
      }

      if (existingForm.file === file) {
        return existingForm
      }

      revokePreviewUrl(existingForm.previewUrl)
      return createArtworkForm(file)
    })

    if (artworkForms.value.length > nextFiles.length) {
      artworkForms.value.slice(nextFiles.length).forEach((form) => {
        revokePreviewUrl(form.previewUrl)
      })
    }

    artworkForms.value = syncedForms

    if (activeIndex.value > artworkForms.value.length - 1) {
      activeIndex.value = Math.max(0, artworkForms.value.length - 1)
    }
  },
  { immediate: true, deep: true }
)

onBeforeUnmount(() => {
  artworkForms.value.forEach((form) => {
    revokePreviewUrl(form.previewUrl)
  })
})

defineExpose({
  handleSave,
})
</script>

<style scoped lang="scss">
.fill-step {
  height: 100%;
  min-height: 0;
  border-top: 1px solid var(--Opacity-10);
  display: grid;
  grid-template-columns: 1fr 25rem;
  gap: 1.5rem;
  border-radius: 0 0 2.5rem 2.5rem;
  overflow: hidden;
}
.left-col,
.right-col {
  min-height: 0;
  overflow-y: auto;
}
.left-col {
  padding: 2rem 1.25rem;
  flex-wrap: wrap;
  @include flex($jc: space-between, $g: 1.5rem);
}
.left-col:deep(.textarea) {
  height: 5.75rem;
}
.left-col:deep(.select-with-icon) {
  width: calc(50% - 0.75rem);

  &::before {
    content: "";
    position: absolute;
    right: 0.75rem;
    top: 2rem;
    width: 1.5rem;
    height: 1.5rem;
    background: url("/images/icon/select.svg") center / cover no-repeat;
    pointer-events: none;
    z-index: 1;
  }

  .input {
    padding-right: 2.75rem;
  }
}
.right-col {
  border-left: 1px solid var(--Opacity-10);
  padding: 1.25rem 2.75rem;
  @include flex($g: 0.5rem, $fd: column);
}
.preview-wrap {
  position: relative;
  width: fit-content;
  margin: 0 auto 0.5rem;
}
.preview-image {
  width: 18rem;
  height: 18.125rem;
  border-radius: 0.625rem;
  overflow: hidden;
  background: var(--Black-400);
}
.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.edit-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  @include flex(center, $g: 0.5rem);
}
.edit-btn::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/edit.svg") center / cover no-repeat;
}
.hidden-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
.files-list {
  @include flex($g: 0.5rem, $fd: column);
}
.file-item {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  border-radius: 0.625rem;
  border: 1px solid transparent;
  background: transparent;
  transition: border-color var(--transition-slow),
    background var(--transition-slow);
  @include flex($ai: center, $g: 0.75rem);
}
.file-item.error .file-name::after {
  opacity: 1;
}
.file-item.active {
  border-color: #0140cb;
}
.file-thumb {
  width: 4rem;
  height: 4rem;
  border-radius: 0.25rem;
  object-fit: contain;
  flex-shrink: 0;
  background: var(--Black-400);
}
.file-name {
  margin-right: auto;
  @include flex($ai: center, $g: 0.5rem);
}
.file-name::after {
  content: "";
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  background: url("/images/icon/info-error.svg") center / cover no-repeat;
  opacity: 0;
  transition: opacity var(--transition-slow);
}
.delete-btn-wrap {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 1px solid var(--Opacity-20);
  flex-shrink: 0;
  @include flex(center, center);
}
.delete-btn {
  padding: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.delete-btn::before {
  content: "";
  display: block;
  width: 1rem;
  height: 1rem;
  background: url("/images/icon/trash-white.svg") center / cover no-repeat;
}
.add-more-btn {
  margin-top: auto;
  width: 100%;
  height: 3.25rem;
  border-radius: 3.625rem;
  border: 1px dashed var(--Opacity-10);
  flex-shrink: 0;
  @include flex(center, center);

  @include hover {
    &:hover {
      &::before {
        opacity: 1;
      }
    }
  }
}
.add-more-btn::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/plus.svg") center / cover no-repeat;
  opacity: 0.5;
  transition: opacity var(--transition-slow);
}
.checkbox-list,
.add-tag-wrap {
  flex-wrap: wrap;
  @include flex($g: 0.375rem);
}
.label-text {
  margin-bottom: 0.25rem;
  width: 100%;
  @include flex(center, $g: 0.375rem);
}
.label-text::after {
  content: "";
  display: block;
  width: 1rem;
  height: 1rem;
  background: url("/images/icon/star.svg") center / cover no-repeat;
}
.scroll-up-wrap {
  width: 100%;
}
.scroll-up-btn {
  position: relative;
  margin: 0 auto;
  @include flex(center);

  @include hover {
    &:hover {
      &::before {
        transform: translateY(0.125rem);
      }
      &::after {
        transform: translateY(-0.125rem);
      }
    }
  }
}
.scroll-up-btn::after,
.scroll-up-btn::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/chevron.svg") center / cover no-repeat;
  transition: transform var(--transition-slow);
}
.scroll-up-btn::before {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
