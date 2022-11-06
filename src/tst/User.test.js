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


//todo test change user type
//todo test delete user