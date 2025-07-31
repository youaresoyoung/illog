import { black } from "../../tokens/colors/primitive";
import { blur } from "../../tokens/size/blur";
import { depth } from "../../tokens/size/depth";

export const dropShadow = {
  100: [
    {
      position: {
        x: depth[0],
        y: depth[25],
      },
      blur: blur[100],
      spread: 0,
      color: black[100],
    },
  ],
  200: [
    {
      position: {
        x: depth[0],
        y: depth[25],
      },
      blur: blur[100],
      spread: 0,
      color: black[100],
    },
    {
      position: {
        x: depth[0],
        y: depth[25],
      },
      blur: blur[100],
      spread: 0,
      color: black[100],
    },
  ],
  300: [
    {
      position: {
        x: depth[0],
        y: depth[100],
      },
      blur: blur[100],
      spread: depth["negative025"],
      color: black[200],
    },
    {
      position: {
        x: depth[0],
        y: depth[100],
      },
      blur: blur[100],
      spread: depth["negative025"],
      color: black[100],
    },
  ],
  400: [
    {
      position: {
        x: depth[0],
        y: depth[400],
      },
      blur: depth[800],
      spread: depth["negative100"],
      color: black[200],
    },
    {
      position: {
        x: depth[0],
        y: depth[100],
      },
      blur: blur[100],
      spread: depth["negative100"],
      color: black[100],
    },
  ],
  500: [
    {
      position: {
        x: depth[0],
        y: depth[400],
      },
      blur: depth[400],
      spread: depth["negative200"],
      color: black[200],
    },
    {
      position: {
        x: depth[0],
        y: depth[100],
      },
      blur: blur[100],
      spread: depth["negative100"],
      color: black[100],
    },
  ],
  600: [
    {
      position: {
        x: depth[0],
        y: depth[400],
      },
      blur: depth[800],
      spread: depth["negative200"],
      color: black[400],
    },
  ],
};
