import { combineReducers } from "@reduxjs/toolkit";
import docClsfReducer from "@/features/clsf/DocClsfSlice";
import docClassificationListReducer from "@/features/classification/DocClassificationListSlice";
import digitalDocListReducer from "@/features/digitalDoc/DigitalDocSlice";
import holdingInstitutionListReducer from "@/features/holdingInstitution/HoldingInstitutionSlice";
import menuReducer from "@/features/auth/MenuSlice";
import uiReducer from "@/features/ui/uiSlice";

const rootReducer = combineReducers({
  docClsf: docClsfReducer,
  docClassificationList: docClassificationListReducer,
  digitalDocList: digitalDocListReducer,
  holdingInstitutionList: holdingInstitutionListReducer,
  menuList: menuReducer,
  ui: uiReducer,
});

export default rootReducer;
