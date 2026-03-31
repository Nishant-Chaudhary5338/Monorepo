import * as React from "react";
import type { PaginationLinkProps, PaginationPreviousProps, PaginationNextProps, PaginationEllipsisProps } from "./Pagination.types";
declare const Pagination: {
    ({ className, ...props }: React.ComponentProps<"nav">): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const PaginationContent: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref"> & React.RefAttributes<HTMLUListElement>>;
declare const PaginationItem: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React.RefAttributes<HTMLLIElement>>;
declare const PaginationLink: {
    ({ className, isActive, size, ...props }: PaginationLinkProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const PaginationPrevious: {
    ({ className, ...props }: PaginationPreviousProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const PaginationNext: {
    ({ className, ...props }: PaginationNextProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const PaginationEllipsis: {
    ({ className, ...props }: PaginationEllipsisProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, };
//# sourceMappingURL=Pagination.d.ts.map