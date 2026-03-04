import React from "react";
import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import { Box, Button, TableCell, TableRow } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
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

  const formatActorAndDate = (actor: unknown, date: unknown) => {
    const actorText = showValue(actor);
    const dateText = showValue(date);
    if (actorText === "-" && dateText === "-") return "-";
    if (actorText === "-") return dateText;
    if (dateText === "-") return actorText;
    return `${actorText} (${dateText})`;
  };

  const handleBack = () => {
    navigate(langPath("docDestruction/list", curLang));
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
          <TableCell>{showValue(detail?.dstrcAprvDt)}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>문서제목</LabelCell>
          <TableCell colSpan={3}>{showValue(detail?.docTtl)}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>수집일자</LabelCell>
          <TableCell>{showValue(detail?.collectDateLabel)}</TableCell>
          <LabelCell>종료일자</LabelCell>
          <TableCell>{showValue(detail?.endYmd)}</TableCell>
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
