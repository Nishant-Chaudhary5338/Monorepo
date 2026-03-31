import * as React from "react";
import type { BreadcrumbProps, BreadcrumbLinkProps, BreadcrumbSeparatorProps, BreadcrumbEllipsisProps } from "./Breadcrumb.types";
declare const Breadcrumb: React.ForwardRefExoticComponent<BreadcrumbProps & React.RefAttributes<HTMLElement>>;
declare const BreadcrumbList: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>, "ref"> & React.RefAttributes<HTMLOListElement>>;
declare const BreadcrumbItem: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React.RefAttributes<HTMLLIElement>>;
declare const BreadcrumbLink: React.ForwardRefExoticComponent<BreadcrumbLinkProps & React.RefAttributes<HTMLAnchorElement>>;
declare const BreadcrumbPage: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & React.RefAttributes<HTMLSpanElement>>;
declare const BreadcrumbSeparator: {
    ({ children, className, ...props }: BreadcrumbSeparatorProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const BreadcrumbEllipsis: {
    ({ className, ...props }: BreadcrumbEllipsisProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, };
//# sourceMappingURL=Breadcrumb.d.ts.map