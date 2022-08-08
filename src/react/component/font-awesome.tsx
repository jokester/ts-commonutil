import type React from 'react';

export const fontawesomeCss = (
  <link
    key="css-fontawesome4"
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css"
    integrity="sha256-eZrrJcwDc/3uDhsdt61sL2oOBY362qM3lon1gyExkL0="
    crossOrigin="anonymous"
  />
);

/**
 * @param className
 * @param icon {@see https://fontawesome.com/v4/icons/}
 */
export const FaIcon: React.FC<{ className?: string; icon: string }> = ({ className, icon }) => {
  return <i className={`fa fa-${icon} ${className}`} />;
};
