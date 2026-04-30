import React from "react";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import https from "@/api/axiosInstance";
import {
  createDepartmentApiPath,
  updateDepartmentApiPath,
} from "@/api/member/MemberApiPaths";
import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import useNotifications from "@/hooks/useNotifications";
import type { DepartmentRow } from "@/types/member";
import { getErrorMessage } from "@/utils/globalFunc";

type DepartmentTreeNode = DepartmentRow & {
  children: DepartmentTreeNode[];
};

type FormMode = "empty" | "create" | "edit";

type DepartmentFormValues = {
  deptNo: string;
  deptNm: string;
  upDeptNo: string;
  upDeptNm: string;
};

interface DepartmentManageDialogProps {
  open: boolean;
  departments: DepartmentRow[];
  selectedDeptNo?: string;
  onClose: () => void;
  onChanged: (department: DepartmentRow) => void | Promise<void>;
}

const EMPTY_FORM: DepartmentFormValues = {
  deptNo: "",
  deptNm: "",
  upDeptNo: "",
  upDeptNm: "",
};

const LIST_KEYS = ["list", "rows", "items", "content"] as const;

const toStr = (value: unknown) => (value == null ? "" : String(value));

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const pickData = (payload: any) => {
  if (isRecord(payload?.data)) return payload.data;
  if (isRecord(payload?.result?.data)) return payload.result.data;
  return payload;
};

const pickArray = (payload: any): any[] => {
  const roots = [
    payload,
    payload?.data,
    payload?.result,
    payload?.data?.data,
    payload?.result?.data,
  ];

  for (const root of roots) {
    if (Array.isArray(root)) return root;
    if (!isRecord(root)) continue;
    for (const key of LIST_KEYS) {
      if (Array.isArray(root[key])) return root[key];
    }
  }

  return [];
};

const normalizeDepartment = (payload: any): DepartmentRow => {
  const data = pickData(payload);
  return {
    rowNo: Number(data?.rowNo ?? data?.row_no ?? 0),
    deptNo: toStr(data?.deptNo ?? data?.dept_no),
    deptNm: toStr(data?.deptNm ?? data?.dept_nm),
    upDeptNo: toStr(data?.upDeptNo ?? data?.up_dept_no),
    useEn: toStr(data?.useEn ?? data?.use_en),
    useYn: toStr(data?.useYn ?? data?.use_yn),
  };
};

const sortDepartments = <T extends DepartmentRow>(items: T[]) =>
  [...items].sort((a, b) => {
    const rowA = Number(a.rowNo ?? 0);
    const rowB = Number(b.rowNo ?? 0);
    if (rowA !== rowB) return rowA - rowB;
    return a.deptNm.localeCompare(b.deptNm, "ko");
  });

const buildDepartmentTree = (departments: DepartmentRow[]) => {
  const nodeMap = new Map<string, DepartmentTreeNode>();
  const roots: DepartmentTreeNode[] = [];

  sortDepartments(departments).forEach((dept) => {
    nodeMap.set(dept.deptNo, { ...dept, children: [] });
  });

  nodeMap.forEach((node) => {
    const parentKey = String(node.upDeptNo ?? "").trim();
    const parent = parentKey ? nodeMap.get(parentKey) : undefined;

    if (parent && parent.deptNo !== node.deptNo) {
      parent.children.push(node);
      return;
    }

    roots.push(node);
  });

  const sortTree = (nodes: DepartmentTreeNode[]) => {
    nodes.sort((a, b) => {
      const rowA = Number(a.rowNo ?? 0);
      const rowB = Number(b.rowNo ?? 0);
      if (rowA !== rowB) return rowA - rowB;
      return a.deptNm.localeCompare(b.deptNm, "ko");
    });
    nodes.forEach((node) => sortTree(node.children));
  };

  sortTree(roots);
  return roots;
};

const collectNodeIds = (nodes: DepartmentTreeNode[], acc = new Set<string>()) => {
  nodes.forEach((node) => {
    acc.add(node.deptNo);
    collectNodeIds(node.children, acc);
  });
  return acc;
};

