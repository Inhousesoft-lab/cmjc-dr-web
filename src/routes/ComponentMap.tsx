import DocClassificationList from "@/pages/ko/DocClassification/DocClassificationList";
import DocClassificationDetail from "@/pages/ko/DocClassification/DocClassificationDetail";
import DocClassificationForm from "@/pages/ko/DocClassification/DocClassificationForm";
import HoldingInstitutionList from "@/pages/ko/DocClassification/HoldingInstitutionList";

import DocDestructionDetail from "@/pages/ko/DocDestruction/DocDestructionDetail";
import DigitalDocList from "@/pages/ko/DigitalDoc/DigitalDocList";
import DigitalDocDetail from "@/pages/ko/DigitalDoc/DigitalDocDetail";
import DigitalDocForm from "@/pages/ko/DigitalDoc/DigitalDocForm";

import DocDestructionReqList from "@/pages/ko/DocDestruction/DocDestructionReqList";
import DocDestructionAppvList from "@/pages/ko/DocDestruction/DocDestructionAppvList";
import DocDestructionList from "@/pages/ko/DocDestruction/DocDestructionList";
import ExternalView from "@/pages/ko/ExternalView";

export const componentMap = {
  DocClassificationList,
  DocClassificationForm,
  DocClassificationDetail,
  HoldingInstitutionList,
  DigitalDocList,
  DigitalDocDetail,
  DigitalDocForm,
  DocDestructionReqList,
  DocDestructionAppvList,
  DocDestructionList,
  DocDestructionDetail,
  ExternalView
};

export type ComponentKey = keyof typeof componentMap;
