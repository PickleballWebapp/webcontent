import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NavigationBar from "../NavigationBar";
import { UserType } from "../models";
import { MemoryRouter } from "react-router-dom";

test("Renders the navbar as an admin", async () => {
  let adminUser = {
    name: "Admin",
    type: UserType.ADMIN,
  };
  render(
    <MemoryRouter initialEntries={["/"]}>
      <NavigationBar user={adminUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(screen.queryByText("Admin")).toBeInTheDocument();
  });
});

test("Renders the navbar as a scorer", async () => {
  let scorerUser = {
    name: "Scorer",
    type: UserType.SCORER,
  };
  render(
    <MemoryRouter initialEntries={["/"]}>
      <NavigationBar user={scorerUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });
});

test("Renders the navbar as a player", async () => {
  let playerUser = {
    name: "Player",
    type: UserType.PLAYER,
  };
  render(
    <MemoryRouter initialEntries={["/"]}>
      <NavigationBar user={playerUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });
});

test("Navbar renders even on unknown page", async () => {
  let playerUser = {
    name: "Player",
    type: UserType.PLAYER,
  };
  render(
    <MemoryRouter initialEntries={["/fakepage"]}>
      <NavigationBar user={playerUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.queryByText("Vandy Pickleball")).toBeInTheDocument();
  });
});
