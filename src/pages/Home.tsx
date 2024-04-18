import { CheckIcon } from '@heroicons/react/20/solid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFirestore } from '../useFirestore';
import { Header } from '../components/Header';
import Container from '../components/Container';
import { Button } from '../components/Button';
import { randomUUID } from 'crypto';

const dominateURL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/vorixi/us-central1/dominate'
    : 'https://dominate-lv3ojcseyq-uc.a.run.app/';

export default function Home() {
  const { latestDomination, totalPrice } = useFirestore();

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const timeLeftToDominate = useMemo(() => {
    if (!latestDomination) return null;
    const end = latestDomination + 3600000;
    const diff = end - now;
    if (diff < 0) return null;
    if (diff > 3600 * 1000) return null;

    const padStart2 = (n: number) => n.toString().padStart(2, '0');
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${padStart2(minutes)}분 ${padStart2(seconds)}초`;
  }, [latestDomination, now]);

  const [modalOpen, setModalOpen] = useState(false);

  const [isDominatting, setIsDominatting] = useState(false);
  const dominate = useCallback(() => {
    if (isDominatting) {
      return;
    }
    setIsDominatting(true);
    fetch(dominateURL, {
      method: 'POST',
      body: JSON.stringify({
        id: randomUUID(),
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log({ data }));
  }, [isDominatting]);

  return (
    <Container>
      {/* 헤더영역 */}
      <header className="mx-auto max-w-2xl text-center">
        <Header />
        <p className="mt-6 text-lg leading-8 text-gray-600 break-keep">
          점령에 도전하고 최대 상금 <span className="font-bold text-xl text-gray-700">10만원</span>을 받아가세요!
        </p>
      </header>

      {/* 메인영역 */}
      <main className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 mt-14">
        <div className="-mt-2 p-2">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5">
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
          </div>
        </div>
        <div className="p-10">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">How to</h3>
          <ul className="mt-6 text-base leading-7 text-gray-600 break-keep">
            <li className="flex gap-3 items-center">
              <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
              Dominate 버튼을 누르면 점령이 시작됩니다.
            </li>
            <li className="flex gap-3 items-center mt-1">
              <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
              1시간동안 아무도 점령을 시도하지 않으면 성공합니다.
            </li>
            <li className="flex gap-3 items-center mt-1">
              <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
              다른 누군가 점령을 시도하면 실패합니다.
            </li>
            <li className="flex gap-3 items-center mt-1">
              <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
              점령에 실패한 사람이 많아질수록 상금이 높아집니다.
            </li>
          </ul>
          <p className="mt-6 text-xs leading-5 text-gray-600 break-keep">
            지금은 테스트 기간으로, 상금이 없습니다. 정식 서비스는 24.2.13. 12시(UTC+9)에 시작됩니다.
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
            Domination Game의 서버는 응답에 1시간이 걸립니다. 이 서버는 느린가요? 아니면 빠른가요?
          </p>
          <p className="mt-4 break-keep">
            제 생각에 이 서버는 "적절히" 빠릅니다. 이 게임의 목적에 맞는 속도이기 때문이죠.
          </p>
          <p className="mt-4 break-keep">
            단순히 "더 빠르면 좋으니까" 라는 이유로 서버를 빠르게 하려고 하진 않나요?
            <br /> 프로덕트에 맞는 다른 선택은 없는지 한 번쯤 생각해보셨으면 해서 만들어보았습니다.
          </p>
        </div>
        <div onClick={onCloseButtonClick} className="text-gray-400 underline mt-4 p-1">
          닫기
        </div>
      </div>
    </div>
  );
}
