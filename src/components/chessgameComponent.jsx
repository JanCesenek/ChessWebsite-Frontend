import { Node, mergeAttributes } from "@tiptap/core";
import React from "react";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import ChessboardPreview from "./chessboardPreview";

const ChessGameComponent = (props) => {
  const game = props.node.attrs.game || {
    moves: [],
    white: "",
    black: "",
    result: "",
    defaultMove: 0,
  };
  return (
    <NodeViewWrapper className="chess-game-node">
      <ChessboardPreview
        moves={game.moves}
        white={game.white}
        black={game.black}
        result={game.result}
        defaultMove={game.defaultMove}
      />
    </NodeViewWrapper>
  );
};

export const ChessGame = Node.create({
  name: "chessGame",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      game: {
        default: {
          moves: [],
          white: "",
          black: "",
          result: "",
          defaultMove: 0,
        },
      },
    };
  },

  renderHTML({ node }) {
    return ["div", { class: "chess-game" }, JSON.stringify(node.attrs.game)];
  },

  parseHTML() {
    return [
      {
        tag: "div.chess-game",
        getAttrs: (dom) => ({
          game: dom.textContent
            ? JSON.parse(dom.textContent)
            : { moves: [], white: "", black: "", result: "", defaultMove: 0 },
        }),
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChessGameComponent);
  },
});
