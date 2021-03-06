import { React, ReactNative } from "../vendors"
import { StyleSheetStyleView } from "../core/app/styles"

interface Props extends ReactNative.TouchableOpacityProps {
  style?: StyleSheetStyleView
  children?: React.ReactNode
}

export const TouchableOpacity = (props: Props) => {
  return <ReactNative.TouchableOpacity {...props} />
}
