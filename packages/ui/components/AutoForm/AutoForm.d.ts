import type { ZodSchema } from "zod";
import type { AutoFormProps } from "./AutoForm.types";
/**
 * AutoForm - A declarative form component that auto-generates forms from a Zod schema.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   name: z.string().min(2),
 *   email: z.string().email(),
 *   role: z.enum(["admin", "user"]),
 * })
 *
 * <AutoForm
 *   schema={schema}
 *   onSubmit={(values) => console.log(values)}
 *   fieldConfig={{
 *     name: { label: "Full Name", placeholder: "Enter name" },
 *     email: { label: "Email", placeholder: "you@example.com" },
 *   }}
 * />
 * ```
 */
declare function AutoForm<TSchema extends ZodSchema>({ schema, defaultValues, fieldConfig, include, exclude, order, onSubmit, onValidationError, submitText, showSubmit, isLoading, className, renderSubmit, children, }: AutoFormProps<TSchema>): import("react/jsx-runtime").JSX.Element;
declare namespace AutoForm {
    var displayName: string;
}
export { AutoForm };
//# sourceMappingURL=AutoForm.d.ts.map