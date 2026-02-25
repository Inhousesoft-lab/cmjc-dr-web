import * as React from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  MenuItem,
  TableRow,
  TableCell,
  Box,
  FormGroup,
  SelectChangeEvent,
} from "@mui/material";
import { useSelector } from "react-redux";
import type {
  DocClassDetail,
  DocClassDetailFormState,
} from "@/types/docClassification";
import TableWrapper from "@/components/table/TableWrapper";
import LabelCell from "@/components/table/LabelCell";
import { https } from "@shared/utils/https";
import useNotifications from "@/hooks/useNotifications";
import {
  insertDocClassificationApiPath,
  selectDocClassificationDetailApiPath,
  updateDocClassificationApiPath,
} from "@/api/docClassification/DocClassificationApiPaths";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import URL from "@/constants/url";
import { docClassificationvalidator } from "@/features/classification/DocClassificationValidator";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import MuiSelect from "@/components/elements/MuiSelect";
import PageStatus from "@/components/common/PageStatus";
import SectionTitle from "@/components/common/SectionTitle";
import MuiCheckbox from "@/components/elements/MuiCheckbox";
import type { RootState } from "@/app/store";

type SubDetailValues = NonNullable<Values["prvcFileHldPrst"]>;

/* ------------------------------------------------------------------ */
/* 타입/초기값                                                         */
/* ------------------------------------------------------------------ */
const INITIAL_FORM_VALUES: DocClassDetailFormState["values"] = {
  docClsfNo: "",
  docClsfSeCd: "L",
  docClsfNm: "",
  upDocClsfNo: "",
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docLclsfNm: "",
  docMclsfNm: "",
  docSclsfNm: "",
  prvcInclYn: "N",
  useEn: "Y",
  prvcFileHldPrst: {},
  rgtrId: "",
  mdfrId: "",
};

type Values = DocClassDetailFormState["values"];

/* ------------------------------------------------------------------ */
/* 개인정보 상세 테이블 (subDetail 전용) – 전부 비제어                         */
/* ------------------------------------------------------------------ */
interface PrvcDetailProps {
  defaults: SubDetailValues;
  isDirectInputYear: boolean;
  onChangeDirectInputYear: (value: boolean) => void;
  isInfoAgree: boolean;
  onChangeInfoAgree: (value: boolean) => void;
  formErrors: Record<string, string>; // ← 추가
}

