const URL = {
  // 메인
  MAIN: "/",
  // 문서고 관리
  DOC_CLASSIFICATION_LIST: "/docClassification/list",
  DOC_CLASSIFICATION_DETAIL: "/docClassification/:docClsfNo",
  DOC_CLASSIFICATION_CREATE: "/docClassification/create",
  DOC_CLASSIFICATION_MODIFY: "/docClassification/:docClsfNo/modify",
  // 보유기관 관리
  HOLDING_INSTITUTION_LIST: "/holdingInstitution/list",
  // 전자문서 관리
  DIGITAL_DOC_LIST: "/digitalDoc/list",
  DIGITAL_DOC_DETAIL: "/digitalDoc/:eldocNo",
  DIGITAL_DOC_CREATE: "/digitalDoc/create",
  DIGITAL_DOC_MODIFY: "/digitalDoc/:eldocNo/modify",
  DIGITAL_DOC_CREATE_TEMP: "/digitalDoc/temp",
  // 전자문서 파기
  DOC_DESTRUCTION_REQ_LIST: "/docDestructionReq/list",
  DOC_DESTRUCTION_APPV_LIST: "/docDestructionAppv/list",
  DOC_DESTRUCTION_LIST: "/docDestruction/list",
  DOC_DESTRUCTION_DETAIL: "/docDestruction/:eldocNo",
};

export default URL;
