<template>
  <div class="artworks" :class="{ 'gallery-view': switcher }">
    <h1 class="h2">
      Artworks
      <span class="gray artworks-count">
        {{ artworksCopy.length }}
      </span>
    </h1>

    <div class="control-panel">
      <div class="left-block">
        <InputText
          v-model="controlPanel.search.value"
          class="search-input"
          :placeholder="controlPanel.search.placeholder"
          @input="handleSearch"
        />
        <InputSwitcher v-model="switcher" />
      </div>
      <div class="right-block">
        <InputSelect
          v-model="controlPanel.sort.value"
          :placeholder="controlPanel.sort.placeholder"
          :items="controlPanel.sort.items"
          without-focus
          class="sort-input"
        />
        <button
          class="default-btn direction-button"
          :class="{ active: direction }"
          @click="handleDirection"
        />
      </div>
    </div>

    <div class="grid-wrap">
      <div v-if="!switcher" class="line-grid">
        <div class="head-line">
          <span
            v-for="(item, index) in gridItems"
            :key="index"
            class="p3 gray line-item"
          >
            {{ item }}
          </span>
        </div>
        <div
          v-if="artworks.length > 0"
          class="body-grid"
          @scroll.passive="closeSubmenu"
        >
          <div
            v-for="(artwork, index) in artworksCopy"
            :key="index"
            class="body-grid-item"
          >
            <div class="title-wrap line-item">
              <div class="img-wrap">
                <img :src="artwork.image" :alt="artwork.title" />
              </div>
              <div class="text-wrap">
                <span class="p2-medium artwork-title">{{ artwork.title }}</span>
                <span class="p2 gray size">
                  {{ artwork.size.height }} x {{ artwork.size.width }} x
                  {{ artwork.size.depth || "0" }} {{ artwork.size.unit }}
                </span>
              </div>
            </div>
            <div class="line-item">
              <span class="p2 primary line-text-item">
                {{ artwork.description }}
              </span>
            </div>
            <div class="line-item">
              <span class="p2 primary line-text-item">
                {{ artwork.rarity }}
              </span>
            </div>
            <div class="line-item">
              <span class="p2 primary line-text-item">
                {{ artwork.status }}
              </span>
            </div>
            <div class="line-item">
              <span class="p2 primary line-text-item">
                {{ artwork.materials }}
              </span>
            </div>
            <div class="line-item">
              <span class="p2 primary line-text-item">
                {{ artwork.medium }}
              </span>
            </div>
            <div class="line-item">
              <span class="p2 primary line-text-item">
                {{ artwork.subject }}
              </span>
            </div>
            <div class="line-item">
              <span class="p2 gray line-text-item">
                {{ artwork.styles.join(", ") }}
              </span>
            </div>
            <div class="line-item">
              <span class="p2 gray line-text-item">
                <span v-for="tag in artwork.tags" :key="tag"> #{{ tag }} </span>
              </span>
            </div>
            <div class="line-item price-item">
              <span
                class="p2 primary line-text-item"
                v-html="
                  `${
                    artwork.price.currency
                  } ${artwork.price.amount.toLocaleString()}`
                "
              />
            </div>
            <div class="submenu-wrap">
              <button
                type="button"
                class="submenu-button"
                @click.stop="toggleSubmenu(index, $event)"
                @blur="closeSubmenu"
              />

              <div
                class="submenu"
                :class="{
                  active: submenuIndex === index,
                  up: submenuUpByIndex[index],
                }"
              >
                <button class="p1 edit-button">Edit</button>
                <button
                  class="p1 delete-button"
                  @click.stop="handleDelete(artwork.id, artwork.title)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="body-grid-empty">
          <div class="no-artworks-icon" />
          <span class="p1 gray">No artworks added yet</span>
          <button
            class="default-btn blue btn-add-artwork"
            @click="modal.addArtwork = true"
          >
            Add artwork
          </button>
        </div>
      </div>

      <div v-if="artworks.length > 0 && switcher" class="gallery-grid">
        <div
          v-for="(column, columnIndex) in galleryColumns"
          :key="columnIndex"
          class="gallery-column"
        >
          <CardGallery
            v-for="{ artwork, index } in column"
            :key="index"
            :artwork="artwork"
            :index="index"
            :active-card-index="activeCardIndex"
            @active-submenu="activeCardIndex = index"
            @close-submenu="activeCardIndex = -1"
          />
        </div>
      </div>

      <div
        v-if="artworks.length === 0 && switcher"
        class="body-grid-empty-gallery"
      >
        <div class="no-artworks-icon" />
        <span class="p1 gray">No artworks added yet</span>
        <button
          class="default-btn blue btn-add-artwork"
          @click="modal.addArtwork = true"
        >
          Add artwork
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Artwork, ModalState } from "~~/shared"

