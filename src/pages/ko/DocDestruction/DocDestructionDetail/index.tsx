import React from "react";
import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import { Box, Button, TableCell, TableRow } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getLangFromPathname, langPath } from "@/routes/lang";
import DigitalDocHistoryButton from "@/components/actionButtons/DigitalDocHistoryButton";
import useNotifications from "@/hooks/useNotifications";
import PageStatus from "@/components/common/PageStatus";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchDocDestructionDetail } from "@/features/docDestruction/DocDestructionThunk";
import {
  selectDocDestructionDetail,
  selectDocDestructionDetailError,
  selectDocDestructionDetailLoading,
} from "@/features/docDestruction/DocDestructionSelectors";

export default function DocDestructionDetail() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const curLang = getLangFromPathname(location.pathname);

  const { eldocNo = "" } = useParams<{ eldocNo?: string }>();
  const detail = useAppSelector(selectDocDestructionDetail);
  const isLoading = useAppSelector(selectDocDestructionDetailLoading);
  const detailError = useAppSelector(selectDocDestructionDetailError);

  React.useEffect(() => {
    if (!eldocNo) return;
    dispatch(fetchDocDestructionDetail(eldocNo));
  }, [dispatch, eldocNo]);

  React.useEffect(() => {
    if (!detailError) return;
    notifications.show(detailError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [detailError, notifications]);

  const showValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };

  const formatDateOnly = (value: unknown) => {
    const raw = String(value ?? "").trim();
    if (!raw) return "-";

    const digits = raw.replace(/[^0-9]/g, "");
    if (digits.length < 8) return "-";

    const yyyy = digits.slice(0, 4);
    const mm = digits.slice(4, 6);
    const dd = digits.slice(6, 8);
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatCollectDate = (
    clctYmd: unknown,
    hldPrdDfyrs: unknown,
    hldPrdMmCnt: unknown,
    collectDateLabel: unknown,
  ) => {
    const dateText = formatDateOnly(clctYmd);
    let years = String(hldPrdDfyrs ?? "").trim();
    let months = String(hldPrdMmCnt ?? "").trim();

    if (!years || !months) {
      const raw = String(collectDateLabel ?? "");
      const m = raw.match(/(\d+)\s*년\s*(\d+)\s*개월/);
      if (m) {
        if (!years) years = m[1];
        if (!months) months = m[2];
      }
    }

    if (dateText === "-" && !years && !months) return "-";
    if (!years && !months) return dateText;

    const y = years || "0";
    const mm = months || "0";
    return `${dateText}(${y}년 ${mm}개월)`;
  };

  const formatActorAndDate = (actor: unknown, date: unknown) => {
    const actorText = showValue(actor);
    const dateText = formatDateOnly(date);
    if (actorText === "-" && dateText === "-") return "-";
    if (actorText === "-") return dateText;
    if (dateText === "-") return actorText;
    return `${actorText} (${dateText})`;
  };

  const handleBack = () => {
    const listState = (
      location.state as
        | {
            listState?: {
              docLclsfNo: string;
              docMclsfNo: string;
              docSclsfNo: string;
              pageNum: number;
              pageSize: number;
            };
          }
        | null
    )?.listState;

    navigate(langPath("destruction/list", curLang), {
      state: {
        restoreListState: listState,
      },
    });
  };

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

  return (
    <div>
      <Box className="btn_wrapper" mt={2}>
        <Button size="large" variant="contained" onClick={handleBack}>
          목록
        </Button>
        <DigitalDocHistoryButton eldocNo={eldocNo} />
      </Box>

      <TableWrapper
        tableAriaLabel="파기 상세 정보"
        colgroup={
          <colgroup>
            <col className="tbl-col-w-20p" />
            <col />
            <col className="tbl-col-w-20p" />
            <col />
          </colgroup>
        }
      >
        <TableRow>
          <LabelCell>문서분류</LabelCell>
          <TableCell colSpan={3}>{showValue(detail?.docClsfNm)}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>문서번호</LabelCell>
          <TableCell>{showValue(detail?.docNo)}</TableCell>
          <LabelCell>파기일자</LabelCell>
          <TableCell>{formatDateOnly(detail?.dstrcAprvDt)}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>문서제목</LabelCell>
          <TableCell colSpan={3}>{showValue(detail?.docTtl)}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>수집일자</LabelCell>
          <TableCell>
            {formatCollectDate(
              detail?.clctYmd,
              detail?.hldPrdDfyrs,
              detail?.hldPrdMmCnt,
              detail?.collectDateLabel,
            )}
          </TableCell>
          <LabelCell>종료일자</LabelCell>
          <TableCell>{formatDateOnly(detail?.endYmd)}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>신청자</LabelCell>
          <TableCell>
            {formatActorAndDate(detail?.dstrcAplcntId, detail?.dstrcAplyDt)}
          </TableCell>
          <LabelCell>부서장</LabelCell>
          <TableCell>
            {formatActorAndDate(detail?.dstrcAutzrId, detail?.dstrcAprvDt)}
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>개인정보</LabelCell>
          <TableCell>{showValue(detail?.prvcInclYn)}</TableCell>
          <LabelCell>개인정보처리담당자</LabelCell>
          <TableCell>
            {formatActorAndDate(detail?.prvcDstrcAutzrId, detail?.prvcDstrcAprvDt)}
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>자료의 종류</LabelCell>
          <TableCell colSpan={3}>{showValue(detail?.eldocYn)}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>비고</LabelCell>
          <TableCell
            colSpan={3}
            sx={{ height: 96, verticalAlign: "top", pt: 2 }}
          >
            {showValue(detail?.addExpln)}
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>파기사유</LabelCell>
          <TableCell colSpan={3}>{showValue(detail?.rsn)}</TableCell>
        </TableRow>
      </TableWrapper>
    </div>
  );
}
