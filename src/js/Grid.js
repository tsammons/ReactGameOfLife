import React from "react";

import Cell from "./Cell";

export default class Grid extends React.Component {

  render() {
    return (
      <div>
        <table>
          <tbody>
            {this.props.grid.map((row, i) =>
              <tr key={i}>{row.map((cell, j) =>
                <td key={j}>
                  <Cell
                    value={cell}
                    onClick={() => this.props.onClick(i, j)}
                  />
                </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}