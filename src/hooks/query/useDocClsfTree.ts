import { selectDocClsfList, selectLclsfList } from "@/api/com/BizCommon";
import { useAppQuery } from "@/hooks/query/useAppQuery";
import { https } from "@shared/utils/https";
import type { DocClsf } from "@/types/docClassification";

export function useLclsfListLive() {
  return useAppQuery<DocClsf[]>(
    ["docClsf", "L"],
    async () => {
      const res = await https.get(selectLclsfList());
      return res.data?.list ?? res.data ?? [];
    },
    {
      staleTime: 1000 * 5, // 5초 정도만 유효
      refetchOnWindowFocus: true,
    },
  );
}

export function useDocClsfChildrenLive(docClsfNo: string | undefined) {
  return useAppQuery<DocClsf[]>(
    ["docClsfChildren", docClsfNo],
    async () => {
      const res = await https.get(selectDocClsfList(docClsfNo!));
      return res.data?.list ?? res.data ?? [];
    },
    {
      enabled: !!docClsfNo,
      staleTime: 1000 * 5, // 짧게
      refetchOnWindowFocus: true,
    },
  );
}
