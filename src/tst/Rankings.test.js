import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserType } from "../models";
import { MemoryRouter } from "react-router-dom";
import PathRoutes from "../Routes";
import { API } from "aws-amplify";
import { act } from "react-test-renderer";

jest.mock("@aws-amplify/api");
let user = {
  name: "User",
  type: UserType.PLAYER,
};

test("Rankings renders given correct route", async () => {
  API.graphql.mockResolvedValue({
    data: {
      listUsers: {
        items: [],
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/rankings"]}>
      <PathRoutes currentUser={user} />
    </MemoryRouter>
  );

  await waitFor(async () => {
    expect(await screen.findByText("Rankings")).toBeInTheDocument();
  });
});

test("Click user profile", async () => {
  API.graphql.mockResolvedValue({
    data: {
      listUsers: {
        items: [
          {
            id: "123",
            name: "Test user",
            wins: 0,
            losses: 0,
          },
        ],
      },
    },
  });


  render(
      <MemoryRouter initialEntries={["/rankings"]}>
        <PathRoutes currentUser={user} />
      </MemoryRouter>
  );


  await waitFor(async () => {
    API.graphql.mockResolvedValue({
      data: {
        getUser: {
          items: [],
        },
      },
    });
    fireEvent.click(await screen.getByText("Test user"));
  });
  await act(async () => {
    expect(await screen.findByText("Player Profile")).toBeInTheDocument();
  });
});
