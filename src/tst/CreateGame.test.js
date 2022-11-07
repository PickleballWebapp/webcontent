import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { UserType } from "../models";
import { MemoryRouter } from "react-router-dom";
import PathRoutes from "../Routes";
import { API } from "aws-amplify";
import { addGameToProfile } from "../Utils";

jest.mock("@aws-amplify/api");
jest.mock("../Utils");

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

test("Ensures all 4 players are unique", async () => {
  API.graphql.mockResolvedValue({
    data: {
      listUsers: {
        items: [
          { id: "user1", name: "user1" },
          { id: "user2", name: "user2" },
          { id: "user3", name: "user3" },
          { id: "user4", name: "user4" },
        ],
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
    userEvent.selectOptions(screen.getByLabelText("Player 1"), ["user1"]);
    userEvent.selectOptions(screen.getByLabelText("Player 2"), ["user2"]);
    userEvent.selectOptions(screen.getByLabelText("Player 3"), ["user3"]);
    userEvent.selectOptions(screen.getByLabelText("Player 4"), ["user1"]);
    fireEvent.change(screen.queryByPlaceholderText("yyyy-MM-dd"), {
      target: { value: "2022-11-07" },
    });
    fireEvent.click(screen.getByText("Submit"));
    expect(
      await screen.queryByText(
        "All four players must be unique. Please correct."
      )
    ).toBeInTheDocument();
  });
});

test("Validates date format", async () => {
  API.graphql.mockResolvedValue({
    data: {
      listUsers: {
        items: [
          { id: "user1", name: "user1" },
          { id: "user2", name: "user2" },
          { id: "user3", name: "user3" },
          { id: "user4", name: "user4" },
        ],
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
    userEvent.selectOptions(screen.getByLabelText("Player 1"), ["user1"]);
    userEvent.selectOptions(screen.getByLabelText("Player 2"), ["user2"]);
    userEvent.selectOptions(screen.getByLabelText("Player 3"), ["user3"]);
    userEvent.selectOptions(screen.getByLabelText("Player 4"), ["user4"]);
    fireEvent.change(screen.queryByPlaceholderText("yyyy-MM-dd"), {
      target: { value: "2022-11-abc" },
    });
    fireEvent.click(screen.getByText("Submit"));
    expect(
      await screen.queryByText(
        "Date must be in the form YYYY-MM-DD. Please correct."
      )
    ).toBeInTheDocument();
  });
});

test("Starts game", async () => {
  API.graphql.mockResolvedValue({
    data: {
      listUsers: {
        items: [
          { id: "user1", name: "user1" },
          { id: "user2", name: "user2" },
          { id: "user3", name: "user3" },
          { id: "user4", name: "user4" },
        ],
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

  API.graphql.mockResolvedValue({
    data: {
      createGame: {
        id: "abc",
      },
    },
  });

  await waitFor(async () => {
    userEvent.selectOptions(await screen.findByLabelText("Player 1"), [
      "user1",
    ]);
    userEvent.selectOptions(await screen.findByLabelText("Player 2"), [
      "user2",
    ]);
    userEvent.selectOptions(await screen.findByLabelText("Player 3"), [
      "user3",
    ]);
    userEvent.selectOptions(await screen.findByLabelText("Player 4"), [
      "user4",
    ]);
    fireEvent.click(screen.getByLabelText("calendar"));
    fireEvent.click(screen.getByText("17"));
    fireEvent.click(screen.getByText("Submit"));
    addGameToProfile.mockResolvedValue(true);
  });
});