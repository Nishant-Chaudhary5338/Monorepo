import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';
describe('Checkbox', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default checkbox', function () {
            var container = render(_jsx(Checkbox, {})).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for checked checkbox', function () {
            var container = render(_jsx(Checkbox, { checked: true })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for disabled checkbox', function () {
            var container = render(_jsx(Checkbox, { disabled: true })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for checkbox with label', function () {
            var container = render(_jsxs("div", { children: [_jsx(Checkbox, { id: "terms" }), _jsx("label", { htmlFor: "terms", children: "Accept terms" })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Checkbox, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as button element', function () {
            var _a;
            var container = render(_jsx(Checkbox, {})).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('BUTTON');
        });
        it('renders with default unchecked state', function () {
            var container = render(_jsx(Checkbox, {})).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
        });
    });
    describe('Checked State', function () {
        it('renders checked state', function () {
            var container = render(_jsx(Checkbox, { checked: true })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
        it('toggles checked state on click', function () {
            var container = render(_jsx(Checkbox, {})).container;
            fireEvent.click(container.firstChild);
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
        it('toggles from checked to unchecked on click', function () {
            var container = render(_jsx(Checkbox, { checked: true })).container;
            fireEvent.click(container.firstChild);
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
        });
        it('calls onCheckedChange when toggled', function () {
            var handleCheckedChange = vi.fn();
            var container = render(_jsx(Checkbox, { onCheckedChange: handleCheckedChange })).container;
            fireEvent.click(container.firstChild);
            expect(handleCheckedChange).toHaveBeenCalledWith(true);
        });
        it('calls onCheckedChange with false when unchecking', function () {
            var handleCheckedChange = vi.fn();
            var container = render(_jsx(Checkbox, { checked: true, onCheckedChange: handleCheckedChange })).container;
            fireEvent.click(container.firstChild);
            expect(handleCheckedChange).toHaveBeenCalledWith(false);
        });
    });
    describe('Controlled State', function () {
        it('respects checked prop', function () {
            var container = render(_jsx(Checkbox, { checked: true })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
        it('respects unchecked checked prop', function () {
            var container = render(_jsx(Checkbox, { checked: false })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
        });
        it('updates when checked prop changes', function () {
            var _a = render(_jsx(Checkbox, { checked: false })), container = _a.container, rerender = _a.rerender;
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
            rerender(_jsx(Checkbox, { checked: true }));
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
    });
    describe('Disabled State', function () {
        it('applies disabled attribute', function () {
            var container = render(_jsx(Checkbox, { disabled: true })).container;
            expect(container.firstChild).toHaveAttribute('disabled');
        });
        it('applies disabled styles', function () {
            var container = render(_jsx(Checkbox, { disabled: true })).container;
            expect(container.firstChild).toHaveClass('disabled:cursor-not-allowed');
            expect(container.firstChild).toHaveClass('disabled:opacity-50');
        });
        it('does not toggle when disabled', function () {
            var handleCheckedChange = vi.fn();
            var container = render(_jsx(Checkbox, { disabled: true, onCheckedChange: handleCheckedChange })).container;
            fireEvent.click(container.firstChild);
            expect(handleCheckedChange).not.toHaveBeenCalled();
        });
        it('maintains checked state when disabled', function () {
            var container = render(_jsx(Checkbox, { checked: true, disabled: true })).container;
            fireEvent.click(container.firstChild);
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Checkbox, { className: "custom-checkbox" })).container;
            expect(container.firstChild).toHaveClass('custom-checkbox');
        });
        it('merges custom className with default styles', function () {
            var container = render(_jsx(Checkbox, { className: "my-custom" })).container;
            expect(container.firstChild).toHaveClass('my-custom');
            expect(container.firstChild).toHaveClass('peer');
        });
        it('forwards ref correctly', function () {
            var ref = { current: null };
            render(_jsx(Checkbox, { ref: ref }));
            expect(ref.current).not.toBeNull();
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Checkbox, { "data-testid": "my-checkbox", "aria-label": "Accept terms" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-checkbox');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Accept terms');
        });
        it('sets name attribute', function () {
            var container = render(_jsx(Checkbox, { name: "terms" })).container;
            expect(container.firstChild).toHaveAttribute('name', 'terms');
        });
        it('sets value attribute', function () {
            var container = render(_jsx(Checkbox, { value: "accepted" })).container;
            expect(container.firstChild).toHaveAttribute('value', 'accepted');
        });
    });
    describe('Required State', function () {
        it('sets aria-required when required', function () {
            var container = render(_jsx(Checkbox, { required: true })).container;
            expect(container.firstChild).toHaveAttribute('aria-required', 'true');
        });
    });
    describe('Accessibility', function () {
        it('has checkbox role', function () {
            var container = render(_jsx(Checkbox, {})).container;
            expect(container.firstChild).toHaveAttribute('role', 'checkbox');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Checkbox, { "aria-label": "Accept terms" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Accept terms');
        });
        it('supports aria-describedby', function () {
            var container = render(_jsx(Checkbox, { "aria-describedby": "terms-hint" })).container;
            expect(container.firstChild).toHaveAttribute('aria-describedby', 'terms-hint');
        });
        it('supports aria-checked', function () {
            var container = render(_jsx(Checkbox, { checked: true })).container;
            expect(container.firstChild).toHaveAttribute('aria-checked', 'true');
        });
        it('supports aria-invalid', function () {
            var container = render(_jsx(Checkbox, { "aria-invalid": "true" })).container;
            expect(container.firstChild).toHaveAttribute('aria-invalid', 'true');
        });
        it('can be associated with a label', function () {
            render(_jsxs("div", { children: [_jsx(Checkbox, { id: "my-checkbox" }), _jsx("label", { htmlFor: "my-checkbox", children: "My Checkbox" })] }));
            var checkbox = document.getElementById('my-checkbox');
            expect(checkbox).toBeInTheDocument();
        });
    });
    describe('Keyboard Navigation', function () {
        it('can be focused', function () {
            var container = render(_jsx(Checkbox, {})).container;
            var checkbox = container.firstChild;
            checkbox.focus();
            expect(checkbox).toHaveFocus();
        });
        it('toggles on Space key', function () {
            var container = render(_jsx(Checkbox, {})).container;
            fireEvent.keyDown(container.firstChild, { key: ' ' });
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
    });
    describe('Edge Cases', function () {
        it('handles rapid clicks', function () {
            var handleCheckedChange = vi.fn();
            var container = render(_jsx(Checkbox, { onCheckedChange: handleCheckedChange })).container;
            var checkbox = container.firstChild;
            fireEvent.click(checkbox);
            fireEvent.click(checkbox);
            fireEvent.click(checkbox);
            expect(handleCheckedChange).toHaveBeenCalledTimes(3);
        });
        it('handles undefined checked prop', function () {
            var container = render(_jsx(Checkbox, { checked: undefined })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
        });
        it('handles asChild prop', function () {
            var _a;
            var container = render(_jsx(Checkbox, { asChild: true, children: _jsx("button", { children: "Custom Checkbox" }) })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('BUTTON');
        });
    });
});
