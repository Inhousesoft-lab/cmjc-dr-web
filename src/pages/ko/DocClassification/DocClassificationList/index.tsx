import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import AgGridContainer from "@/components/grid/AgGridContainer";
import React from "react";
import { ColDef } from "ag-grid-community";
import useNotifications from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import {
  DocClassificationSearch,
  DocClassificationVO,
} from "@/types/docClassification";
import { https } from "@shared/utils/https";
import { listDefs } from "./col-def";
import { selectDocClassificationListApiPath } from "@/api/docClassification/DocClassificationApiPaths";
import {
  useDocClsfChildrenLive,
  useLclsfListLive,
} from "@/hooks/query/useDocClsfTree";

export default function DocClassificationList() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [columnDefs] = React.useState<ColDef[]>(listDefs);

  const [rowData, setRowsData] = React.useState<{
    rows: DocClassificationVO[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);

  const { control, handleSubmit, setValue, getValues } =
    useForm<DocClassificationSearch>({
      defaultValues: {
        docLclsfNo: "",
        docMclsfNo: "",
        docSclsfNo: "",
        prvcInclYn: "",
        useEn: "",
        docClsfNm: "",
        pageNum: 1,
        pageSize: 10,
      },
    });

  const loadData = async () => {
    setIsLoading(true);
    const data = { ...getValues() };
    try {
      const res = await https.get(selectDocClassificationListApiPath(), {
        params: data,
      });

      setRowsData({
        rows: res.data.list,
        rowCount: res.data.total,
      });
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

  const docLclsfNo = useWatch({ control, name: "docLclsfNo" });
  const docMclsfNo = useWatch({ control, name: "docMclsfNo" });

  const { data: lclsfDocs } = useLclsfListLive();
  const { data: mclsfDocs } = useDocClsfChildrenLive(docLclsfNo);
  const { data: sclsfDocs } = useDocClsfChildrenLive(docMclsfNo);

  // const lclsfList = lclsfDocs
  //   ? [
  //       ...initSelectItem,
  //       ...lclsfDocs.map((vo) => ({
  //         label: vo.docClsfNm,
  //         value: vo.docClsfNo,
  //       })),
  //     ]
  //   : initSelectItem;
  // const mclsfList = mclsfDocs
  //   ? [
  //       ...initSelectItem,
  //       ...mclsfDocs.map((vo) => ({
  //         label: vo.docClsfNm,
  //         value: vo.docClsfNo,
  //       })),
  //     ]
  //   : initSelectItem;
  // const sclsfList = sclsfDocs
  //   ? [
  //       ...initSelectItem,
  //       ...sclsfDocs.map((vo) => ({
  //         label: vo.docClsfNm,
  //         value: vo.docClsfNo,
  //       })),
  //     ]
  //   : initSelectItem;

  const handleCreateClick = () => {
    navigate(`/docClassification/create`);
  };

  const handleRowClick = (row: DocClassificationVO) => {
    navigate(`/docClassification/${row.docClsfNo}`);
  };

  return (
    <div>
      {/* <!-- 검색조건 --> */}
      <div className="filter">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">대상</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select id="docMclsfNo" name="docMclsfNo" defaultValue="00">
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="01">피해구제</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">소분류</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select id="docSclsfNo" name="docSclsfNo" defaultValue="00">
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="01">피해구제</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 3 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <div className="filter-field filter-field--checkbox">
              <FormControlLabel
                className="filter-checkbox"
                name="holding-check"
                control={<Checkbox size="small" />}
                label="개인정보 포함"
              />
            </div>
          </Grid>
          {/* 2행: 사용유무 / 검색어 / 검색 버튼 */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">사용유무</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select id="useEn" name="useEn" defaultValue="00">
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="00">사용</MenuItem>
                    <MenuItem value="01">사용안함</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
            <div className="filter-field">
              <label className="filter-label">검색어</label>
              <TextField name="docClsfNm" size="small" fullWidth />
            </div>
          </Grid>
        </Grid>
        <Button size="small" variant="contained">
          조회
        </Button>
      </div>
      <Divider sx={{ marginY: 2 }} />

      <div className="btn_wrapper">
        <Button size="small" variant="contained" onClick={handleCreateClick}>
          등록
        </Button>
      </div>

      {/* <!-- 본문 --> */}
      <AgGridContainer
        isLoading={isLoading}
        colDefs={columnDefs}
        rowData={rowData.rows}
        count={rowData.rowCount}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
