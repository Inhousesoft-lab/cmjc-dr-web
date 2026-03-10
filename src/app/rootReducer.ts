import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/AuthSlice";
import docClsfReducer from "@/features/clsf/DocClsfSlice";
import docClassificationListReducer from "@/features/classification/DocClassificationListSlice";
import digitalDocListReducer from "@/features/digitalDoc/DigitalDocSlice";
import docDestructionListReducer from "@/features/docDestruction/DocDestructionSlice";
import externalViewReducer from "@/features/ExternalViewSlice";
import holdingInstitutionListReducer from "@/features/holdingInstitution/HoldingInstitutionSlice";
import menuReducer from "@/features/menu/MenuSlice";
import uiReducer from "@/features/ui/uiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  docClsf: docClsfReducer,
  docClassificationList: docClassificationListReducer,
  digitalDocList: digitalDocListReducer,
  docDestructionList: docDestructionListReducer,
  externalView: externalViewReducer,
  holdingInstitutionList: holdingInstitutionListReducer,
  menuList: menuReducer,
  ui: uiReducer,
});

export default rootReducer;
