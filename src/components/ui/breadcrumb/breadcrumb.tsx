import { Link, useLocation } from "react-router-dom";

import styles from "./breadcrumb.module.css";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumb = () => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", path: "/" }];

    if (pathSegments.length === 0) {
      return [{ label: "Home" }];
    }

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Create readable labels for segments
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Handle specific routes
      if (segment === "functions") {
        label = "Functions";
      } else if (segment === "pipelines") {
        label = "Pipelines";
      } else if (segment === "new") {
        label = "New";
      } else if (segment === "edit") {
        label = "Edit";
      } else if (segment === "run") {
        label = "Run";
      } else if (
        segment.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        )
      ) {
        // UUID pattern - show as "Details"
        label = "Details";
      }

      // Add path for all items except the last one
      if (index < pathSegments.length - 1) {
        breadcrumbs.push({ label, path: currentPath });
      } else {
        breadcrumbs.push({ label });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {breadcrumbs.map((item, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {item.path ? (
              <Link to={item.path} className={styles.breadcrumbLink}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
