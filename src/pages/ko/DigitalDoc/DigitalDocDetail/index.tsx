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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DigitalDocHistoryButton from "@/components/actionButtons/DigitalDocHistoryButton";
import { AuthrtTable } from "@/components/table/AuthrtTable";
import TableWrapper from "@/components/table/TableWrapper";
import LabelCell from "@/components/table/LabelCell";
import MuiSelect from "@/components/elements/MuiSelect";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchDigitalDocDetail,
  updateDigitalDoc,
} from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocDetail,
  selectDigitalDocDetailError,
  selectDigitalDocDetailLoading,
  selectDigitalDocUpdating,
} from "@/features/digitalDoc/DigitalDocSelectors";
import useNotifications from "@/hooks/useNotifications";
import PageStatus from "@/components/common/PageStatus";
import URL from "@/constants/url";
import { getLangFromPathname, langPath } from "@/routes/lang";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import DocDetailTable from "@/components/table/DocDetailTable";

export default function DigitalDocDetail() {
  const { eldocNo = "" } = useParams<{ eldocNo?: string }>();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const dispatch = useAppDispatch();

  const detail = useAppSelector(selectDigitalDocDetail);
  const isLoading = useAppSelector(selectDigitalDocDetailLoading);
  const detailError = useAppSelector(selectDigitalDocDetailError);
  const isUpdating = useAppSelector(selectDigitalDocUpdating);
  const [selectedDocLclsfNo, setSelectedDocLclsfNo] = React.useState("");
  const [selectedDocMclsfNo, setSelectedDocMclsfNo] = React.useState("");
  const [selectedDocSclsfNo, setSelectedDocSclsfNo] = React.useState("");
  const [selectedGvbkYn, setSelectedGvbkYn] = React.useState<"Y" | "N">("N");

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
    setSelectedGvbkYn(detail.gvbkYn === "Y" ? "Y" : "N");
  }, [detail]);

  const handleBack = React.useCallback(() => {
    navigate(langPath(URL.DIGITAL_DOC_LIST, curLang));
  }, [curLang, navigate]);

  const handleUpdate = React.useCallback(async () => {
    if (!eldocNo) {
      notifications.show("전자문서 번호가 없습니다.", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    const payload = {
      eldocNo,
      docClsfNo:
        selectedDocSclsfNo || selectedDocMclsfNo || selectedDocLclsfNo || "",
      gvbkYn: selectedGvbkYn,
    };

    try {
      await dispatch(updateDigitalDoc(payload)).unwrap();
      notifications.show("전자문서가 수정되었습니다.", {
        severity: "success",
        autoHideDuration: 3000,
      });
      dispatch(fetchDigitalDocDetail(eldocNo));
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [
    dispatch,
    eldocNo,
    notifications,
    selectedDocLclsfNo,
    selectedDocMclsfNo,
    selectedDocSclsfNo,
    selectedGvbkYn,
  ]);

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

  return (
    <div>
      <div className="btn_wrapper">
        <DigitalDocHistoryButton eldocNo={eldocNo} />
        <Button variant="contained" color="primary" onClick={handleBack}>
          목록
        </Button>
      </div>

      <DocDetailTable eldocNo={eldocNo} detail={detail} />

      <Grid container spacing={3} gap={2} mt={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AuthrtTable eldocNo={eldocNo} tableAriaLabel="문서고 공람 이력" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TableWrapper
            aria-label="문서분류/반환여부 수정"
            colgroup={
              <colgroup>
                <col className="tbl-col-w-100" />
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
              <TableCell colSpan={3}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={selectedGvbkYn}
                    onChange={(e) =>
                      setSelectedGvbkYn((e.target.value as "Y" | "N") ?? "N")
                    }
                  >
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
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              수정
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
