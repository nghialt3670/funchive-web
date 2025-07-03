import {
  type CompilationStatus,
  type Language,
} from "@/features/function/function-types";
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

export const getLanguageIcon = (language: Language) => {
  const iconStyle = {
    width: "1rem",
    height: "1rem",
    objectFit: "contain" as const,
  };

  switch (language.toUpperCase()) {
    case "PYTHON":
      return <img src={pythonLogo} alt="Python" style={iconStyle} />;
    case "C#":
      return <img src={csharpLogo} alt="C#" style={iconStyle} />;
    case "JAVA":
      return <img src={javaLogo} alt="Java" style={iconStyle} />;
    case "GO":
      return <img src={goLogo} alt="Go" style={iconStyle} />;
    default:
      return <CodeFilled />;
  }
};
