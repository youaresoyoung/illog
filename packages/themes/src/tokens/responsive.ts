import { primitive } from './typography/primitive'

export const responsive = {
  mobile: {
    width: 375,
    rootFontSize: primitive.scale[3],
    scale: 1.25
  },
  tablet: {
    width: 768,
    rootFontSize: primitive.scale[3],
    scale: 1
  },
  desktop: {
    width: 1200,
    rootFontSize: primitive.scale[3],
    scale: 1
  }
}