const artworks = useState<Artwork[]>("artworks")
const modal = useState<ModalState>("modal")

const gridItems = [
  "title",
  "description",
  "rarity",
  "status",
  "materials",
  "medium",
  "subject",
  "styles",
  "Tags",
  "price",
]

const switcher = ref(false)
const direction = ref(false)
const submenuIndex = ref(-1)
const activeCardIndex = ref(-1)
const submenuUpByIndex = reactive<Record<number, boolean>>({})
const artworksCopy = ref<Artwork[]>(artworks.value)
const GALLERY_COLUMNS_COUNT = 4
const sortValueByProperty: Record<
  string,
  (artwork: Artwork) => string | number
> = {
  Title: (artwork) => artwork.title,
  Rarity: (artwork) => artwork.rarity,
  Status: (artwork) => artwork.status,
  Materials: (artwork) => artwork.materials,
  Medium: (artwork) => artwork.medium,
  Subject: (artwork) => artwork.subject,
  Styles: (artwork) => artwork.styles.join(", "),
  Price: (artwork) => artwork.price.amount,
}

const controlPanel = reactive({
  search: {
    value: "",
    placeholder: "Search",
  },
  sort: {
    value: "Title",
    label: "Location",
    placeholder: "Select location",
    error: {
      status: false,
      message: "Invalid location",
    },
    items: [
      "Title",
      "Rarity",
      "Status",
      "Materials",
      "Medium",
      "Subject",
      "Styles",
      "Price",
    ],
  },
})

const handleSearch = () => {
  artworksCopy.value = artworks.value.filter((artwork) =>
    artwork.title
      .toLowerCase()
      .includes(controlPanel.search.value.toLowerCase())
  )
}

const handleDirection = () => {
  direction.value = !direction.value
  artworksCopy.value = artworksCopy.value.reverse()
}

const handleSortBy = () => {
  const property = controlPanel.sort.value
  const getSortValue = sortValueByProperty[property]

  if (!getSortValue) return

  artworksCopy.value = artworksCopy.value.sort((a, b) => {
    const aValue = getSortValue(a)
    const bValue = getSortValue(b)

    if (typeof aValue === "number" && typeof bValue === "number") {
      return aValue - bValue
    }

    return String(aValue).localeCompare(String(bValue))
  })
  if (direction.value) {
    artworksCopy.value = artworksCopy.value.reverse()
  }
}

const galleryColumns = computed(() => {
  const columns = Array.from(
    { length: GALLERY_COLUMNS_COUNT },
    () =>
      [] as {
        artwork: Artwork
        index: number
      }[]
  )

  artworksCopy.value.forEach((artwork, index) => {
    const targetColumn = columns[index % GALLERY_COLUMNS_COUNT]
    if (targetColumn) {
      targetColumn.push({ artwork, index })
    }
  })

  return columns
})

const closeSubmenu = () => {
  setTimeout(() => {
    submenuIndex.value = -1
  }, 250)
}

const toggleSubmenu = (index: number, event: MouseEvent) => {
  if (submenuIndex.value === index) {
    closeSubmenu()
    return
  }

  const button = event.currentTarget as HTMLElement | null
  const bodyGrid = button?.closest(".body-grid") as HTMLElement | null

  if (button && bodyGrid) {
    const btnRect = button.getBoundingClientRect()
    const bodyRect = bodyGrid.getBoundingClientRect()
    const submenuHeight = 88
    const gap = 16
    const spaceBelow = bodyRect.bottom - btnRect.bottom
    const spaceAbove = btnRect.top - bodyRect.top

    submenuUpByIndex[index] =
      spaceBelow < submenuHeight + gap && spaceAbove > submenuHeight + gap
  } else {
    submenuUpByIndex[index] = false
  }

  submenuIndex.value = index
}

const handleDelete = (id: string, title: string) => {
  modal.value.deleteArtwork = { id, title }
}

watch(() => controlPanel.sort.value, handleSortBy)
watch(
  () => artworks.value,
  (newVal) => {
    artworksCopy.value = [...newVal]
    handleSortBy()
  }
)

onMounted(() => {
  handleSortBy()
})
</script>

