import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DigitalDocViewerButton from "@/components/actionButtons/DigitalDocViewerButton";
import DigitalDocDownDialog from "@/components/biz/DigitalDocDownDialog";
import DigitalDocHistoryButton from "@/components/actionButtons/DigitalDocHistoryButton";
import { AuthrtTable } from "@/components/table/AuthrtTable";
import GridField from "@/components/common/GridField";
import TableWrapper from "@/components/table/TableWrapper";
import LabelCell from "@/components/table/LabelCell";
import MuiSelect from "@/components/elements/MuiSelect";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchDigitalDocDetail } from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocDetail,
  selectDigitalDocDetailError,
  selectDigitalDocDetailLoading,
} from "@/features/digitalDoc/DigitalDocSelectors";
import useNotifications from "@/hooks/useNotifications";
import PageStatus from "@/components/common/PageStatus";
import URL from "@/constants/url";
import { getLangFromPathname, langPath } from "@/routes/lang";
import { displayDate, gvbkLabel, prvcLabel } from "@/utils/formater";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";

const holdPeriodLabel = (yearCode: string, monthCount: string) => {
  const map: Record<string, string> = {
    "1": "1년",
    "3": "3년",
    "5": "5년",
    "10": "10년",
    "30": "30년",
    "90": "준영구",
    "99": "영구",
  };

  if (yearCode === "0") return monthCount ? `${monthCount}개월` : "직접입력";
  return map[yearCode] ?? "-";
};

export default function DigitalDocDetail() {
  const { eldocNo = "" } = useParams<{ eldocNo?: string }>();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const dispatch = useAppDispatch();

  const detail = useAppSelector(selectDigitalDocDetail);
  const isLoading = useAppSelector(selectDigitalDocDetailLoading);
  const detailError = useAppSelector(selectDigitalDocDetailError);
  const [selectedDocLclsfNo, setSelectedDocLclsfNo] = React.useState("");
  const [selectedDocMclsfNo, setSelectedDocMclsfNo] = React.useState("");
  const [selectedDocSclsfNo, setSelectedDocSclsfNo] = React.useState("");

  const { lclsfList, mclsfList, sclsfList } = useDocClsfOptions(
    selectedDocLclsfNo,
    selectedDocMclsfNo,
  );

  const curLang = getLangFromPathname(location.pathname);

  React.useEffect(() => {
    if (!eldocNo) return;
    dispatch(fetchDigitalDocDetail(eldocNo));
  }, [dispatch, eldocNo]);

  React.useEffect(() => {
    if (!detailError) return;
    notifications.show(detailError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [detailError, notifications]);

  React.useEffect(() => {
    if (!detail) return;
    setSelectedDocLclsfNo(detail.docLclsfNo ?? "");
    setSelectedDocMclsfNo(detail.docMclsfNo ?? "");
    setSelectedDocSclsfNo(detail.docSclsfNo ?? "");
  }, [detail]);

  const handleBack = React.useCallback(() => {
    navigate(langPath(URL.DIGITAL_DOC_LIST, curLang));
  }, [curLang, navigate]);

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

  const classification = [
    detail?.docLclsfNm,
    detail?.docMclsfNm,
    detail?.docSclsfNm,
  ]
    .filter(Boolean)
    .join(" > ");
  const holdLabel = holdPeriodLabel(
    detail?.hldPrdDfyrs ?? "",
    detail?.hldPrdMmCnt ?? "",
  );
  const clctLabel = detail?.endYmd
    ? `${displayDate(detail.endYmd)}${holdLabel !== "-" ? ` (${holdLabel})` : ""}`
    : "-";
  const mappedGvbkLabel = gvbkLabel(detail?.gvbkYn);
  const mappedPrvcLabel = prvcLabel(detail?.prvcInclYn);

  return (
    <div>
      <div className="btn_wrapper">
        <DigitalDocHistoryButton eldocNo={eldocNo} />
        <Button variant="contained" color="primary" onClick={handleBack}>
          목록
        </Button>
      </div>

      <Grid container spacing={0} className="table-view-grid">
        <GridField item={12} label="문서분류" value={classification || "-"} />
        <GridField label="문서번호" value={detail?.docNo || "-"} />
        <GridField label="기본권한" value={detail?.deptId || "-"} />
        <GridField item={12} label="문서제목" value={detail?.docTtl || "-"} />
        <GridField
          label="수집일자"
          value={displayDate(detail?.clctYmd ?? "")}
        />
        <GridField label="종료일자" value={clctLabel} />
        <GridField label="개인정보" value={mappedPrvcLabel} />
        <GridField label="반환여부" value={mappedGvbkLabel} />
        <GridField item={12} label="비고" value={detail?.addExpln || "-"} />
        {/* TODO: 첨부파일 개발 필요 */}
        <GridField
          label="첨부파일"
          value={
            <Stack direction="row" spacing={1} alignItems="center">
              {/* TODO: 업로드된 파일이 있다면 연결 필요 */}
              <Typography>피해구제 접수서류.pdf</Typography>
              {detail?.atchFileSn && (
                <>
                  <DigitalDocViewerButton fileUrl="/pdf/피해구제 접수서류.pdf" />
                  <DigitalDocDownDialog atchFileSn={detail.atchFileSn} />
                </>
              )}
            </Stack>
          }
        />
      </Grid>

      <Grid container spacing={3} gap={2} mt={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AuthrtTable eldocNo={eldocNo} tableAriaLabel="문서고 공람 이력" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <div className="tbl_wrap">
            <TableWrapper
              aria-label="문서분류/반환여부 수정"
              colgroup={
                <colgroup>
                  <col style={{ width: "80px" }} />
                  <col />
                </colgroup>
              }
            >
              <TableRow>
                <LabelCell width={100}>문서분류</LabelCell>
                <TableCell colSpan={3}>
                  <Stack direction="row" spacing={1}>
                    <MuiSelect
                      id="docLclsfNo"
                      items={lclsfList}
                      value={selectedDocLclsfNo}
                      onChange={(e) => {
                        setSelectedDocLclsfNo(e.target.value);
                        setSelectedDocMclsfNo("");
                        setSelectedDocSclsfNo("");
                      }}
                    />
                    <MuiSelect
                      id="docMclsfNo"
                      items={mclsfList}
                      value={selectedDocMclsfNo}
                      onChange={(e) => {
                        setSelectedDocMclsfNo(e.target.value);
                        setSelectedDocSclsfNo("");
                      }}
                    />
                    <MuiSelect
                      id="docSclsfNo"
                      items={sclsfList}
                      value={selectedDocSclsfNo}
                      onChange={(e) => setSelectedDocSclsfNo(e.target.value)}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <LabelCell>반환여부</LabelCell>
                <TableCell>
                  <FormControl component="fieldset">
                    <RadioGroup defaultValue={detail?.gvbkYn || "N"}>
                      <FormControlLabel
                        value="Y"
                        control={<Radio size="small" />}
                        label="반환"
                      />
                      <FormControlLabel
                        value="N"
                        control={<Radio size="small" />}
                        label="미반환"
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
              </TableRow>
            </TableWrapper>
          </div>
          {/* TODO: 수정 API 연결 필요 */}
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button variant="contained" color="primary">
              수정
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
