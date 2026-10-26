type Listener = (open: boolean) => void

let popupOpen = false
const listeners = new Set<Listener>()

/** True while the Halloween cash popup covers the page. Hanging novedades wait. */
export function setHalloweenCashPopupOpen(open: boolean): void {
  if (popupOpen === open) return
  popupOpen = open
  for (const listener of listeners) listener(open)
}

export function isHalloweenCashPopupOpen(): boolean {
  return popupOpen
}

export function subscribeHalloweenCashPopup(listener: Listener): () => void {
  listeners.add(listener)
  listener(popupOpen)
  return () => {
    listeners.delete(listener)
  }
}
