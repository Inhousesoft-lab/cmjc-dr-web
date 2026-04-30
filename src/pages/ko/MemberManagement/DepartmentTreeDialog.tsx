import React from "react";
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
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DepartmentRow } from "@/types/member";

type DepartmentTreeNode = DepartmentRow & {
  children: DepartmentTreeNode[];
};

interface DepartmentTreeDialogProps {
  open: boolean;
  departments: DepartmentRow[];
  selectedDeptNo?: string;
  onClose: () => void;
  onSelect: (department: DepartmentRow) => void;
}

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

function DepartmentNode({
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
        onDoubleClick={() => onSelect(node)}
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
            <DepartmentNode
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

export default function DepartmentTreeDialog({
  open,
  departments,
  selectedDeptNo,
  onClose,
  onSelect,
}: DepartmentTreeDialogProps) {
  const [keyword, setKeyword] = React.useState("");
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [pendingDept, setPendingDept] = React.useState<DepartmentRow | null>(
    null,
  );

  const tree = React.useMemo(
    () => buildDepartmentTree(departments),
    [departments],
  );
  const visibleTree = React.useMemo(
    () => filterTree(tree, keyword),
    [keyword, tree],
  );

  React.useEffect(() => {
    if (!open) return;
    setPendingDept(
      departments.find((dept) => dept.deptNo === selectedDeptNo) ?? null,
    );
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

  const handleConfirm = () => {
    if (!pendingDept) return;
    onSelect(pendingDept);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      className="department-dialog"
    >
      <DialogTitle className="department-dialog__title">
        <span>▶ 부서조회</span>
        <IconButton aria-label="닫기" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="department-dialog__content">
        <Stack direction="row" spacing={1} className="department-dialog__search">
          <TextField
            fullWidth
            size="small"
            placeholder="검색어"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            autoFocus
          />
          <IconButton aria-label="부서 검색" sx={{ flexShrink: 0 }}>
            <SearchIcon />
          </IconButton>
        </Stack>
        <Box className="department-tree" role="tree">
          {visibleTree.length > 0 ? (
            <ul className="department-tree__root">
              {visibleTree.map((node) => (
                <DepartmentNode
                  key={node.deptNo}
                  node={node}
                  level={0}
                  expandedIds={expandedIds}
                  selectedDeptNo={pendingDept?.deptNo}
                  onToggle={handleToggle}
                  onSelect={setPendingDept}
                />
              ))}
            </ul>
          ) : (
            <Typography className="department-tree__empty">
              조회된 부서가 없습니다.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions className="department-dialog__actions">
        <Button type="button" variant="contained" onClick={handleConfirm} disabled={!pendingDept}>
          선택
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
