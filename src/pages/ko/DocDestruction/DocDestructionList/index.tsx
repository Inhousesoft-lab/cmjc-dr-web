import { Box, Button, Grid, IconButton, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { listDefs } from "./col-def";

import DocDestructionManagementPrintButton from "@/components/biz/DocDestructionManagementPrintDialog";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dayjs from "dayjs";
import MuiSelect from "@/components/elements/MuiSelect";
import { useNavigate } from "react-router";
import useNotifications from "@/hooks/useNotifications";
import { DocDestruction } from "@/types/docDestruction";
import { ColDef } from "ag-grid-community";
import GridField from "@/components/common/GridField";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchDocDestructionList } from "@/features/docDestruction/DocDestructionThunk";
import {
  selectDocDestructionError,
  selectDocDestructionLoading,
  selectDocDestructionRowCount,
  selectDocDestructionRows,
} from "@/features/docDestruction/DocDestructionSelectors";
import type { SearchValues } from "@/types/docDestruction";
import { getLangFromPathname, langPath } from "@/routes/lang";
import DocDestructionReqButton from "@/components/actionButtons/DocDestructionReqButton";
import DocDestructionAppvButton from "@/components/actionButtons/DocDestructionAppvButton";

const buildSearchValues = (
  docLclsfNo: string,
  docMclsfNo: string,
  docSclsfNo: string,
): SearchValues => ({
  docLclsfNo,
  docMclsfNo,
  docSclsfNo,
  prvcInclYn: "N",
  docNo: "",
  docTtl: "",
  hldPrdChangedOnly: false,
  docClsfNm: "",
  fromEndYmd: dayjs().add(-7, "day").format("YYYYMMDD"),
  toEndYmd: dayjs()
    .set("year", 9999)
    .set("month", 11)
    .set("date", 31)
    .format("YYYYMMDD"),
  fromDstrcAplyYmd: "",
  toDstrcAplyYmd: "",
  fromDstrcAprvYmd: "",
  toDstrcAprvYmd: "",
  pageNum: 1,
  pageSize: 10,
});

