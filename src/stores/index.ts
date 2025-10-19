import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';

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
  token: string;
  setToken: (t: string) => void;
  config: Record<string, string | undefined>;
  setConfig: (c: Record<string, string | undefined>) => void;
  theme: string;
  setTheme: (t: string) => void;
}

const initialState = {
  token: '',
  config: {},
  theme: '#987123',
};

export const useCaches = create<States>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setToken: token => set({token}),
        setConfig: config => set({config}),
        setTheme: theme => set({theme}),
      }),
      {
        storage: createJSONStorage(() => mmkvStorage),
        name: 'useCaches.ts',
        /** 白名单 */
        partialize: state => ({
          token: state.token,
        }),
      },
    ),
  ),
);
