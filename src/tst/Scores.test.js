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

test("Scores renders given correct route", async () => {
    API.graphql.mockResolvedValue({
        data: {
            listGames: {
                items: [],
            },
        },
    });
    render(
        <MemoryRouter initialEntries={["/scores"]}>
            <PathRoutes currentUser={playerUser} />
        </MemoryRouter>
    );
    await waitFor(async () => {
        expect(await screen.findByText("Game Scores")).toBeInTheDocument();
    });
});

test("New game button appears for admin", async () => {
    API.graphql.mockResolvedValue({
        data: {
            listGames: {
                items: [],
            },
        },
    });
    render(
        <MemoryRouter initialEntries={["/scores"]}>
            <PathRoutes currentUser={adminUser} />
        </MemoryRouter>
    );
    await waitFor(async () => {
        expect(await screen.findByText("Start New Game")).toBeInTheDocument();
    });
});

test("New game button hidden for non-admin", async () => {
    API.graphql.mockResolvedValue({
        data: {
            listGames: {
                items: [],
            },
        },
    });
    render(
        <MemoryRouter initialEntries={["/scores"]}>
            <PathRoutes currentUser={playerUser} />
        </MemoryRouter>
    );
    await waitFor(async () => {
        expect(await screen.queryByText("Start New Game")).not.toBeInTheDocument();
    });
});