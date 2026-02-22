import React from "react";
import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import { Box, Button, TableCell, TableRow } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { getLangFromPathname, langPath } from "@/routes/lang";
import DigitalDocHistoryButton from "@/components/actionButtons/DigitalDocHistoryButton";
import useNotifications from "@/hooks/useNotifications";
import { DocDestruction } from "@/types/docDestruction";
import PageStatus from "@/components/common/PageStatus";

export default function DocDestructionDetail() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const curLang = getLangFromPathname(location.pathname);

  const { eldocNo } = useParams();

  const [viewData, setViewData] = React.useState<DocDestruction | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleBack = () => {
    navigate(langPath("docDestruction/list", curLang));
  };

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

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
        <Button size="large" variant="contained" onClick={handleBack}>
          목록
        </Button>
        <DigitalDocHistoryButton eldocNo="k2" />
      </Box>
    </div>
  );
}
