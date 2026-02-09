import * as React from "react";
import type { CloseNotification, ShowNotification } from ".";

const NotificationsContext = React.createContext<{
  show: ShowNotification;
  close: CloseNotification;
} | null>(null);

export default NotificationsContext;
