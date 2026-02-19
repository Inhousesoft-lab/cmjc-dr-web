import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { columnDefs } from "./col-def";

import DESTRUCTION_LIST_DUMMY_DATA from "@/mocks/edoc/edocDestructionListDummyData.json";
import DocDestructionManagementPrintButton from "@/components/biz/DocDestructionManagementPrintDialog";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import MuiSelect from "@/components/elements/MuiSelect";

export default function DocDestructionReqList() {
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  const [printOn, setPrintOn] = useState(false);
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
    page: 1,
    recordCountPerPage: 10,
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
      <div className="filter">
        <Grid container spacing={2}>
          {/* 1행 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">대분류</label>
              <div className="field_select">
                <MuiSelect
                  id="largeCategory"
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
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">중분류</label>
              <div className="field_select">
                <MuiSelect
                  id="midCategory"
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
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">소분류</label>
              <div className="field_select">
                <MuiSelect
                  id="smallCategory"
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
              </div>
            </div>
          </Grid>
          {/* 2행 MuiDateRangePicker */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className="filter-field">
              <label className="filter-label">기간</label>
              <div className="filter-range">
                <MuiDatePickerFt value={""} onChange={() => {}} />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt value={""} onChange={() => {}} />
              </div>
            </div>
          </Grid>
        </Grid>
        <div className="filter-actions">
          <Button size="small" variant="contained">
            조회
          </Button>
        </div>
      </div>

      <Divider sx={{ my: 2 }} />

      <div className="btn_wrapper">
        <Button variant="contained" onClick={handlePrintCurrentList}>
          파기목록출력
        </Button>
        <DocDestructionManagementPrintButton searchValues={searchValues} />
      </div>

      <Box ref={printAreaRef} sx={{ width: "100%" }}>
        <AgGridContainer
          colDefs={columnDefs}
          rowData={DESTRUCTION_LIST_DUMMY_DATA}
          count={DESTRUCTION_LIST_DUMMY_DATA.length}
        />
      </Box>
    </div>
  );
}
