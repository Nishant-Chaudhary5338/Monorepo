var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Button component library for @repo/ui
 * @module Button
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./Button.variants";
/**
 * A versatile button component with multiple variants and sizes.
 *
 * Features:
 * - 6 visual variants: default, destructive, outline, secondary, ghost, link
 * - 4 size options: default, sm, lg, icon
 * - Polymorphic rendering with `asChild` prop
 * - Full accessibility support with focus-visible states
 * - Icon integration with automatic sizing
 *
 * @component
 * @example
 * ```tsx
 * // Primary action button
 * <Button variant="default">Save Changes</Button>
 *
 * // Destructive action
 * <Button variant="destructive">Delete</Button>
 *
 * // Outline style
 * <Button variant="outline">Cancel</Button>
 *
 * // Icon button
 * <Button variant="ghost" size="icon">
 *   <SettingsIcon />
 * </Button>
 *
 * // As a link
 * <Button asChild>
 *   <a href="/dashboard">Go to Dashboard</a>
 * </Button>
 * ```
 *
 * @param {ButtonProps} props - The component props
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref
 * @returns {JSX.Element} The rendered button element
 */
var Button = React.forwardRef(function (_a, ref) {
    var className = _a.className, variant = _a.variant, size = _a.size, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["className", "variant", "size", "asChild"]);
    var Comp = asChild ? Slot : "button";
    return (_jsx(Comp, __assign({ className: cn(buttonVariants({ variant: variant, size: size, className: className })), ref: ref }, props)));
});
Button.displayName = "Button";
export { Button, buttonVariants };
