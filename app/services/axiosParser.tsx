import {get, map} from 'lodash';
export const parseNationInfo = (rawNations: any) => {
  return map(rawNations, item => ({
    id: get(item, 'cca3', ''),
    name: get(item, 'name.common', ''),
    flag: get(item, 'flag', ''),
  }));
};
