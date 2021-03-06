import { React, ReactNative } from "../vendors"
import { StyleSheetStyleView } from "../core/app/styles"

interface Props extends ReactNative.ScrollViewProps {
  style?: StyleSheetStyleView
  children?: React.ReactNode
}

export const ScrollView = (props: Props) => {
  return <ReactNative.ScrollView {...props} />
}
