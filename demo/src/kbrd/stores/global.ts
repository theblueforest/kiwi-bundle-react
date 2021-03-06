import { KBRD } from ".."

// Definition of the values contained in the Store
type Values = {
  counter: number
  text: string
}

// Generation of a new Store from our App, by naming convention we suggest to add "Store" as suffix
export const GlobalStore = KBRD.Store<Values>({
  counter: 0,
  text: "",
})
