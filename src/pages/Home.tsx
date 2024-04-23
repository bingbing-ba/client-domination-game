import { CheckIcon } from '@heroicons/react/20/solid';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useFirestore } from '../useFirestore';
import { Header } from '../components/Header';
import Container from '../components/Container';
import { Button } from '../components/Button';
import { ParticipantContext } from '../ParticipantContext';
import { useNavigate } from 'react-router';

const dominateURL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/vorixi/us-central1/dominate'
    : 'https://dominate-lv3ojcseyq-uc.a.run.app/';

const oneHour = 1000 * 60 * 60;

export default function Home() {
  const { totalPrice, roundEntity, currentRound, participants, winners } = useFirestore();

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const timeLeftToDominate = useMemo(() => {
    const latestDomination = roundEntity.updatedAt;
    if (!latestDomination) return null;
    const end = latestDomination + oneHour;
    const diff = end - now;
    if (diff < 0) return null;
    if (diff > oneHour) return null;

    const padStart2 = (n: number) => n.toString().padStart(2, '0');
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${padStart2(minutes)}분 ${padStart2(seconds)}초`;
  }, [roundEntity, now]);

  const [modalOpen, setModalOpen] = useState(false);

  const { id, setId, startedAt, setStartedAt, setRound } = useContext(ParticipantContext);

  const dominateStatus = useMemo(() => {
    if (id) {
      if (roundEntity[id] === startedAt) {
        if (now - startedAt > oneHour) {
          return '점령 성공';
        }
        return '점령 중';
      }
      return '점령 실패';
    }
    return '점령 가능';
  }, [id, roundEntity, now, startedAt]);

  const navigate = useNavigate();
  useEffect(() => {
    if (dominateStatus === '점령 성공') {
      navigate('/domination-successed');
    } else if (dominateStatus === '점령 실패') {
      navigate('/domination-failed');
    }
  }, [dominateStatus, navigate]);

  const [tryDominate, setTryDominate] = useState(false);

  const dominate = useCallback(() => {
    if (dominateStatus !== '점령 가능') return;
    if (tryDominate) return;
    setTryDominate(true);
    fetch(dominateURL, {
      method: 'POST',
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('점령에 실패했습니다.');
      })
      .then((_data) => {
        const data = _data as { id: string; currentRound: number; startAt: number };
        setId(data.id);
        setStartedAt(data.startAt);
        setRound(data.currentRound);
      })
      .catch((e) => {
        alert('점령에 실패했습니다. 새로고침 후 시도해주세요.');
      })
      .finally(() => {
        setTryDominate(false);
      });
  }, [setId, dominateStatus, setStartedAt, setRound, tryDominate]);

  return (
    <Container>
      {/* 헤더영역 */}
      <header className="mx-auto max-w-2xl text-center">
        <Header />
        <p className="mt-6 text-lg leading-8 text-gray-600 break-keep">
          점령에 도전하고 최대 상금 <span className="font-bold text-xl text-gray-700">10만원</span>을 받아가세요!
        </p>
        <RollingRecords winners={winners} />
      </header>

      {/* 메인영역 */}
      <main className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 mt-10">
        <div className="-mt-2 p-2">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5">
            {dominateStatus === '점령 중' ? (
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600 break-keep">
                  점령중입니다.
                  <br />
                  남은시간: <span className="text-lg text-red-600">{timeLeftToDominate}</span>
                </p>
                <div className="flex justify-center mt-8">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-20 h-20 text-gray-200 animate-spin-slow dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600 break-keep">
                  {timeLeftToDominate === null ? (
                    '운이 좋네요! 아무도 점령하지 않고 있습니다.'
                  ) : (
                    <>
                      지금 점령하지 않으면
                      <br />
                      누군가 <span className="text-lg text-red-600">{timeLeftToDominate}</span> 뒤에
                      <br />
                      상금을 받아가요
                    </>
                  )}
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    <span className="text-3xl">₩</span>
                    {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </span>
                  <span className="text-xl font-semibold leading-6 tracking-wide text-gray-600">원</span>
                </p>
                <Button onClick={dominate}>Dominate</Button>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              현재 {currentRound}번째 라운드
              <br />
              참여자: {participants} 명
            </div>
          </div>
        </div>
        <div className="p-10">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">How to</h3>
          </div>
          <ul className="mt-6 text-base leading-7 text-gray-600 break-keep">
            <li className="flex gap-3 items-center">
              <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
              Dominate 버튼을 누르면 점령이 시작됩니다.
            </li>
            <li className="flex gap-3 items-center mt-1">
              <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
              1시간동안 다른 사람이 점령하지 않으면 성공합니다.
            </li>
            <li className="flex gap-3 items-center mt-1">
              <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
              점령에 도전하는 사람이 많을 수록 상금이 올라갑니다.
            </li>
            <li className="flex gap-3 items-center mt-1">
              <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
              점령에 성공하면 상금이 지급됩니다.
            </li>
          </ul>
          <p className="mt-6 text-xs leading-5 text-gray-400 break-keep">
            이 게임은 예기치 않게 종료될 수 있습니다.
            <br />
            제작자의 판단하에 부정한 게임의 경우 상금이 지급되지 않을 수 있습니다.
          </p>
        </div>
      </main>
      <button
        className="fixed right-2 bottom-2 rounded-full w-10 h-10 bg-gray-400 text-white flex justify-center items-center text-xl hover:bg-gray-500"
        onClick={() => setModalOpen(true)}
      >
        ?
      </button>
      {modalOpen && (
        <div
          className="fixed inset-0 bg-[#000a] flex justify-center items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div className="max-w-xl mx-auto h-4/5 overflow-y-auto px-4 rounded-lg">
            <ReasonModal onCloseButtonClick={() => setModalOpen(false)} />
          </div>
        </div>
      )}
    </Container>
  );
}

function ReasonModal({ onCloseButtonClick }: { onCloseButtonClick: () => void }) {
  const openBehind = useCallback(() => {
    window.open(
      'https://bingbingba.tistory.com/entry/%EC%99%9C-%EB%82%98%EB%8A%94-%EB%8A%90%EB%A6%B0-%EC%84%9C%EB%B2%84%EB%A5%BC-%EB%A7%8C%EB%93%9C%EB%A0%A4%EA%B3%A0-%ED%96%88%EC%9D%84%EA%B9%8C',
      '_blank'
    );
  }, []);
  return (
    <div className="bg-white px-6 py-8 lg:px-8 rounded-lg min-h-[80vh]">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <p className="text-base font-semibold leading-7 text-gray-600">Introduction</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-indigo-500 sm:text-4xl">DOMINATION GAME</h1>
        <div className="mt-10 max-w-2xl">
          <p>
            서버는 항상 빨라야 할까요?
            <br />
            그래야 한다면, 얼마나 빨라야 할까요?
          </p>
          <p className="mt-4 break-keep">
            Domination Game의 서버는 동작하는데 1시간이 걸립니다.{' '}
            <span className="font-bold">이 서버는 느린가요? 아니면 빠른가요?</span>
          </p>
          <p className="mt-4 break-keep">
            제 생각에 이 서버는 "알맞게" 빠릅니다. 이 게임의 목적에 맞는 속도이기 때문이죠.
          </p>
          <p className="mt-4 break-keep">
            단순히 "더 빠르면 좋으니까" 라는 이유로 서버를 빠르게 하려고 하진 않나요?
            <br /> <span className="font-bold">서버를 빠르게 하는 것보다 더 좋은 선택을</span> 할 수 있는지 한 번쯤
            생각해보세요.
          </p>
        </div>
        <div className="flex justify-between">
          <div onClick={onCloseButtonClick} className="text-gray-400 underline mt-4 p-1">
            닫기
          </div>
          <div onClick={openBehind} className="text-gray-400 underline mt-4 p-1">
            제작 비하인드
          </div>
        </div>
      </div>
    </div>
  );
}

function RollingRecords(props: { winners: { round: number; nickname: string; amount: number }[] }) {
  const [rollingIndex, setRollingIndex] = useState(0);
  useEffect(() => {
    const interval = window.setInterval(() => {
      setRollingIndex((prev) => (prev + 1) % props.winners.length);
    }, 2500);
    return () => window.clearInterval(interval);
  }, [props.winners]);
  return (
    <div
      className="h-8 overflow-hidden text-gray-400 mt-4"
      style={{
        fontSize: '0.9rem',
        fontWeight: 300,
      }}
    >
      <ul
        className="flex flex-col justify-center items-center"
        style={{
          transform: `translateY(-${(rollingIndex / props.winners.length) * 100}%)`,
          transition: 'transform 1s',
        }}
      >
        {props.winners.map((winner) => {
          return (
            <li className="h-8 flex justify-center items-center" key={winner.round}>
              <div>
                {winner.round}회{' '}
                <span>{winner.nickname.length > 5 ? winner.nickname.slice(0, 10) + '...' : winner.nickname}</span>{' '}
                <span className="font-bold">{winner.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</span>{' '}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
