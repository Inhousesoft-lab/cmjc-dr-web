import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DocClassHistory } from "@/types/docClassification";
import PageStatus from "../common/PageStatus";

type Props = {
  docClsfNo: string;
};

export default function DocClassificationHistoryButton({ docClsfNo }: Props) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const [rowData, setRowsData] = React.useState<DocClassHistory[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        이력
      </Button>
      <Dialog maxWidth="md" open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            position: "relative",
            fontWeight: 600,
          }}
        >
          이력
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 600 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    번호
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    행위일자
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    행위자
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    행위내용
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    IP
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    장비
                  </th>
                </tr>
              </thead>
              <tbody>
                {rowData?.length > 0 &&
                  rowData?.map((row) => (
                    <tr key={row.docClsfNo}>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.docClsfNo}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {formatDate(row.regDt)}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.rgtrId}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.actCn}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {row.acsrIpAddr}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.eqpmntNm}
                      </td>
                    </tr>
                  ))}
                {rowData?.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      조회된 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
