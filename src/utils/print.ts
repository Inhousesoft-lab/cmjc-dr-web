import { formatRegDate } from "@/utils/formater";

type PrintElementOptions = {
  title?: string;
  subTitle?: string;
  popupFeatures?: string;
  zoom?: number;
  pageMarginMm?: number;
  gridColumns?: Array<{
    headerName?: string;
    field?: string;
    format?: "date";
  }>;
  gridRows?: Array<Record<string, unknown>>;
};

type AgHeader = {
  id: string;
  label: string;
};

function uniqueHeaders(headers: AgHeader[]) {
  const seen = new Set<string>();
  const result: AgHeader[] = [];

  for (const header of headers) {
    const key = `${header.id}::${header.label}`;
    if (!header.label || seen.has(key)) continue;
    seen.add(key);
    result.push(header);
  }

  return result;
}

function buildTableFromAgRoot(agRoot: HTMLElement) {
  const headerNodes = Array.from(
    agRoot.querySelectorAll<HTMLElement>(".ag-header-cell"),
  );

  const headers = uniqueHeaders(
    headerNodes.map((node) => ({
      id: node.getAttribute("col-id") ?? "",
      label:
        node.querySelector(".ag-header-cell-text")?.textContent?.trim() ?? "",
    })),
  );

  const bodyRows = Array.from(
    agRoot.querySelectorAll<HTMLElement>(".ag-center-cols-container .ag-row"),
  );

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.tableLayout = "fixed";
  table.style.fontSize = "12px";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  for (const header of headers) {
    const th = document.createElement("th");
    th.textContent = header.label;
    th.style.border = "1px solid #ccc";
    th.style.padding = "6px";
    th.style.textAlign = "center";
    th.style.backgroundColor = "#f5f5f5";
    headRow.appendChild(th);
  }

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  for (const rowNode of bodyRows) {
    const row = document.createElement("tr");
    const cells = Array.from(rowNode.querySelectorAll<HTMLElement>(".ag-cell"));
    const cellMap = new Map<string, string>();

    for (const cell of cells) {
      const key = cell.getAttribute("col-id") ?? "";
      const text = cell.textContent?.trim() ?? "";
      if (!cellMap.has(key)) {
        cellMap.set(key, text);
      }
    }

    if (headers.length > 0) {
      for (const header of headers) {
        const td = document.createElement("td");
        const rawValue = cellMap.get(header.id) ?? "";
        td.textContent = rawValue;
        td.style.border = "1px solid #ccc";
        td.style.padding = "6px";
        td.style.textAlign = "center";
        row.appendChild(td);
      }
    } else {
      for (const cell of cells) {
        const td = document.createElement("td");
        td.textContent = cell.textContent?.trim() ?? "";
        td.style.border = "1px solid #ccc";
        td.style.padding = "6px";
        td.style.textAlign = "center";
        row.appendChild(td);
      }
    }

    tbody.appendChild(row);
  }

  if (bodyRows.length === 0) {
    const emptyRow = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = Math.max(headers.length, 1);
    td.textContent = "데이터가 없습니다.";
    td.style.border = "1px solid #ccc";
    td.style.padding = "8px";
    td.style.textAlign = "center";
    emptyRow.appendChild(td);
    tbody.appendChild(emptyRow);
  }

  table.appendChild(tbody);
  return table;
}

function getByPath(obj: Record<string, unknown>, path: string) {
  if (!path) return "";
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[key];
  }

  return current ?? "";
}

