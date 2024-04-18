import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot, getDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

const firebaseConfig = {
  apiKey: 'AIzaSyDFfvAWdTBhsLfuPcSkM1Q3WbtQ9uhORf4',
  authDomain: 'vorixi.firebaseapp.com',
  projectId: 'vorixi',
  storageBucket: 'vorixi.appspot.com',
  messagingSenderId: '847296293819',
  appId: '1:847296293819:web:eadaff07a98bf5c412b29e',
  measurementId: 'G-E81VGE5NJ6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type RoundRecordsType = {
  thisRound: number;
  updatedAt: number;
  [round: number]: {
    id: string;
    nickname: string;
    amount: number;
    email: string;
  };
};
type RoundType = {
  [id: string]: number;
  startAt: number;
  updatedAt: number;
};

// 1. getCurrentRound해서 받아온다.
// 2. round를 listen한다.

const getCurrentRoundURL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/vorixi/us-central1/getCurrentRound'
    : 'https://getcurrentround-lv3ojcseyq-uc.a.run.app/';

const useFirestore = () => {
  const [round, setRound] = useState<RoundType>({ startAt: 0, updatedAt: 0 });
  const [currentRound, setCurrentRound] = useState<number>(0);
  useEffect(() => {
    fetch(getCurrentRoundURL)
      .then((res) => res.json())
      .then((data) => data.currentRound && setCurrentRound(data.currentRound));
  }, []);
  useEffect(() => {
    const roundRef = doc(db, 'domination-game', 'round-' + currentRound);
    const unsubscribe = onSnapshot(roundRef, (doc) => {
      doc.data() && setRound(doc.data() as RoundType);
    });
    return unsubscribe;
  }, [currentRound]);

  const totalPrice = useMemo(() => {
    const participants = Object.keys(round).length - 2;
    if (participants < 1000) return 1000;
    return participants;
  }, [round]);

  const latestDomination = useMemo(() => round.updatedAt, [round]);

  return {
    currentRound,
    totalPrice,
    latestDomination,
  };
};

export { useFirestore };
