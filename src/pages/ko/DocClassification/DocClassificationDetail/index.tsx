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
  checkDocClassificationDelete,
  deleteDocClassification,
  fetchDocClassificationDetail,
  unuseDocClassification,
} from "@/features/classification/DocClassificationListThunk";
import {
  selectDocClassificationDeleteLoading,
  selectDocClassificationDetail,
  selectDocClassificationDetailError,
  selectDocClassificationDetailLoading,
} from "@/features/classification/DocClassificationListSelectors";
import { formatDateDash } from "@/utils/formater";
import { getLangFromPathname, langPath } from "@/routes/lang";
import DocClassificationDeleteDialog from "@/components/biz/DocClassificationDeleteDialog";
import { getErrorMessage } from "@/utils/globalFunc";

type DeleteDialogMode = "delete" | "unuse";

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
  const [deleteDialogMode, setDeleteDialogMode] =
    React.useState<DeleteDialogMode>("delete");

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

  const handleUnuseSuccess = React.useCallback(() => {
    notifications.show("사용안함 처리되었습니다.", {
      severity: "success",
      autoHideDuration: 3000,
    });
    dispatch(fetchDocClassificationDetail(targetDocClsfNo));
  }, [dispatch, notifications, targetDocClsfNo]);

  const openDeleteDialog = React.useCallback((mode: DeleteDialogMode) => {
    setDeleteDialogMode(mode);
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = React.useCallback(() => {
    if (isDeleteLoading) return;
    setDeleteDialogOpen(false);
  }, [isDeleteLoading]);

  const handleDeleteWithReason = React.useCallback(
    async ({ password, reason }: { password: string; reason: string }) => {
      try {
        if (deleteDialogMode === "unuse") {
          await dispatch(
            unuseDocClassification({
              docClsfNo: targetDocClsfNo,
              password,
              reason,
            }),
          ).unwrap();
          setDeleteDialogOpen(false);
          handleUnuseSuccess();
          return;
        }

        await dispatch(
          deleteDocClassification({
            docClsfNo: targetDocClsfNo,
            password,
            reason,
          }),
        ).unwrap();
        setDeleteDialogOpen(false);
        handleDeleteSuccess();
      } catch (error) {
        notifications.show(getErrorMessage(error), {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    },
    [
      deleteDialogMode,
      dispatch,
      handleDeleteSuccess,
      handleUnuseSuccess,
      notifications,
      targetDocClsfNo,
    ],
  );

  const handleViewDataDelete = React.useCallback(async () => {
    if (!targetDocClsfNo) return;

    try {
      const result = await dispatch(checkDocClassificationDelete(targetDocClsfNo)).unwrap();
      if (result.hasLinkedElectronicDocs) {
        const confirmed = await dialogs.confirm(
          "전자문서가 연결된 문서분류입니다. 사용안함 처리하시겠습니까?",
          {
            title: "문서분류 사용안함",
            severity: "warning",
            okText: "확인",
            cancelText: "취소",
          },
        );
        if (confirmed) openDeleteDialog("unuse");
        return;
      }

      openDeleteDialog("delete");
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [dialogs, dispatch, notifications, openDeleteDialog, targetDocClsfNo]);

  const handleBack = React.useCallback(() => {
    navigate(langPath("/docClassification/list", curLang));
  }, [curLang, navigate]);

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
          "사용여부",
          detailData?.useEn === "Y" ? "사용" : "사용안함",
          "등록일자",
          formatDateDash(detailData?.regDt),
        )}
        {renderFullRow(
          "등록자",
          detailData?.rgtrNm || detailData?.rgtrId || "-",
        )}
      </TableWrapper>

      <DocClassificationDeleteDialog
        open={deleteDialogOpen}
        loading={isDeleteLoading}
        title={deleteDialogMode === "unuse" ? "문서분류 사용안함" : "문서분류 삭제"}
        submitText={deleteDialogMode === "unuse" ? "사용안함" : "삭제"}
        onClose={handleCloseDeleteDialog}
        onSubmit={handleDeleteWithReason}
      />
    </div>
  );
}
