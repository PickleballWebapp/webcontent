import { Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { getUser } from "./graphql/queries";
import { updateUser } from "./graphql/mutations";

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
  API.graphql({ query: updateUser, variables: { input: userDetails } }).catch(
    (err) => console.log(err)
  );
}

/**
 * Generate a round robin tournament of form:
 * tournament[ROUND_#][GAME_#], with each game containing {team1: "TEAM1", team2: "TEAM2"}
 * So to get the second team of second game of the second round of the tournament:
 * game2Team2 = tourney[1][1].team2;
 * */
export const genRoundRobin = (arr) => {
  let teams = [...arr];

  // add "BYE" if needed
  if (teams.length % 2 === 1) {
    teams.push(null);
  }

  const teamCount = teams.length;
  const rounds = teamCount - 1;
  const half = teamCount / 2;

  const tournamentPairings = [];

  // get indices so we can iter through our teams
  const teamIndexes = teams.map((_, i) => i).slice(1);

  for (let round = 0; round < rounds; round++) {
    const roundPairings = [];

    const newteamIndexes = [0].concat(teamIndexes);

    // get indices for first teams 1 and 2 this round
    const firstHalf = newteamIndexes.slice(0, half);
    const secondHalf = newteamIndexes.slice(half, teamCount).reverse();

    // pair our teams up and push as games
    for (let i = 0; i < firstHalf.length; i++) {
      roundPairings.push({
        team1: teams[firstHalf[i]],
        team2: teams[secondHalf[i]],
      });
    }

    // rotating the array to prepare for next round
    teamIndexes.push(teamIndexes.shift());
    tournamentPairings.push(roundPairings);
  }

  return tournamentPairings;
};
