import { Text } from "@illog/ui";
import { Meta, StoryObj } from "@storybook/react-vite";
import { styles, tokens } from "@illog/themes";
import "@illog/ui/style.css";

const colors = Object.entries(tokens.colors.light.text).reduce(
  (acc, [key, value]) => {
    if (typeof value === "string") {
      acc.push(value);
    } else {
      Object.entries(value).forEach(([subKey, subValue]) => {
        acc.push(`${key}.${subKey}`);
      });
    }
    return acc;
  },
  [] as string[]
);

const meta = {
  component: Text,
  argTypes: {
    as: {
      control: { type: "select" },
      options: ["p", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
    },
    textStyle: {
      control: { type: "select" },
      options: Object.keys(styles.text),
    },
    color: {
      control: { type: "select" },
      options: colors,
    },
    align: {
      control: { type: "select" },
      options: ["left", "center", "right", "justify"],
    },
    padding: {
      control: { type: "select" },
      options: Object.keys(tokens.size.space),
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {};
Primary.args = {
  textStyle: "heading",
  color: "brand.default",
  children: "Hello, world!",
};
