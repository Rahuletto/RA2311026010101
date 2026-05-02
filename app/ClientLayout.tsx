"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/notification_app_fe/context/ThemeContext";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
