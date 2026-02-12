import { primitive } from './primitive'

export const typography = {
  title: {
    fontFamily: primitive.family.sans,
    small: primitive.scale[7],
    base: primitive.scale[8],
    large: primitive.scale[9],
    fontWeight: primitive.weight.bold
  },
  subtitle: {
    fontFamily: primitive.family.sans,
    base: primitive.scale[6],
    large: primitive.scale[7],
    small: primitive.scale[5],
    fontWeight: primitive.weight.semiBold
  },
  heading: {
    fontFamily: primitive.family.sans,
    small: primitive.scale[4],
    base: primitive.scale[5],
    large: primitive.scale[6],
    fontWeight: primitive.weight.semiBold
  },
  subheading: {
    fontFamily: primitive.family.sans,
    small: primitive.scale[3],
    medium: primitive.scale[4],
    large: primitive.scale[5],
    fontWeight: primitive.weight.regular
  },
  body: {
    fontFamily: primitive.family.sans,
    small: primitive.scale[2],
    base: primitive.scale[3],
    large: primitive.scale[4],
    fontWeightRegular: primitive.weight.regular,
    fontWeightStrong: primitive.weight.semiBold
  },
  caption: {
    fontFamily: primitive.family.sans,
    small: primitive.scale[1],
    fontWeightRegular: primitive.weight.regular,
    fontWeightStrong: primitive.weight.semiBold
  }
}
