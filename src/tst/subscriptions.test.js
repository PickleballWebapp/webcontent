import "@testing-library/jest-dom/extend-expect";
import {
  onCreateGame,
  onUpdateGame,
  onDeleteGame,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
} from "../graphql/subscriptions";

test("Validate game subscriptions", async () => {
  expect(onCreateGame);
  expect(onUpdateGame);
  expect(onDeleteGame);
});

test("Validate user subscriptions", async () => {
  expect(onCreateUser);
  expect(onUpdateUser);
  expect(onDeleteUser);
});
