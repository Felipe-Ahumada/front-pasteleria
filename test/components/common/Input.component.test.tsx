// tests/Input.component.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/common";

describe("Input – componente UI", () => {
  it("renderiza con placeholder", () => {
    render(<Input placeholder="Correo" />);
    const input = screen.getByPlaceholderText("Correo");
    expect(input).toBeTruthy();
  });
});
