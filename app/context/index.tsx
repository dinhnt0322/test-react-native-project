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
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>> | null;
}>({
  users: null,
  setUsers: null,
  searchKey: '',
  setSearchKey: null,
});
