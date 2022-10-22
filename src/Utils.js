import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

/**
 * Builds graphical display of game information given a list of game data.
 */
export const gameTable = (games, showNewGameRow = false) => {
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
                <Link to={`/score/${game?.id}`}>
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
