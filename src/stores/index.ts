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
  password: string;
  setPassword: (p: string) => void;
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
  yahoo: {
    cookies: string;
    crumb: string;
  };
  setYahoo: (y: {cookies: string; crumb: string}) => void;
  reset: () => void;
}

// 我的持仓
const defaultCared = [
  {market: 0, code: '159659', label: '纳斯达克100ETF'},
  {market: 1, code: '513500', label: '标普500ETF'},
  {market: 1, code: '513880', label: '日经225ETF'},
];

const defaultGlobal = [
  '1.000001',
  '0.399006',
  '100.N225',
  '100.VNINDEX',
  '100.SPX',
  '100.NDX',
];
const initialState = {
  password: '123456',
  user: UserSchema.parse({}),
  token: '',
  theme: '#987123',
  category: CategorySchema.parse({}),
  cared: _.cloneDeep(defaultCared).map(it => `${it.market}.${it.code}`),
  global: _.cloneDeep(defaultGlobal),
  holdFundCodes:
    `BK1040,BK1041,BK0727,BK1044,BK1031,BK0433,BK0438,BK0437`.split(','),
  yahoo: {
    cookies: `GUC=AQEBCAFpcyJppEIcswRn&s=AQAAAIRYnMD7&g=aXHREA; A1=d=AQABBKpfoWgCEGajuXd9l--403wdLKCZn2QFEgEBCAEic2mkaWChyyMA_eMDAAcIql-haKCZn2Q&S=AQAAAgnKAnX81kxNcsaI9kp0jgY; A3=d=AQABBKpfoWgCEGajuXd9l--403wdLKCZn2QFEgEBCAEic2mkaWChyyMA_eMDAAcIql-haKCZn2Q&S=AQAAAgnKAnX81kxNcsaI9kp0jgY; A1S=d=AQABBKpfoWgCEGajuXd9l--403wdLKCZn2QFEgEBCAEic2mkaWChyyMA_eMDAAcIql-haKCZn2Q&S=AQAAAgnKAnX81kxNcsaI9kp0jgY; gpp=DBAA; gpp_sid=-1; axids=gam=y-Nt8QxHlE2uJYwT1c9H4YfYaKC0N807H_~A&dv360=eS13d0haTXpORTJ1SFFZb0szUU9vYmpScnVHUkVPWUZ4MH5B&ydsp=y-Z.l1i8ZE2uJZdSuhTkxoyA4mcA2knQxw~A&tbla=y-D45mccJE2uJ7M2FQc7dnSrWwgdeLHmUR~A; tbla_id=cc8194ee-f8d4-4550-a0ad-1a2686694879-tuctf9bf5b1; _ga_BNW7Q63BME=GS2.1.s1769067216$o1$g1$t1769067227$j49$l0$h0; _ga=GA1.1.1320792746.1769066762; _ga_YD9K1W9DLN=GS2.1.s1769068902$o2$g1$t1769068921$j41$l0$h0; PRF=t%3DHPG.VN%252BFPT.VN%26dock-collapsed%3Dtrue; fes-ds-session=pv%3D4; _ga_LHGXQCMSKY=GS2.1.s1769070983$o2$g1$t1769070984$j59$l0$h0; cmp=t=1769081923&j=0&u=1---`,
    crumb: 'VPmHr38ItUO',
  },
};

export const useCaches = create<States>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setPassword: password => set({password}),
        setToken: token => set({token}),
        setTheme: theme => set({theme}),
        setCategory: category => set({category}),
        setCared: cared => set({cared}),
        setGlobal: global => set({global}),
        setHoldFundCodes: holdFundCodes => set({holdFundCodes}),
        setUser: user => set({user}),
        setYahoo: yahoo => set({yahoo}),
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
          yahoo: state.yahoo,
        }),
      },
    ),
  ),
);
