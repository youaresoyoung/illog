import { styleVariants } from "@vanilla-extract/css";
import { styles } from "packages/themes/dist";

export const textVariants = styleVariants({
  title: styles.text.title,
  subtitle: styles.text.subtitle,
  heading: styles.text.heading,
  subheading: styles.text.subheading,
  bodyBase: styles.text.bodyBase,
  bodyStrong: styles.text.bodyStrong,
  bodySmall: styles.text.bodySmall,
  bodySmallStrong: styles.text.bodySmallStrong,
  caption: styles.text.caption,
  captionStrong: styles.text.captionStrong,
  singleLineBodyBase: styles.text.singleLine.bodyBase,
  singleLineBodyStrong: styles.text.singleLine.caption,
});

export type textStyle = keyof typeof textVariants;
