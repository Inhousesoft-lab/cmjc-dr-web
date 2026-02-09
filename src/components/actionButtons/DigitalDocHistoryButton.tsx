import { useState, useEffect, useCallback } from "react";
import { Grid } from "@mui/material";
import AgGridContainer from "../grid/AgGridContainer";
import type { ColDef } from "ag-grid-community";
import type {
  DigitalAuthrtHistory,
  DigitalDocHistory,
  EldocState,
} from "@/types/digitalDoc";
import useNotifications from "@/hooks/useNotifications";
import type { Paging } from "@/types/common";
import DialogTrigger from "../dialog/DialogTrigger";

const docListDefs = [
  {
    headerName: "번호",
    field: "eldocHstryNo",
    width: 90,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "행위일자",
    field: "regDt",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: { value: string }) => {
      return formatDate(params.value.replaceAll("-", "")); // null/undefined 대비
    },
  },
  {
    headerName: "행위자",
    field: "rgtrId",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "행위내용",
    field: "actCn",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "IP",
    field: "acsrIpAddr",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "장비",
    field: "eqpmntNm",
    cellStyle: { textAlign: "center" },
  },
];

const authListDefs = [
  {
    headerName: "공람 이력",
    cellStyle: { textAlign: "center" },
    children: [
      {
        headerName: "부서",
        field: "deptId",
        width: 90,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "이름",
        field: "indvId",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "행위내용",
        field: "actCn",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "행위자",
        field: "rgtrId",
        cellStyle: { textAlign: "center" },
      },

      {
        headerName: "행위일자",
        field: "regDt",
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: { value: string }) => {
          return formatDate(params.value.replaceAll("-", "")); // null/undefined 대비
        },
      },
    ],
  },
];

export default function DigitalDocHistoryButton({
  eldocNo,
  onOpen,
}: {
  eldocNo: string;
  onOpen?: () => void;
}) {
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [docColumnDefs] = useState<ColDef[]>(docListDefs);
  const [authColumnDefs] = useState<ColDef[]>(authListDefs);

  const [docData, setDocData] = useState<{
    rows: DigitalDocHistory[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [authData, setAuthData] = useState<{
    rows: DigitalAuthrtHistory[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [searchDoc, setSearchDoc] = useState<EldocState>({
    eldocNo: eldocNo,
    page: 1,
    recordCountPerPage: 10,
  });
  const [searchAuth, setSearchAuth] = useState<EldocState>({
    eldocNo: eldocNo,
    page: 1,
    recordCountPerPage: 10,
  });

  const [detail, setDetail] = useState<DigitalDocHistory>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getDocHistory = useCallback(async () => {
    setIsLoading(true);

    try {
      const listData = { items: [], itemCount: 0 };

      setDocData({
        rows: listData.items,
        rowCount: listData.itemCount,
      });

      setDetail(listData.items[0]);
    } catch (e) {
      notifications.show(getErrorMessage(e), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [notifications, searchDoc]);

  const getAuthHistory = useCallback(async () => {
    setIsLoading(true);

    try {
      const listData = { items: [], itemCount: 0 };

      setAuthData({
        rows: listData.items,
        rowCount: listData.itemCount,
      });
    } catch (e) {
      notifications.show(getErrorMessage(e), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchAuth, notifications]);

  useEffect(() => {
    console.log(open, "모달 열림 감지");
    if (open) {
      getDocHistory();
      getAuthHistory();
    }
  }, [getAuthHistory, getDocHistory, open]);

  const handleDocPageChange = (vo: Paging) => {
    setSearchDoc((prev) => ({
      ...prev,
      page: vo.page,
      recordCountPerPage: vo.recordCountPerPage,
    }));
    getDocHistory();
  };

  const handleAuthPageChange = (vo: Paging) => {
    setSearchAuth((prev) => ({
      ...prev,
      page: vo.page,
      recordCountPerPage: vo.recordCountPerPage,
    }));
    getAuthHistory();
  };

  const getHoldingPeriod = useCallback((doc: DigitalDocHistory | undefined) => {
    const formattedDate = formatDate(doc?.clctYmd ?? "", "-");
    const hldPrdDfyrs = doc?.hldPrdDfyrs;

    if (String(hldPrdDfyrs) === "0")
      return `${formattedDate} (${doc?.hldPrdMmCnt || "0"}개월)`;
    if (String(hldPrdDfyrs) === "90") return `${formattedDate} (반영구)`;
    if (String(hldPrdDfyrs) === "99") return `${formattedDate} (영구)`;
    return `${formattedDate} (${hldPrdDfyrs || "0"}년)`;
  }, []);

  const digitalDocSample = [
    {
      groups: [
        {
          label: "문서분류",
          contentColSpan: 7,
          content:
            detail?.docLclsfNm +
            " > " +
            detail?.docMclsfNm +
            " > " +
            detail?.docSclsfNm,
        },
      ],
    },
    {
      groups: [
        {
          label: "문서번호",
          contentColSpan: 3,
          content: detail?.docNo,
        },
        {
          label: "기본권한",
          contentColSpan: 3,
          content: "무슨 컬럼인지 안정해짐",
        },
      ],
    },
    {
      groups: [
        {
          label: "문서제목",
          contentColSpan: 7,
          content: detail?.docTtl,
        },
      ],
    },
    {
      groups: [
        {
          label: "수집일자",
          contentColSpan: 3,
          content: getHoldingPeriod(detail),
        },
        {
          label: "종료일자",
          contentColSpan: 3,
          content: formatDate(detail?.endYmd ?? "", "-"),
        },
      ],
    },
    {
      groups: [
        {
          label: "개인정보",
          contentColSpan: 3,
          content: detail?.prvcInclYn === "Y" ? "포함" : "미포함",
        },
        {
          label: "반환여부",
          contentColSpan: 3,
          content: detail?.gvbkYn === "Y" ? "반환" : "미반환",
        },
      ],
    },
    {
      groups: [
        {
          label: "비고",
          contentColSpan: 7,
          content: detail?.addExpln,
        },
      ],
    },
    {
      groups: [
        {
          label: "첨부파일",
          contentColSpan: 7,
          content: detail?.atchFileSn,
        },
      ],
    },
  ];

  return (
    <DialogTrigger
      buttonLabel="이력"
      title="이력"
      maxWidth="xl"
      onOpen={handleClickOpen}
      open={open}
      onClose={handleClose}
    >
      <Grid container spacing={3}>
        <Grid size={6}>
          <AgGridContainer
            isLoading={isLoading}
            colDefs={docColumnDefs}
            rowData={docData.rows}
            count={docData.rowCount}
          />
        </Grid>
        <Grid size={6}>
          <AgGridContainer
            isLoading={isLoading}
            colDefs={authColumnDefs}
            rowData={authData.rows}
            count={authData.rowCount}
          />
        </Grid>
        {/* 문서 정보 */}
        {/* <HorizontalTableView
          tableAriaLabel="전자 문서"
          rows={digitalDocSample}
        /> */}
      </Grid>
    </DialogTrigger>
  );
}
