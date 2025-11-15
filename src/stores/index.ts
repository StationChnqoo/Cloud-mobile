import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';
import {Category, CategorySchema, User, UserSchema} from '@src/constants/t';

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
}

const initialState = {
  user: UserSchema.parse({}),
  token: '',
  theme: '#987123',
  category: CategorySchema.parse({}),
  cared:
    '1.511520,1.513100,0.159567,1.513020,1.520600,0.159329,100.NDX,0.300996'.split(
      ',',
    ),
  global: ['1.000001', '0.399006', '1.000300', '100.N225'],
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
      }),
      {
        storage: createJSONStorage(() => mmkvStorage),
        name: 'useCaches.ts',
        /** 白名单 */
        partialize: state => ({
          token: state.token,
          holdFundCodes: state.holdFundCodes,
        }),
      },
    ),
  ),
);
