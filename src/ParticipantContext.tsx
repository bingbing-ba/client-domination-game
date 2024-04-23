import { PropsWithChildren, createContext, useState } from 'react';

export const ParticipantContext = createContext<{
  id: string | null;
  setId: (id: string | null) => void;
  startedAt: number | null;
  setStartedAt: (updatedAt: number | null) => void;
  round: number | null;
  setRound: (round: number | null) => void;
}>({
  id: null,
  setId: () => {},
  startedAt: null,
  setStartedAt: () => {},
  round: null,
  setRound: () => {},
});

export const ParticipantContextProvider = ({ children }: PropsWithChildren) => {
  const [id, setId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [round, setRound] = useState<number | null>(null);
  return (
    <ParticipantContext.Provider value={{ id, setId, startedAt, setStartedAt, round, setRound }}>
      {children}
    </ParticipantContext.Provider>
  );
};
