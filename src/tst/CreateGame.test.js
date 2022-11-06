import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserType } from "../models";
import { MemoryRouter } from "react-router-dom";
import PathRoutes from "../Routes";
import { API } from "aws-amplify";

jest.mock("@aws-amplify/api");

test("CreateGame renders with route", async () => {
  API.graphql.mockResolvedValue({
    data: {
      listUsers: {
        items: [],
      },
    },
  });
  API.graphql.mockResolvedValue({
    data: {
      listGames: {
        items: [],
      },
    },
  });

  let adminUser = {
    name: "Admin",
    type: UserType.ADMIN,
  };
  render(
    <MemoryRouter initialEntries={["/new"]}>
      <PathRoutes currentUser={adminUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.findByText("Create New Game")).toBeInTheDocument();
  });
});

test("CreateGame redirects for regular player", async () => {
  API.graphql.mockResolvedValue({
    data: {
      listUsers: {
        items: [],
      },
    },
  });
  API.graphql.mockResolvedValue({
    data: {
      listGames: {
        items: [],
      },
    },
  });
  let playerUser = {
    name: "Player",
    type: UserType.PLAYER,
  };
  render(
    <MemoryRouter initialEntries={["/new"]}>
      <PathRoutes currentUser={playerUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.getByRole("heading")).toHaveTextContent("Game Scores");
  });
});

//todo test validation logic
//todo test form content (?)
