import { React, ReactNative } from "../vendors"
import { StyleSheetStyleView } from "../core/app/styles"

interface Props extends ReactNative.PickerProps {
  style?: StyleSheetStyleView
  children?: React.ReactNode
}

export const Picker = (props: Props) => {
  return <ReactNative.Picker {...props} />
}
