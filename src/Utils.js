import { Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {API} from "aws-amplify";
import {getUser} from "./graphql/queries";
import {updateUser} from "./graphql/mutations";

/**
 * Builds graphical display of game information given a list of game data.
 */
export const GameTable = (games, showNewGameRow = false) => {
  let navigate = useNavigate();
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
          <tr
            key={game.id}
            onClick={() => navigate(`/score/${game?.id}`)}
            style={{ cursor: "pointer" }}
          >
            <td>
              <strong>{game.complete ? "Complete" : "Active"}</strong>
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
        {showNewGameRow && (
          <tr key="newGame">
            <td colSpan={5} className="text-center">
              <Link to="/new">Start New Game</Link>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

/**
 * Determines win rate given wins and losses.
 */
export const winRate = (wins, losses) => {
  if (wins === undefined || wins === 0) return (0).toFixed(1);
  return ((wins / (wins + losses)) * 100).toFixed(1);
};

/**
 * Determines which of two users has a higher win rate.
 */
export const comparator = (usera, userb) => {
  return winRate(userb.wins, userb.losses) - winRate(usera.wins, usera.losses);
};

/**
 * Add a game ID to a player's profile.
 */
export async function addGameToProfile(username, gameId) {
    const userData = await API.graphql({
        query: getUser,
        variables: { id: username },
    });
    const userDetails = {
        id: username,
        games: userData.data.getUser.games
            ? [...userData.data.getUser.games, gameId]
            : gameId,
    };
    console.log(`adding game ${gameId} to ${username}`);
    API.graphql({ query: updateUser, variables: { input: userDetails } }).catch(
        (err) => console.log(err)
    );
}