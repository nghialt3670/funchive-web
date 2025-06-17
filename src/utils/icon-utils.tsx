import { CodeOutlined } from "@ant-design/icons";
import pythonLogo from "programming-languages-logos/src/python/python.svg";
import javascriptLogo from "programming-languages-logos/src/javascript/javascript.svg";
import javaLogo from "programming-languages-logos/src/java/java.svg";
import goLogo from "programming-languages-logos/src/go/go.svg";

export const getLanguageIcon = (language: string) => {
  const iconStyle = {
    width: "16px",
    height: "16px",
    objectFit: "contain" as const,
  };

  switch (language.toLowerCase()) {
    case "python":
      return <img src={pythonLogo} alt="Python" style={iconStyle} />;
    case "javascript":
    case "node.js":
      return <img src={javascriptLogo} alt="JavaScript" style={iconStyle} />;
    case "java":
      return <img src={javaLogo} alt="Java" style={iconStyle} />;
    case "go":
      return <img src={goLogo} alt="Go" style={iconStyle} />;
    default:
      return <CodeOutlined />;
  }
};
