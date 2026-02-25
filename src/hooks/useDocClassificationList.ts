import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  selectDocClassificationError,
  selectDocClassificationLoading,
  selectDocClassificationRowCount,
  selectDocClassificationRows,
} from "@/features/classification/DocClassificationListSelectors";
import { fetchDocClassificationList } from "@/features/classification/DocClassificationListThunk";
import type { DocClassificationSearch } from "@/types/docClassification";

export function useDocClassificationList() {
  const dispatch = useDispatch<AppDispatch>();
  const rows = useSelector((state: RootState) =>
    selectDocClassificationRows(state),
  );
  const rowCount = useSelector((state: RootState) =>
    selectDocClassificationRowCount(state),
  );
  const isLoading = useSelector((state: RootState) =>
    selectDocClassificationLoading(state),
  );
  const listError = useSelector((state: RootState) =>
    selectDocClassificationError(state),
  );

  const loadData = useCallback(
    (params?: DocClassificationSearch) =>
      dispatch(fetchDocClassificationList(params)).unwrap(),
    [dispatch],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { rows, rowCount, isLoading, listError, loadData };
}
