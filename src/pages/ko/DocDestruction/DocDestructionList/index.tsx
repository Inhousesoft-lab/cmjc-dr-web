import { Box, Button, Grid, Stack } from "@mui/material";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { listDefs } from "./col-def";

import DocDestructionManagementPrintButton from "@/components/biz/DocDestructionManagementPrintDialog";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import MuiSelect from "@/components/elements/MuiSelect";
import { useNavigate } from "react-router-dom";
import useNotifications from "@/hooks/useNotifications";
import { DocDestruction } from "@/types/docDestruction";
import { ColDef } from "ag-grid-community";
import GridField from "@/components/common/GridField";

export default function DocDestructionReqList() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const printAreaRef = useRef<HTMLDivElement | null>(null);

  const [printOn, setPrintOn] = useState(false);

  const [columnDefs] = React.useState<ColDef<DocDestruction>[]>(listDefs);

  const [rowData, setRowsData] = React.useState<{
    rows: DocDestruction[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // TODO: load data
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

  const searchValues = {
    docLclsfNo: "",
    docMclsfNo: "",
    docSclsfNo: "",
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
  };

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
                items={[
                  {
                    name: "전체",
                    code: "",
                  },
                  {
                    name: "피해구제",
                    code: "01",
                  },
                ]}
              />
            }
          />
          <GridField
            item={4}
            label="중분류"
            value={
              <MuiSelect
                id="docMclsfNo"
                items={[
                  {
                    name: "전체",
                    code: "",
                  },
                  {
                    name: "접수서류",
                    code: "01",
                  },
                  {
                    name: "신청자 제출서류",
                    code: "02",
                  },
                  {
                    name: "직원보완자료",
                    code: "03",
                  },
                ]}
              />
            }
          />
          <GridField
            item={4}
            label="소분류"
            value={
              <MuiSelect
                id="docSclsfNo"
                items={[
                  {
                    name: "전체",
                    code: "",
                  },
                  {
                    name: "사망 신청",
                    code: "01",
                  },
                  {
                    name: "미성년자 신청",
                    code: "02",
                  },
                  {
                    name: "이전문서",
                    code: "03",
                  },
                  {
                    name: "의무기록",
                    code: "04",
                  },
                ]}
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
        <Box className="table-view-actions">
          <Button variant="contained">조회</Button>
        </Box>
      </Stack>
      <div className="btn_wrapper">
        <Button variant="contained" onClick={handlePrintCurrentList}>
          파기목록출력
        </Button>
        <DocDestructionManagementPrintButton searchValues={searchValues} />
      </div>

      <Box ref={printAreaRef} sx={{ width: "100%" }}>
        <AgGridContainer
          isLoading={isLoading}
          enableRowSelection={false}
          colDefs={columnDefs}
          rowData={rowData.rows}
          count={rowData.rowCount}
        />
      </Box>
    </div>
  );
}
