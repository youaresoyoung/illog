export type AsProp<T extends React.ElementType> = {
  as?: T;
};

export type PropsToOmit<T extends React.ElementType, P> = keyof (AsProp<T> & P);

export type NestedKeys<T, P extends string = ""> = {
  [K in keyof T]: T[K] extends string
    ? `${P}${Extract<K, string>}`
    : NestedKeys<T[K], `${P}${Extract<K, string>}.`>;
}[keyof T];
