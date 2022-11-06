import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserType } from "../models";
import { MemoryRouter } from "react-router-dom";
import PathRoutes from "../Routes";
import { API } from "aws-amplify";

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
