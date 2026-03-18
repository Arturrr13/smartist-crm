export interface ProfileState {
  email: string
  name: string
  location: string
  boothNumber: string
  logo: string
  website: string
  instagram: string
  about: string
}

export interface ModalState {
  addArtwork: boolean
  deleteArtwork:
    | false
    | {
        id: string
        title: string
      }
  message: boolean | "success" | "error"
}
