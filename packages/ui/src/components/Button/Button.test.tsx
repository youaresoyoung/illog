import { describe, it } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./Button";

describe("Button", () => {
  it("should render with default props", () => {
    render(<Button variant="primary">Click Me</Button>);
  });
});
