import { React, Kiwi } from "../vendors/kiwi-bundle-react"
import { HomePageStyle } from "./Home.style"
import { KBS } from "../bundle"
import { ButtonLayout } from "../layouts/Button"

type Props = {
  selected?: boolean
}

type States = {
  count: number
}

export const HomePage = KBS.Page<Props, States>({
  states: {
    count: 10,
  },
  render: ({ state }) => (
    <Kiwi.View>
      <Kiwi.View style={HomePageStyle.textContainer}>
        <Kiwi.Text style={HomePageStyle.text}>{state.get.count}</Kiwi.Text>
      </Kiwi.View>
      <Kiwi.View style={HomePageStyle.container}>
        <ButtonLayout
          title="-"
          onPress={() => {
            if (state.get.count > 0) {
              state.set.count(state.get.count - 1)
            }
          }}
        />
        <ButtonLayout
          title="+"
          onPress={() => {
            state.set.count(state.get.count + 1)
          }}
        />
      </Kiwi.View>
    </Kiwi.View>
  ),
})
