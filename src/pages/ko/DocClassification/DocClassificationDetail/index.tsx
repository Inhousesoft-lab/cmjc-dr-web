import * as React from "react";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import TableWrapper from "@/components/table/TableWrapper";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications";
import DocClassificationHistoryButton from "@/components/biz/DocClassificationHistoryDialog";
import LabelCell from "@/components/table/LabelCell";
import { useNavigate, useParams } from "react-router-dom";
import PageStatus from "@/components/common/PageStatus";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  deleteDocClassification,
  fetchDocClassificationDetail,
} from "@/features/classification/DocClassificationListThunk";
import {
  selectDocClassificationDeleteLoading,
  selectDocClassificationDetail,
  selectDocClassificationDetailError,
  selectDocClassificationDetailLoading,
} from "@/features/classification/DocClassificationListSelectors";
import { dateLabel, holdPeriodLabel, ynLabel } from "@/utils/formater";

export default function DocClassificationDetail() {
  const { docClsfNo } = useParams();
  const targetDocClsfNo = docClsfNo ?? "";
  const dispatch = useAppDispatch();

  const dialogs = useDialogs();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const detailData = useAppSelector(selectDocClassificationDetail);
  const isLoading = useAppSelector(selectDocClassificationDetailLoading);
  const detailError = useAppSelector(selectDocClassificationDetailError);
  const isDeleteLoading = useAppSelector(selectDocClassificationDeleteLoading);

  React.useEffect(() => {
    if (!targetDocClsfNo) return;
    dispatch(fetchDocClassificationDetail(targetDocClsfNo));
  }, [dispatch, targetDocClsfNo]);

  React.useEffect(() => {
    if (!detailError) return;
    notifications.show(detailError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [detailError, notifications]);

  const handleViewDataEdit = React.useCallback(() => {
    navigate(`/docClassification/${targetDocClsfNo}/modify`);
  }, [navigate, targetDocClsfNo]);

  const handleViewDataDelete = React.useCallback(async () => {
    if (!detailData) {
      return;
    }

    const confirmed = await dialogs.confirm("삭제하시겠습니까?", {
      title: `삭제 확인`,
      severity: "error",
      okText: "확인",
      cancelText: "취소",
    });

    if (confirmed) {
      try {
        await dispatch(deleteDocClassification(targetDocClsfNo)).unwrap();

        notifications.show("삭제 되었습니다..", {
          severity: "success",
          autoHideDuration: 3000,
        });
        navigate("/docClassification/list");
      } catch (e) {
        notifications.show(getErrorMessage(e), {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    }
  }, [detailData, dialogs, dispatch, navigate, notifications, targetDocClsfNo]);

  const handleBack = () => {
    navigate("/docClassification/list");
  };

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

  const sub = detailData?.prvcFileHldPrst ?? {};
  const classification = [
    detailData?.docLclsfNm,
    detailData?.docMclsfNm,
    detailData?.docSclsfNm,
  ]
    .filter(Boolean)
    .join(" > ");

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        mb={2}
        className="detail-top-actions"
      >
        <div className="btn_wrapper detail-top-actions__group">
          <Button variant="contained" onClick={handleBack}>
            목록
          </Button>
          <DocClassificationHistoryButton docClsfNo={targetDocClsfNo} />
        </div>
        <div className="btn_wrapper detail-top-actions__group">
          <Button variant="contained" onClick={handleViewDataEdit}>
            수정
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleViewDataDelete}
            disabled={isDeleteLoading}
          >
            삭제
          </Button>
        </div>
      </Stack>

      <TableWrapper
        sx={{ mb: 2 }}
        tableAriaLabel="문서분류 요약"
        colgroup={
          <colgroup>
            <col className="tbl-col-w-200" />
            <col />
            <col className="tbl-col-w-200" />
            <col />
          </colgroup>
        }
      >
        <TableRow>
          <LabelCell>문서분류</LabelCell>
          <TableCell colSpan={3}>{classification || "-"}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>개인정보 포함</LabelCell>
          <TableCell>
            {ynLabel(detailData?.prvcInclYn, "포함", "미포함")}
          </TableCell>
          <LabelCell>사용여부</LabelCell>
          <TableCell>
            {ynLabel(detailData?.useEn, "사용", "사용안함")}
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>등록일자</LabelCell>
          <TableCell>{dateLabel(detailData?.regDt)}</TableCell>
          <LabelCell>등록자</LabelCell>
          <TableCell>{detailData?.rgtrId || "-"}</TableCell>
        </TableRow>
      </TableWrapper>

      <TableWrapper
        tableAriaLabel="문서분류 상세 조회"
        colgroup={
          <colgroup>
            <col className="tbl-col-w-200" />
            <col />
            <col className="tbl-col-w-200" />
            <col />
          </colgroup>
        }
      >
        <TableRow>
          <LabelCell>부서명</LabelCell>
          <TableCell>{sub.deptNm || "-"}</TableCell>
          <LabelCell>파일명</LabelCell>
          <TableCell>{sub.fileNm || "-"}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>보유목적</LabelCell>
          <TableCell>{sub.hldPrpsExpln || "-"}</TableCell>
          <LabelCell>사용부서(내부, 외부)</LabelCell>
          <TableCell>{sub.useDeptNm || "-"}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>개인정보 처리방법</LabelCell>
          <TableCell>{sub.prvcPrcsMthdExpln || "-"}</TableCell>
          <LabelCell>보유기간</LabelCell>
          <TableCell>
            {holdPeriodLabel(sub.hldPrdDfyrs ?? null, sub.hldPrdMmCnt ?? null)}
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>정보주체의 개인정보항목</LabelCell>
          <TableCell>{sub.infoMnbdPrvcMttr || "-"}</TableCell>
          <LabelCell>법정대리인의 개인정보항목</LabelCell>
          <TableCell>{sub.sttyAgtPrvcMttr || "-"}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>주민등록번호 수집여부</LabelCell>
          <TableCell>{ynLabel(sub.rrnoClctYn, "수집", "미수집")}</TableCell>
          <LabelCell>주민등록번호 수집 법령근거</LabelCell>
          <TableCell>{sub.rrnoClctSttBssExpln || "-"}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>정보주체 동의여부</LabelCell>
          <TableCell>{ynLabel(sub.infoMnbdAgreYn, "동의", "미동의")}</TableCell>
          <LabelCell>정보주체 동의 없이 수집 법령근거</LabelCell>
          <TableCell>{sub.infoMnbdDsagClctSttBssExpln || "-"}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>민감 정보 보유여부</LabelCell>
          <TableCell>{ynLabel(sub.spiHldYn, "보유", "미보유")}</TableCell>
          <LabelCell>민감 정보 별도동의 여부</LabelCell>
          <TableCell>{ynLabel(sub.spiIndivAgrnYn, "동의", "미동의")}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>고유식별정보 보유여부</LabelCell>
          <TableCell>{ynLabel(sub.uiiHldYn, "보유", "미보유")}</TableCell>
          <LabelCell>고유식별정보 별도동의여부</LabelCell>
          <TableCell>{ynLabel(sub.uiiIndivAgreYn, "동의", "미동의")}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>개인정보영향평가 대상여부</LabelCell>
          <TableCell>{ynLabel(sub.prvcEvlTrgtYn, "대상", "미대상")}</TableCell>
          <LabelCell>취급담당자</LabelCell>
          <TableCell>{sub.hndlPicNm || "-"}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>제3자 제공받는 자</LabelCell>
          <TableCell>{sub.tdptySplrcpNmCn || "-"}</TableCell>
          <LabelCell>제3자 제공 근거</LabelCell>
          <TableCell>{sub.tdptyPvsnBssExpln || "-"}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>제3자 제공 항목</LabelCell>
          <TableCell>{sub.tdptyPvsnMttr || "-"}</TableCell>
          <LabelCell>개인정보처리 위탁 업체명</LabelCell>
          <TableCell>{sub.prvcPrcsCnsgnBzentyNmCn || "-"}</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>개인정보위탁 계약서 여부</LabelCell>
          <TableCell>{ynLabel(sub.prvcCnsgnCtrtYn, "있음", "없음")}</TableCell>
          <LabelCell>개인정보위탁사실 게재여부</LabelCell>
          <TableCell>
            {ynLabel(sub.prvcCnsgnFactIndctYn, "게재", "미게재")}
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>목적 외 이용.제공 여부</LabelCell>
          <TableCell>
            {ynLabel(sub.prpsExclUtztnPvsnYn, "있음", "없음")}
          </TableCell>
          <LabelCell>목적 외 이용.제공 근거</LabelCell>
          <TableCell>{sub.prpsExclUtztnPvsnBssExpln || "-"}</TableCell>
        </TableRow>
      </TableWrapper>
    </div>
  );
}
