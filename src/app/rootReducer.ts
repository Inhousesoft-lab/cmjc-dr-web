import { combineReducers } from "@reduxjs/toolkit";
import autheducer from "@/features/auth/AuthSlice";
import docClsfReducer from "@/features/clsf/DocClsfSlice";
import docClassificationListReducer from "@/features/classification/DocClassificationListSlice";
import menuReducer from "@/features/auth/MenuSlice";
import uiReducer from "@/features/ui/uiSlice";

const rootReducer = combineReducers({
  auth: autheducer,
  docClsf: docClsfReducer,
  docClassificationList: docClassificationListReducer,
  menu: menuReducer,
  ui: uiReducer,
});

export default rootReducer;
