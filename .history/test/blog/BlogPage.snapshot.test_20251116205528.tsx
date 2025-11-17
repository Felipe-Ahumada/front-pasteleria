// tests/BlogPage.snapshot.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import BlogPage from "@/pages/blog/BlogPage";
import { MemoryRouter } from "react-router-dom";
import { BlogProvider } from "@/context/blog/BlogProvider";

describe("BlogPage – Snapshot", () => {
  it("renderiza correctamente la vista del blog", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <BlogProvider>
          <BlogPage />
        </BlogProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
