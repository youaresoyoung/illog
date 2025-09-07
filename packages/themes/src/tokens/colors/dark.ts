import { blue, brand, gray, green, purple, red, white, yellow } from './primitive'

export const background = {
  default: {
    default: gray[900],
    defaultHover: gray[700],
    secondary: gray[800],
    secondaryHover: gray[900],
    tertiary: gray[600],
    tertiaryHover: gray[700]
  },
  disabled: {
    default: gray[700]
  },
  danger: {
    default: red[600],
    hover: red[700],
    secondary: red[800],
    secondaryHover: red[900]
  },
  brand: {
    default: brand[100],
    defaultHover: brand[300],
    secondary: brand[600],
    secondaryHover: brand[500],
    tertiary: brand[600],
    tertiaryHover: brand[800]
  },
  tag: {
    blue: white[1000],
    green: white[1000],
    yellow: gray[900],
    purple: white[1000],
    red: white[1000],
    gray: gray[900]
  },
  state: {
    done: blue[400],
    progress: green[400],
    toDo: yellow[400]
  }
}

export const text = {
  default: {
    default: white[1000],
    secondary: white[500],
    tertiary: white[400]
  },
  disabled: {
    default: brand[500],
    onDisabled: brand[400]
  },
  danger: {
    default: red[200],
    secondary: red[400],
    tertiary: red[500],
    onDanger: red[100],
    onDangerSecondary: red[100],
    onDangerTertiary: red[100]
  },
  brand: {
    default: brand[100],
    onBrand: brand[900],
    secondary: brand[300],
    onBrandSecondary: brand[100],
    tertiary: brand[400],
    onBrandTertiary: brand[100]
  },
  tag: {
    blue: white[1000],
    green: white[1000],
    yellow: gray[900],
    purple: white[1000],
    red: white[100],
    gray: white[1000]
  }
}

export const border = {
  default: {
    default: gray[600],
    secondary: gray[500],
    tertiary: gray[400]
  },
  disabled: {
    default: brand[600]
  },
  danger: {
    default: red[200]
  },
  brand: {
    default: brand[100],
    secondary: brand[300],
    tertiary: brand[400]
  }
}

export const icon = {
  default: {
    default: white[1000],
    secondary: white[500],
    tertiary: white[400]
  },
  disabled: {
    default: brand[500],
    onDisabled: brand[400]
  },
  danger: {
    default: red[200]
  },
  brand: {
    default: brand[100],
    secondary: brand[300],
    tertiary: brand[400],
    onBrand: brand[900],
    onBrandSecondary: brand[100],
    onBrandTertiary: brand[100]
  }
}
