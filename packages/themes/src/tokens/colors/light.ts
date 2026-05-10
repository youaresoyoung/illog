import { blue, brand, gray, green, purple, red, white, yellow } from './primitive'

export const background = {
  default: {
    default: white[1000],
    defaultHover: gray[100],
    secondary: gray[100],
    secondaryHover: gray[200],
    tertiary: gray[300],
    tertiaryHover: gray[400]
  },
  disabled: {
    default: gray[100]
  },
  danger: {
    default: red[500],
    hover: red[600],
    secondary: red[200],
    secondaryHover: red[300]
  },
  brand: {
    default: brand[800],
    defaultHover: brand[900],
    secondary: brand[200],
    secondaryHover: brand[300],
    tertiary: brand[100],
    tertiaryHover: brand[200]
  },
  tag: {
    blue: blue[100],
    green: green[100],
    yellow: yellow[100],
    purple: purple[100],
    red: red[100],
    gray: gray[200]
  },
  state: {
    done: green[500],
    progress: yellow[500],
    toDo: gray[500]
  }
}

export const text = {
  default: {
    default: gray[900],
    secondary: gray[500],
    tertiary: gray[400]
  },
  disabled: {
    default: brand[400],
    onDisabled: brand[400]
  },
  danger: {
    default: red[700],
    secondary: red[600],
    tertiary: red[500],
    onDanger: red[100],
    onDangerSecondary: red[700],
    onDangerTertiary: red[700]
  },
  brand: {
    default: brand[800],
    secondary: brand[600],
    tertiary: brand[500],
    onBrand: brand[100],
    onBrandSecondary: brand[900],
    onBrandTertiary: brand[800]
  },
  tag: {
    blue: blue[600],
    green: green[600],
    yellow: yellow[600],
    purple: purple[600],
    red: red[600],
    gray: gray[600]
  }
}

export const border = {
  default: {
    default: gray[300],
    secondary: gray[500],
    tertiary: gray[700]
  },
  disabled: {
    default: brand[400]
  },
  danger: {
    default: red[700]
  },
  brand: {
    default: brand[800],
    secondary: brand[600],
    tertiary: brand[500]
  }
}

export const icon = {
  default: {
    default: gray[900],
    secondary: gray[500],
    tertiary: gray[400]
  },
  disabled: {
    default: brand[400],
    onDisabled: brand[400]
  },
  danger: {
    default: red[700]
  },
  brand: {
    default: brand[800],
    secondary: brand[600],
    tertiary: brand[500],
    onBrand: brand[100],
    onBrandSecondary: brand[900],
    onBrandTertiary: brand[800]
  }
}