function buildTableFromData(
  columns: Array<{ headerName?: string; field?: string; format?: "date" }>,
  rows: Array<Record<string, unknown>>,
) {
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.tableLayout = "fixed";
  table.style.fontSize = "12px";

  const effectiveColumns = columns.filter((c) => c.headerName && c.field);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const col of effectiveColumns) {
    const th = document.createElement("th");
    th.textContent = col.headerName ?? "";
    th.style.border = "1px solid #ccc";
    th.style.padding = "6px";
    th.style.textAlign = "center";
    th.style.backgroundColor = "#f5f5f5";
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  if (rows.length === 0) {
    const emptyRow = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = Math.max(effectiveColumns.length, 1);
    td.textContent = "데이터가 없습니다.";
    td.style.border = "1px solid #ccc";
    td.style.padding = "8px";
    td.style.textAlign = "center";
    emptyRow.appendChild(td);
    tbody.appendChild(emptyRow);
  } else {
    for (const rowData of rows) {
      const tr = document.createElement("tr");
      for (const col of effectiveColumns) {
        const td = document.createElement("td");
        const rawValue = String(getByPath(rowData, col.field ?? ""));
        td.textContent = col.format === "date" ? formatRegDate(rawValue) : rawValue;
        td.style.border = "1px solid #ccc";
        td.style.padding = "6px";
        td.style.textAlign = "center";
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }

  table.appendChild(tbody);
  return table;
}

function convertAgGridToHtmlTable(root: HTMLElement) {
  const cloned = root.cloneNode(true) as HTMLElement;
  const removeSelectors = [
    ".board_info",
    ".paing_container",
    ".paging-count",
    ".paging_wrapper",
    ".ag-paging-panel",
  ];

  for (const selector of removeSelectors) {
    const nodes = Array.from(cloned.querySelectorAll(selector));
    for (const node of nodes) {
      node.remove();
    }
  }

  const agRoots = Array.from(cloned.querySelectorAll<HTMLElement>(".ag-root"));

  if (agRoots.length === 0) {
    return cloned;
  }

  for (const agRoot of agRoots) {
    const table = buildTableFromAgRoot(agRoot);
    agRoot.replaceWith(table);
  }

  return cloned;
}

export function printElement(
  element: HTMLElement,
  options: PrintElementOptions = {},
) {
  const {
    title = "출력",
    subTitle = "",
    popupFeatures = "width=1200,height=800",
    zoom = 0.44,
    pageMarginMm = 12,
    gridColumns,
    gridRows,
  } = options;

  const printWindow = window.open("", "_blank", popupFeatures);
  if (!printWindow) return;

  const doc = printWindow.document;
  // 브라우저 인쇄 헤더의 페이지명 노출을 최소화하기 위해 타이틀을 비운다.
  // 스크린샷의 날짜/페이지명 말머리는 브라우저 인쇄 헤더·푸터(Chrome 기본 기능)라서 JS/CSS로 완전 제거가 불가합니다.
  // 인쇄창에서 설정 더보기 → 헤더 및 바닥글 끄면 날짜/페이지명도 사라집니다.
  doc.title = title;

  const meta = doc.createElement("meta");
  meta.setAttribute("charset", "utf-8");
  doc.head.appendChild(meta);

  const styleNodes = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style'),
  );

  for (const node of styleNodes) {
    if (node instanceof HTMLLinkElement) {
      if (!node.href) continue;
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = node.href;
      if (node.media) link.media = node.media;
      doc.head.appendChild(link);
      continue;
    }

    if (node instanceof HTMLStyleElement) {
      const style = doc.createElement("style");
      style.textContent = node.textContent ?? "";
      doc.head.appendChild(style);
    }
  }

  const printStyle = doc.createElement("style");
  printStyle.textContent = `
    @page { size: auto; margin: ${pageMarginMm}mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @media print {
      html, body {
        visibility: visible !important;
      }
      body * {
        visibility: visible !important;
      }
      body { zoom: ${zoom}; }
    }
  `;
  doc.head.appendChild(printStyle);

  doc.body.replaceChildren();
  if (subTitle) {
    const headerWrapper = doc.createElement("div");
    headerWrapper.style.marginBottom = "12px";

    const subTitleRow = doc.createElement("div");
    subTitleRow.textContent = subTitle;
    subTitleRow.style.textAlign = "left";
    subTitleRow.style.fontSize = "14px";
    subTitleRow.style.marginBottom = "6px";
    headerWrapper.appendChild(subTitleRow);

    const titleRow = doc.createElement("div");
    titleRow.textContent = title;
    titleRow.style.textAlign = "center";
    titleRow.style.fontSize = "28px";
    titleRow.style.fontWeight = "700";
    titleRow.style.marginBottom = "8px";
    headerWrapper.appendChild(titleRow);

    doc.body.appendChild(headerWrapper);
  }

  if (gridColumns && gridRows) {
    const wrapper = doc.createElement("div");
    const table = buildTableFromData(gridColumns, gridRows);
    wrapper.appendChild(table);
    doc.body.appendChild(wrapper);
  } else {
    const converted = convertAgGridToHtmlTable(element);
    doc.body.appendChild(doc.importNode(converted, true));
  }

  let printed = false;
  const doPrint = () => {
    if (printed) return;
    printed = true;
    printWindow.focus();
    printWindow.print();
  };

  printWindow.addEventListener("afterprint", () => {
    printWindow.close();
  });

  const schedulePrint = () => {
    printWindow.requestAnimationFrame(() => {
      printWindow.requestAnimationFrame(doPrint);
    });
  };

  // about:blank 팝업은 onload 타이밍을 놓칠 수 있어서 fallback을 함께 둔다.
  printWindow.onload = schedulePrint;

  if (doc.readyState === "complete") {
    schedulePrint();
  } else {
    setTimeout(schedulePrint, 200);
  }
}
