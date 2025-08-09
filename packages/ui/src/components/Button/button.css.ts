import { recipe } from "@vanilla-extract/recipes";
import { styles, tokens } from "@illog/themes";

const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: tokens.size.radius[200],
  cursor: "pointer",
  border: "none",
  textDecoration: "none",
  backgroundColor: "transparent",
  color: tokens.colors.light.text.default.default,
  appearance: "none" as const,
  transition: "all 0.2s ease-in-out",
  ...styles.text.singleLine.bodyBase,
};

export const buttonRecipe = recipe({
  base: buttonBase,
  variants: {
    size: {
      sm: {},
      md: { padding: tokens.size.space[300], height: "2.5rem" },
      lg: {},
    },
    variant: {
      primary: {
        color: tokens.colors.light.text.brand.onBrand,
        border: `${tokens.size.stroke.border}px solid ${tokens.colors.light.border.brand.default}`,
        backgroundColor: tokens.colors.light.background.brand.default,

        ":hover": {
          color: tokens.colors.light.text.brand.onBrand,
          backgroundColor: tokens.colors.light.background.brand.defaultHover,
        },
        ":disabled": {
          cursor: "default",
          color: tokens.colors.light.text.disabled.default,
          backgroundColor: tokens.colors.light.background.disabled.default,
          borderColor: tokens.colors.light.border.disabled.default,
        },
      },
    },
    isFullWidth: {
      true: {
        width: "100%",
      },
      false: {
        width: "auto",
      },
    },
  },
});
