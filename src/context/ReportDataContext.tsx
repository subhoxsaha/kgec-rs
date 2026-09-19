import React, { ReactNode } from 'react';
import {
  useReportDataStore,
  SectionTexts,
  ReportDataState,
  EditorTab,
  INITIAL_SECTION_TEXTS,
} from '../store/useReportDataStore';

export type { SectionTexts, EditorTab };
export { INITIAL_SECTION_TEXTS };

export const ReportDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useReportData = () => {
  return useReportDataStore();
};
