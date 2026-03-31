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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './Form';
function FormWrapper(_a) {
    var children = _a.children;
    var form = useForm({ defaultValues: { name: '' } });
    return _jsx(Form, __assign({}, form, { children: children }));
}
function TestForm() {
    return (_jsx(FormField, { name: "name", render: function (_a) {
            var field = _a.field;
            return (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Name" }), _jsx(FormControl, { children: _jsx("input", __assign({}, field, { "data-testid": "name-input" })) }), _jsx(FormDescription, { children: "Enter your name" }), _jsx(FormMessage, {})] }));
        } }));
}
describe('Form', function () {
    it('renders form fields within a form context', function () {
        render(_jsx(FormWrapper, { children: _jsx(TestForm, {}) }));
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Enter your name')).toBeInTheDocument();
        expect(screen.getByTestId('name-input')).toBeInTheDocument();
    });
    it('renders form label with correct htmlFor', function () {
        render(_jsx(FormWrapper, { children: _jsx(TestForm, {}) }));
        var label = screen.getByText('Name');
        expect(label).toBeInTheDocument();
    });
    it('renders form description', function () {
        render(_jsx(FormWrapper, { children: _jsx(TestForm, {}) }));
        var description = screen.getByText('Enter your name');
        expect(description).toBeInTheDocument();
        expect(description.tagName).toBe('P');
    });
    it('does not render error message when no error', function () {
        render(_jsx(FormWrapper, { children: _jsx(TestForm, {}) }));
        expect(screen.queryByRole('paragraph')).not.toHaveClass('text-destructive');
    });
});
