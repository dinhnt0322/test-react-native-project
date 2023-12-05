import {createContext} from 'react';

export type UserInfo = {
  id: string;
  fullName: string;
  birthDay: number;
  nation: string;
};
export const UserInputContext = createContext<{
  users: UserInfo[] | null;
  setUsers: React.Dispatch<React.SetStateAction<UserInfo[]>> | null;
}>({
  users: null,
  setUsers: null,
});
