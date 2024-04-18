import { Button } from '../components/Button';
import Container from '../components/Container';
import { Header } from '../components/Header';
import Input from '../components/Input';

function DominationSuccessed() {
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
          <Input label="이메일 주소" type="email" onChange={(input) => console.log(input)} />
          <div className="mt-8" />
          <Input label="닉네임" type="text" onChange={(input) => console.log(input)} />
          <Button
            onClick={() => {
              console.log('제출하기');
            }}
          >
            제출하기
          </Button>
        </div>
      </main>
    </Container>
  );
}

export default DominationSuccessed;
