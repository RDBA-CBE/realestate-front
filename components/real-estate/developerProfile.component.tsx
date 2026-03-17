// components/CompanyCard.jsx
import React from "react";

const DeveloperCard = ({
  companyName = "Adissia Developers Pvt Ltd",
  yearEstd = "2005",
  projects = "6",
  location = "Coimbatore",
  variant = "default", // default, minimal, featured, horizontal
}) => {
  // Variant styles using Tailwind CSS classes
  const variants = {
    default: {
      container:
        "w-full bg-white rounded-2xl shadow-lg p-8  border border-gray-100 hover:shadow-xl transition-shadow duration-300",
      name: "text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4",
      statsGrid: "grid grid-cols-2 gap-6 mb-6",
      label: "text-sm font-medium text-gray-500 uppercase tracking-wider",
      value: "text-3xl font-bold text-gray-900 mt-1",
      locationWrapper: "border-t border-gray-100 pt-4",
      locationLabel:
        "text-sm font-medium text-gray-500 uppercase tracking-wider",
      locationValue: "text-lg font-semibold text-gray-800 mt-1",
    },
    minimal: {
      container: "bg-gray-50 rounded-xl p-6 ",
      name: "text-xl font-semibold text-gray-800 mb-4",
      statsGrid: "flex justify-between mb-4",
      label: "text-xs text-gray-400",
      value: "text-lg font-bold text-gray-700",
      locationWrapper: "mt-3 pt-3 border-t border-gray-200",
      locationLabel: "text-xs text-gray-400",
      locationValue: "text-base font-medium text-gray-600",
    },
    featured: {
      container:
        "bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8  text-white",
      name: "text-2xl font-bold text-white mb-6 border-b border-white/20 pb-4",
      statsGrid: "grid grid-cols-2 gap-6 mb-6",
      label: "text-sm font-medium text-white/80 uppercase tracking-wider",
      value: "text-3xl font-bold text-white mt-1",
      locationWrapper: "border-t border-white/20 pt-4",
      locationLabel:
        "text-sm font-medium text-white/80 uppercase tracking-wider",
      locationValue: "text-lg font-semibold text-white mt-1",
    },
    horizontal: {
      container:
        "bg-white rounded-xl shadow-md p-3 flex items-center gap-8 mt-2",
      name: "text-lg text-gray-900 mb-3",
      statsGrid: "flex gap-8",
      label: "text-sm text-gray-500",
      value: "text-lg font-bold text-gray-900",
      locationWrapper: "ml-auto text-right",
      locationLabel: "text-sm text-gray-500",
      locationValue: "text-lg  text-gray-800",
    },
  };

  const styles = variants[variant] || variants.default;

  // If horizontal variant, use different layout
  if (variant === "horizontal") {
    return (
      <div className={styles.container}>
        <div className="flex-1">
          <h2 className={styles.name}>{companyName}</h2>
          <div className={styles.statsGrid}>
            <div>
              <p className={styles.label}>Year estd.</p>
              <p className={styles.value}>{yearEstd}</p>
            </div>
            <div>
              <p className={styles.label}>Projects</p>
              <p className={styles.value}>{projects}</p>
            </div>
          </div>
        </div>
        <div className={styles.locationWrapper}>
          <p className={styles.locationLabel}>Location</p>
          <p className={styles.locationValue}>{location}</p>
        </div>
      </div>
    );
  }

  // Default layout for other variants
  return (
    <div className={styles.container}>
      <h2 className={styles.name}>{companyName}</h2>

      <div className={styles.statsGrid}>
        <div>
          <p className={styles.label}>Year estd.</p>
          <p className={styles.value}>{yearEstd}</p>
        </div>
        <div>
          <p className={styles.label}>Projects</p>
          <p className={styles.value}>{projects}</p>
        </div>
      </div>

      <div className={styles.locationWrapper}>
        <p className={styles.locationLabel}>Location</p>
        <p className={styles.locationValue}>{location}</p>
      </div>
    </div>
  );
};

export default DeveloperCard;
