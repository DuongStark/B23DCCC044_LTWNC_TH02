import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

describe("ThemeContext", () => {
  it("đổi sáng/tối qua nút giao diện", () => {
    function Toggle() {
      const { theme, toggleTheme } = useTheme();
      return <button onClick={toggleTheme}>{theme}</button>;
    }
    render(
      <ThemeProvider>
        <Toggle />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "light" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    fireEvent.click(screen.getByRole("button", { name: "dark" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });
});
