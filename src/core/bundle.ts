import * as React from "react"
import { KeysObject } from "dropin-recipes"
import { Config as WebFontConfig } from "webfontloader"
import { observer } from "mobx-react"
import { ComponentProps, PageConstructor, Component, PageProps, Page, ComponentState } from "./components"
import { Router } from "./client/router"
import { StyleSheetData } from "./styles"
import { Renderer } from "./client/Renderer"
import { Values } from "./values/Values"

export interface KiwiBundleReactTheme<Data extends KiwiBundleReactTheme<Data> = any> {
  sizes?: KeysObject<number, Data["sizes"]>
  colors?: KeysObject<string, Data["colors"]>
  fonts?: WebFontConfig
  css?: { [rule: string]: string | number }
}

export interface KiwiBundleReactOptions<Data extends KiwiBundleReactOptions<Data> = { routes: KeysObject<string>, theme: KiwiBundleReactTheme }> {
  routes: KeysObject<string, Data["routes"]>
  theme: KiwiBundleReactTheme<Data["theme"]>
}

interface KiwiBundleReactContextComponentObject<Props, State, Values, Functions, Options extends KiwiBundleReactOptions> {
  props: Props
  state: State
  setState: (state: {} | ((prevState: Readonly<State>, props: Readonly<Props>) => void)) => void
  values: Values
  functions: Functions
  routes: Options["routes"]
  sizes: Options["theme"]["sizes"]
  colors: Options["theme"]["colors"]
  router: Router
}

interface KiwiBundleReactContextComponent<Props = ComponentProps, State = ComponentState, Values = KeysObject<any>, Functions = KeysObject<any>, Options extends KiwiBundleReactOptions = KiwiBundleReactOptions> {
  props?: Props
  state?: Omit<State, "$">
  values?: Values
  functions?: Functions
  init?: (context: KiwiBundleReactContextComponentObject<Props, State, Values, Functions, Options>) => void
  onDidMount?: (context: KiwiBundleReactContextComponentObject<Props, State, Values, Functions, Options>) => void
  render: (context: KiwiBundleReactContextComponentObject<Props, State, Values, Functions, Options>) => React.ReactNode
}

interface KiwiBundleReactContextPageObject<Params = KeysObject<any>, State = KeysObject<any>, Values = KeysObject<any>, Functions = KeysObject<any>, Options extends KiwiBundleReactOptions = KiwiBundleReactOptions> extends KiwiBundleReactContextComponentObject<PageProps<Params>, State, Values, Functions, Options> {
  params: Params
}

interface KiwiBundleReactContextPage<Params = KeysObject<any>, State = KeysObject<any>, Values = KeysObject<any>, Functions = KeysObject<any>, Options extends KiwiBundleReactOptions = KiwiBundleReactOptions> {
  state?: State
  values?: Values
  functions?: { [key: string]: (context: KiwiBundleReactContextPageObject<Params, State, Values, Functions, Options>) => any }
  init?: (context: KiwiBundleReactContextPageObject<Params, State, Values, Functions, Options>) => void
  onDidMount?: (context: KiwiBundleReactContextPageObject<Params, State, Values, Functions, Options>) => void
  render: (context: KiwiBundleReactContextPageObject<Params, State, Values, Functions, Options>) => React.ReactNode
}

export class KiwiBundleReact<Options extends KiwiBundleReactOptions<Options> = KiwiBundleReactOptions> {
  private options: Options
  private router = new Router()

  constructor(options: Options) {
    this.options = options
  }

  Values<Data extends Values<Data, any>>(values: (theme: Options["theme"]) => Data): Data {
    return values(this.options.theme)
  }

  StyleSheet<Data extends StyleSheetData<Data>>(style: (theme: Options["theme"]) => Data): Data {
    return style(this.options.theme)
  }

  Component<Props extends ComponentProps = ComponentProps, State extends ComponentState = ComponentState, Values = KeysObject<any>, Functions = KeysObject<any>>(component: KiwiBundleReactContextComponent<Props, State, Values, Functions, Options>) {
    const getContext = (instance: Component<Props, State>): KiwiBundleReactContextComponentObject<Props, State, Values, Functions, Options> => ({
      props: instance.props,
      state: instance.state,
      setState: instance.setState.bind(instance),
      values: component.values || {} as Values,
      functions: Object.assign({}, component.functions),
      routes: this.options.routes,
      sizes: this.options.theme.sizes,
      colors: this.options.theme.colors,
      router: this.router,
    })
    return observer(class extends Component<Props, State> {
      constructor(props: any) {
        super(props)
        if(typeof component.state !== "undefined") this.state = Object.assign(this.state, component.state)
        if(typeof component.init !== "undefined") component.init(getContext(this))
      }
      componentDidMount() {
        super.componentDidMount()
        if(typeof component.onDidMount !== "undefined") component.onDidMount(getContext(this))
      }
      render(): React.ReactNode {
        return component.render(getContext(this))
      }
    })
  }

  Layout<Props extends ComponentProps = ComponentProps, State extends ComponentState = ComponentState, Values = KeysObject<any>, Functions = KeysObject<any>>(layout: KiwiBundleReactContextComponent<Props, State, Values, Functions, Options>) {
    return this.Component<Props, State, Values, Functions>(layout)
  }

  Page<Params = KeysObject<any>, State extends ComponentState = ComponentState, Values = KeysObject<any>, Functions = KeysObject<any>>(page: KiwiBundleReactContextPage<Params, State, Values, Functions, Options>) {
    const getContext = (instance: Page<Params, State>): KiwiBundleReactContextPageObject<Params, State, Values, Functions, Options> => ({
      props: instance.props,
      state: Object.assign(instance.state, page.state),
      setState: instance.setState.bind(instance),
      values: Object.assign({}, page.values),
      functions: {} as any, // Object.assign({}, page.functions), // TODO
      routes: this.options.routes,
      sizes: this.options.theme.sizes,
      colors: this.options.theme.colors,
      params: instance.getParams(),
      router: this.router,
    })
    return observer(class extends Page<Params, State> {
      constructor(props: any) {
        super(props)
        if(typeof page.init !== "undefined") page.init(getContext(this))
      }
      componentDidMount() {
        super.componentDidMount()
        if(typeof page.onDidMount !== "undefined") page.onDidMount(getContext(this))
      }
      render(): React.ReactNode {
        return page.render(getContext(this))
      }
    })
  }

  Render<Routes extends KeysObject<PageConstructor | string, Options["routes"]>>(routes: Routes): void {
    Renderer(this.options, routes)
  }
}
