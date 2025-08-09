import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./Button";
import { userEvent } from "@vitest/browser/context";
import { createRef } from "react";

// TODO: Add more tests for different variants, sizes, and states
describe("Button", () => {
  it("renders children correctly", () => {
    const { getByRole } = render(<Button variant="primary">Click</Button>);

    expect(getByRole("button")).toHaveTextContent("Click");
  });

  it("applies correct variant and size classes", () => {
    const { getByRole } = render(
      <Button variant="primary" size="md">
        Click
      </Button>
    );

    const button = getByRole("button");
    expect(button).toHaveClass(/variant_primary/);
    expect(button).toHaveClass(/size_md/);
  });

  it("adds custom className", () => {
    const { getByRole } = render(
      <Button variant="primary" className="custom-class">
        Click
      </Button>
    );

    expect(getByRole("button")).toHaveClass("custom-class");
  });

  it("sets disabled when isDisabled prop is true", () => {
    const { getByRole } = render(
      <Button variant="primary" isDisabled>
        Click
      </Button>
    );

    expect(getByRole("button")).toBeDisabled();
  });

  it("applies full width class when isFullWidth is true", () => {
    const { getByRole } = render(
      <Button variant="primary" isFullWidth>
        Full Width Button
      </Button>
    );

    const button = getByRole("button");
    expect(button).toHaveClass(/isFullWidth_true/);
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { getByRole } = render(
      <Button variant="primary" onClick={handleClick}>
        Click
      </Button>
    );

    await user.click(getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("sets aria-label when provided", () => {
    const { getByRole } = render(
      <Button variant="primary" ariaLabel="test-button">
        Click
      </Button>
    );

    expect(getByRole("button")).toHaveAttribute("aria-label", "test-button");
  });

  it("spreads rest props to the button element", () => {
    const { getByTestId } = render(
      <Button variant="primary" data-testid="test-button">
        Click
      </Button>
    );

    expect(getByTestId("test-button")).toBeInTheDocument();
  });

  it("forwards ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button variant="primary" ref={ref}>
        Click
      </Button>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Click");
  });
});
