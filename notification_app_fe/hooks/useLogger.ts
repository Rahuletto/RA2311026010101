"use client";

import { useState, useCallback } from "react";
import type { LogLevel, LogPackage, UseLoggerReturn } from "../types";
import { LogFrontend } from "../../logging_middleware/logger";

export function useLogger(): UseLoggerReturn {
  const [logging, setLogging] = useState(false);

  const log = useCallback(
    async (level: LogLevel, pkg: LogPackage, message: string) => {
      setLogging(true);
      try {
        await LogFrontend(level, pkg, message);
      } catch (error) {
        console.error("Logging error:", error);
      } finally {
        setLogging(false);
      }
    },
    [],
  );

  return {
    log,
    logging,
  };
}

export const logger = {
  debug: (pkg: LogPackage, msg: string) => LogFrontend("debug", pkg, msg),
  info: (pkg: LogPackage, msg: string) => LogFrontend("info", pkg, msg),
  warn: (pkg: LogPackage, msg: string) => LogFrontend("warn", pkg, msg),
  error: (pkg: LogPackage, msg: string) => LogFrontend("error", pkg, msg),
};
