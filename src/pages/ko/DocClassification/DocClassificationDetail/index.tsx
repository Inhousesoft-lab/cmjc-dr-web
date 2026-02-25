import * as React from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import TableWrapper from "@/components/table/TableWrapper";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications";
import DocClassificationHistoryButton from "@/components/biz/DocClassificationHistoryDialog";
import DigitalDocDownButton from "@/components/actionButtons/DigitalDocDownButton";
import DigitalDocViewerButton from "@/components/actionButtons/DigitalDocViewerButton";
import GridField from "@/components/common/GridField";
import LabelCell from "@/components/table/LabelCell";
import { useNavigate, useParams } from "react-router-dom";
import { DocClassDetail } from "@/types/docClassification";
import PageStatus from "@/components/common/PageStatus";
import {
  deleteDocClassificationApiPath,
  selectDocClassificationDetailApiPath,
} from "@/api/docClassification/DocClassificationApiPaths";
import https from "@/api/axiosInstance";

export default function DocClassificationDetail() {
  const { docClsfNo } = useParams();

  const dialogs = useDialogs();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [detailData, setDetailData] = React.useState<DocClassDetail | null>(
    null,
  );

  const [isLoading, setIsLoading] = React.useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await https.get(
        selectDocClassificationDetailApiPath(docClsfNo ?? ""),
      );
      const payload = res.data?.data ?? res.data;
      setDetailData((payload ?? null) as DocClassDetail | null);
    } catch (e) {
      notifications.show(getErrorMessage(e), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const [returnStatus, setReturnStatus] = React.useState("");

  const [approvalRows, setApprovalRows] = React.useState<
    { id: number; dept: string; target: string; name: string }[]
  >([
    { id: 1, dept: "정보화팀", target: "전체", name: "전체" },
    { id: 2, dept: "경영팀", target: "전체", name: "김길동" },
  ]);

  const [newDept, setNewDept] = React.useState("");
  const [newName, setNewName] = React.useState("");

  const handleAddApprovalRow = React.useCallback(async () => {
    if (!newDept || !newName) return;
    setApprovalRows((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        dept: newDept,
        target: "전체",
        name: newName,
      },
    ]);
    setNewDept("");
    setNewName("");

    notifications.show("공람 이력이 등록되었습니다.", {
      severity: "success",
      autoHideDuration: 3000,
    });
  }, [newDept, newName, notifications]);

  const handleDeleteApprovalRow = React.useCallback(
    async (id: number) => {
      // 삭제 대상 행 찾기
      const targetRow = approvalRows.find((row) => row.id === id);
      if (!targetRow) {
        return;
      }

      const confirmed = await dialogs.confirm("삭제하시겠습니까?", {
        title: `삭제 확인`,
        severity: "error",
        okText: "확인",
        cancelText: "취소",
      });

      if (!confirmed) {
        return;
      }

      setApprovalRows((prev) => prev.filter((row) => row.id !== id));

      notifications.show("공람 이력이 삭제되었습니다.", {
        severity: "success",
        autoHideDuration: 3000,
      });
    },
    [approvalRows, dialogs, notifications],
  );

  const handleViewDataEdit = React.useCallback(() => {
    navigate(`/docClassification/${docClsfNo}/modify`);
  }, [navigate, docClsfNo]);

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
      setIsLoading(true);
      try {
        await deleteDocClassificationApiPath(docClsfNo ?? "");

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
      } finally {
        setIsLoading(false);
      }
    }
  }, [detailData, dialogs, docClsfNo, navigate, notifications]);

  const handleBack = () => {
    navigate("/docClassification/list");
  };

  const detailExt = detailData as
    | (DocClassDetail & {
        docNo?: string;
        docTtl?: string;
        endYmd?: string;
        gvbkYn?: string;
        addExpln?: string;
        deptNm?: string;
        deptId?: string;
      })
    | null;

  const mappedDocNo = detailExt?.docNo ?? "-";
  const mappedDocTtl = detailExt?.docTtl ?? "-";
  const mappedDept = detailExt?.deptNm ?? detailExt?.deptId ?? "-";
  const mappedEndYmd = detailExt?.endYmd
    ? formatDate(detailExt.endYmd.replaceAll("-", ""))
    : "-";
  const mappedGvbkYn =
    detailExt?.gvbkYn === "Y"
      ? "반환"
      : detailExt?.gvbkYn === "N"
        ? "미반환"
        : "-";
  const mappedAddExpln = detailExt?.addExpln ?? "-";

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

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
          <DocClassificationHistoryButton docClsfNo={docClsfNo ?? ""} />
        </div>
        <div className="btn_wrapper detail-top-actions__group">
          <Button variant="contained" onClick={handleViewDataEdit}>
            수정
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleViewDataDelete}
          >
            삭제
          </Button>
        </div>
      </Stack>

      {/* 문서분류 */}
      <Grid container spacing={0} className="table-view-grid">
        <GridField
          label="문서분류"
          value={
            <>
              {detailData?.docClsfSeCd === "L" && `${detailData?.docLclsfNm}`}
              {detailData?.docClsfSeCd === "M" &&
                `${detailData?.docLclsfNm} > ${detailData?.docMclsfNm}`}
              {detailData?.docClsfSeCd === "S" &&
                `${detailData?.docLclsfNm} > ${detailData?.docMclsfNm} > ${detailData?.docSclsfNm}`}
            </>
          }
        />
        <GridField
          label="개인정보 포함"
          value={detailData?.prvcInclYn === "Y" ? "포함" : "미포함"}
        />
        <GridField
          label="사용여부"
          value={detailData?.useEn === "Y" ? "사용" : "사용안함"}
        />
        <GridField
          label="등록일자"
          value={
            detailData?.regDt
              ? formatDate(detailData?.regDt.replaceAll("-", ""))
              : "-"
          }
        />
        <GridField label="등록자" value={detailData?.rgtrId ?? "-"} />
        <GridField label="문서번호" value={mappedDocNo} />
        <GridField label="기본권한" value={mappedDept} />
        <GridField label="문서제목" value={mappedDocTtl} />
        <GridField label="종료일자" value={mappedEndYmd} />
        <GridField label="반환여부" value={mappedGvbkYn} />
        <GridField label="비고" value={mappedAddExpln} />
        <GridField
          label="첨부파일"
          value={
            <Stack
              direction="row"
              gap={1}
              justifyContent="flex-start"
              alignItems="center"
            >
              피해구제 접수서류.pdf
              <DigitalDocViewerButton />
              <DigitalDocDownButton />
            </Stack>
          }
        />
      </Grid>

      <Grid container spacing={3} gap={2} mt={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <div className="tbl_wrap">
            <TableWrapper
              tableAriaLabel="디지털 문서 상세 정보"
              colgroup={
                <colgroup>
                  <col className="tbl-col-w-28p" />
                  <col className="tbl-col-w-28p" />
                  <col className="tbl-col-w-28p" />
                  <col className="tbl-col-w-16p" />
                </colgroup>
              }
            >
              <TableRow>
                <LabelCell>공람</LabelCell>
                <LabelCell>부서</LabelCell>
                <LabelCell>이름</LabelCell>
                <LabelCell>삭제</LabelCell>
              </TableRow>
              {approvalRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.dept}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell sx={{ width: 60 }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteApprovalRow(row.id)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <FormControl fullWidth>
                    <Select size="small" displayEmpty value={newDept}>
                      <MenuItem value="">
                        <em>부서</em>
                      </MenuItem>
                      <MenuItem value="정보화팀">정보화팀</MenuItem>
                      <MenuItem value="경영팀">경영팀</MenuItem>
                      <MenuItem value="기획팀">기획팀</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <Select size="small" displayEmpty value={newName}>
                      <MenuItem value="">
                        <em>대상</em>
                      </MenuItem>
                      <MenuItem value="전체">전체</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <Select size="small" displayEmpty value={newName}>
                      <MenuItem value="">
                        <em>이름</em>
                      </MenuItem>
                      <MenuItem value="전체">전체</MenuItem>
                      <MenuItem value="김길동">김길동</MenuItem>
                      <MenuItem value="홍길동">홍길동</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell sx={{ width: 60 }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleAddApprovalRow}
                  >
                    등록
                  </Button>
                </TableCell>
              </TableRow>
            </TableWrapper>
          </div>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <div className="tbl_wrap">
            <TableWrapper tableAriaLabel="문서분류 및 반환여부">
              <TableRow>
                <LabelCell>문서분류</LabelCell>
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ width: "100%" }}
                  >
                    <Select size="small" fullWidth displayEmpty value="">
                      <MenuItem value="">
                        <em>대분류</em>
                      </MenuItem>
                    </Select>
                    <Select size="small" fullWidth displayEmpty value="">
                      <MenuItem value="">
                        <em>중분류</em>
                      </MenuItem>
                    </Select>
                    <Select size="small" fullWidth displayEmpty value="">
                      <MenuItem value="">
                        <em>소분류</em>
                      </MenuItem>
                    </Select>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <LabelCell>반환여부</LabelCell>
                <TableCell>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      value={returnStatus}
                      onChange={(event) => setReturnStatus(event.target.value)}
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
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