const filterTree = (
  nodes: DepartmentTreeNode[],
  keyword: string,
): DepartmentTreeNode[] => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return nodes;

  return nodes.flatMap((node) => {
    const isMatched =
      node.deptNm.toLowerCase().includes(normalizedKeyword) ||
      node.deptNo.toLowerCase().includes(normalizedKeyword);
    const filteredChildren = filterTree(node.children, normalizedKeyword);

    if (isMatched) return [{ ...node }];
    if (filteredChildren.length > 0) {
      return [{ ...node, children: filteredChildren }];
    }
    return [];
  });
};

function DepartmentManageNode({
  node,
  level,
  expandedIds,
  selectedDeptNo,
  onToggle,
  onSelect,
}: {
  node: DepartmentTreeNode;
  level: number;
  expandedIds: Set<string>;
  selectedDeptNo?: string;
  onToggle: (deptNo: string) => void;
  onSelect: (department: DepartmentRow) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.deptNo);
  const isSelected = selectedDeptNo === node.deptNo;

  return (
    <li>
      <button
        type="button"
        className={`department-tree__item ${
          isSelected ? "department-tree__item--selected" : ""
        }`}
        style={{ paddingLeft: `${level * 18 + 4}px` }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <span
            className="department-tree__toggle"
            role="button"
            tabIndex={-1}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(node.deptNo);
            }}
          >
            {isExpanded ? (
              <ExpandMoreIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </span>
        ) : (
          <span className="department-tree__toggle-spacer" />
        )}
        <span className="department-tree__label">{node.deptNm}</span>
      </button>
      {hasChildren && isExpanded && (
        <ul className="department-tree__children">
          {node.children.map((child) => (
            <DepartmentManageNode
              key={child.deptNo}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              selectedDeptNo={selectedDeptNo}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function DepartmentManageDialog({
  open,
  departments,
  selectedDeptNo,
  onClose,
  onChanged,
}: DepartmentManageDialogProps) {
  const notifications = useNotifications();
  const [keyword, setKeyword] = React.useState("");
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [selectedDept, setSelectedDept] = React.useState<DepartmentRow | null>(
    null,
  );
  const [formMode, setFormMode] = React.useState<FormMode>("empty");
  const [formValues, setFormValues] =
    React.useState<DepartmentFormValues>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const initializedRef = React.useRef(false);

  const tree = React.useMemo(
    () => buildDepartmentTree(departments),
    [departments],
  );
  const visibleTree = React.useMemo(
    () => filterTree(tree, keyword),
    [keyword, tree],
  );

  React.useEffect(() => {
    if (!open) {
      initializedRef.current = false;
      return;
    }
    if (initializedRef.current) return;

    initializedRef.current = true;

    const initialDept =
      departments.find((dept) => dept.deptNo === selectedDeptNo) ?? null;
    setSelectedDept(initialDept);
    setFormMode(initialDept ? "edit" : "empty");
    setFormValues(initialDept ? toEditForm(initialDept, departments) : EMPTY_FORM);
    setExpandedIds(collectNodeIds(tree));
  }, [departments, open, selectedDeptNo, tree]);

  React.useEffect(() => {
    if (keyword.trim()) {
      setExpandedIds(collectNodeIds(visibleTree));
    }
  }, [keyword, visibleTree]);

  const handleToggle = (deptNo: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(deptNo)) {
        next.delete(deptNo);
      } else {
        next.add(deptNo);
      }
      return next;
    });
  };

  const handleSelect = (department: DepartmentRow) => {
    setSelectedDept(department);
    setFormMode("edit");
    setFormValues(toEditForm(department, departments));
  };

  const handleAdd = () => {
    if (!selectedDept) {
      notifications.show("부서를 선택해주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    setFormMode("create");
    setFormValues({
      deptNo: "",
      deptNm: "",
      upDeptNo: selectedDept.deptNo,
      upDeptNm: selectedDept.deptNm,
    });
  };

  const handleSave = async () => {
    const deptNm = formValues.deptNm.trim();
    if (!deptNm) {
      notifications.show("부서명을 입력해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    if (formMode === "create" && !formValues.upDeptNo) {
      notifications.show("상위부서를 선택해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    if (formMode === "empty") {
      notifications.show("등록 또는 수정할 부서를 선택해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    setSaving(true);
    try {
      const res =
        formMode === "create"
          ? await https.post(createDepartmentApiPath(), {
              deptNm,
              upDeptNo: formValues.upDeptNo,
            })
          : await https.put(updateDepartmentApiPath(formValues.deptNo), {
              deptNm,
            });

      const department = normalizeDepartment((res as any)?.data ?? {});
      await onChanged(department);
      setSelectedDept(department);
      setFormMode("edit");
      setFormValues(toEditForm(department, departments));
      notifications.show(
        formMode === "create" ? "부서가 등록되었습니다." : "부서가 수정되었습니다.",
        {
          severity: "success",
          autoHideDuration: 2500,
        },
      );
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="department-manage-dialog"
    >
      <DialogTitle className="department-manage-dialog__title">
        부서관리
      </DialogTitle>
      <DialogContent className="department-manage-dialog__content">
        <Box className="department-manage">
          <Box className="department-manage__tree-panel">
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              className="department-manage__toolbar"
            >
              <Typography fontWeight={700}>부서</Typography>
              <IconButton
                type="button"
                aria-label="부서 등록"
                onClick={handleAdd}
                disabled={saving}
                size="small"
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <TextField
                size="small"
                placeholder="검색어"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="department-manage__search"
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" />,
                }}
              />
            </Stack>
            <Box className="department-tree department-manage__tree" role="tree">
              {visibleTree.length > 0 ? (
                <ul className="department-tree__root">
                  {visibleTree.map((node) => (
                    <DepartmentManageNode
                      key={node.deptNo}
                      node={node}
                      level={0}
                      expandedIds={expandedIds}
                      selectedDeptNo={selectedDept?.deptNo}
                      onToggle={handleToggle}
                      onSelect={handleSelect}
                    />
                  ))}
                </ul>
              ) : (
                <Typography className="department-tree__empty">
                  조회된 부서가 없습니다.
                </Typography>
              )}
            </Box>
          </Box>

          <Box className="department-manage__form-panel">
            <Typography variant="h6" fontWeight={700} mb={1}>
              {formMode === "create" ? "부서 등록" : "부서 수정"}
            </Typography>
            <TableWrapper
              tableAriaLabel="부서관리 정보"
              colgroup={
                <colgroup>
                  <col className="tbl-col-w-100" />
                  <col />
                </colgroup>
              }
            >
              <TableRow>
                <LabelCell>부서ID</LabelCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={formValues.deptNo}
                    placeholder="저장 시 자동생성"
                    disabled
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <LabelCell>상위부서</LabelCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={formValues.upDeptNm}
                    placeholder="상위부서"
                    disabled
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <LabelCell required>부서명</LabelCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={formValues.deptNm}
                    placeholder="부서명"
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        deptNm: event.target.value,
                      }))
                    }
                    disabled={saving || formMode === "empty"}
                  />
                </TableCell>
              </TableRow>
            </TableWrapper>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="department-manage-dialog__actions">
        <Button
          type="button"
          variant="contained"
          onClick={handleSave}
          disabled={saving || formMode === "empty"}
        >
          저장
        </Button>
        <Button type="button" variant="outlined" onClick={onClose} disabled={saving}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function toEditForm(
  department: DepartmentRow,
  departments: DepartmentRow[],
): DepartmentFormValues {
  const parent = departments.find((dept) => dept.deptNo === department.upDeptNo);

  return {
    deptNo: department.deptNo,
    deptNm: department.deptNm,
    upDeptNo: department.upDeptNo ?? "",
    upDeptNm: parent?.deptNm ?? "",
  };
}
