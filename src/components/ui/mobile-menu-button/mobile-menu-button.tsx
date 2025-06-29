import styles from "./mobile-menu-button.module.css";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton = ({
  isOpen,
  onClick,
}: MobileMenuButtonProps) => {
  return (
    <button
      className={`${styles.menuButton} ${isOpen ? styles.open : ""}`}
      onClick={onClick}
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
    >
      <span className={styles.menuLine}></span>
      <span className={styles.menuLine}></span>
      <span className={styles.menuLine}></span>
    </button>
  );
};
