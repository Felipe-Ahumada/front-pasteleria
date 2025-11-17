import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Button from "@/components/common/Button";

describe("Button – Disabled Behavior", () => {
  it("no ejecuta onClick cuando está deshabilitado", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button
        as="button"
        variant="mint"
        disabled
        onClick={handleClick}
      >
        Comprar
      </Button>
    );

    const button = screen.getByRole("button", { name: /comprar/i });

    // Debe estar deshabilitado
    expect(button).toBeDisabled();

    // Clases correctas
    expect(button.className).toContain("btn");
    expect(button.className).toContain("btn-mint");

    // Click NO debe ejecutarse
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
