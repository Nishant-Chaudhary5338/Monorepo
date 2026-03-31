import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';
describe('Label', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default label', function () {
            var container = render(_jsx(Label, { children: "Label Text" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for label with htmlFor', function () {
            var container = render(_jsx(Label, { htmlFor: "input-id", children: "Email" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Label, { children: "Test Label" })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as label element', function () {
            var _a;
            var container = render(_jsx(Label, { children: "Test" })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('LABEL');
        });
        it('renders children correctly', function () {
            render(_jsx(Label, { children: "My Label" }));
            expect(screen.getByText('My Label')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Label, { className: "custom-label", children: "Test" })).container;
            expect(container.firstChild).toHaveClass('custom-label');
        });
        it('sets htmlFor attribute', function () {
            var container = render(_jsx(Label, { htmlFor: "email-input", children: "Email" })).container;
            expect(container.firstChild).toHaveAttribute('for', 'email-input');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Label, { "data-testid": "my-label", "aria-label": "Form label", children: "Test" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-label');
        });
    });
    describe('Accessibility', function () {
        it('can be associated with input', function () {
            render(_jsxs("div", { children: [_jsx(Label, { htmlFor: "test-input", children: "Name" }), _jsx("input", { id: "test-input" })] }));
            var label = screen.getByText('Name');
            expect(label).toHaveAttribute('for', 'test-input');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Label, { "aria-label": "Accessible label", children: "Test" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Accessible label');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty label', function () {
            var container = render(_jsx(Label, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex children', function () {
            render(_jsxs(Label, { children: [_jsx("span", { children: "Icon" }), _jsx("span", { children: "Text" })] }));
            expect(screen.getByText('Icon')).toBeInTheDocument();
            expect(screen.getByText('Text')).toBeInTheDocument();
        });
    });
});
