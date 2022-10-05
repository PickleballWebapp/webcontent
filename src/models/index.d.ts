import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export enum UserType {
  ADMIN = "ADMIN",
  SCORER = "SCORER",
  PLAYER = "PLAYER"
}

type GameMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Game {
  readonly id: string;
  readonly date?: string | null;
  readonly complete?: boolean | null;
  readonly player1?: string | null;
  readonly player2?: string | null;
  readonly player3?: string | null;
  readonly player4?: string | null;
  readonly server?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Game, GameMetaData>);
  static copyOf(source: Game, mutator: (draft: MutableModel<Game, GameMetaData>) => MutableModel<Game, GameMetaData> | void): Game;
}

export declare class User {
  readonly id: string;
  readonly first: string;
  readonly last: string;
  readonly wins: number;
  readonly losses: number;
  readonly games?: (string | null)[] | null;
  readonly email?: string | null;
  readonly type?: UserType | keyof typeof UserType | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}