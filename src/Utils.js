import { API, Auth, Hub } from "aws-amplify";
import { UserType } from "./models";
import { createUser } from "./graphql/mutations";
import { getUser } from "./graphql/queries";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

/**
 * Creates user account in 'User' table if it doesn't exist.
 */
export const authHooks = () => {
  Hub.listen("auth", async (data) => {
    // Only pay attention to signIn events
    if (data.payload.event !== "signIn") return;

    // Query username in Users table
    const user = await Auth.currentAuthenticatedUser();
    const userData = await API.graphql({
      query: getUser,
      variables: { id: user.username },
    });

    // If user doesn't already exist in table, create it
    if (userData?.data.getUser) return;
    const userDetails = {
      id: user.username,
      name: user.attributes.name,
      email: user.attributes.email,
      wins: 0,
      losses: 0,
      type: UserType.PLAYER,
    };
    API.graphql({ query: createUser, variables: { input: userDetails } });
  });
};

/**
 * Builds graphical display of game information given a list of game data.
 */
export const gameTable = (games) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Status</th>
          <th>Date</th>
          <th>Team 1</th>
          <th>Team 2</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr key={game.id}>
            <td>
              {
                <Link to="/score" state={{ gameId: game.id }}>
                  {game.complete ? "Complete" : "Active"}
                </Link>
              }
            </td>
            <td>{game.date}</td>
            <td>
              {game.player1name} & {game.player2name}
            </td>
            <td>
              {game.player3name} & {game.player4name}
            </td>
            <td>
              {game.team1score} - {game.team2score}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

/**
 * Returns true if user is authenticated to view protected pages (i.e.,
 * returns false if user is not of type ADMIN or SCORER).
 */
export const checkPermissions = async () => {
  const userData = await Auth.currentAuthenticatedUser();
  const response = await API.graphql({
    query: getUser,
    variables: { id: userData?.username },
  });
  return response.data.getUser.type !== UserType.PLAYER;
};
