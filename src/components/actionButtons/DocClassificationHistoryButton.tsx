import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface HistoryRow {
  id: number;
  date: string;
  actor: string;
  action: string;
  ip: string;
  device: string;
}

const historyRows: HistoryRow[] = [
  {
    id: 1,
    date: "2025. 10. 27.",
    actor: "홍길동",
    action: "문서분류 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
  {
    id: 2,
    date: "2025. 10. 15.",
    actor: "홍길동",
    action: "개인정보파일 현황 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
  {
    id: 3,
    date: "2025. 10. 02.",
    actor: "홍길동",
    action: "개인정보파일 현황 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
  {
    id: 4,
    date: "2025. 10. 01.",
    actor: "홍길동",
    action: "문서분류 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
  {
    id: 5,
    date: "2025. 09. 30.",
    actor: "홍길동",
    action: "문서분류 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
  {
    id: 6,
    date: "2025. 09. 26.",
    actor: "홍길동",
    action: "문서분류 등록",
    ip: "111.111.\n111.111",
    device: "PC",
  },
];

export default function DocDestructionHistoryButton() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        이력
      </Button>
      <Dialog maxWidth="xl" open={open} onClose={handleClose}>
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
            <Stack direction="row" spacing={4} alignItems="flex-start">
              {/* 이력 정보 */}
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
                  {historyRows.map((row) => (
                    <tr key={row.id}>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.id}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.date}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.actor}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.action}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {row.ip}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.device}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 공람 이력 */}
              <table
                style={{
                  width: "420px",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th
                      colSpan={5}
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        backgroundColor: "#bdbdbd",
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                    >
                      공람 이력
                    </th>
                  </tr>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        backgroundColor: "#e0e0e0",
                        textAlign: "center",
                      }}
                    >
                      부서
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        backgroundColor: "#e0e0e0",
                        textAlign: "center",
                      }}
                    >
                      이름
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
                      행위일자
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      피해구제팀
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      -
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      추가
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      홍길동
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      25.10.01.
                    </td>
                  </tr>

                  {/* row 2 */}
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      정보화팀
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      홍길동
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      추가
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      홍길동
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      25.08.10.
                    </td>
                  </tr>

                  {/* empty rows for layout */}
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    ></td>
                  </tr>
                </tbody>
              </table>
            </Stack>

            {/* 문서 정보 */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "24px",
              }}
            >
              <tbody>
                {/* 문서분류 / 기본권한 */}
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    문서분류
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    피해구제 &gt; 접수서류 &gt; 사망 신청 (전자문서)
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    기본권한
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    피해구제팀 / 전체
                  </td>
                </tr>

                {/* 문서번호 */}
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    문서번호
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                    colSpan={3}
                  >
                    KIDS-0001
                  </td>
                </tr>

                {/* 문서제목 */}
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    문서제목
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                    colSpan={3}
                  >
                    피해구제 접수서류 사망신청서
                  </td>
                </tr>

                {/* 수집일자 / 종료일자 */}
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    수집일자
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    2025-10-01 (5년)
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    종료일자
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    2030-09-30
                  </td>
                </tr>

                {/* 개인정보 / 반환여부 */}
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    개인정보
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    포함
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    반환여부
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    미반환
                  </td>
                </tr>

                {/* 비고 */}
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    비고
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                    colSpan={3}
                  >
                    피해구제 접수서류 비고입니다.
                  </td>
                </tr>

                {/* 첨부파일 */}
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    첨부파일
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                    colSpan={3}
                  >
                    피해구제 접수서류.pdf
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
