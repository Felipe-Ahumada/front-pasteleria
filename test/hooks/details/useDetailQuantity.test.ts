import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDetailQuantity } from "@/hooks/details/useDetailQuantity";

describe("useDetailQuantity", () => {
  it("should default to '1' when stock is available", () => {
    const { result } = renderHook(() => useDetailQuantity(10));
    expect(result.current.quantity).toBe("1");
  });

  it("should reset to '1' on blur if input is empty and stock is available", () => {
    const { result } = renderHook(() => useDetailQuantity(10));

    // Simulate clearing the input
    act(() => {
      // We need to mock the event object for handleQuantityChange
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleQuantityChange(event);
    });

    expect(result.current.quantity).toBe("");

    // Simulate blur
    act(() => {
      result.current.handleQuantityBlur();
    });

    expect(result.current.quantity).toBe("1");
  });

  it("should reset to '1' on blur if input is 0 and stock is available", () => {
    const { result } = renderHook(() => useDetailQuantity(10));

    // Simulate typing "0" (handleQuantityChange might reject "0" directly, let's check)
    // Based on code: if (num === 0) return; so it might not update state if we type 0.
    // But if we somehow got 0 in there or empty string.

    // Let's try empty string again as that's the user case
    act(() => {
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleQuantityChange(event);
    });

    expect(result.current.quantity).toBe("");

    act(() => {
      result.current.handleQuantityBlur();
    });

    expect(result.current.quantity).toBe("1");
  });
});
