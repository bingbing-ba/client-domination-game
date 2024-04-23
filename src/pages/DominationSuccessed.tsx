import { useCallback, useContext, useState } from 'react';
import { Button } from '../components/Button';
import Container from '../components/Container';
import { Header } from '../components/Header';
import Input from '../components/Input';
import { ParticipantContext } from '../ParticipantContext';
import { useNavigate } from 'react-router';

const submitWinnerURL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/vorixi/us-central1/submitWinner'
    : 'https://submitwinner-lv3ojcseyq-uc.a.run.app/';

function DominationSuccessed() {
  const { id, round, setId, setStartedAt, setRound } = useContext(ParticipantContext);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();

  const resetAndNavigate = useCallback(() => {
    setId(null);
    setStartedAt(null);
    setRound(null);
    navigate('/');
  }, [setId, setStartedAt, setRound, navigate]);

  const submitWinner = useCallback(() => {
    if (submitting) return;
    fetch(submitWinnerURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        round,
        nickname,
        email,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('제출에 실패했습니다.');
        setSubmitting(false);
        setSubmit(true);
        alert('제출 되었습니다. 다시 돌아갑니다.');
        resetAndNavigate();
      })
      .catch(() => {
        alert('제출에 실패했습니다. 다시 시도해주세요.');
      });
  }, [id, round, nickname, email, submitting, resetAndNavigate]);

  const retry = useCallback(() => {
    if (!submit) {
      if (window.confirm('아직 이메일 주소를 제출하지 않았습니다. \n정말로 다시할까요? 다시 제출할 수 없습니다.')) {
        resetAndNavigate();
        return;
      }
      return;
    }
    resetAndNavigate();
  }, [resetAndNavigate, submit]);

  return (
    <Container>
      <header className="mx-auto max-w-2xl text-center">
        <Header />
      </header>

      <main
        className="mx-auto max-w-2xl text-gray-700 text-lg"
        style={{
          marginTop: 'min(32vw, 300px)',
        }}
      >
        <div className="text-center">
          <p>축하드려요! 점령에 성공했습니다.😆</p>
          <p className="mt-4">이메일 주소와 닉네임을 입력해주세요.</p>
          <p className="mt-4">확인 후 상금 전달을 위해 연락드리겠습니다.</p>
        </div>

        <div className="mt-20">
          <Input label="이메일 주소" type="email" onChange={(input) => setEmail(input)} />
          <div className="mt-8" />
          <Input label="닉네임" type="text" onChange={(input) => setNickname(input)} />
          <Button onClick={submitWinner}>제출하기</Button>
        </div>

        <div className="text-center">
          <button className="underline text-gray-400 mt-8 font-light" onClick={retry}>
            다시하기
          </button>
        </div>
      </main>
    </Container>
  );
}

export default DominationSuccessed;
