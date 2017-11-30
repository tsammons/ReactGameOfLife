import React from "react";

export default function Cell(props) {
  let style = { backgroundColor: 'white' };
  if (props.value)
    style = { backgroundColor: 'black' };

  return (
    <button
      className="cell"
      onClick={props.onClick}
      style={style}
    ></button>
  );
}