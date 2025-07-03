import "@/features/function/types";
import {
  BugFilled,
  CheckCircleFilled,
  CodeFilled,
  ExclamationCircleFilled,
  LoadingOutlined,
  PauseCircleFilled,
} from "@ant-design/icons";
import csharpLogo from "programming-languages-logos/src/csharp/csharp.svg";
import goLogo from "programming-languages-logos/src/go/go.svg";
import javaLogo from "programming-languages-logos/src/java/java.svg";
import pythonLogo from "programming-languages-logos/src/python/python.svg";

export const getCompilationStatusIcon = (status: CompilationStatus) => {
  switch (status) {
    case "SUCCESS":
      return <CheckCircleFilled />;
    case "FAILED":
      return <BugFilled />;
    case "IN_PROGRESS":
      return <LoadingOutlined spin />;
    case "OUTDATED":
      return <ExclamationCircleFilled />;
    case "NOT_STARTED":
      return <PauseCircleFilled />;
    default:
      return <PauseCircleFilled />;
  }
};

export const getLanguageIcon = (language: Language) => {};
