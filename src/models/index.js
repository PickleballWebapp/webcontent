// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const UserType = {
  "ADMIN": "ADMIN",
  "SCORER": "SCORER",
  "PLAYER": "PLAYER"
};

const { Game, User } = initSchema(schema);

export {
  Game,
  User,
  UserType
};