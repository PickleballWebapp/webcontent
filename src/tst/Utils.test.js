import "@testing-library/jest-dom/extend-expect";
import { API } from "aws-amplify";
import {addGameToProfile, comparator} from "../Utils";

jest.mock("@aws-amplify/api");

test("Test Comparator", async () => {
  const usera = {
    wins: 2,
    losses: 0,
  };
  const userb = {
    wins: 0,
    losses: 1,
  };
  expect(comparator(usera, userb)).toBe(-100);
  expect(comparator(userb, usera)).toBe(100);
});

test("Add game to profile", async () => {
  API.graphql.mockResolvedValue({
    data: {
      getUser: {
          games: []
      },
    },
  });
  await addGameToProfile("abc", "123");
});
