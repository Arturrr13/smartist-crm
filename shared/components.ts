export interface Artwork {
  id: string
  image: string
  title: string
  size: {
    height: string
    width: string
    depth: string
    unit: string
  }
  description: string
  rarity: string
  status: string
  materials: string
  medium: string
  subject: string
  styles: string[]
  tags: string[]
  price: {
    currency: string
    amount: number
  }
}