<style scoped lang="scss">
.artworks {
  flex: 1;
  min-height: 0;
  margin: 2rem 0 3.5rem;
  @include flex($fd: column);
}
.artworks.gallery-view {
  margin: 2rem 0 0;
}
.artworks-count {
  font-style: italic;
}
.control-panel {
  margin: 1.5rem 0;
  @include flex($ai: center, $jc: space-between);
}
.left-block {
  @include flex($ai: center, $g: 0.75rem);
}
.search-input {
  width: 19.75rem;

  &::before {
    content: "";
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("/images/icon/search.svg") center / cover no-repeat;
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
  }
  &:deep(.input) {
    padding-left: 3rem;
  }
}
.right-block {
  @include flex($ai: center, $g: 0.75rem);
}
.direction-button {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  overflow: hidden;
  padding: 0;
  flex-shrink: 0;
}
.direction-button.active::before {
  transform: rotate(180deg);
}
.direction-button::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/arrow.svg") center / cover no-repeat;
  transition: transform var(--transition-slow);
}
.sort-input {
  width: 10rem;

  &::before {
    content: "Sort by: ";
    color: var(--Gray-30);
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
  }
  &:deep(.input) {
    padding-left: 4.75rem;
  }
}
.grid-wrap {
  flex: 1;
  min-height: 0;
}
.line-grid {
  height: 100%;
  border-radius: 0.75rem;
  border: 1px solid var(--Stroke-Primary);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.body-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
.head-line,
.body-grid-item {
  display: grid;
  grid-template-columns: 12.5rem 8.125rem 5.25rem 5.25rem repeat(6, 8.125rem) auto;
}
.body-grid-item {
  background: var(--Black-150);
}
.body-grid-item:not(:last-child) {
  border-bottom: 1px solid var(--Stroke-Primary);
}
.head-line > .line-item:last-child,
.body-grid-item > .line-item:last-child,
.body-grid-item > .price-item {
  justify-content: flex-end;
}
.line-item {
  padding: 0.75rem;
  @include flex(center);
}
.line-text-item {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.title-wrap {
  @include flex($ai: center, $g: 1rem);
}
.img-wrap {
  width: 2.5rem;
  height: 2.5rem;
  overflow: hidden;
  border-radius: 0.5rem;
  background: var(--Stroke-Primary);
  flex-shrink: 0;
  @include flex(center, center);
}
.img-wrap img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
.text-wrap {
  @include flex($g: 0.25rem, $fd: column);
}
.artwork-title,
.size {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.submenu-wrap {
  position: relative;
  @include flex(center, center);
}
.submenu-button {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--Stroke-Primary);
  transition: background var(--transition-slow);
  @include flex(center, center);

  @include hover {
    &:hover {
      background: var(--Opacity-10);
    }
  }
}
.submenu-button::before {
  content: "";
  display: block;
  width: 0.5rem;
  height: 0.75rem;
  background: url("/images/icon/dots.svg") center / contain no-repeat;
}
.submenu {
  position: absolute;
  top: 50%;
  bottom: auto;
  right: 0.75rem;
  z-index: 1;
  width: 9.375rem;
  height: 0;
  background: var(--Black-150);
  border-radius: 0.5rem;
  border: 1px solid transparent;
  border-bottom: 1px solid transparent;
  display: grid;
  grid-template-rows: 1fr 1fr;
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
  opacity: 0;
  --submenu-shift-y: 1rem;
  transform: translateX(100%) translateY(var(--submenu-shift-y));
  transition: var(--transition-slow);
  transition-property: transform, opacity, visibility, height, border-color;
}
.submenu.active {
  height: 5.5rem;
  border-color: var(--Stroke-Primary);
  visibility: visible;
  pointer-events: auto;
  opacity: 1;
  transform: translateX(0) translateY(var(--submenu-shift-y));
}
.submenu.up {
  --submenu-shift-y: -6.5rem;
}
.edit-button,
.delete-button {
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  transition: background var(--transition-slow);
  @include flex(center, flex-start, 0.5rem);

  @include hover {
    &:hover {
      background: var(--Opacity-10);
    }
  }
}
.delete-button {
  border-top: 1px solid var(--Stroke-Primary);
  color: var(--Error);
}
.edit-button::before,
.delete-button::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/edit.svg") center / cover no-repeat;
}
.delete-button::before {
  background: url("/images/icon/trash.svg") center / cover no-repeat;
}
.gallery-grid {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.5rem;
  padding-bottom: 3.5rem;
}
.gallery-column {
  @include flex($g: 2.5rem, $fd: column);
}
.gallery-card {
  @include flex($g: 0.5rem, $fd: column);
}
.gallery-card-img {
  width: 100%;
}
.gallery-card-img img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
.gallery-card-text {
  @include flex($g: 0.25rem, $fd: column);
}
.body-grid-empty {
  height: 100%;
  border-top: 1px solid var(--Stroke-Primary);
  background: linear-gradient(180deg, rgba(24, 24, 28, 0) 0%, #18181c 100%);
  @include flex(center, center, 2rem, column);
}
.body-grid-empty-gallery {
  height: 100%;
  @include flex(center, center, 2rem, column);
}
.no-artworks-icon {
  width: 4.75rem;
  height: 4.125rem;
  background: url("/images/common/no-img.svg") center / cover no-repeat;
}
.btn-add-artwork {
  @include flex(center, center, 0.5rem);
}
.btn-add-artwork::before {
  content: "";
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url("/images/icon/plus-2.svg") center / cover no-repeat;
}
</style>
