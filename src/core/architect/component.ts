export enum ArchitectComponentType {
  COMPONENT,
  LAYOUT,
  PAGE,
}

export type ArchitectComponentProps = { [name: string]: any }

export type ArchitectComponentStates = Required<{ [name: string]: any }>

export type ArchitectComponentValues = Required<{ [name: string]: any }>

export type ArchitectComponentFunctions = Required<{
  [name: string]: (...params: any) => any
}>

export type ArchitectComponent<
  Props extends ArchitectComponentProps = {}
  > = React.ComponentType<Props>
