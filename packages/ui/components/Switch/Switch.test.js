import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';
describe('Switch', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default switch', function () {
            var container = render(_jsx(Switch, {})).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for checked switch', function () {
            var container = render(_jsx(Switch, { checked: true })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for disabled switch', function () {
            var container = render(_jsx(Switch, { disabled: true })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for switch with label', function () {
            var container = render(_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Switch, { id: "dark-mode" }), _jsx("label", { htmlFor: "dark-mode", children: "Dark Mode" })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Switch, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as button element', function () {
            var _a;
            var container = render(_jsx(Switch, {})).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('BUTTON');
        });
        it('renders with default unchecked state', function () {
            var container = render(_jsx(Switch, {})).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
        });
        it('renders thumb element', function () {
            var container = render(_jsx(Switch, {})).container;
            var thumb = container.querySelector('span');
            expect(thumb).toBeInTheDocument();
        });
    });
    describe('Checked State', function () {
        it('renders checked state', function () {
            var container = render(_jsx(Switch, { checked: true })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
        it('toggles checked state on click', function () {
            var container = render(_jsx(Switch, {})).container;
            fireEvent.click(container.firstChild);
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
        it('toggles from checked to unchecked on click', function () {
            var container = render(_jsx(Switch, { checked: true })).container;
            fireEvent.click(container.firstChild);
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
        });
        it('calls onCheckedChange when toggled', function () {
            var handleCheckedChange = vi.fn();
            var container = render(_jsx(Switch, { onCheckedChange: handleCheckedChange })).container;
            fireEvent.click(container.firstChild);
            expect(handleCheckedChange).toHaveBeenCalledWith(true);
        });
        it('calls onCheckedChange with false when unchecking', function () {
            var handleCheckedChange = vi.fn();
            var container = render(_jsx(Switch, { checked: true, onCheckedChange: handleCheckedChange })).container;
            fireEvent.click(container.firstChild);
            expect(handleCheckedChange).toHaveBeenCalledWith(false);
        });
    });
    describe('Controlled State', function () {
        it('respects checked prop', function () {
            var container = render(_jsx(Switch, { checked: true })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
        it('respects unchecked checked prop', function () {
            var container = render(_jsx(Switch, { checked: false })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
        });
        it('updates when checked prop changes', function () {
            var _a = render(_jsx(Switch, { checked: false })), container = _a.container, rerender = _a.rerender;
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
            rerender(_jsx(Switch, { checked: true }));
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
    });
    describe('Disabled State', function () {
        it('applies disabled attribute', function () {
            var container = render(_jsx(Switch, { disabled: true })).container;
            expect(container.firstChild).toHaveAttribute('disabled');
        });
        it('applies disabled styles', function () {
            var container = render(_jsx(Switch, { disabled: true })).container;
            expect(container.firstChild).toHaveClass('disabled:cursor-not-allowed');
            expect(container.firstChild).toHaveClass('disabled:opacity-50');
        });
        it('does not toggle when disabled', function () {
            var handleCheckedChange = vi.fn();
            var container = render(_jsx(Switch, { disabled: true, onCheckedChange: handleCheckedChange })).container;
            fireEvent.click(container.firstChild);
            expect(handleCheckedChange).not.toHaveBeenCalled();
        });
        it('maintains checked state when disabled', function () {
            var container = render(_jsx(Switch, { checked: true, disabled: true })).container;
            fireEvent.click(container.firstChild);
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Switch, { className: "custom-switch" })).container;
            expect(container.firstChild).toHaveClass('custom-switch');
        });
        it('merges custom className with default styles', function () {
            var container = render(_jsx(Switch, { className: "my-custom" })).container;
            expect(container.firstChild).toHaveClass('my-custom');
            expect(container.firstChild).toHaveClass('peer');
        });
        it('forwards ref correctly', function () {
            var ref = { current: null };
            render(_jsx(Switch, { ref: ref }));
            expect(ref.current).not.toBeNull();
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Switch, { "data-testid": "my-switch", "aria-label": "Toggle dark mode" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-switch');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Toggle dark mode');
        });
        it('sets name attribute', function () {
            var container = render(_jsx(Switch, { name: "dark-mode" })).container;
            expect(container.firstChild).toHaveAttribute('name', 'dark-mode');
        });
        it('sets value attribute', function () {
            var container = render(_jsx(Switch, { value: "on" })).container;
            expect(container.firstChild).toHaveAttribute('value', 'on');
        });
    });
    describe('Required State', function () {
        it('sets aria-required when required', function () {
            var container = render(_jsx(Switch, { required: true })).container;
            expect(container.firstChild).toHaveAttribute('aria-required', 'true');
        });
    });
    describe('Accessibility', function () {
        it('has switch role', function () {
            var container = render(_jsx(Switch, {})).container;
            expect(container.firstChild).toHaveAttribute('role', 'switch');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Switch, { "aria-label": "Enable notifications" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Enable notifications');
        });
        it('supports aria-describedby', function () {
            var container = render(_jsx(Switch, { "aria-describedby": "switch-hint" })).container;
            expect(container.firstChild).toHaveAttribute('aria-describedby', 'switch-hint');
        });
        it('supports aria-checked', function () {
            var container = render(_jsx(Switch, { checked: true })).container;
            expect(container.firstChild).toHaveAttribute('aria-checked', 'true');
        });
        it('supports aria-checked false', function () {
            var container = render(_jsx(Switch, { checked: false })).container;
            expect(container.firstChild).toHaveAttribute('aria-checked', 'false');
        });
        it('supports aria-invalid', function () {
            var container = render(_jsx(Switch, { "aria-invalid": "true" })).container;
            expect(container.firstChild).toHaveAttribute('aria-invalid', 'true');
        });
        it('can be associated with a label', function () {
            render(_jsxs("div", { children: [_jsx(Switch, { id: "my-switch" }), _jsx("label", { htmlFor: "my-switch", children: "My Switch" })] }));
            var switchEl = document.getElementById('my-switch');
            expect(switchEl).toBeInTheDocument();
        });
    });
    describe('Keyboard Navigation', function () {
        it('can be focused', function () {
            var container = render(_jsx(Switch, {})).container;
            var switchEl = container.firstChild;
            switchEl.focus();
            expect(switchEl).toHaveFocus();
        });
        it('toggles on Space key', function () {
            var container = render(_jsx(Switch, {})).container;
            fireEvent.keyDown(container.firstChild, { key: ' ' });
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
        it('toggles on Enter key', function () {
            var container = render(_jsx(Switch, {})).container;
            fireEvent.keyDown(container.firstChild, { key: 'Enter' });
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
    });
    describe('Edge Cases', function () {
        it('handles rapid clicks', function () {
            var handleCheckedChange = vi.fn();
            var container = render(_jsx(Switch, { onCheckedChange: handleCheckedChange })).container;
            var switchEl = container.firstChild;
            fireEvent.click(switchEl);
            fireEvent.click(switchEl);
            fireEvent.click(switchEl);
            expect(handleCheckedChange).toHaveBeenCalledTimes(3);
        });
        it('handles undefined checked prop', function () {
            var container = render(_jsx(Switch, { checked: undefined })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'unchecked');
        });
        it('handles defaultChecked prop', function () {
            var container = render(_jsx(Switch, { defaultChecked: true })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'checked');
        });
        it('thumb moves when toggled', function () {
            var container = render(_jsx(Switch, {})).container;
            var thumb = container.querySelector('span');
            expect(thumb).toHaveClass('left-[2px]');
            fireEvent.click(container.firstChild);
            expect(thumb).toHaveClass('left-[18px]');
        });
    });
});
