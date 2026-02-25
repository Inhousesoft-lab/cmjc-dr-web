import { Menu } from "@/features/menu/MenuSlice";

const menuItems: Menu[] = [
  {
    path: "classification",
    label: "문서고 관리",
    menuType: "SCN",
    children: [
      {
        path: "docClassification/list",
        label: "문서분류 관리",
        menuType: "MENU",
        element: {
          ko: "DocClassificationList",
          en: "DocClassificationList",
        },
        menu: true,
      },
      {
        path: "docClassification/:docClsfNo",
        label: "문서분류 상세",
        menuType: "MENU",
        element: {
          ko: "DocClassificationDetail",
          en: "DocClassificationDetail",
        },
        menu: false,
      },
      {
        path: "docClassification/create",
        label: "문서분류 등록",
        menuType: "MENU",
        element: {
          ko: "DocClassificationForm",
          en: "DocClassificationForm",
        },
        menu: false,
      },
      {
        path: "docClassification/:docClsfNo/modify",
        label: "문서분류 수정",
        menuType: "MENU",
        element: {
          ko: "DocClassificationForm",
          en: "DocClassificationForm",
        },
        menu: false,
      },
      {
        path: "holdingInstitution/list",
        label: "보유기간 관리",
        menuType: "MENU",
        element: {
          ko: "HoldingInstitutionList",
          en: "HoldingInstitutionList",
        },
        menu: true,
      },
    ],
    menu: true,
  },
  {
    path: "digitalDoc/list",
    label: "문서고 조회",
    menuType: "MENU",
    element: {
      ko: "DigitalDocList",
      en: "DigitalDocList",
    },
    menu: true,
  },
  {
    path: "digitalDoc/:id",
    label: "문서고 상세",
    menuType: "MENU",
    element: {
      ko: "DigitalDocDetail",
      en: "DigitalDocDetail",
    },
    menu: false,
  },
  {
    path: "digitalDoc/create",
    label: "문서분류 등록",
    menuType: "MENU",
    element: {
      ko: "DigitalDocForm",
      en: "DigitalDocForm",
    },
    menu: false,
  },
  {
    path: "destruction",
    label: "파기문서 관리",
    menuType: "SCN",
    children: [
      {
        path: "docDestructionReq/list",
        label: "전자문서 파기신청",
        menuType: "MENU",
        element: {
          ko: "DocDestructionReqList",
          en: "DocDestructionReqList",
        },
        menu: true,
      },
      {
        path: "docDestructionAppv/list",
        label: "전자문서 승인신청",
        menuType: "MENU",
        element: {
          ko: "DocDestructionAppvList",
          en: "DocDestructionAppvList",
        },
        menu: true,
      },
      {
        path: "docDestruction/list",
        label: "전자문서 파기목록",
        menuType: "MENU",
        element: {
          ko: "DocDestructionList",
          en: "DocDestructionList",
        },
        menu: true,
      },
      {
        path: "docDestruction/:eldocNo",
        label: "전자문서 파기상세",
        menuType: "MENU",
        element: {
          ko: "DocDestructionDetail",
          en: "DocDestructionDetail",
        },
        menu: false,
      },
    ],
    menu: true,
  },
  {
    path: "exteralView",
    label: "문서열람(외부)",
    menuType: "MENU",
    element: {
      ko: "ExternalView",
      en: "ExternalView",
    },
    menu: true,
  },
];

export default menuItems;
