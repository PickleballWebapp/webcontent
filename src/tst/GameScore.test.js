import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserType } from "../models";
import { MemoryRouter } from "react-router-dom";
import PathRoutes from "../Routes";
import { API } from "aws-amplify";
import {act} from "react-test-renderer";

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
      getGame: {},
    },
  });
  render(
    <MemoryRouter initialEntries={["/score/abc"]}>
      <PathRoutes currentUser={adminUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.findByText("Game Score")).toBeInTheDocument();
  });
});

test("GameScore populates game fields properly", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getGame: {
        complete: false,
        team1score: 7,
        team2score: 3,
        player1name: "p1",
        player2name: "p2",
        player3name: "p3",
        player4name: "p4",
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/score/abc"]}>
      <PathRoutes currentUser={playerUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.findByText("p1 & p2")).toBeInTheDocument();
    expect(await screen.findByText("p3 & p4")).toBeInTheDocument();
    expect(await screen.findByText("7 - 3")).toBeInTheDocument();
  });
});

test("Buttons display for active game", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getGame: {
        complete: false,
        team1score: 7,
        team2score: 3,
        player1name: "p1",
        player2name: "p2",
        player3name: "p3",
        player4name: "p4",
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/score/abc"]}>
      <PathRoutes currentUser={adminUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.getAllByText("+1")[0]).toBeInTheDocument();
    expect(await screen.getAllByText("Give Serve")[0]).toBeInTheDocument();
    expect(await screen.getAllByText("-1")[0]).toBeInTheDocument();
  });
});

test("Buttons hide for non-admin", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getGame: {
        complete: false,
        team1score: 7,
        team2score: 3,
        player1name: "p1",
        player2name: "p2",
        player3name: "p3",
        player4name: "p4",
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/score/abc"]}>
      <PathRoutes currentUser={playerUser} />
    </MemoryRouter>
  );
  await waitFor(async () => {
    expect(await screen.queryByText("+1")).not.toBeInTheDocument();
    expect(await screen.queryByText("Give Serve")).not.toBeInTheDocument();
    expect(await screen.queryByText("-1")).not.toBeInTheDocument();
  });
});

test("Give serve", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getGame: {
        complete: false,
        team1score: 7,
        team2score: 3,
        player1name: "p1",
        player2name: "p2",
        player3name: "p3",
        player4name: "p4",
      },
    },
  });
  render(
      <MemoryRouter initialEntries={["/score/abc"]}>
        <PathRoutes currentUser={adminUser} />
      </MemoryRouter>
  );
  await act(async () => {
    fireEvent.click(await screen.getAllByText("Give Serve")[0]);
    fireEvent.click(await screen.getAllByText("Give Serve")[1]);
  });
});

test("Update Score", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getGame: {
        complete: false,
        team1score: 7,
        team2score: 3,
        player1name: "p1",
        player2name: "p2",
        player3name: "p3",
        player4name: "p4",
      },
    },
  });
  render(
      <MemoryRouter initialEntries={["/score/abc"]}>
        <PathRoutes currentUser={adminUser} />
      </MemoryRouter>
  );
  await act(async () => {
    fireEvent.click(await screen.getAllByText("+1")[0]);
    fireEvent.click(await screen.getAllByText("+1")[1]);
    fireEvent.click(await screen.getAllByText("-1")[0]);
    fireEvent.click(await screen.getAllByText("-1")[1]);
  });
});

test("Mark game as complete", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getGame: {
        complete: false,
        team1score: 7,
        team2score: 3,
        player1name: "p1",
        player2name: "p2",
        player3name: "p3",
        player4name: "p4",
      },
    },
  });
  await render(
      <MemoryRouter initialEntries={["/score/abc"]}>
        <PathRoutes currentUser={adminUser} />
      </MemoryRouter>
  );
  await act(async () => {
    fireEvent.click(await screen.getByText("Mark Game as Completed"));
    API.graphql.mockResolvedValueOnce({
      data: {
        getGame: {
          complete: false,
          team1score: 7,
          team2score: 3,
          player1name: "p1",
          player2name: "p2",
          player3name: "p3",
          player4name: "p4",
        },
      },
    });
  });
});

test("Delete Game", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getGame: {
        complete: false,
        team1score: 7,
        team2score: 3,
        player1name: "p1",
        player2name: "p2",
        player3name: "p3",
        player4name: "p4",
      },
    },
  });
  await render(
      <MemoryRouter initialEntries={["/score/abc"]}>
        <PathRoutes currentUser={adminUser} />
      </MemoryRouter>
  );
  await act(async () => {
    fireEvent.click(await screen.getByText("Delete Game"));
    API.graphql.mockResolvedValueOnce({
      data: {
        getGame: {
          complete: false,
          team1score: 7,
          team2score: 3,
          player1name: "p1",
          player2name: "p2",
          player3name: "p3",
          player4name: "p4",
        },
      },
    });
  });
});