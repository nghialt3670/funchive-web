import { CodeOutlined } from '@ant-design/icons';
import pythonLogo from 'programming-languages-logos/src/python/python.svg';
import javaLogo from 'programming-languages-logos/src/java/java.svg';
import goLogo from 'programming-languages-logos/src/go/go.svg';
import csharpLogo from 'programming-languages-logos/src/csharp/csharp.svg';
import {
  CheckCircleOutlined,
  BugOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import {
  type CompilationStatus,
  type Language,
} from '@/features/function/function-types';

export const getCompilationStatusIcon = (status: CompilationStatus) => {
  switch (status) {
    case 'SUCCESS':
      return <CheckCircleOutlined />;
    case 'FAILED':
      return <BugOutlined />;
    case 'IN_PROGRESS':
      return <LoadingOutlined spin />;
    case 'OUTDATED':
      return <ExclamationCircleOutlined />;
    case 'NOT_STARTED':
      return <PauseCircleOutlined />;
    default:
      return <PauseCircleOutlined />;
  }
};

export const getLanguageIcon = (language: Language) => {
  const iconStyle = {
    width: '1.5rem',
    height: '1.5rem',
    objectFit: 'contain' as const,
  };

  switch (language.toUpperCase()) {
    case 'PYTHON':
      return <img src={pythonLogo} alt="Python" style={iconStyle} />;
    case 'C#':
      return <img src={csharpLogo} alt="C#" style={iconStyle} />;
    case 'JAVA':
      return <img src={javaLogo} alt="Java" style={iconStyle} />;
    case 'GO':
      return <img src={goLogo} alt="Go" style={iconStyle} />;
    default:
      return <CodeOutlined />;
  }
};
