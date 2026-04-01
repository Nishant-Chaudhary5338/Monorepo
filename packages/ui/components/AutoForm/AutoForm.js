"use client";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/utils";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Label } from "../Label/Label";
import { Textarea } from "../Textarea/Textarea";
import { Checkbox } from "../Checkbox/Checkbox";
import { Switch } from "../Switch/Switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../Select/Select";
import { RadioGroup, RadioGroupItem } from "../RadioGroup/RadioGroup";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, } from "../Form/Form";
// Utility to get field type from Zod schema
function getFieldTypeFromSchema(schema, fieldName) {
    var _a, _b, _c, _d;
    var shape = (_b = (_a = schema._def) === null || _a === void 0 ? void 0 : _a.shape) === null || _b === void 0 ? void 0 : _b.call(_a);
    if (!shape)
        return "text";
    var fieldSchema = shape[fieldName];
    if (!fieldSchema)
        return "text";
    var typeName = (_c = fieldSchema._def) === null || _c === void 0 ? void 0 : _c.typeName;
    // Check for email validation
    var checks = ((_d = fieldSchema._def) === null || _d === void 0 ? void 0 : _d.checks) || [];
    var hasEmailCheck = checks.some(function (c) { return c.kind === "email" || (c.value && c.value === "email"); });
    if (hasEmailCheck || fieldName.toLowerCase().includes("email"))
        return "email";
    if (fieldName.toLowerCase().includes("password"))
        return "password";
    if (fieldName.toLowerCase().includes("description"))
        return "textarea";
    if (fieldName.toLowerCase().includes("bio"))
        return "textarea";
    switch (typeName) {
        case "ZodString":
            return "text";
        case "ZodNumber":
            return "number";
        case "ZodBoolean":
            return "switch";
        case "ZodDate":
            return "date";
        case "ZodEnum":
            return "select";
        case "ZodNativeEnum":
            return "select";
        case "ZodOptional":
        case "ZodNullable":
        case "ZodDefault":
            return getFieldTypeFromSchema(fieldSchema, fieldName);
        default:
            return "text";
    }
}
// Get enum options from Zod schema
function getEnumOptions(schema, fieldName) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var shape = (_b = (_a = schema._def) === null || _a === void 0 ? void 0 : _a.shape) === null || _b === void 0 ? void 0 : _b.call(_a);
    if (!shape)
        return [];
    var fieldSchema = shape[fieldName];
    if (!fieldSchema)
        return [];
    // Unwrap optional/nullable/default wrappers
    while (((_c = fieldSchema._def) === null || _c === void 0 ? void 0 : _c.typeName) === "ZodOptional" ||
        ((_d = fieldSchema._def) === null || _d === void 0 ? void 0 : _d.typeName) === "ZodNullable" ||
        ((_e = fieldSchema._def) === null || _e === void 0 ? void 0 : _e.typeName) === "ZodDefault") {
        fieldSchema = ((_f = fieldSchema._def) === null || _f === void 0 ? void 0 : _f.innerType) || ((_g = fieldSchema._def) === null || _g === void 0 ? void 0 : _g.defaultValue);
    }
    var typeName = (_h = fieldSchema._def) === null || _h === void 0 ? void 0 : _h.typeName;
    if (typeName === "ZodEnum") {
        var values = ((_j = fieldSchema._def) === null || _j === void 0 ? void 0 : _j.values) || [];
        return values.map(function (v) { return ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v }); });
    }
    if (typeName === "ZodNativeEnum") {
        var enumObj = ((_k = fieldSchema._def) === null || _k === void 0 ? void 0 : _k.values) || {};
        return Object.entries(enumObj)
            .filter(function (_a) {
            var key = _a[0];
            return isNaN(Number(key));
        })
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return ({ label: key, value: String(value) });
        });
    }
    return [];
}
// Check if field is required
function isFieldRequired(schema, fieldName) {
    var _a, _b, _c;
    var shape = (_b = (_a = schema._def) === null || _a === void 0 ? void 0 : _a.shape) === null || _b === void 0 ? void 0 : _b.call(_a);
    if (!shape)
        return false;
    var fieldSchema = shape[fieldName];
    if (!fieldSchema)
        return false;
    // Check if it's optional/nullable
    var typeName = (_c = fieldSchema._def) === null || _c === void 0 ? void 0 : _c.typeName;
    return typeName !== "ZodOptional" && typeName !== "ZodNullable" && typeName !== "ZodDefault";
}
// Get all field names from schema
function getFieldNames(schema) {
    var _a, _b;
    var shape = (_b = (_a = schema._def) === null || _a === void 0 ? void 0 : _a.shape) === null || _b === void 0 ? void 0 : _b.call(_a);
    if (!shape)
        return [];
    return Object.keys(shape);
}
// Field renderers
function renderField(fieldType, field, config, isRequired) {
    switch (fieldType) {
        case "text":
        case "email":
        case "password":
            return (_jsx(Input, __assign({ type: fieldType === "email" ? "email" : fieldType === "password" ? "password" : "text", placeholder: config.placeholder, disabled: config.disabled }, field, config.inputProps)));
        case "number":
            return (_jsx(Input, __assign({ type: "number", placeholder: config.placeholder, disabled: config.disabled }, field, { onChange: function (e) { return field.onChange(e.target.valueAsNumber || undefined); } }, config.inputProps)));
        case "textarea":
            return (_jsx(Textarea, __assign({ placeholder: config.placeholder, disabled: config.disabled }, field)));
        case "select":
            var options = config.options || [];
            return (_jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, disabled: config.disabled, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: config.placeholder || "Select..." }) }), _jsx(SelectContent, { children: options.map(function (option) { return (_jsx(SelectItem, { value: String(option.value), children: option.label }, String(option.value))); }) })] }));
        case "checkbox":
            return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: field.name, checked: field.value, onCheckedChange: field.onChange, disabled: config.disabled }), _jsx("label", { htmlFor: field.name, className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: config.label || field.name })] }));
        case "switch":
            return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: field.name, checked: field.value, onCheckedChange: field.onChange, disabled: config.disabled }), _jsx("label", { htmlFor: field.name, className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: config.label || field.name })] }));
        case "radio":
            var radioOptions = config.options || [];
            return (_jsx(RadioGroup, { onValueChange: field.onChange, defaultValue: field.value, disabled: config.disabled, className: "flex flex-col space-y-1", children: radioOptions.map(function (option) { return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(RadioGroupItem, { value: String(option.value), id: "".concat(field.name, "-").concat(option.value) }), _jsx(Label, { htmlFor: "".concat(field.name, "-").concat(option.value), children: option.label })] }, String(option.value))); }) }));
        case "date":
            return (_jsx(Input, __assign({ type: "date", disabled: config.disabled }, field)));
        default:
            return (_jsx(Input, __assign({ placeholder: config.placeholder, disabled: config.disabled }, field)));
    }
}
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
function AutoForm(_a) {
    var _this = this;
    var schema = _a.schema, defaultValues = _a.defaultValues, _b = _a.fieldConfig, fieldConfig = _b === void 0 ? {} : _b, include = _a.include, _c = _a.exclude, exclude = _c === void 0 ? [] : _c, order = _a.order, onSubmit = _a.onSubmit, onValidationError = _a.onValidationError, _d = _a.submitText, submitText = _d === void 0 ? "Submit" : _d, _e = _a.showSubmit, showSubmit = _e === void 0 ? true : _e, _f = _a.isLoading, isLoading = _f === void 0 ? false : _f, className = _a.className, renderSubmit = _a.renderSubmit, children = _a.children;
    var form = useForm({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(schema),
        defaultValues: defaultValues,
    });
    var handleSubmit = form.handleSubmit, _g = form.formState, isSubmitting = _g.isSubmitting, isValid = _g.isValid, errors = _g.errors, control = form.control;
    // Get field names to render
    var fieldNames = getFieldNames(schema);
    // Apply include/exclude filters
    if (include) {
        fieldNames = fieldNames.filter(function (name) { return include.includes(name); });
    }
    fieldNames = fieldNames.filter(function (name) { return !exclude.includes(name); });
    // Apply order
    if (order) {
        fieldNames = order.filter(function (name) { return fieldNames.includes(name); });
    }
    // Convert errors to simple object
    var errorMessages = {};
    Object.entries(errors).forEach(function (_a) {
        var key = _a[0], error = _a[1];
        if (error === null || error === void 0 ? void 0 : error.message) {
            errorMessages[key] = String(error.message);
        }
    });
    var handleValidSubmit = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, onSubmit(values)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Form submission error:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleInvalidSubmit = function () {
        if (onValidationError) {
            onValidationError(errorMessages);
        }
    };
    return (_jsx(Form, __assign({}, form, { children: _jsxs("form", { onSubmit: handleSubmit(handleValidSubmit, handleInvalidSubmit), className: cn("space-y-6", className), children: [fieldNames.map(function (fieldName) {
                    var config = fieldConfig[fieldName] || {};
                    var fieldType = config.fieldType || getFieldTypeFromSchema(schema, fieldName);
                    var fieldOptions = config.options || getEnumOptions(schema, fieldName);
                    var required = isFieldRequired(schema, fieldName);
                    // Skip checkbox/switch in FormField wrapper (they handle their own labels)
                    if (fieldType === "checkbox" || fieldType === "switch") {
                        return (_jsx(FormField, { control: control, name: fieldName, render: function (_a) {
                                var field = _a.field;
                                return (_jsxs(FormItem, { className: config.className, children: [_jsx(FormControl, { children: renderField(fieldType, field, __assign(__assign({}, config), { options: fieldOptions }), required) }), config.description && (_jsx(FormDescription, { children: config.description })), _jsx(FormMessage, {})] }));
                            } }, fieldName));
                    }
                    return (_jsx(FormField, { control: control, name: fieldName, render: function (_a) {
                            var field = _a.field;
                            return (_jsxs(FormItem, { className: config.className, children: [_jsxs(FormLabel, { children: [config.label || fieldName, required && _jsx("span", { className: "ml-1 text-destructive", children: "*" })] }), _jsx(FormControl, { children: renderField(fieldType, field, __assign(__assign({}, config), { options: fieldOptions }), required) }), config.description && (_jsx(FormDescription, { children: config.description })), _jsx(FormMessage, {})] }));
                        } }, fieldName));
                }), children, showSubmit && (_jsx("div", { className: "flex justify-end", children: renderSubmit ? (renderSubmit({ isLoading: isLoading || isSubmitting, isValid: isValid })) : (_jsx(Button, { type: "submit", disabled: isLoading || isSubmitting, children: isSubmitting ? "Submitting..." : submitText })) }))] }) })));
}
AutoForm.displayName = "AutoForm";
export { AutoForm };
