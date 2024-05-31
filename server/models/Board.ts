import { Schema, model, Types } from "mongoose";
import type { Document } from "mongoose";
import { ListDocument } from "./List";

export interface BoardDocument extends Document {
  _id: string;
  name: string;
  lists: string[] | ListDocument[];
  owner: string;
  coverImage: string;
}

const boardSchema = new Schema(
  {
    name: {
      type: String,
      default: "Untitled Board",
    },
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "List",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    coverImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Board = model<BoardDocument>("Board", boardSchema);
