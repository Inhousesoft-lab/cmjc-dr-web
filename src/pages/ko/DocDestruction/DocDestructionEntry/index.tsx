import { useAppSelector } from "@/app/hooks";
import { getDefaultDocDestructionPath } from "@/features/docDestruction/docDestructionAccess";
import { getLangFromPathname, langPath } from "@/routes/lang";
import { Navigate, useLocation } from "react-router-dom";

export default function DocDestructionEntry() {
  const location = useLocation();
  const curLang = getLangFromPathname(location.pathname);
  const roles = useAppSelector((state) => state.auth.user?.roles ?? []);
  const targetPath = getDefaultDocDestructionPath(roles);

  return <Navigate to={langPath(targetPath, curLang)} replace />;
}
