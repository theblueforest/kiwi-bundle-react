import { Bundle } from "kiwi-bundle-react"

export const KBRD = Bundle({
  id: "kbrd",
  theme: {
    dark: {
      colors: {
        blue: "#ffffff",
      },
      sizes: {
        small: 10,
        medium: 15,
        big: 20,
      }
    },
  },
  routes: {
    HOME: {
      path: "/"
    },
  },
})