const PrvcDetailTable = React.memo(
  ({
    defaults,
    isDirectInputYear,
    onChangeDirectInputYear,
    isInfoAgree,
    onChangeInfoAgree,
    formErrors,
  }: PrvcDetailProps) => {
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isDirect = value === "0";

      // 상위 플래그 갱신 (disable 토글용)
      onChangeDirectInputYear(isDirect);

      // 직접입력이 아닌 경우 월 값 비우기
      if (!isDirect) {
        const mmInput = document.querySelector<HTMLInputElement>(
          'input[name="hldPrdMmCnt"]',
        );
        if (mmInput) {
          mmInput.value = ""; // 또는 "0"으로 고정하고 싶으면 "0"
        }
      }
    };

    const handleInfoAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked; // checked == 동의(Y)
      const notAgree = checked; // 동의가 아니면 true
      onChangeInfoAgree(notAgree);

      const target = document.querySelector<HTMLInputElement>(
        'input[name="infoMnbdDsagClctSttBssExpln"]',
      );
      if (!target) return;

      if (!notAgree) {
        // 동의(Y)인 경우: 값 초기화 + 비활성
        target.value = "";
        target.disabled = true;
      } else {
        // 비동의인 경우: 활성
        target.value = "";
        target.disabled = false;
      }
    };
    return (
      <TableWrapper aria-label="개인정보 상세 입력">
        {/* 부서명 / 파일명 */}
        <TableRow>
          <LabelCell>부서명</LabelCell>
          <TableCell>
            <TextField
              fullWidth
              size="small"
              placeholder="부서명"
              name="deptNm"
              defaultValue={defaults.deptNm ?? ""}
              error={!!formErrors.deptNm}
              helperText={formErrors.deptNm ?? ""}
            />
          </TableCell>
          <LabelCell>파일명</LabelCell>
          <TableCell>
            <TextField
              fullWidth
              size="small"
              placeholder="파일명"
              name="fileNm"
              defaultValue={defaults.fileNm ?? ""}
              error={!!formErrors.fileNm}
              helperText={formErrors.fileNm ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 보유목적 */}
        <TableRow>
          <LabelCell>보유목적</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="보유목적"
              name="hldPrpsExpln"
              defaultValue={defaults.hldPrpsExpln ?? ""}
              error={!!formErrors.hldPrpsExpln}
              helperText={formErrors.hldPrpsExpln ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 수집근거(법령) */}
        <TableRow>
          <LabelCell>수집근거(법령)</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="수집근거(법령)"
              name="clctSttBssExpln"
              multiline
              rows={5}
              defaultValue={defaults.clctSttBssExpln ?? ""}
              error={!!formErrors.clctSttBssExpln}
              helperText={formErrors.clctSttBssExpln ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 사용부서명(내부,외부) / 보유기간 */}
        <TableRow>
          <LabelCell>사용부서명(내부,외부)</LabelCell>
          <TableCell>
            <TextField
              fullWidth
              size="small"
              placeholder="사용부서"
              name="useDeptNm"
              defaultValue={defaults.useDeptNm ?? ""}
              error={!!formErrors.useDeptNm}
              helperText={formErrors.useDeptNm ?? ""}
            />
          </TableCell>
          <LabelCell>보유기간</LabelCell>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                select
                size="small"
                name="hldPrdDfyrs"
                defaultValue={defaults.hldPrdDfyrs ?? 1}
                sx={{ width: 100 }}
                onChange={handleYearChange}
              >
                <MenuItem value="1">1년</MenuItem>
                <MenuItem value="3">3년</MenuItem>
                <MenuItem value="5">5년</MenuItem>
                <MenuItem value="10">10년</MenuItem>
                <MenuItem value="30">30년</MenuItem>
                <MenuItem value="90">준영구</MenuItem>
                <MenuItem value="99">영구</MenuItem>
                <MenuItem value="0">직접입력</MenuItem>
              </TextField>
              <TextField
                size="small"
                name="hldPrdMmCnt"
                sx={{ width: 80 }}
                placeholder="월"
                type="text"
                disabled={!isDirectInputYear}
                defaultValue={defaults.hldPrdMmCnt ?? null}
                error={!!formErrors.hldPrdMmCnt}
                helperText={formErrors.hldPrdMmCnt ?? null}
                onChange={(e) => {
                  const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                  // 비제어라면 DOM 값만 수정
                  if (onlyNumber !== e.target.value) {
                    e.target.value = onlyNumber;
                  }
                }}
              />
              개월
            </Stack>
          </TableCell>
        </TableRow>

        {/* 개인정보 처리방법  */}
        <TableRow>
          <LabelCell>개인정보 처리방법</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="개인정보 처리방법"
              name="prvcPrcsMthdExpln"
              multiline
              rows={5}
              defaultValue={defaults.prvcPrcsMthdExpln ?? ""}
              error={!!formErrors.prvcPrcsMthdExpln}
              helperText={formErrors.prvcPrcsMthdExpln ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 정보주체의 개인정보항목 */}
        <TableRow>
          <LabelCell>정보주체의 개인정보항목</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="정보주체의 개인정보항목"
              name="infoMnbdPrvcMttr"
              multiline
              rows={5}
              defaultValue={defaults.infoMnbdPrvcMttr ?? ""}
              error={!!formErrors.infoMnbdPrvcMttr}
              helperText={formErrors.infoMnbdPrvcMttr ?? ""}
            />
          </TableCell>
        </TableRow>
        {/* 법정대리인의 개인정보항목 */}
        <TableRow>
          <LabelCell>법정대리인의 개인정보항목</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="법정대리인의 개인정보항목"
              name="sttyAgtPrvcMttr"
              multiline
              rows={5}
              defaultValue={defaults.sttyAgtPrvcMttr ?? ""}
              error={!!formErrors.sttyAgtPrvcMttr}
              helperText={formErrors.sttyAgtPrvcMttr ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 주민등록번호 수집여부 / 주민등록번호 수집 법령근거 */}
        <TableRow>
          <LabelCell>주민등록번호 수집여부</LabelCell>
          <TableCell colSpan={3}>
            <RadioGroup
              row
              name="rrnoClctYn"
              defaultValue={defaults.rrnoClctYn ?? "N"}
            >
              <FormControlLabel
                value="Y"
                control={<Radio size="small" />}
                label="수집"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" />}
                label="미수집"
              />
            </RadioGroup>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>주민등록번호 수집 법령근거</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="주민등록번호 수집 법령근거"
              name="rrnoClctSttBssExpln"
              multiline
              rows={5}
              defaultValue={defaults.rrnoClctSttBssExpln ?? ""}
              error={!!formErrors.rrnoClctSttBssExpln}
              helperText={formErrors.rrnoClctSttBssExpln ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 정보주체 동의여부 / 정보주체 동의 없이 수집 법령근거 */}
        <TableRow>
          <LabelCell>정보주체 동의여부</LabelCell>
          <TableCell colSpan={3}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  name="infoMnbdAgreYn"
                  defaultChecked={defaults.infoMnbdAgreYn === "Y"} // ← 플래그로 제어
                  onChange={handleInfoAgreeChange}
                />
              }
              label="동의"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>정보주체 동의 없이 수집 법령근거</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="정보주체 동의 없이 수집 법령근거"
              name="infoMnbdDsagClctSttBssExpln"
              multiline
              rows={5}
              defaultValue={defaults.infoMnbdDsagClctSttBssExpln ?? ""}
              error={!!formErrors.infoMnbdDsagClctSttBssExpln}
              helperText={formErrors.infoMnbdDsagClctSttBssExpln ?? ""}
              disabled={isInfoAgree} // 최초 렌더 기준
            />
          </TableCell>
        </TableRow>

        {/* 민감 정보 보유여부 / 민감 정보 별도동의여부 */}
        <TableRow>
          <LabelCell>민감 정보 보유여부</LabelCell>
          <TableCell>
            <RadioGroup
              row
              name="spiHldYn"
              defaultValue={defaults.spiHldYn ?? "N"}
            >
              <FormControlLabel
                value="Y"
                control={<Radio size="small" />}
                label="보유"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" />}
                label="미보유"
              />
            </RadioGroup>
          </TableCell>
          <LabelCell>민감 정보 별도동의여부</LabelCell>
          <TableCell>
            <RadioGroup
              row
              name="spiIndivAgrnYn"
              defaultValue={defaults.spiIndivAgrnYn ?? "N"}
            >
              <FormControlLabel
                value="Y"
                control={<Radio size="small" />}
                label="동의"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" />}
                label="미동의"
              />
            </RadioGroup>
          </TableCell>
        </TableRow>

        <TableRow>
          <LabelCell>민감 정보 보유 법령근거</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="민감 정보 보유 법령근거"
              name="spiHldSttBssExpln"
              multiline
              rows={5}
              defaultValue={defaults.spiHldSttBssExpln ?? ""}
              error={!!formErrors.spiHldSttBssExpln}
              helperText={formErrors.spiHldSttBssExpln ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 고유식별정보 보유여부 / 고유식별정보 별도동의여부 */}
        <TableRow>
          <LabelCell>고유식별정보 보유여부</LabelCell>
          <TableCell>
            <RadioGroup
              row
              name="uiiHldYn"
              defaultValue={defaults.uiiHldYn ?? "N"}
            >
              <FormControlLabel
                value="Y"
                control={<Radio size="small" />}
                label="보유"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" />}
                label="미보유"
              />
            </RadioGroup>
          </TableCell>
          <LabelCell>고유식별정보 별도동의여부</LabelCell>
          <TableCell>
            <RadioGroup
              row
              name="uiiIndivAgreYn"
              defaultValue={defaults.uiiIndivAgreYn ?? "N"}
            >
              <FormControlLabel
                value="Y"
                control={<Radio size="small" />}
                label="동의"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" />}
                label="미동의"
              />
            </RadioGroup>
          </TableCell>
        </TableRow>

        <TableRow>
          <LabelCell>고유식별정보 보유 법령근거</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="고유식별정보 보유 법령근거"
              name="uiiHldSttBssExpln"
              multiline
              rows={5}
              defaultValue={defaults.uiiHldSttBssExpln ?? ""}
              error={!!formErrors.uiiHldSttBssExpln}
              helperText={formErrors.uiiHldSttBssExpln ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 개인정보영향평가 대상여부 / 취급담당자 */}
        <TableRow>
          <LabelCell>개인정보영향평가 대상여부</LabelCell>
          <TableCell>
            <RadioGroup
              row
              name="prvcEvlTrgtYn"
              defaultValue={defaults.prvcEvlTrgtYn ?? "N"}
            >
              <FormControlLabel
                value="Y"
                control={<Radio size="small" />}
                label="대상"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" />}
                label="미대상"
              />
            </RadioGroup>
          </TableCell>
          <LabelCell>취급담당자</LabelCell>
          <TableCell>
            <TextField
              fullWidth
              size="small"
              placeholder="민감 정보 보유 법령근거"
              name="hndlPicNm"
              defaultValue={defaults.hndlPicNm ?? ""}
              error={!!formErrors.hndlPicNm}
              helperText={formErrors.hndlPicNm ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 제3자 제공받는 자 / 제3자 제공 근거 */}
        <TableRow>
          <LabelCell>제3자 제공받는 자</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="제3자 제공받는 자"
              name="tdptySplrcpNmCn"
              multiline
              rows={5}
              defaultValue={defaults.tdptySplrcpNmCn ?? ""}
              error={!!formErrors.tdptySplrcpNmCn}
              helperText={formErrors.tdptySplrcpNmCn ?? ""}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>제3자 제공 근거</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="제3자 제공 근거"
              name="tdptyPvsnBssExpln"
              multiline
              rows={5}
              defaultValue={defaults.tdptyPvsnBssExpln ?? ""}
              error={!!formErrors.tdptyPvsnBssExpln}
              helperText={formErrors.tdptyPvsnBssExpln ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 제3자 제공사항 / 개인정보처리 위탁 업체명 */}
        <TableRow>
          <LabelCell>제3자 제공사항</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="제3자 제공사항"
              name="tdptyPvsnMttr"
              multiline
              rows={5}
              defaultValue={defaults.tdptyPvsnMttr ?? ""}
              error={!!formErrors.tdptyPvsnMttr}
              helperText={formErrors.tdptyPvsnMttr ?? ""}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>개인정보처리 위탁 업체명</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="개인정보처리 위탁 업체명"
              name="prvcPrcsCnsgnBzentyNmCn"
              multiline
              rows={5}
              defaultValue={defaults.prvcPrcsCnsgnBzentyNmCn ?? ""}
              error={!!formErrors.prvcPrcsCnsgnBzentyNmCn}
              helperText={formErrors.prvcPrcsCnsgnBzentyNmCn ?? ""}
            />
          </TableCell>
        </TableRow>

        {/* 개인정보위탁계약서 여부 / 개인정보 윈탁사실 게재여부 */}
        <TableRow>
          <LabelCell>개인정보위탁계약서 여부</LabelCell>
          <TableCell>
            <RadioGroup
              row
              name="prvcCnsgnCtrtYn"
              defaultValue={defaults.prvcCnsgnCtrtYn ?? "N"}
            >
              <FormControlLabel
                value="Y"
                control={<Radio size="small" />}
                label="있음"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" />}
                label="없음"
              />
            </RadioGroup>
          </TableCell>
          <LabelCell>개인정보 윈탁사실 게재여부</LabelCell>
          <TableCell>
            <RadioGroup
              row
              name="prvcCnsgnFactIndctYn"
              defaultValue={defaults.prvcCnsgnFactIndctYn ?? "N"}
            >
              <FormControlLabel
                value="Y"
                control={<Radio size="small" />}
                label="게재"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" />}
                label="미게재"
              />
            </RadioGroup>
          </TableCell>
        </TableRow>

        {/* 목적 외 이용 제공 여부 / 목적 외 이용 제공 근거 */}
        <TableRow>
          <LabelCell>목적 외 이용 제공 여부</LabelCell>
          <TableCell colSpan={3}>
            <RadioGroup
              row
              name="prpsExclUtztnPvsnYn"
              defaultValue={defaults.prpsExclUtztnPvsnYn ?? "N"}
            >
              <FormControlLabel
                value="Y"
                control={<Radio size="small" />}
                label="있음"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" />}
                label="없음"
              />
            </RadioGroup>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell required>목적 외 이용 제공 근거</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="목적 외 이용 제공 근거"
              name="prpsExclUtztnPvsnBssExpln"
              multiline
              rows={5}
              defaultValue={defaults.prpsExclUtztnPvsnBssExpln ?? ""}
              error={!!formErrors.prpsExclUtztnPvsnBssExpln}
              helperText={formErrors.prpsExclUtztnPvsnBssExpln ?? ""}
            />
          </TableCell>
        </TableRow>
      </TableWrapper>
    );
  },
);

