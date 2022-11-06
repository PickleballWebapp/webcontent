import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserType } from "../models";
import { MemoryRouter } from "react-router-dom";
import PathRoutes from "../Routes";
import { API } from "aws-amplify";

jest.mock("@aws-amplify/api");
let adminUser = {
  name: "Admin",
  type: UserType.ADMIN,
};
let playerUser = {
  name: "Player",
  type: UserType.PLAYER,
};

test("GameScore renders given correct route", async () => {
  API.graphql.mockResolvedValue({
    data: {
      listUsers: {
        items: [],
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/schedule"]}>
      <PathRoutes currentUser={adminUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.findByText("Schedule Games")).toBeInTheDocument();
  });
});

test("GameScore redirects for non-admin", async () => {
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
  render(
    <MemoryRouter initialEntries={["/schedule"]}>
      <PathRoutes currentUser={playerUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.queryByText("Schedule Games")).not.toBeInTheDocument();
  });
});
