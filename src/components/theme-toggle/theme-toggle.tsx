import React, { useState, useRef, useEffect } from 'react';
import { useTheme, type Theme } from '@/contexts/theme-context';
import styles from './theme-toggle.module.css';

const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SystemIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes: Array<{
    value: Theme;
    label: string;
    icon: React.ReactNode;
  }> = [
    { value: 'light', label: 'Light', icon: <SunIcon /> },
    { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
    { value: 'system', label: 'System', icon: <SystemIcon /> },
  ];

  const currentTheme = themes.find((t) => t.value === theme);
  const displayIcon =
    theme === 'system' ? (
      resolvedTheme === 'dark' ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )
    ) : (
      currentTheme?.icon
    );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className={styles.themeToggle} ref={dropdownRef}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.iconWrapper}>{displayIcon}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              className={`${styles.dropdownItem} ${theme === themeOption.value ? styles.active : ''}`}
              onClick={() => handleThemeSelect(themeOption.value)}
              role="option"
              aria-selected={theme === themeOption.value}
            >
              <span className={styles.iconWrapper}>{themeOption.icon}</span>
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
