import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from './Select';
describe('Select', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default select', function () {
            var container = render(_jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select option" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "option1", children: "Option 1" }), _jsx(SelectItem, { value: "option2", children: "Option 2" })] })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Select, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select option" }) }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger button', function () {
            render(_jsx(Select, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select option" }) }) }));
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });
        it('renders placeholder text', function () {
            render(_jsx(Select, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Choose an option" }) }) }));
            expect(screen.getByText('Choose an option')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to trigger', function () {
            render(_jsx(Select, { children: _jsx(SelectTrigger, { className: "custom-trigger", children: _jsx(SelectValue, { placeholder: "Select" }) }) }));
            var trigger = screen.getByRole('combobox');
            expect(trigger).toHaveClass('custom-trigger');
        });
        it('passes through additional HTML attributes', function () {
            render(_jsx(Select, { children: _jsx(SelectTrigger, { "data-testid": "my-select", children: _jsx(SelectValue, { placeholder: "Select" }) }) }));
            expect(screen.getByTestId('my-select')).toBeInTheDocument();
        });
    });
    describe('Disabled State', function () {
        it('disables trigger when disabled prop is set', function () {
            render(_jsx(Select, { disabled: true, children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select" }) }) }));
            var trigger = screen.getByRole('combobox');
            expect(trigger).toHaveAttribute('disabled');
        });
    });
    describe('Accessibility', function () {
        it('trigger has combobox role', function () {
            render(_jsx(Select, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select" }) }) }));
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });
        it('supports aria-label', function () {
            render(_jsx(Select, { children: _jsx(SelectTrigger, { "aria-label": "Select option", children: _jsx(SelectValue, { placeholder: "Select" }) }) }));
            var trigger = screen.getByRole('combobox');
            expect(trigger).toHaveAttribute('aria-label', 'Select option');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty select', function () {
            var container = render(_jsx(Select, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles select with many options', function () {
            var options = Array.from({ length: 20 }, function (_, i) { return (_jsxs(SelectItem, { value: "option".concat(i), children: ["Option ", i] }, i)); });
            render(_jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select" }) }), _jsx(SelectContent, { children: options })] }));
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });
    });
});
