import * as React from "react";
import { type DrawerProps, type DrawerHeaderProps, type DrawerFooterProps } from "./Drawer.types";
declare const Drawer: {
    ({ shouldScaleBackground, ...props }: DrawerProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const DrawerTrigger: React.ForwardRefExoticComponent<import("@radix-ui/react-dialog").DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const DrawerPortal: typeof import("vaul").Portal;
declare const DrawerClose: React.ForwardRefExoticComponent<import("@radix-ui/react-dialog").DialogCloseProps & React.RefAttributes<HTMLButtonElement>>;
declare const DrawerOverlay: React.ForwardRefExoticComponent<Omit<Omit<import("@radix-ui/react-dialog").DialogOverlayProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DrawerContent: React.ForwardRefExoticComponent<Omit<Omit<import("@radix-ui/react-dialog").DialogContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DrawerHeader: {
    ({ className, ...props }: DrawerHeaderProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const DrawerFooter: {
    ({ className, ...props }: DrawerFooterProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const DrawerTitle: React.ForwardRefExoticComponent<Omit<import("@radix-ui/react-dialog").DialogTitleProps & React.RefAttributes<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
declare const DrawerDescription: React.ForwardRefExoticComponent<Omit<import("@radix-ui/react-dialog").DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, };
//# sourceMappingURL=Drawer.d.ts.map