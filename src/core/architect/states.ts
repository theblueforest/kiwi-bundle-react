import { AppConfig } from "../app/config"
import { AppLinksImports } from "../app/links"
import {
  ArchitectComponentProps,
  ArchitectComponentStyle,
  ArchitectComponentStates,
} from "./component"
import { ArchitectFunctions } from "./functions"
import { ArchitectOnInit } from "./onInit"
import { ArchitectOnMount } from "./onMount"
import { ArchitectOnUnmount } from "./onUnmount"
import { ArchitectOptions } from "./options"
import { ArchitectRender } from "./render"
import { ArchitectSelf } from "./self"
import { ArchitectValues } from "./values"

export type ArchitectStates<
  Config extends AppConfig,
  Links extends AppLinksImports<Config>,
  Props extends ArchitectComponentProps,
  Style extends ArchitectComponentStyle,
  > = <States extends ArchitectComponentStates>(states: States) => Omit<
    ArchitectSelf<Config, Links, Props, Style, States>,
    "style" | "states"
  >

export const ArchitectStates = <
  Config extends AppConfig,
  Links extends AppLinksImports<Config>,
  Props extends ArchitectComponentProps,
  Style extends ArchitectComponentStyle,
  >(
    options: ArchitectOptions<Config, Links, Props, Style>
  ): ArchitectStates<Config, Links, Props, Style> => {
  return <States extends ArchitectComponentStates>(states: States) => {
    options.cache.states = states
    return {
      values: ArchitectValues<Config, Links, Props, Style, States>(options),
      functions: ArchitectFunctions<Config, Links, Props, Style, States, {}>(options),
      onInit: ArchitectOnInit<Config, Links, Props, Style, States, {}, any>(options),
      onMount: ArchitectOnMount<Config, Links, Props, Style, States, {}, any>(options),
      onUnmount: ArchitectOnUnmount<Config, Links, Props, Style, States, {}, any>(options),
      render: ArchitectRender<Config, Links, Props, Style, States, {}, any>(options),
    }
  }
}
