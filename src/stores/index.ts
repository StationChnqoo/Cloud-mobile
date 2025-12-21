import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';
import {Category, CategorySchema, User, UserSchema} from '@src/constants/t';
import _ from 'lodash';

// const mmkv = new MMKV({
//   id: 'useMMKV',
//   encryptionKey: 'net.cctv3.iCloud',
// });

const mmkv = new MMKV();
const mmkvStorage: StateStorage = {
  setItem: (key, value) => mmkv.set(key, value),
  getItem: key => mmkv.getString(key) || null,
  removeItem: key => mmkv.delete(key),
};

interface States {
  user: User;
  setUser: (u: User) => void;
  token: string;
  setToken: (t: string) => void;
  theme: string;
  setTheme: (t: string) => void;
  category: Category;
  setCategory: (c: Category) => void;
  cared: string[];
  setCared: (c: string[]) => void;
  global: string[];
  setGlobal: (g: string[]) => void;
  holdFundCodes: string[];
  setHoldFundCodes: (h: string[]) => void;
  reset: () => void;
}

const defaultCared = ['0.159659', '1.513500', '1.513880'];
const defaultGlobal = [
  '0.159659',
  '1.513500',
  '1.513880',
  '100.N225',
  '100.VNINDEX',
  '100.SPX',
  '100.NDX',
];
const initialState = {
  user: UserSchema.parse({}),
  token: '',
  theme: '#987123',
  category: CategorySchema.parse({}),
  cared: _.cloneDeep(defaultCared),
  global: _.cloneDeep(defaultGlobal),
  holdFundCodes:
    `BK1040,BK1041,BK0727,BK1044,BK1031,BK0433,BK0438,BK0437`.split(','),
};

export const useCaches = create<States>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setToken: token => set({token}),
        setTheme: theme => set({theme}),
        setCategory: category => set({category}),
        setCared: cared => set({cared}),
        setGlobal: global => set({global}),
        setHoldFundCodes: holdFundCodes => set({holdFundCodes}),
        setUser: user => set({user}),
        reset: () => set({...initialState}),
      }),
      {
        storage: createJSONStorage(() => mmkvStorage),
        name: 'useCaches.ts',
        /** 白名单 */
        partialize: state => ({
          token: state.token,
          holdFundCodes: state.holdFundCodes,
          cared: state.cared,
        }),
      },
    ),
  ),
);
