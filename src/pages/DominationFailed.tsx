import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import Container from '../components/Container';
import { Header } from '../components/Header';
import { useContext } from 'react';
import { ParticipantContext } from '../ParticipantContext';

function DominationFailed() {
  const navigate = useNavigate();
  const { setId, setStartedAt: setUpdatedAt } = useContext(ParticipantContext);
  return (
    <Container>
      <header className="mx-auto max-w-2xl text-center">
        <Header />
      </header>
      <main
        className="mx-auto max-w-2xl text-center text-gray-700 text-lg"
        style={{
          marginTop: 'min(32vw, 300px)',
        }}
      >
        <p>아쉽게도 점령에 실패했어요😞</p>
        <p className="mt-4">다른 누군가 점령을 시도했습니다</p>
      </main>
      <div className="mt-20">
        <Button
          onClick={() => {
            setId(null);
            setUpdatedAt(null);
            navigate('/');
          }}
        >
          다시하기
        </Button>
      </div>
    </Container>
  );
}

export default DominationFailed;
