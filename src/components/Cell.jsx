import React from 'react';

export const CELL_SIZE = 20;

export function Cell(props) {
    const { x, y } = props;
    return (
        <div  style={{
            left: `${CELL_SIZE * x + 1}px`,
            top: `${CELL_SIZE * y + 1}px`,
            width: `${CELL_SIZE - 1}px`,
            height: `${CELL_SIZE - 1}px`,
            background: "#ccc",
            position: "absolute",
            }} />
    );
}