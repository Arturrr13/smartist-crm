export interface ModalState {
  addArtwork: boolean
  deleteArtwork:
    | false
    | {
        id: string
        title: string
      }
}
