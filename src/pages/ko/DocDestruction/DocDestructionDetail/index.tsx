import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import { Box, Button, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router";
import { getLangFromPathname, langPath } from "@/routes/lang";
import DigitalDocHistoryButton from "@/components/actionButtons/DigitalDocHistoryButton";

export default function DocDestructionDetail() {
  const navigate = useNavigate();
  const curLang = getLangFromPathname(location.pathname);

  const handleBackToList = () => {
    navigate(langPath("docDestruction/list", curLang));
  };

  return (
    <div>
      <TableWrapper>
        <TableRow>
          <LabelCell>이름</LabelCell>
          <TableCell>김*전</TableCell>
          <LabelCell>이메일</LabelCell>
          <TableCell>on***ay#drugsafe.or.kr</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>아이디</LabelCell>
          <TableCell>dr**free</TableCell>
          <LabelCell>전화번호</LabelCell>
          <TableCell>010/****/1111</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>회원유형</LabelCell>
          <TableCell>14세 미만 / 일반 / 전문가</TableCell>
          <LabelCell>가입일자</LabelCell>
          <TableCell>2025-10-10</TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>가입상태</LabelCell>
          <TableCell>정상 / 탈회</TableCell>
          <LabelCell>탈회일자</LabelCell>
          <TableCell>2026-01-01</TableCell>
        </TableRow>
      </TableWrapper>

      <Box className="btn_wrapper" mt={2}>
        <Button size="large" variant="contained" onClick={handleBackToList}>
          목록
        </Button>
        <DigitalDocHistoryButton eldocNo="k2" />
      </Box>
    </div>
  );
}
