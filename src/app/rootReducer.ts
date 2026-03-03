import { combineReducers } from "@reduxjs/toolkit";
import docClsfReducer from "@/features/clsf/DocClsfSlice";
import docClassificationListReducer from "@/features/classification/DocClassificationListSlice";
import digitalDocListReducer from "@/features/digitalDoc/DigitalDocSlice";
import menuReducer from "@/features/auth/MenuSlice";
import uiReducer from "@/features/ui/uiSlice";

const rootReducer = combineReducers({
  docClsf: docClsfReducer,
  docClassificationList: docClassificationListReducer,
  digitalDocList: digitalDocListReducer,
  menuList: menuReducer,
  ui: uiReducer,
});

export default rootReducer;