export default function DocDestructionList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notifications = useNotifications();
  const curLang = getLangFromPathname(location.pathname);

  const printAreaRef = useRef<HTMLDivElement | null>(null);

  const [printOn, setPrintOn] = useState(false);
  const [docLclsfNo, setDocLclsfNo] = useState("");
  const [docMclsfNo, setDocMclsfNo] = useState("");
  const [docSclsfNo, setDocSclsfNo] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { lclsfList, mclsfList, sclsfList } = useDocClsfOptions(
    docLclsfNo,
    docMclsfNo,
  );

  const [columnDefs] = React.useState<ColDef<DocDestruction>[]>(listDefs);

  const rows = useAppSelector(selectDocDestructionRows);
  const rowCount = useAppSelector(selectDocDestructionRowCount);
  const isLoading = useAppSelector(selectDocDestructionLoading);
  const listError = useAppSelector(selectDocDestructionError);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  const searchValues = useMemo(
    () => ({
      ...buildSearchValues(docLclsfNo, docMclsfNo, docSclsfNo),
      pageNum,
      pageSize,
    }),
    [docLclsfNo, docMclsfNo, docSclsfNo, pageNum, pageSize],
  );

  const loadData = () => {
    const nextParams = { ...searchValues, pageNum: 1 };
    setPageNum(1);
    dispatch(fetchDocDestructionList(nextParams));
  };

  const handleRefresh = () => {
    setDocLclsfNo("");
    setDocMclsfNo("");
    setDocSclsfNo("");
    setPageNum(1);
    setPageSize(10);
    dispatch(
      fetchDocDestructionList({
        ...buildSearchValues("", "", ""),
        pageNum: 1,
        pageSize: 10,
      }),
    );
  };

  useEffect(() => {
    dispatch(fetchDocDestructionList(buildSearchValues("", "", "")));
  }, [dispatch]);

  useEffect(() => {
    if (!listError) return;
    notifications.show(listError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [listError, notifications]);

  const handlePrintCurrentList = () => {
    setPrintOn(true);

    setTimeout(() => {
      setPrintOn(false);
    }, 500);
  };

  useEffect(() => {
    if (!printOn) return;
    const el = printAreaRef.current;
    if (!el) return;

    // innerHTML 대신 outerHTML 권장 (컨테이너 포함)
    const printContents = el.outerHTML;

    const printWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printWindow) return;

    // 현재 문서의 CSS(스타일/링크)를 복사
    const styles = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style'),
    )
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>파기목록대장 출력</title>
          ${styles}
          <style>
            /* 인쇄 기본 여백/배경 보정 (필요 시 조정) */
            @page { size: auto; margin: 12mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @media print {
              body {
                zoom: 0.44; /* 0.7~0.95 범위에서 조정 */
              }
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();

    // 렌더링 완료 후 print
    const doPrint = () => {
      printWindow.focus();
      printWindow.print();
    };

    // afterprint로 닫기 (print() 직후 close하면 출력이 취소되는 브라우저가 있음)
    printWindow.addEventListener("afterprint", () => {
      printWindow.close();
    });

    // 로드 대기(폰트/스타일 반영)
    printWindow.onload = () => {
      // 한 번 더 프레임을 넘겨 레이아웃 확정
      printWindow.requestAnimationFrame(() => {
        printWindow.requestAnimationFrame(doPrint);
      });
    };

    setPrintOn(false);
  }, [printOn]);

  const handleRowClick = (row: DocDestruction) => {
    if (!row.eldocNo) return;
    navigate(langPath(`docDestruction/${row.eldocNo}`, curLang));
  };

  return (
    <div>
      <Stack direction="row" className="search-area" mb={2}>
        <Grid container spacing={0} className="table-view-grid">
          {/* 1행 */}
          <GridField
            item={4}
            label="대분류"
            value={
              <MuiSelect
                id="docLclsfNo"
                items={lclsfList}
                value={docLclsfNo}
                onChange={(e) => {
                  setDocLclsfNo(e.target.value);
                  setDocMclsfNo("");
                  setDocSclsfNo("");
                }}
              />
            }
          />
          <GridField
            item={4}
            label="중분류"
            value={
              <MuiSelect
                id="docMclsfNo"
                items={mclsfList}
                value={docMclsfNo}
                onChange={(e) => {
                  setDocMclsfNo(e.target.value);
                  setDocSclsfNo("");
                }}
              />
            }
          />
          <GridField
            item={4}
            label="소분류"
            value={
              <MuiSelect
                id="docSclsfNo"
                items={sclsfList}
                value={docSclsfNo}
                onChange={(e) => setDocSclsfNo(e.target.value)}
              />
            }
          />
          {/* 2행 */}
          <GridField
            item={12}
            label="기간"
            value={
              <div className="filter-range">
                <MuiDatePickerFt value={""} onChange={() => {}} />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt value={""} onChange={() => {}} />
              </div>
            }
          />
        </Grid>
        <Box
          className="table-view-actions"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button variant="contained" onClick={loadData}>
            조회
          </Button>
          <IconButton
            aria-label="검색 초기화 및 새로고침"
            onClick={handleRefresh}
            sx={{ mt: 1, border: "1px solid", borderColor: "divider" }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Stack>
      <div className="btn_wrapper">
        <DocDestructionReqButton selectedRows={selectedRows} />

        <DocDestructionAppvButton selectedRows={selectedRows} />

        <Button variant="contained" onClick={handlePrintCurrentList}>
          파기목록출력
        </Button>
        <DocDestructionManagementPrintButton searchValues={searchValues} />
      </div>

      <Box ref={printAreaRef} sx={{ width: "100%" }}>
        <AgGridContainer
          isLoading={isLoading}
          enableRowSelection={true}
          colDefs={columnDefs}
          rowData={rows}
          pageNum={pageNum}
          pageSize={pageSize}
          count={rowCount}
          onRowClick={handleRowClick}
          onSelectionChange={handleSelectionChange}
          onPageChange={({ pageNum: nextPage, pageSize: nextSize }) => {
            setPageNum(nextPage);
            setPageSize(nextSize);
            dispatch(
              fetchDocDestructionList({
                ...searchValues,
                pageNum: nextPage,
                pageSize: nextSize,
              }),
            );
          }}
        />
      </Box>
    </div>
  );
}
