import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  selectDocClsfByParent,
  selectDocClsfErrorByParent,
} from "@/features/clsf/DocClsfSelectors";
import { fetchDocClsfList } from "@/features/clsf/DocClsfThunk";

interface SelectOption {
  name: string;
  code: string;
}

const INIT_SELECT_ITEM: SelectOption[] = [{ name: "전체", code: "" }];

function toOption(vo: any): SelectOption | null {
  const code = String(
    vo?.docClsfNo ??
      vo?.code ??
      vo?.value ??
      vo?.id ??
      vo?.clsfNo ??
      "",
  );
  const name = String(
    vo?.docClsfNm ??
      vo?.name ??
      vo?.label ??
      vo?.clsfNm ??
      vo?.docClsfNo ??
      "",
  );

  if (!code || !name) return null;
  return { name, code };
}

export function useDocClsfOptions(
  docLclsfNo?: string,
  docMclsfNo?: string,
) {
  const dispatch = useDispatch<AppDispatch>();

  const lclsfDocs = useSelector((state: RootState) =>
    selectDocClsfByParent(state),
  );
  const lclsfError = useSelector((state: RootState) =>
    selectDocClsfErrorByParent(state),
  );
  const mclsfDocs = useSelector((state: RootState) =>
    selectDocClsfByParent(state, docLclsfNo),
  );
  const sclsfDocs = useSelector((state: RootState) =>
    selectDocClsfByParent(state, docMclsfNo),
  );

  useEffect(() => {
    dispatch(fetchDocClsfList());
  }, [dispatch]);

  useEffect(() => {
    if (!docLclsfNo) return;
    dispatch(fetchDocClsfList({ parentDocClsfNo: docLclsfNo }));
  }, [dispatch, docLclsfNo]);

  useEffect(() => {
    if (!docMclsfNo) return;
    dispatch(fetchDocClsfList({ parentDocClsfNo: docMclsfNo }));
  }, [dispatch, docMclsfNo]);

  const lclsfList = useMemo(
    () =>
      Array.isArray(lclsfDocs)
        ? [
            ...INIT_SELECT_ITEM,
            ...lclsfDocs
              .map(toOption)
              .filter((v): v is SelectOption => v !== null),
          ]
        : INIT_SELECT_ITEM,
    [lclsfDocs],
  );

  const mclsfList = useMemo(
    () =>
      Array.isArray(mclsfDocs)
        ? [
            ...INIT_SELECT_ITEM,
            ...mclsfDocs
              .map(toOption)
              .filter((v): v is SelectOption => v !== null),
          ]
        : INIT_SELECT_ITEM,
    [mclsfDocs],
  );

  const sclsfList = useMemo(
    () =>
      Array.isArray(sclsfDocs)
        ? [
            ...INIT_SELECT_ITEM,
            ...sclsfDocs
              .map(toOption)
              .filter((v): v is SelectOption => v !== null),
          ]
        : INIT_SELECT_ITEM,
    [sclsfDocs],
  );

  return { lclsfList, mclsfList, sclsfList, lclsfError };
}
