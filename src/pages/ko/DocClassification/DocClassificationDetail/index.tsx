import * as React from "react";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import TableWrapper from "@/components/table/TableWrapper";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications";
import DocClassificationHistoryButton from "@/components/biz/DocClassificationHistoryDialog";
import LabelCell from "@/components/table/LabelCell";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { formatDateDash, holdPeriodLabel, ynLabel } from "@/utils/formater";
import { getLangFromPathname, langPath } from "@/routes/lang";
import DocClassificationDeleteDialog from "@/components/biz/DocClassificationDeleteDialog";
import { getErrorMessage } from "@/utils/globalFunc";

const DETAIL_LABEL_WIDTH = 180;

export default function DocClassificationDetail() {
  const location = useLocation();
  const { docClsfNo } = useParams();
  const targetDocClsfNo = docClsfNo ?? "";
  const dispatch = useAppDispatch();

  const dialogs = useDialogs();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const curLang = getLangFromPathname(location.pathname);

  const detailData = useAppSelector(selectDocClassificationDetail);
  const isLoading = useAppSelector(selectDocClassificationDetailLoading);
  const detailError = useAppSelector(selectDocClassificationDetailError);
  const isDeleteLoading = useAppSelector(selectDocClassificationDeleteLoading);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

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
    navigate(langPath(`/docClassification/${targetDocClsfNo}/modify`, curLang));
  }, [curLang, navigate, targetDocClsfNo]);

  const handleDeleteSuccess = React.useCallback(() => {
    notifications.show("삭제되었습니다.", {
      severity: "success",
      autoHideDuration: 3000,
    });
    navigate(langPath("/docClassification/list", curLang));
  }, [curLang, navigate, notifications]);

  const handleViewDataDelete = React.useCallback(async () => {
    if (!detailData) return;

    if (detailData.prvcInclYn === "Y") {
      setDeleteDialogOpen(true);
      return;
    }

    const confirmed = await dialogs.confirm("삭제하시겠습니까?", {
      title: "삭제 확인",
      severity: "error",
      okText: "확인",
      cancelText: "취소",
    });

    if (!confirmed) return;

    try {
      await dispatch(deleteDocClassification(targetDocClsfNo)).unwrap();
      handleDeleteSuccess();
    } catch (e) {
      notifications.show(getErrorMessage(e), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [detailData, dialogs, dispatch, handleDeleteSuccess, notifications, targetDocClsfNo]);

  const handleDeleteWithReason = React.useCallback(
    async ({ password, reason }: { password: string; reason: string }) => {
      if (!password) {
        notifications.show("비밀번호를 입력해 주세요.", {
          severity: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      if (!reason) {
        notifications.show("삭제 사유를 입력해 주세요.", {
          severity: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      try {
        await dispatch(
          deleteDocClassification({
            docClsfNo: targetDocClsfNo,
            password,
            reason,
          }),
        ).unwrap();
        setDeleteDialogOpen(false);
        handleDeleteSuccess();
      } catch (e) {
        notifications.show(getErrorMessage(e), {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    },
    [dispatch, handleDeleteSuccess, notifications, targetDocClsfNo],
  );

  const handleBack = () => {
    const listState = (
      location.state as { listState?: Record<string, unknown> } | null
    )?.listState;
    navigate(langPath("/docClassification/list", curLang), {
      state: {
        restoreListState: listState,
      },
    });
  };

  const renderFullRow = React.useCallback(
    (label: string, value: React.ReactNode) => (
      <TableRow>
        <LabelCell width={DETAIL_LABEL_WIDTH}>{label}</LabelCell>
        <TableCell colSpan={3}>{value}</TableCell>
      </TableRow>
    ),
    [],
  );

  const renderPairRow = React.useCallback(
    (
      leftLabel: string,
      leftValue: React.ReactNode,
      rightLabel: string,
      rightValue: React.ReactNode,
    ) => (
      <TableRow>
        <LabelCell width={DETAIL_LABEL_WIDTH}>{leftLabel}</LabelCell>
        <TableCell>{leftValue}</TableCell>
        <LabelCell width={DETAIL_LABEL_WIDTH}>{rightLabel}</LabelCell>
        <TableCell>{rightValue}</TableCell>
      </TableRow>
    ),
    [],
  );

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
          <Button className="btn_fixed-sm" variant="contained" onClick={handleBack}>
            목록
          </Button>
          <DocClassificationHistoryButton docClsfNo={targetDocClsfNo} />
        </div>
        <div className="btn_wrapper detail-top-actions__group">
          <Button className="btn_fixed-sm" variant="contained" onClick={handleViewDataEdit}>
            수정
          </Button>
          <Button
            className="btn_fixed-sm"
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
            <col style={{ width: `${DETAIL_LABEL_WIDTH}px` }} />
            <col />
            <col style={{ width: `${DETAIL_LABEL_WIDTH}px` }} />
            <col />
          </colgroup>
        }
      >
        {renderFullRow("문서분류", classification || "-")}
        {renderPairRow(
          "개인정보 포함",
          ynLabel(detailData?.prvcInclYn, "포함", "미포함"),
          "사용여부",
          ynLabel(detailData?.useEn, "사용", "사용안함"),
        )}
        {renderPairRow(
          "등록일자",
          formatDateDash(detailData?.regDt),
          "등록자",
          detailData?.rgtrNm || detailData?.rgtrId || "-",
        )}
      </TableWrapper>

      <DocClassificationDeleteDialog
        open={deleteDialogOpen}
        loading={isDeleteLoading}
        onClose={() => setDeleteDialogOpen(false)}
        onSubmit={handleDeleteWithReason}
      />

      {detailData?.prvcInclYn === "Y" ? (
        <TableWrapper
          tableAriaLabel="문서분류 상세 조회"
          colgroup={
            <colgroup>
              <col style={{ width: `${DETAIL_LABEL_WIDTH}px` }} />
              <col />
              <col style={{ width: `${DETAIL_LABEL_WIDTH}px` }} />
              <col />
            </colgroup>
          }
        >
          {renderPairRow("부서명", sub.deptNm || "-", "파일명", sub.fileNm || "-")}
          {renderFullRow("보유목적", sub.hldPrpsExpln || "-")}
          {renderPairRow(
            "사용부서(내부, 외부)",
            sub.useDeptNm || "-",
            "보유기간",
            holdPeriodLabel(sub.hldPrdDfyrs ?? null, sub.hldPrdMmCnt ?? null),
          )}
          {renderFullRow("개인정보 처리방법", sub.prvcPrcsMthdExpln || "-")}
          {renderFullRow("정보주체의 개인정보항목", sub.infoMnbdPrvcMttr || "-")}
          {renderFullRow("법정대리인의 개인정보항목", sub.sttyAgtPrvcMttr || "-")}
          {renderPairRow(
            "주민등록번호 수집여부",
            ynLabel(sub.rrnoClctYn, "수집", "미수집"),
            "주민등록번호 수집 법령근거",
            sub.rrnoClctSttBssExpln || "-",
          )}
          {renderPairRow(
            "정보주체 동의여부",
            ynLabel(sub.infoMnbdAgreYn, "동의", "미동의"),
            "동의 없이 수집 법령근거",
            sub.infoMnbdDsagClctSttBssExpln || "-",
          )}
          {renderPairRow(
            "민감정보 보유여부",
            ynLabel(sub.spiHldYn, "보유", "미보유"),
            "민감정보 별도동의 여부",
            ynLabel(sub.spiIndivAgrnYn || sub.spiIndivAgreYn, "동의", "미동의"),
          )}
          {renderPairRow(
            "고유식별정보 보유여부",
            ynLabel(sub.uiiHldYn, "보유", "미보유"),
            "고유식별정보 별도동의여부",
            ynLabel(sub.uiiIndivAgreYn, "동의", "미동의"),
          )}
          {renderPairRow(
            "개인정보영향평가 대상여부",
            ynLabel(sub.prvcEvlTrgtYn, "대상", "미대상"),
            "취급담당자",
            sub.hndlPicNm || "-",
          )}
          {renderFullRow("제3자 제공받는 자", sub.tdptySplrcpNmCn || "-")}
          {renderFullRow("제3자 제공 근거", sub.tdptyPvsnBssExpln || "-")}
          {renderFullRow("제3자 제공 항목", sub.tdptyPvsnMttr || "-")}
          {renderFullRow(
            "개인정보처리 위탁 업체명",
            sub.prvcPrcsCnsgnBzentyNmCn || "-",
          )}
          {renderPairRow(
            "개인정보위탁 계약서 여부",
            ynLabel(sub.prvcCnsgnCtrtYn, "있음", "없음"),
            "개인정보위탁사실 게재여부",
            ynLabel(sub.prvcCnsgnFactIndctYn, "게재", "미게재"),
          )}
          {renderPairRow(
            "목적 외 이용·제공 여부",
            ynLabel(sub.prpsExclUtztnPvsnYn, "있음", "없음"),
            "목적 외 이용·제공 근거",
            sub.prpsExclUtztnPvsnBssExpln || "-",
          )}
        </TableWrapper>
      ) : null}
    </div>
  );
}
