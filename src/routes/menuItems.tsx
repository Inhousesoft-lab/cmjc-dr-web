import { Menu } from "@/features/menu/MenuSlice";

const menuItems: Menu[] = [
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
    path: "digitalDoc/create",
    label: "문서 등록",
    menuType: "MENU",
    element: {
      ko: "DigitalDocForm",
      en: "DigitalDocForm",
    },
    menu: false,
  },
  {
    path: "destruction/reqList",
    label: "문서 파기 신청",
    menuType: "MENU",
    element: {
      ko: "DocDestructionReqList",
      en: "DocDestructionReqList",
    },
    menu: true,
  },
  {
    path: "destruction/appvList",
    label: "문서 파기 승인",
    menuType: "MENU",
    element: {
      ko: "DocDestructionAppvList",
      en: "DocDestructionAppvList",
    },
    menu: true,
  },
  {
    path: "destruction/list",
    label: "문서 파기 내역",
    menuType: "MENU",
    element: {
      ko: "DocDestructionList",
      en: "DocDestructionList",
    },
    menu: true,
  },
  {
    path: "docDestruction/:eldocNo",
    label: "파기문서 상세",
    menuType: "MENU",
    element: {
      ko: "DocDestructionDetail",
      en: "DocDestructionDetail",
    },
    menu: false,
  },
  {
    path: "digitalDoc/:eldocNo",
    label: "전자문서 상세",
    menuType: "MENU",
    element: {
      ko: "DigitalDocDetail",
      en: "DigitalDocDetail",
    },
    menu: false,
  },
  {
    path: "digitalDoc/:eldocNo/modify",
    label: "문서 수정",
    menuType: "MENU",
    element: {
      ko: "DigitalDocForm",
      en: "DigitalDocForm",
    },
    menu: false,
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
    path: "members",
    label: "회원관리",
    menuType: "MENU",
    element: {
      ko: "MemberManagement",
      en: "MemberManagement",
    },
    menu: false,
  },
  {
    path: "members/create",
    label: "회원 등록",
    menuType: "MENU",
    element: {
      ko: "MemberForm",
      en: "MemberForm",
    },
    menu: false,
  },
  {
    path: "members/:mbrId",
    label: "회원 수정",
    menuType: "MENU",
    element: {
      ko: "MemberForm",
      en: "MemberForm",
    },
    menu: false,
  },
  {
    path: "password-change",
    label: "비밀번호 변경",
    menuType: "MENU",
    element: {
      ko: "PasswordChange",
      en: "PasswordChange",
    },
    menu: false,
  },
  // {
  //   path: "classification",
  //   label: "문서고 관리",
  //   menuType: "SCN",
  //   children: [
  //     {
  //       path: "docClassification/list",
  //       label: "문서분류 관리",
  //       menuType: "MENU",
  //       element: {
  //         ko: "DocClassificationList",
  //         en: "DocClassificationList",
  //       },
  //       menu: true,
  //     },

  //     {
  //       path: "holdingInstitution/list",
  //       label: "문서 보유기관 관리",
  //       menuType: "MENU",
  //       element: {
  //         ko: "HoldingInstitutionList",
  //         en: "HoldingInstitutionList",
  //       },
  //       menu: true,
  //     },
  //   ],
  //   menu: true,
  // },
  // {
  //   path: "digitalDoc/list",
  //   label: "문서고 조회",
  //   menuType: "MENU",
  //   element: {
  //     ko: "DigitalDocList",
  //     en: "DigitalDocList",
  //   },
  //   menu: true,
  // },
  // {
  //   path: "digitalDoc/create",
  //   label: "문서 등록",
  //   menuType: "MENU",
  //   element: {
  //     ko: "DigitalDocForm",
  //     en: "DigitalDocForm",
  //   },
  //   menu: false,
  // },
  // {
  //   path: "destruction",
  //   label: "파기문서 관리",
  //   menuType: "MENU",
  //   element: {
  //     ko: "DocDestructionEntry",
  //     en: "DocDestructionEntry",
  //   },
  //   children: [

  // {
  //   path: "external-view",
  //   label: "문서열람(외부)",
  //   menuType: "MENU",
  //   element: {
  //     ko: "ExternalView",
  //     en: "ExternalView",
  //   },
  //   menu: true,
  // },
  // {
  //   path: "digitalDoc/temp",
  //   label: "문서등록(임시)",
  //   menuType: "MENU",
  //   element: {
  //     ko: "DigitalDocFormTemp",
  //     en: "DigitalDocFormTemp",
  //   },
  //   menu: true,
  // },
  // {
  //   path: "members",
  //   label: "회원관리",
  //   menuType: "MENU",
  //   element: {
  //     ko: "MemberManagement",
  //     en: "MemberManagement",
  //   },
  //   menu: false,
  // },
  // {
  //   path: "members/create",
  //   label: "회원 등록",
  //   menuType: "MENU",
  //   element: {
  //     ko: "MemberForm",
  //     en: "MemberForm",
  //   },
  //   menu: false,
  // },
  // {
  //   path: "members/:mbrId",
  //   label: "회원 수정",
  //   menuType: "MENU",
  //   element: {
  //     ko: "MemberForm",
  //     en: "MemberForm",
  //   },
  //   menu: false,
  // },
  // {
  //   path: "password-change",
  //   label: "비밀번호 변경",
  //   menuType: "MENU",
  //   element: {
  //     ko: "PasswordChange",
  //     en: "PasswordChange",
  //   },
  //   menu: false,
  // },
];

export default menuItems;
