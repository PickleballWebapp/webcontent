import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserType } from "../models";
import { MemoryRouter } from "react-router-dom";
import PathRoutes from "../Routes";
import { API } from "aws-amplify";

jest.mock("@aws-amplify/api");
let playerUser = {
  name: "Player",
  type: UserType.PLAYER,
};

test("Scheduling renders given correct route", async () => {
  API.graphql.mockResolvedValue({
    data: {
      listGames: {
        items: [
          {
            date: "2030-01-01",
          },
          {
            date: "2030-01-02",
          },
        ],
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/scheduling"]}>
      <PathRoutes currentUser={playerUser} />
    </MemoryRouter>
  );

  await waitFor(async () => {
    expect(await screen.findByText("Upcoming Games")).toBeInTheDocument();
  });
});
