/**
 * InputOTP component type definitions
 * @module InputOTP
 */
import type * as React from "react";
import type { OTPInput } from "input-otp";
/**
 * Props for the InputOTP component.
 * Extends OTPInput props from input-otp library.
 */
export type InputOTPProps = React.ComponentPropsWithoutRef<typeof OTPInput>;
/**
 * Props for the InputOTPGroup component.
 */
export interface InputOTPGroupProps extends React.ComponentPropsWithoutRef<"div"> {
}
/**
 * Props for the InputOTPSlot component.
 */
export interface InputOTPSlotProps extends React.ComponentPropsWithoutRef<"div"> {
    /**
     * The index of the slot in the OTP input.
     */
    index: number;
}
/**
 * Props for the InputOTPSeparator component.
 */
export interface InputOTPSeparatorProps extends React.ComponentPropsWithoutRef<"div"> {
}
//# sourceMappingURL=InputOTP.types.d.ts.map