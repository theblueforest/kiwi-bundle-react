import { ReactNative } from "../../vendors"
import { Provider } from "../provider"
import {
  AppLinks,
  AppLinksCustom,
  AppLinksResolve,
  AppLinksImports,
} from "./links"
import { Architect } from "../architect"
import { DynamicData } from "../../utils/dynamicData"
import {
  ArchitectComponentProps,
  ArchitectComponentType,
} from "../architect/component"
import { AppConfig } from "./config"
import { AppOptions } from "./options"
import { AppTheme } from "./theme"
import { AppStore, AppStoreValues } from "./store"
import { AppStyleSheet } from "./styles"

export const App = <
  Config extends AppConfig,
  Links extends AppLinksImports<Config>
>(
  config: Config,
  links: Links,
) => {
  const options: AppOptions = {
    actions: {
      theme: {
        name: DynamicData(""),
        scheme: DynamicData<ReactNative.ColorSchemeName>("light"),
      },
    },
  }
  return {
    Component: Architect<Config, Links>({
      type: ArchitectComponentType.COMPONENT,
      app: { config, options },
    }),
    Layout: Architect<Config, Links>({
      type: ArchitectComponentType.LAYOUT,
      app: { config, options },
    }),
    Page: Architect<Config, Links>({
      type: ArchitectComponentType.PAGE,
      app: { config, options },
    }),
    Theme: <Theme extends AppTheme<Config>>(
      theme: (context: { colors: Config["appearance"]["colors"] }) => Theme,
    ) => {
      return theme({
        colors: config.appearance.colors,
      })
    },
    StyleSheet: <S1 extends AppStyleSheet, S2 extends AppStyleSheet>(
      style1: (app: {
        colors: Config["appearance"]["colors"]
        sizes: Config["appearance"]["sizes"]
        dimensions: {
          window: ReactNative.ScaledSize
          screen: ReactNative.ScaledSize
        }
      }) => S1,
      style2?: S2,
    ): S1 & S2 => {
      const style: AppStyleSheet = style1({
        colors: config.appearance.colors,
        sizes: config.appearance.sizes,
        dimensions: {
          window: ReactNative.Dimensions.get("window"),
          screen: ReactNative.Dimensions.get("screen"),
        },
      })
      if (typeof style2 !== "undefined") {
        Object.keys(style2).forEach((key) => {
          const value = style2[key]
          if (typeof style[key] === "undefined") {
            style[key] = value
          } else {
            style[key] = Object.assign(style[key], value)
          }
        })
      }
      return style as S1 & S2
    },
    Store: <Values extends AppStoreValues>(values: Values) => {
      const methods: Omit<AppStore, "bind"> = { get: {}, set: {} }
      const onUpdateBindings = Object.keys(values).reduce<{
        [key: string]: (cb: () => void) => void
      }>((all, key) => {
        let value = values[key]
        const data = DynamicData(value)
        data.bind({
          get: () => value,
          set: (newValue) => {
            value = newValue
          },
        })
        methods.get[key] = data.data.get
        methods.set[key] = data.data.set
        all[key] = data.onUpdate
        return all
      }, {})
      return {
        ...methods,
        bind: (bindValues) => (onUpdate) => {
          bindValues.forEach((valueKey) => {
            onUpdateBindings[valueKey as string](onUpdate)
          })
        },
      } as AppStore<Values>
    },
    Custom: <Props extends ArchitectComponentProps>(
      custom: AppLinksCustom<Config, Props>,
    ) => custom,
    Render: () => {
      const resolveImports = <Content>(from: {
        [key: string]: Promise<{ default: Content }> | undefined
      }) => {
        return Object.keys(from).reduce<Promise<{ [key: string]: Content }>>(
          (promise, key) =>
            promise.then((all) => {
              const item = from[key]
              if (typeof item === "undefined") {
                return all
              }
              return item.then((current) => {
                all[key] = current.default
                return all
              })
            }),
          Promise.resolve({}),
        )
      }
      const linksResolve: AppLinksResolve = links
      Promise.resolve<AppLinks<any>>({ pages: {} })
        .then((resolvedLinks) => {
          return resolveImports(linksResolve.pages)
            .then((pages) => {
              resolvedLinks.pages = pages
            })
            .then(() => {
              if (typeof linksResolve.themes === "undefined") {
                return
              }
              return resolveImports(linksResolve.themes).then((themes) => {
                resolvedLinks.themes = themes
              })
            })
            .then(() => {
              if (typeof linksResolve.custom === "undefined") {
                return
              }
              const importsCustom = linksResolve.custom
              return Promise.resolve<NonNullable<AppLinks<any>["custom"]>>({})
                .then((custom) => {
                  if (typeof importsCustom.header === "undefined") {
                    return custom
                  }
                  return resolveImports(importsCustom.header).then((header) => {
                    custom.header = header
                    return custom
                  })
                })
                .then((custom) => {
                  resolvedLinks.custom = custom
                })
            })
            .then(() => resolvedLinks)
        })
        .then((resolvedLinks) => {
          ReactNative.AppRegistry.registerComponent(
            config.key,
            Provider(config, resolvedLinks, options),
          )
          if (ReactNative.Platform.OS === "web") {
            ReactNative.AppRegistry.runApplication(config.key, {
              rootTag: document.getElementById("root"),
            })
          }
        })
    },
  }
}
