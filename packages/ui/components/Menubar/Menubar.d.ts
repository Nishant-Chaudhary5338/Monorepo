import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { type MenubarSubTriggerProps, type MenubarContentProps, type MenubarItemProps, type MenubarLabelProps, type MenubarShortcutProps } from "./Menubar.types";
declare const MenubarMenu: typeof MenubarPrimitive.Menu;
declare const MenubarGroup: typeof MenubarPrimitive.Group;
declare const MenubarPortal: typeof MenubarPrimitive.Portal;
declare const MenubarSub: typeof MenubarPrimitive.Sub;
declare const MenubarRadioGroup: typeof MenubarPrimitive.RadioGroup;
declare const Menubar: React.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const MenubarTrigger: React.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarTriggerProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
declare const MenubarSubTrigger: React.ForwardRefExoticComponent<MenubarSubTriggerProps & React.RefAttributes<HTMLDivElement>>;
declare const MenubarSubContent: React.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarSubContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const MenubarContent: React.ForwardRefExoticComponent<MenubarContentProps & React.RefAttributes<HTMLDivElement>>;
declare const MenubarItem: React.ForwardRefExoticComponent<MenubarItemProps & React.RefAttributes<HTMLDivElement>>;
declare const MenubarCheckboxItem: React.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarCheckboxItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const MenubarRadioItem: React.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarRadioItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const MenubarLabel: React.ForwardRefExoticComponent<MenubarLabelProps & React.RefAttributes<HTMLDivElement>>;
declare const MenubarSeparator: React.ForwardRefExoticComponent<Omit<MenubarPrimitive.MenubarSeparatorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const MenubarShortcut: {
    ({ className, ...props }: MenubarShortcutProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarPortal, MenubarSubContent, MenubarSubTrigger, MenubarGroup, MenubarSub, MenubarShortcut, };
//# sourceMappingURL=Menubar.d.ts.map