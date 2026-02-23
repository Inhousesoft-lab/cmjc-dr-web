import Router from "@/routes/Router";

import NotificationsProvider from "@/hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "@/hooks/useDialogs/DialogsProvider";

import AppTheme from "./theme/AppTheme";

import MenuGate from "@/components/gate/MenuGate";
import UseLangStylesReady from "./UseLangStylesReady";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

dayjs.locale("ko");

/*
(중요) “CSS가 누적되는 문제”에 대한 현실적인 처리 - LangStylesLoader.tsx 참고

위 방식은 언어 바꾸면 새로운 CSS가 추가로 로드됩니다.
즉 “ko CSS가 남아있고 en CSS가 추가되는 구조”가 될 수 있어요.

그래도 보통은 아래 둘 중 하나로 해결합니다:

✅ A안(권장): 언어별 스타일을 서로 충돌 안 나게 설계

언어별로 필요한 차이(폰트/자간/줄간격 등)만 넣고

selector가 겹치면 마지막 로드된 쪽이 이기니 의도대로 덮어쓰게 구성

✅ B안(완전 분리): <link> 태그로 “교체”하기

CSS를 아예 파일로 분리해 두고, 언어 바뀔 때 <link id="lang-css">의 href를 갈아끼우는 방식.
Vite 빌드 설정(멀티 엔트리 or 정적 asset) 필요
*/
export default function App() {
  const ready = UseLangStylesReady();
  if (!ready) {
    // 완전 빈 화면이 싫으면 로고/로딩 스피너 넣어도 됨
    return null; // 또는 로딩 스피너
  }

  const queryClient = new QueryClient();

  return (
    <AppTheme>
      <MenuGate>
        <NotificationsProvider>
          <DialogsProvider>
            <QueryClientProvider client={queryClient}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Router />
              </LocalizationProvider>
            </QueryClientProvider>
          </DialogsProvider>
        </NotificationsProvider>
      </MenuGate>
    </AppTheme>
  );
}
