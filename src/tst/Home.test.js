import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home from "../Home";

test("Render user's name on landing page", () => {
  let user = {
    name: "Test User",
  };
  render(<Home user={user} />);
  expect(screen.getByRole("heading")).toHaveTextContent("Welcome, Test User!");
});
