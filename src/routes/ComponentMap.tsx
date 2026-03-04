import Login from "@/pages/ko/Login";

import DocClassificationList from "@/pages/ko/DocClassification/DocClassificationList";
import DocClassificationDetail from "@/pages/ko/DocClassification/DocClassificationDetail";
import DocClassificationForm from "@/pages/ko/DocClassification/DocClassificationForm";
import HoldingInstitutionList from "@/pages/ko/DocClassification/HoldingInstitutionList";

import DigitalDocList from "@/pages/ko/DigitalDoc/DigitalDocList";
import DigitalDocDetail from "@/pages/ko/DigitalDoc/DigitalDocDetail";
import DigitalDocForm from "@/pages/ko/DigitalDoc/DigitalDocForm";
import DigitalDocFormTemp from "@/pages/ko/DigitalDoc/DigitalDocFormTemp";

import DocDestructionList from "@/pages/ko/DocDestruction/DocDestructionList";
import DocDestructionDetail from "@/pages/ko/DocDestruction/DocDestructionDetail";

import ExternalView from "@/pages/ko/ExternalView";

export const componentMap = {
  Login,
  DocClassificationList,
  DocClassificationForm,
  DocClassificationDetail,
  HoldingInstitutionList,
  DigitalDocList,
  DigitalDocDetail,
  DigitalDocForm,
  DigitalDocFormTemp,
  DocDestructionList,
  DocDestructionDetail,
  ExternalView,
};

export type ComponentKey = keyof typeof componentMap;
