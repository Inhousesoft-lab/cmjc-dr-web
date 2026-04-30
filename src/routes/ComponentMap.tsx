import Login from "@/pages/ko/Login";

import DocClassificationList from "@/pages/ko/DocClassification/DocClassificationList";
import DocClassificationDetail from "@/pages/ko/DocClassification/DocClassificationDetail";
import DocClassificationForm from "@/pages/ko/DocClassification/DocClassificationForm";
import HoldingInstitutionList from "@/pages/ko/DocClassification/HoldingInstitutionList";

import DigitalDocList from "@/pages/ko/DigitalDoc/DigitalDocList";
import DigitalDocDetail from "@/pages/ko/DigitalDoc/DigitalDocDetail";
import DigitalDocForm from "@/pages/ko/DigitalDoc/DigitalDocForm";
import DigitalDocFormTemp from "@/pages/ko/DigitalDoc/DigitalDocFormTemp";
import ExternalView from "@/pages/ko/ExternalView";
import MemberManagement from "@/pages/ko/MemberManagement";
import MemberForm from "@/pages/ko/MemberManagement/MemberForm";
import PasswordChange from "@/pages/ko/PasswordChange";

import DocDestructionReqList from "@/pages/ko/DocDestruction/DocDestructionReqList";
import DocDestructionAppvList from "@/pages/ko/DocDestruction/DocDestructionAppvList";
import DocDestructionEntry from "@/pages/ko/DocDestruction/DocDestructionEntry";
import DocDestructionList from "@/pages/ko/DocDestruction/DocDestructionList";
import DocDestructionDetail from "@/pages/ko/DocDestruction/DocDestructionDetail";

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
  ExternalView,
  MemberManagement,
  MemberForm,
  PasswordChange,
  DocDestructionEntry,
  DocDestructionReqList,
  DocDestructionAppvList,
  DocDestructionList,
  DocDestructionDetail,
};

export type ComponentKey = keyof typeof componentMap;