/* ------------------------------------------------------------------ */
/* 메인 페이지 컴포넌트 – 비제어 폼                                   */
/* ------------------------------------------------------------------ */
export default function DocClassificationForm() {
  const { docClsfNo } = useParams();

  const navigate = useNavigate();
  const notifications = useNotifications();
  const dialogs = useDialogs();

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 초기값/조회값만 들고 있음 (입력 중에는 state 변경 없음)
  const [defaults, setDefaults] = React.useState<Values>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {},
  );

  const [formRenderKey, setFormRenderKey] = React.useState(0);

  const [docClsfSeCd, setdocClsfSeCd] = React.useState<string>("L");
  const [prvcInclYn, setPrvcInclYn] = React.useState<"Y" | "N">("N");

  const [hldPrdDfyrs, setHldPrdDfyrs] = React.useState<number | null>();
  const [hldPrdMmCnt, setHldPrdMmCnt] = React.useState<number | null>();

  const [isDirectInputYear, setIsDirectInputYear] = React.useState(false);
  const [isInfoAgree, setIsInfoAgree] = React.useState(false);

  const { lclsfList, mclsfList } = useDocClsfOptions(
    defaults.docLclsfNo ?? "",
    defaults.docMclsfNo ?? "",
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (docClsfNo) {
        const res = await https.get(
          selectDocClassificationDetailApiPath(docClsfNo),
        );
        const viewData = (res.data?.data ?? res.data) as Values;
        setDefaults(viewData as Values);
        setdocClsfSeCd(viewData.docClsfSeCd ?? "L");
        setPrvcInclYn(viewData.prvcInclYn === "Y" ? "Y" : "N");
        if (viewData?.prvcFileHldPrst) {
          const y = viewData.prvcFileHldPrst.hldPrdDfyrs ?? 1;
          setIsDirectInputYear(String(y) === "0");

          setIsInfoAgree(viewData.prvcFileHldPrst.infoMnbdAgreYn === "Y");

          setHldPrdDfyrs(viewData.prvcFileHldPrst.hldPrdDfyrs ?? null);
          setHldPrdMmCnt(viewData.prvcFileHldPrst.hldPrdMmCnt ?? null);
        }
      } else {
        setDefaults(INITIAL_FORM_VALUES);
        setPrvcInclYn(INITIAL_FORM_VALUES.prvcInclYn === "Y" ? "Y" : "N");
      }
      setFormRenderKey((prev) => prev + 1);
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
  }, [docClsfNo]);

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    setDefaults((prev) => {
      const next = { ...prev, [name]: value as string };

      switch (name) {
        case "docLclsfNo":
          next.docMclsfNo = "";
          next.docSclsfNo = "";
          break;
        default:
          break;
      }
      // 대분류 변경 시 중분류/소분류 초기화

      return next;
    });
  };

  const handleBack = React.useCallback(() => {
    navigate(URL.DOC_CLASSIFICATION_LIST);
  }, [navigate]);

  /* ---------------- 제출 처리 ---------------- */
  const handleSubmit = React.useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formRef.current) return;

      // 폼데이터로 안하고 수정될때마다 컬럼의 값을 바꿔주는 형태로 가면 입력이 너무 느려짐..
      // 추후 좋은 방안 나오면 수정가능
      const fd = new FormData(formRef.current);
      const hasField = (key: string) =>
        Boolean(formRef.current?.elements.namedItem(key));
      const getText = (key: string, fallback = "") => {
        if (!hasField(key)) return fallback;
        const value = fd.get(key);
        return typeof value === "string" ? value : fallback;
      };
      const getNumber = (key: string, fallback: number | null = null) => {
        if (!hasField(key)) return fallback;
        const value = fd.get(key);
        if (value === null || value === "") return fallback;
        const num = Number(value);
        return Number.isNaN(num) ? fallback : num;
      };
      const getCheckboxYn = (key: string, fallback: string) => {
        if (!hasField(key)) return fallback;
        return fd.get(key) ? "Y" : "N";
      };

      const subDetail: SubDetailValues = {
        ...(defaults.prvcFileHldPrst ?? {}),
        deptNm: getText("deptNm", defaults.prvcFileHldPrst?.deptNm ?? ""),
        fileNm: getText("fileNm", defaults.prvcFileHldPrst?.fileNm ?? ""),
        hldPrpsExpln: getText(
          "hldPrpsExpln",
          defaults.prvcFileHldPrst?.hldPrpsExpln ?? "",
        ),
        clctSttBssExpln: getText(
          "clctSttBssExpln",
          defaults.prvcFileHldPrst?.clctSttBssExpln ?? "",
        ),
        useDeptNm: getText(
          "useDeptNm",
          defaults.prvcFileHldPrst?.useDeptNm ?? "",
        ),
        prvcPrcsMthdExpln: getText(
          "prvcPrcsMthdExpln",
          defaults.prvcFileHldPrst?.prvcPrcsMthdExpln ?? "",
        ),
        hldPrdDfyrs: getNumber(
          "hldPrdDfyrs",
          defaults.prvcFileHldPrst?.hldPrdDfyrs ?? null,
        ),
        hldPrdMmCnt: getNumber(
          "hldPrdMmCnt",
          defaults.prvcFileHldPrst?.hldPrdMmCnt ?? null,
        ),
        infoMnbdPrvcMttr: getText(
          "infoMnbdPrvcMttr",
          defaults.prvcFileHldPrst?.infoMnbdPrvcMttr ?? "",
        ),
        sttyAgtPrvcMttr: getText(
          "sttyAgtPrvcMttr",
          defaults.prvcFileHldPrst?.sttyAgtPrvcMttr ?? "",
        ),
        rrnoClctYn: getText(
          "rrnoClctYn",
          defaults.prvcFileHldPrst?.rrnoClctYn ?? "",
        ),
        rrnoClctSttBssExpln: getText(
          "rrnoClctSttBssExpln",
          defaults.prvcFileHldPrst?.rrnoClctSttBssExpln ?? "",
        ),
        infoMnbdAgreYn: getCheckboxYn(
          "infoMnbdAgreYn",
          defaults.prvcFileHldPrst?.infoMnbdAgreYn ?? "N",
        ),
        infoMnbdDsagClctSttBssExpln: getText(
          "infoMnbdDsagClctSttBssExpln",
          defaults.prvcFileHldPrst?.infoMnbdDsagClctSttBssExpln ?? "",
        ),
        spiHldYn: getText(
          "spiHldYn",
          defaults.prvcFileHldPrst?.spiHldYn ?? "",
        ),
        spiIndivAgrnYn: getText(
          "spiIndivAgrnYn",
          defaults.prvcFileHldPrst?.spiIndivAgrnYn ?? "",
        ),
        spiHldSttBssExpln: getText(
          "spiHldSttBssExpln",
          defaults.prvcFileHldPrst?.spiHldSttBssExpln ?? "",
        ),
        uiiHldYn: getText("uiiHldYn", defaults.prvcFileHldPrst?.uiiHldYn ?? ""),
        uiiIndivAgreYn: getText(
          "uiiIndivAgreYn",
          defaults.prvcFileHldPrst?.uiiIndivAgreYn ?? "",
        ),
        uiiHldSttBssExpln: getText(
          "uiiHldSttBssExpln",
          defaults.prvcFileHldPrst?.uiiHldSttBssExpln ?? "",
        ),
        prvcEvlTrgtYn: getText(
          "prvcEvlTrgtYn",
          defaults.prvcFileHldPrst?.prvcEvlTrgtYn ?? "",
        ),
        hndlPicNm: getText(
          "hndlPicNm",
          defaults.prvcFileHldPrst?.hndlPicNm ?? "",
        ),
        tdptySplrcpNmCn: getText(
          "tdptySplrcpNmCn",
          defaults.prvcFileHldPrst?.tdptySplrcpNmCn ?? "",
        ),
        tdptyPvsnBssExpln: getText(
          "tdptyPvsnBssExpln",
          defaults.prvcFileHldPrst?.tdptyPvsnBssExpln ?? "",
        ),
        tdptyPvsnMttr: getText(
          "tdptyPvsnMttr",
          defaults.prvcFileHldPrst?.tdptyPvsnMttr ?? "",
        ),
        prvcPrcsCnsgnBzentyNmCn: getText(
          "prvcPrcsCnsgnBzentyNmCn",
          defaults.prvcFileHldPrst?.prvcPrcsCnsgnBzentyNmCn ?? "",
        ),
        prvcCnsgnCtrtYn: getText(
          "prvcCnsgnCtrtYn",
          defaults.prvcFileHldPrst?.prvcCnsgnCtrtYn ?? "",
        ),
        prvcCnsgnFactIndctYn: getText(
          "prvcCnsgnFactIndctYn",
          defaults.prvcFileHldPrst?.prvcCnsgnFactIndctYn ?? "",
        ),
        prpsExclUtztnPvsnYn: getText(
          "prpsExclUtztnPvsnYn",
          defaults.prvcFileHldPrst?.prpsExclUtztnPvsnYn ?? "",
        ),
        prpsExclUtztnPvsnBssExpln: getText(
          "prpsExclUtztnPvsnBssExpln",
          defaults.prvcFileHldPrst?.prpsExclUtztnPvsnBssExpln ?? "",
        ),

        // 필요하면 나머지도 여기서만 추가
      };

      let docClsfNm = "";
      let upDocClsfNo: string | null = null;

      switch (docClsfSeCd) {
        case "L":
          docClsfNm = fd.get("docLclsfNm") as string;
          break;
        case "M":
          docClsfNm = fd.get("docMclsfNm") as string;
          upDocClsfNo = fd.get("docLclsfNo") as string;
          break;
        default:
          docClsfNm = fd.get("docSclsfNm") as string;
          upDocClsfNo = fd.get("docMclsfNo") as string;
          break;
      }

      const payload: Values = {
        ...defaults,
        docClsfNm: docClsfNm,
        upDocClsfNo: upDocClsfNo,
        docClsfSeCd: getText("docClsfSeCd", docClsfSeCd),
        docLclsfNo: getText("docLclsfNo", defaults.docLclsfNo ?? ""),
        docMclsfNo: getText("docMclsfNo", defaults.docMclsfNo ?? ""),
        docSclsfNo: getText("docSclsfNo", defaults.docSclsfNo ?? ""),
        docLclsfNm: getText("docLclsfNm", defaults.docLclsfNm ?? ""),
        docMclsfNm: getText("docMclsfNm", defaults.docMclsfNm ?? ""),
        docSclsfNm: getText("docSclsfNm", defaults.docSclsfNm ?? ""),
        prvcInclYn: getCheckboxYn("prvcInclYn", defaults.prvcInclYn ?? "N"),
        useEn: getText("useEn", defaults.useEn ?? "Y"),
        rgtrId: "Admin test",
        mdfrId: "Admin test",
        prvcFileHldPrst: subDetail,
      };
      // 검증
      const { issues } = docClassificationvalidator(payload);
      if (issues && issues.length > 0) {
        setFormErrors(
          Object.fromEntries(
            issues.map((issue) => [issue.path?.[0] ?? "", issue.message]),
          ),
        );
        return;
      }
      setFormErrors({});

      setIsSubmitting(true);

      try {
        const isEditMode = Boolean(docClsfNo);

        if (isEditMode) {
          if (
            payload.prvcInclYn === "Y" &&
            (Number(payload.prvcFileHldPrst?.hldPrdDfyrs) !==
              Number(hldPrdDfyrs) ||
              Number(payload.prvcFileHldPrst?.hldPrdMmCnt) !==
                Number(hldPrdMmCnt))
          ) {
            const confirmed = await dialogs.confirm(
              "보유기간 변경 시, 기존 개인정보파일에 대한 보유기간 수정에 대한 검토가 필요합니다. 해당화면으로 이동 하시겠습니다?",
              {
                severity: "error",
                okText: "확인",
                cancelText: "취소",
              },
            );

            if (confirmed) {
              navigate({
                pathname: URL.HOLDING_INSTITUTION_LIST,
                search: `?${createSearchParams({
                  lclsfNo: payload.docLclsfNo ?? "",
                  mclsfNo: payload.docMclsfNo ?? "",
                  sclsfNo: payload.docClsfNo ?? "",
                })}`,
              });

              return;
            } else {
              return;
            }
          } else {
            await https.post(
              updateDocClassificationApiPath(),
              payload as DocClassDetail,
            );
            notifications.show("수정 완료.", {
              severity: "success",
              autoHideDuration: 3000,
            });
          }
        } else {
          if (!payload.rgtrId) {
            notifications.show(
              "등록자 정보가 없습니다. 다시 로그인 후 시도해 주세요.",
              {
                severity: "error",
                autoHideDuration: 3000,
              },
            );
            return;
          }
          await https.post(
            insertDocClassificationApiPath(),
            payload as Omit<DocClassDetail, "docClsfNo">,
          );
          notifications.show("생성 완료.", {
            severity: "success",
            autoHideDuration: 3000,
          });
        }

        navigate(URL.DOC_CLASSIFICATION_LIST);
      } catch (err) {
        notifications.show(`처리 실패. 사유: ${(err as Error).message}`, {
          severity: "error",
          autoHideDuration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      defaults,
      docClsfSeCd,
      docClsfNo,
      navigate,
      hldPrdDfyrs,
      hldPrdMmCnt,
      dialogs,
      notifications,
    ],
  );

  /* ---------------- 렌더링 ---------------- */
  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }
  return (
    <Box
      key={formRenderKey}
      component="form"
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
    >
      <FormGroup>
        <TableWrapper
          sx={{ mb: 2 }}
          colgroup={
            <colgroup>
              <col className="tbl-col-w-20p" />
              <col />
            </colgroup>
          }
        >
          {!defaults.docClsfNo && (
            <TableRow>
              <LabelCell>문서분류</LabelCell>
              <TableCell>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    name="docClsfSeCd"
                    value={docClsfSeCd}
                    onChange={(e) => setdocClsfSeCd(e.target.value)}
                  >
                    <FormControlLabel
                      value="L"
                      control={<Radio size="small" />}
                      label="대분류"
                    />
                    <FormControlLabel
                      value="M"
                      control={<Radio size="small" />}
                      label="중분류"
                    />
                    <FormControlLabel
                      value="S"
                      control={<Radio size="small" />}
                      label="소분류"
                    />
                  </RadioGroup>
                </FormControl>
              </TableCell>
            </TableRow>
          )}

          {/* 대분류 */}
          <TableRow>
            <LabelCell>대분류</LabelCell>
            <TableCell>
              {docClsfSeCd === "L" ? (
                <TextField
                  name="docLclsfNm"
                  defaultValue={defaults.docLclsfNm ?? ""}
                  placeholder="대분류 메타정보"
                  error={!!formErrors.docLclsfNm}
                  helperText={formErrors.docLclsfNm ?? ""}
                  fullWidth
                />
              ) : (
                <MuiSelect
                  id="docLclsfNo"
                  label="대분류"
                  items={lclsfList}
                  value={defaults.docLclsfNo ?? ""}
                  onChange={handleSelectChange}
                />
              )}
            </TableCell>
          </TableRow>

          {/* 중분류 */}
          <TableRow>
            <LabelCell>중분류</LabelCell>
            <TableCell>
              {docClsfSeCd === "M" ? (
                <TextField
                  name="docMclsfNm"
                  defaultValue={defaults.docMclsfNm ?? ""}
                  placeholder="중분류 메타정보"
                  error={!!formErrors.docMclsfNm}
                  helperText={formErrors.docMclsfNm ?? ""}
                  fullWidth
                />
              ) : (
                <MuiSelect
                  id="docMclsfNo"
                  items={mclsfList}
                  value={defaults.docMclsfNo ?? ""}
                  error={!!formErrors.docMclsfNm}
                  helperText={formErrors.docMclsfNm ?? ""}
                  onChange={handleSelectChange}
                />
              )}
            </TableCell>
          </TableRow>
          {/* 소분류 */}
          {docClsfSeCd === "S" && (
            <TableRow>
              <LabelCell>소분류</LabelCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    name="docSclsfNm"
                    defaultValue={defaults.docSclsfNm ?? ""}
                    placeholder="소분류"
                    error={!!formErrors.docSclsfNm}
                    helperText={formErrors.docSclsfNm ?? " "}
                    fullWidth
                  />
                  <FormControlLabel
                    className="doc-clsf-prvc-checkbox"
                    control={
                      <Checkbox
                        size="small"
                        name="prvcInclYn"
                        defaultChecked={prvcInclYn === "Y"}
                        onChange={(e) =>
                          setPrvcInclYn(e.target.checked ? "Y" : "N")
                        }
                      />
                    }
                    label="개인정보포함"
                  />
                </Stack>
              </TableCell>
            </TableRow>
          )}

          {/* 사용여부 */}
          {defaults.docClsfNo && (
            <TableRow>
              <LabelCell>사용여부</LabelCell>
              <TableCell>
                <FormControl component="fieldset">
                  <RadioGroup row name="useEn" defaultValue={defaults.useEn}>
                    <FormControlLabel
                      value="Y"
                      control={<Radio size="small" />}
                      label="사용"
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio size="small" />}
                      label="사용안함"
                    />
                  </RadioGroup>
                </FormControl>
              </TableCell>
            </TableRow>
          )}
        </TableWrapper>

        {/* 개인정보 상세 – defaults.subDetail을 defaultValue로만 사용 */}
        {prvcInclYn === "Y" && (
          <Box mb={2}>
            <SectionTitle title="개인정보 상세" />
            <PrvcDetailTable
              defaults={defaults.prvcFileHldPrst ?? {}}
              isDirectInputYear={isDirectInputYear}
              onChangeDirectInputYear={setIsDirectInputYear}
              isInfoAgree={isInfoAgree}
              onChangeInfoAgree={setIsInfoAgree}
              formErrors={formErrors}
            />
          </Box>
        )}
      </FormGroup>

      <div className="btn_wrapper">
        <Button size="large" variant="contained" onClick={handleBack}>
          취소
        </Button>
        <Button
          type="submit"
          size="large"
          variant="outlined"
          disabled={isSubmitting}
        >
          {docClsfNo ? "수정" : "등록"}
        </Button>
      </div>
    </Box>
  );
}
