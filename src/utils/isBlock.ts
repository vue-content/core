import { Block } from "../plugin/ContentSource";

export const isBlock = (block: Block | {}): block is Block => typeof block === "object" && Object.keys(block).length > 0