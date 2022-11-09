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

test("Add rows to table", async () => {
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
  await act(async () => {
    fireEvent.click(await screen.getByText("Add Team"));
  });
  await act(async () => {
    fireEvent.click(await screen.getByText("Add Team"));
  });
  await act(async () => {
    fireEvent.click(await screen.getByText("Add Team"));
  });
  expect(await screen.findByText("3")).toBeInTheDocument();
});

test("Delete rows from table", async () => {
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
  await act(async () => {
    fireEvent.click(await screen.getByText("Add Team"));
  });
  await act(async () => {
    fireEvent.click(await screen.findByText("1"));
  });
  expect(await screen.queryByText("1")).not.toBeInTheDocument();
});

test("Validates at least two rows exist", async () => {
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
  await act(async () => {
    fireEvent.click(await screen.getByText("Submit"));
  });
  expect(
    await screen.queryByText(
      "There must be at least 2 teams to schedule a round robin."
    )
  ).toBeInTheDocument();
});

test("Validates each team is full", async () => {
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
  await act(async () => {
    fireEvent.click(await screen.findByText("Add Team"));
  });
  await act(async () => {
    fireEvent.click(await screen.findByText("Add Team"));
  });
  await act(async () => {
    fireEvent.click(await screen.getByText("Submit"));
  });
  await waitFor(async () => {
    expect(
      await screen.queryByText("Each team must have 2 players.")
    ).toBeInTheDocument();
  });
});

test("Populates user list", async () => {
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
  await waitFor(() => {
    render(
        <MemoryRouter initialEntries={["/schedule"]}>
          <PathRoutes currentUser={adminUser} />
        </MemoryRouter>
    )
  });
  await waitFor(() => {
    expect(screen.getByText("Schedule Games")).toBeInTheDocument();
  })
});
