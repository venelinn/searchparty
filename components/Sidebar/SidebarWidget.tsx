import type { ReactNode } from "react";
import styles from "./Sidebar.module.scss";

interface SidebarWidgetProps {
  title?: string;
  children: ReactNode;
}

export function SidebarWidget({ title, children }: SidebarWidgetProps) {
  return (
    <div className={styles.widget}>
      {title && <h3 className={styles.widgetTitle}>{title}</h3>}
      {children}
    </div>
  );
}
