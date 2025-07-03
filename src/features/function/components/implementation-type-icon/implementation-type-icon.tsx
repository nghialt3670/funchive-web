import { CodeFilled } from "@ant-design/icons";
import csharpLogo from "programming-languages-logos/src/csharp/csharp.svg";
import goLogo from "programming-languages-logos/src/go/go.svg";
import javaLogo from "programming-languages-logos/src/java/java.svg";
import pythonLogo from "programming-languages-logos/src/python/python.svg";
import { type FC, type HTMLAttributes } from "react";

export interface FunctionLanguageIconProps
  extends HTMLAttributes<HTMLImageElement> {
  type: string;
}

export const ImplementationTypeIcon: FC<FunctionLanguageIconProps> = ({
  type,
  style,
}) => {
  const defaultStyle = {
    width: "1rem",
    height: "1rem",
    objectFit: "contain" as const,
  };

  const mergedStyle = {
    ...defaultStyle,
    ...style,
  };

  switch (type.toUpperCase()) {
    case "PYTHON":
      return <img src={pythonLogo} alt="Python" style={mergedStyle} />;
    case "C#":
      return <img src={csharpLogo} alt="C#" style={mergedStyle} />;
    case "JAVA":
      return <img src={javaLogo} alt="Java" style={mergedStyle} />;
    case "GO":
      return <img src={goLogo} alt="Go" style={mergedStyle} />;
    default:
      return <CodeFilled />;
  }
};
