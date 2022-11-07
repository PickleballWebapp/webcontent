import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserType } from "../models";
import { MemoryRouter } from "react-router-dom";
import PathRoutes from "../Routes";
import { API } from "aws-amplify";
import { act } from "react-test-renderer";

jest.mock("@aws-amplify/api");
let adminUser = {
  name: "Admin",
  type: UserType.ADMIN,
};
let playerUser = {
  name: "Player",
  type: UserType.PLAYER,
};

test("User renders given correct route", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getUser: {},
    },
  });
  render(
    <MemoryRouter initialEntries={["/user/abc"]}>
      <PathRoutes currentUser={playerUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.findByText("Player Profile")).toBeInTheDocument();
  });
});

test("Populates user data", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getUser: {
        id: "abc",
        games: [],
        email: "test@test.com",
        wins: "1",
        losses: "1",
        type: "ADMIN",
        name: "Test User",
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/user/abc"]}>
      <PathRoutes currentUser={adminUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.queryByText("Test User")).toBeInTheDocument();
    expect(await screen.queryByText("test@test.com")).toBeInTheDocument();
    expect(await screen.queryByText("ADMIN")).toBeInTheDocument();
  });
});

test("Handles user type change", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getUser: {
        id: "abc",
        games: [],
        email: "test@test.com",
        wins: "1",
        losses: "1",
        type: "ADMIN",
        name: "Test User",
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/user/abc"]}>
      <PathRoutes currentUser={adminUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId("change-user"));
    API.graphql.mockResolvedValue({
      data: {
        updateUser: {
          id: "abc",
          games: [],
          email: "test@test.com",
          wins: "1",
          losses: "1",
          type: "PLAYER",
          name: "Test User",
        },
      },
    });
    fireEvent.click(screen.getByText("Confirm Change"));
    expect(await screen.queryByText("PLAYER")).toBeInTheDocument();
  });
});

test("Handles user deletion", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getUser: {
        id: "abc",
        games: [],
        email: "test@test.com",
        wins: "1",
        losses: "1",
        type: "ADMIN",
        name: "Test User",
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/user/abc"]}>
      <PathRoutes currentUser={adminUser} />
    </MemoryRouter>
  );

  await act(async () => {
    API.graphql.mockResolvedValue({
      data: {
        deleteUser: {},
      },
    });
    fireEvent.click(screen.getByTestId("delete-user"));
    API.graphql.mockResolvedValue({
      data: {
        listUsers: {
          items: [],
        },
      },
    });
    API.graphql.mockResolvedValue({
      data: {
        deleteUser: {},
      },
    });
    API.graphql.mockResolvedValue({
      data: {
        listUsers: {
          items: [],
        },
      },
    });
    fireEvent.click(screen.getByTestId("delete-user"));
  });
  await act(async () => {
    setTimeout(async () => {
      fireEvent.click(screen.getByText("Confirm Deletion"));
      expect(await screen.getByText("Rankings")).toBeInTheDocument();
    }, 100);
  });
});
