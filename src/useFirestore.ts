import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ParticipantContext } from './ParticipantContext';

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
type RoundEntity = {
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
  const [roundEntity, setRoundEntity] = useState<RoundEntity>({ startAt: 0, updatedAt: 0 });
  const [currentRound, setCurrentRound] = useState<number>(0);
  const { setStartedAt } = useContext(ParticipantContext);
  useEffect(() => {
    fetch(getCurrentRoundURL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to get current round');
        return res.json();
      })
      .then((data) => data.currentRound && setCurrentRound(data.currentRound));
  }, []);

  const [winners, setWinners] = useState<{ round: number; nickname: string; amount: number }[]>([]);

  useEffect(() => {
    const roundRecordsRef = doc(db, 'domination-game', 'roundRecords');
    getDoc(roundRecordsRef).then((doc) => {
      const roundRecords = doc.data() as RoundRecordsType | undefined;
      if (roundRecords) {
        setWinners([]);
        for (let i = 1; i <= roundRecords.thisRound; i++) {
          if (!roundRecords[i]) continue;
          setWinners((prev) => [
            ...prev,
            { round: i, nickname: roundRecords[i].nickname, amount: roundRecords[i].amount },
          ]);
        }
      }
    });
  }, []);
  useEffect(() => {
    const roundRef = doc(db, 'domination-game', 'round-' + currentRound);
    const unsubscribe = onSnapshot(roundRef, (doc) => {
      if (doc.data()) {
        const roundEntity = doc.data() as RoundEntity;
        setRoundEntity(roundEntity);
        setStartedAt(roundEntity.updatedAt);
      }
    });
    return unsubscribe;
  }, [currentRound, setStartedAt]);

  const totalPrice = useMemo(() => {
    const participants = Object.keys(roundEntity).length - 2;
    if (participants < 1000) return 1000;
    if (participants > 100_000) return 100_000;
    return participants;
  }, [roundEntity]);

  return {
    winners,
    roundEntity,
    currentRound,
    totalPrice,
    participants: Object.keys(roundEntity).length - 2,
  };
};

export { useFirestore };
