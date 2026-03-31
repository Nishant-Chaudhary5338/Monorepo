import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from './RadioGroup';
describe('RadioGroup', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default radio group', function () {
            var container = render(_jsxs(RadioGroup, { children: [_jsx(RadioGroupItem, { value: "option1" }), _jsx(RadioGroupItem, { value: "option2" })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for radio group with labels', function () {
            var container = render(_jsxs(RadioGroup, { children: [_jsxs("div", { children: [_jsx(RadioGroupItem, { value: "option1", id: "r1" }), _jsx("label", { htmlFor: "r1", children: "Option 1" })] }), _jsxs("div", { children: [_jsx(RadioGroupItem, { value: "option2", id: "r2" }), _jsx("label", { htmlFor: "r2", children: "Option 2" })] })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(RadioGroup, { children: _jsx(RadioGroupItem, { value: "option1" }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsx(RadioGroup, { children: _jsx(RadioGroupItem, { value: "option1" }) })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
        it('renders radio items', function () {
            render(_jsxs(RadioGroup, { children: [_jsx(RadioGroupItem, { value: "option1" }), _jsx(RadioGroupItem, { value: "option2" })] }));
            var radios = screen.getAllByRole('radio');
            expect(radios).toHaveLength(2);
        });
    });
    describe('Value', function () {
        it('applies default value', function () {
            var container = render(_jsxs(RadioGroup, { defaultValue: "option2", children: [_jsx(RadioGroupItem, { value: "option1" }), _jsx(RadioGroupItem, { value: "option2" })] })).container;
            var radios = container.querySelectorAll('[role="radio"]');
            expect(radios[1]).toHaveAttribute('data-state', 'checked');
        });
        it('handles controlled value', function () {
            var container = render(_jsxs(RadioGroup, { value: "option1", children: [_jsx(RadioGroupItem, { value: "option1" }), _jsx(RadioGroupItem, { value: "option2" })] })).container;
            var radios = container.querySelectorAll('[role="radio"]');
            expect(radios[0]).toHaveAttribute('data-state', 'checked');
        });
    });
    describe('Props', function () {
        it('applies custom className to group', function () {
            var container = render(_jsx(RadioGroup, { className: "custom-group", children: _jsx(RadioGroupItem, { value: "option1" }) })).container;
            expect(container.firstChild).toHaveClass('custom-group');
        });
        it('applies custom className to item', function () {
            var container = render(_jsx(RadioGroup, { children: _jsx(RadioGroupItem, { value: "option1", className: "custom-item" }) })).container;
            var item = container.querySelector('[role="radio"]');
            expect(item).toHaveClass('custom-item');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(RadioGroup, { "data-testid": "my-radio-group", children: _jsx(RadioGroupItem, { value: "option1" }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-radio-group');
        });
    });
    describe('Interactions', function () {
        it('calls onValueChange when selection changes', function () {
            var handleValueChange = vi.fn();
            render(_jsxs(RadioGroup, { onValueChange: handleValueChange, children: [_jsx(RadioGroupItem, { value: "option1" }), _jsx(RadioGroupItem, { value: "option2" })] }));
            var radios = screen.getAllByRole('radio');
            fireEvent.click(radios[1]);
            expect(handleValueChange).toHaveBeenCalledWith('option2');
        });
        it('only one item can be selected at a time', function () {
            var container = render(_jsxs(RadioGroup, { defaultValue: "option1", children: [_jsx(RadioGroupItem, { value: "option1" }), _jsx(RadioGroupItem, { value: "option2" })] })).container;
            var radios = container.querySelectorAll('[role="radio"]');
            expect(radios[0]).toHaveAttribute('data-state', 'checked');
            expect(radios[1]).toHaveAttribute('data-state', 'unchecked');
        });
    });
    describe('Disabled State', function () {
        it('disables individual items', function () {
            var container = render(_jsxs(RadioGroup, { children: [_jsx(RadioGroupItem, { value: "option1", disabled: true }), _jsx(RadioGroupItem, { value: "option2" })] })).container;
            var radios = container.querySelectorAll('[role="radio"]');
            expect(radios[0]).toHaveAttribute('disabled');
            expect(radios[1]).not.toHaveAttribute('disabled');
        });
        it('does not change selection when disabled item is clicked', function () {
            var handleValueChange = vi.fn();
            render(_jsxs(RadioGroup, { onValueChange: handleValueChange, defaultValue: "option1", children: [_jsx(RadioGroupItem, { value: "option1" }), _jsx(RadioGroupItem, { value: "option2", disabled: true })] }));
            var radios = screen.getAllByRole('radio');
            fireEvent.click(radios[1]);
            expect(handleValueChange).not.toHaveBeenCalled();
        });
    });
    describe('Accessibility', function () {
        it('has radiogroup role', function () {
            var container = render(_jsx(RadioGroup, { children: _jsx(RadioGroupItem, { value: "option1" }) })).container;
            expect(container.firstChild).toHaveAttribute('role', 'radiogroup');
        });
        it('items have radio role', function () {
            render(_jsx(RadioGroup, { children: _jsx(RadioGroupItem, { value: "option1" }) }));
            expect(screen.getByRole('radio')).toBeInTheDocument();
        });
        it('supports aria-label', function () {
            var container = render(_jsx(RadioGroup, { "aria-label": "Select option", children: _jsx(RadioGroupItem, { value: "option1" }) })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Select option');
        });
        it('selected item has aria-checked true', function () {
            var container = render(_jsx(RadioGroup, { defaultValue: "option1", children: _jsx(RadioGroupItem, { value: "option1" }) })).container;
            var radio = container.querySelector('[role="radio"]');
            expect(radio).toHaveAttribute('aria-checked', 'true');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty radio group', function () {
            var container = render(_jsx(RadioGroup, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles single radio item', function () {
            render(_jsx(RadioGroup, { children: _jsx(RadioGroupItem, { value: "only" }) }));
            expect(screen.getByRole('radio')).toBeInTheDocument();
        });
        it('handles many radio items', function () {
            var items = Array.from({ length: 10 }, function (_, i) { return (_jsx(RadioGroupItem, { value: "option".concat(i) }, i)); });
            render(_jsx(RadioGroup, { children: items }));
            var radios = screen.getAllByRole('radio');
            expect(radios).toHaveLength(10);
        });
    });
});
