import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCniEmIgkBdfeX022PVH3_l_N1rJoD-vvE',
  authDomain: 'shareplay-364420.firebaseapp.com',
  projectId: 'shareplay-364420',
  storageBucket: 'shareplay-364420.appspot.com',
  messagingSenderId: '414125495010',
  appId: '1:414125495010:web:32cf4d3962060e4bdb44bb',
};

// eslint-disable-next-line import/prefer-default-export
export const firebaseApp = initializeApp(firebaseConfig);
