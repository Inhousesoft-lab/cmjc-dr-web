import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { getLangFromPathname } from "@/routes/lang";
import { getDefaultLandingPath } from "@/routes/defaultLanding";

export default function NotFound() {
  const location = useLocation();
  const { list } = useAppSelector((s) => s.menuList);
  const user = useAppSelector((s) => s.auth.user);
  const lang = getLangFromPathname(location.pathname);
  const homePath = getDefaultLandingPath(lang, list, user);

  return (
    <div className="page notfound">
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>
        <Link to={homePath}>홈으로 이동</Link>
      </p>
    </div>
  );
}
