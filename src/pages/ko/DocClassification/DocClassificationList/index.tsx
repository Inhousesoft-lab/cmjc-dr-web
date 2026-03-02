import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ColDef } from "ag-grid-community";
import AgGridContainer from "@/components/grid/AgGridContainer";
import MuiSelect from "@/components/elements/MuiSelect";
import useNotifications from "@/hooks/useNotifications";
import { useDocClassificationList } from "@/hooks/useDocClassificationList";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import {
  DocClassificationSearch,
  DocClassificationVO,
} from "@/types/docClassification";
import { listDefs } from "./col-def";
import GridField from "@/components/common/GridField";

export default function DocClassificationList() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [columnDefs] = React.useState<ColDef[]>(listDefs);

  const { control, handleSubmit, setValue } = useForm<DocClassificationSearch>({
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

  const docLclsfNo = useWatch({ control, name: "docLclsfNo" });
  const docMclsfNo = useWatch({ control, name: "docMclsfNo" });
  const useEnItems = [
    { name: "전체", code: "" },
    { name: "사용", code: "Y" },
    { name: "사용안함", code: "N" },
  ];
  const { lclsfList, mclsfList, sclsfList, lclsfError } = useDocClsfOptions(
    docLclsfNo,
    docMclsfNo,
  );

  const { rows, rowCount, isLoading, listError, loadData } =
    useDocClassificationList();

  React.useEffect(() => {
    if (!listError) return;
    notifications.show(listError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [listError, notifications]);

  React.useEffect(() => {
    if (!lclsfError) return;
    notifications.show(lclsfError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [lclsfError, notifications]);

  const handleSearch = handleSubmit((values) => {
    loadData(values);
  });

  const handleCreateClick = () => {
    navigate(`/docClassification/create`);
  };

  const handleRowClick = (row: DocClassificationVO) => {
    navigate(`/docClassification/${row.docClsfNo}`);
  };

  return (
    <div>
      <Stack direction="row" className="search-area" mb={2}>
        <Grid container spacing={0} className="table-view-grid">
          <GridField
            item={3}
            label="대분류"
            value={
              <Controller
                name="docLclsfNo"
                control={control}
                render={({ field }) => (
                  <MuiSelect
                    id="docLclsfNo"
                    items={lclsfList}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setValue("docMclsfNo", "");
                      setValue("docSclsfNo", "");
                    }}
                  />
                )}
              />
            }
          />
          <GridField
            item={3}
            label="중뷴류"
            value={
              <Controller
                name="docMclsfNo"
                control={control}
                render={({ field }) => (
                  <MuiSelect
                    id="docMclsfNo"
                    items={mclsfList}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setValue("docSclsfNo", "");
                    }}
                  />
                )}
              />
            }
          />
          <GridField
            item={3}
            label="소분류"
            value={
              <Controller
                name="docSclsfNo"
                control={control}
                render={({ field }) => (
                  <MuiSelect
                    id="docSclsfNo"
                    items={sclsfList}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            }
          />
          <GridField
            item={3}
            label="개인정보 포함"
            value={
              <Controller
                name="prvcInclYn"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    size="small"
                    checked={field.value === "Y"}
                    onChange={(e) =>
                      field.onChange(e.target.checked ? "Y" : "")
                    }
                  />
                )}
              />
            }
          />
          <GridField
            item={3}
            label="사용유무"
            value={
              <Controller
                name="useEn"
                control={control}
                render={({ field }) => (
                  <MuiSelect
                    id="useEn"
                    items={useEnItems}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            }
          />
          <GridField
            item={9}
            label="검색어"
            value={
              <Controller
                name="docClsfNm"
                control={control}
                render={({ field }) => (
                  <TextField
                    size="small"
                    fullWidth
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            }
          />
        </Grid>
        <Box className="table-view-actions">
          <Button variant="contained" onClick={handleSearch}>
            조회
          </Button>
        </Box>
      </Stack>

      <AgGridContainer
        actionButtons={[{ label: "등록", onClick: handleCreateClick }]}
        isLoading={isLoading}
        colDefs={columnDefs}
        rowData={rows}
        count={rowCount}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
