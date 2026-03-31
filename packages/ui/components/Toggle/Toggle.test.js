import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toggle } from './Toggle';
describe('Toggle', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default toggle', function () {
            var container = render(_jsx(Toggle, { children: "Toggle" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for pressed toggle', function () {
            var container = render(_jsx(Toggle, { pressed: true, children: "Pressed" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Toggle, { children: "Test Toggle" })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as button element', function () {
            var _a;
            var container = render(_jsx(Toggle, { children: "Test" })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('BUTTON');
        });
        it('renders children correctly', function () {
            render(_jsx(Toggle, { children: "Toggle Text" }));
            expect(screen.getByText('Toggle Text')).toBeInTheDocument();
        });
    });
    describe('Variants', function () {
        it('applies default variant styles', function () {
            var container = render(_jsx(Toggle, { children: "Default" })).container;
            expect(container.firstChild).toHaveClass('bg-transparent');
        });
        it('applies outline variant styles', function () {
            var container = render(_jsx(Toggle, { variant: "outline", children: "Outline" })).container;
            expect(container.firstChild).toHaveClass('border');
        });
    });
    describe('Sizes', function () {
        it('applies default size', function () {
            var container = render(_jsx(Toggle, { children: "Default Size" })).container;
            expect(container.firstChild).toHaveClass('h-10');
        });
        it('applies small size', function () {
            var container = render(_jsx(Toggle, { size: "sm", children: "Small" })).container;
            expect(container.firstChild).toHaveClass('h-9');
        });
        it('applies large size', function () {
            var container = render(_jsx(Toggle, { size: "lg", children: "Large" })).container;
            expect(container.firstChild).toHaveClass('h-11');
        });
    });
    describe('Pressed State', function () {
        it('renders unpressed by default', function () {
            var container = render(_jsx(Toggle, { children: "Toggle" })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'off');
        });
        it('renders pressed state', function () {
            var container = render(_jsx(Toggle, { pressed: true, children: "Pressed" })).container;
            expect(container.firstChild).toHaveAttribute('data-state', 'on');
        });
        it('toggles pressed state on click', function () {
            var container = render(_jsx(Toggle, { children: "Toggle" })).container;
            fireEvent.click(container.firstChild);
            expect(container.firstChild).toHaveAttribute('data-state', 'on');
        });
        it('calls onPressedChange when toggled', function () {
            var handlePressedChange = vi.fn();
            render(_jsx(Toggle, { onPressedChange: handlePressedChange, children: "Toggle" }));
            fireEvent.click(screen.getByText('Toggle'));
            expect(handlePressedChange).toHaveBeenCalledWith(true);
        });
    });
    describe('Disabled State', function () {
        it('applies disabled attribute', function () {
            var container = render(_jsx(Toggle, { disabled: true, children: "Disabled" })).container;
            expect(container.firstChild).toHaveAttribute('disabled');
        });
        it('does not toggle when disabled', function () {
            var handlePressedChange = vi.fn();
            render(_jsx(Toggle, { disabled: true, onPressedChange: handlePressedChange, children: "Disabled" }));
            fireEvent.click(screen.getByText('Disabled'));
            expect(handlePressedChange).not.toHaveBeenCalled();
        });
    });
    describe('Accessibility', function () {
        it('has button role', function () {
            render(_jsx(Toggle, { children: "Toggle" }));
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
        it('has aria-pressed attribute', function () {
            var container = render(_jsx(Toggle, { children: "Toggle" })).container;
            expect(container.firstChild).toHaveAttribute('aria-pressed', 'false');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Toggle, { "aria-label": "Toggle bold", children: "B" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Toggle bold');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Toggle, { className: "custom-toggle", children: "Test" })).container;
            expect(container.firstChild).toHaveClass('custom-toggle');
        });
        it('forwards ref correctly', function () {
            var ref = { current: null };
            render(_jsx(Toggle, { ref: ref, children: "Test" }));
            expect(ref.current).not.toBeNull();
        });
    });
});
