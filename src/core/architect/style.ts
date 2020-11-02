import { AppLinksImports } from "../app/links"
import { ArchitectRender } from "./render"
import { ArchitectSelf } from "./self"
import { ArchitectStates } from "./states"
import { ArchitectOptions } from "./options"
import { ArchitectOnInit } from "./onInit"
import { ArchitectOnMount } from "./onMount"
import { ArchitectOnUnmount } from "./onUnmount"
import { ArchitectStores } from "./stores"
import { ArchitectValues } from "./values"
import { ArchitectFunctions } from "./functions"
import {
  ArchitectComponentFunctions,
  ArchitectComponentProps,
  ArchitectComponentStates,
  ArchitectComponentStores,
  ArchitectComponentStyle,
  ArchitectComponentValues
} from "./component"
import { AppConfig } from "../app/config"

export type ArchitectStyle<
  Config extends AppConfig,
  Links extends AppLinksImports<Config>,
  Props extends ArchitectComponentProps,
  EmptyStyle extends ArchitectComponentStyle,
  States extends ArchitectComponentStates,
  Values extends ArchitectComponentValues,
  Functions extends ArchitectComponentFunctions,
  Stores extends ArchitectComponentStores,
  > = <Style extends EmptyStyle>(style: Style) => Omit<
    ArchitectSelf<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>,
    "style"
  >

export const ArchitectStyle = <
  Config extends AppConfig,
  Links extends AppLinksImports<Config>,
  Props extends ArchitectComponentProps,
  EmptyStyle extends ArchitectComponentStyle = {},
  States extends ArchitectComponentStates = {},
  Values extends ArchitectComponentValues = {},
  Functions extends ArchitectComponentFunctions = {},
  Stores extends ArchitectComponentStores = {},
  >(
    options: ArchitectOptions<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>
  ): ArchitectStyle<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores> => {
  return <Style extends EmptyStyle>(style: Style) => {
    options.context.style = style
    return {
      states: ArchitectStates<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>(options),
      values: ArchitectValues<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>(options),
      functions: ArchitectFunctions<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>(options),
      stores: ArchitectStores<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>(options),
      onInit: ArchitectOnInit<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>(options),
      onMount: ArchitectOnMount<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>(options),
      onUnmount: ArchitectOnUnmount<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>(options),
      render: ArchitectRender<Config, Links, Props, EmptyStyle, States, Values, Functions, Stores>(options),
    }
  }
}
