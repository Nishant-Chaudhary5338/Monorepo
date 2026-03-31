import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
describe('Button', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default variant', function () {
            var container = render(_jsx(Button, { children: "Default Button" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for secondary variant', function () {
            var container = render(_jsx(Button, { variant: "secondary", children: "Secondary" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for destructive variant', function () {
            var container = render(_jsx(Button, { variant: "destructive", children: "Delete" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for outline variant', function () {
            var container = render(_jsx(Button, { variant: "outline", children: "Outline" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for ghost variant', function () {
            var container = render(_jsx(Button, { variant: "ghost", children: "Ghost" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for link variant', function () {
            var container = render(_jsx(Button, { variant: "link", children: "Link" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for small size', function () {
            var container = render(_jsx(Button, { size: "sm", children: "Small" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for large size', function () {
            var container = render(_jsx(Button, { size: "lg", children: "Large" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for icon size', function () {
            var container = render(_jsx(Button, { size: "icon", children: _jsx("svg", { "data-testid": "icon" }) })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for disabled state', function () {
            var container = render(_jsx(Button, { disabled: true, children: "Disabled" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            render(_jsx(Button, { children: "Test Content" }));
            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });
        it('renders children correctly', function () {
            render(_jsx(Button, { children: "Button Text" }));
            expect(screen.getByText('Button Text')).toBeInTheDocument();
        });
        it('renders as button element by default', function () {
            var _a;
            var container = render(_jsx(Button, { children: "Test" })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('BUTTON');
        });
    });
    describe('Variants', function () {
        it('applies default variant styles', function () {
            var container = render(_jsx(Button, { children: "Default" })).container;
            expect(container.firstChild).toHaveClass('bg-primary');
        });
        it('applies secondary variant styles', function () {
            var container = render(_jsx(Button, { variant: "secondary", children: "Secondary" })).container;
            expect(container.firstChild).toHaveClass('bg-secondary');
        });
        it('applies destructive variant styles', function () {
            var container = render(_jsx(Button, { variant: "destructive", children: "Delete" })).container;
            expect(container.firstChild).toHaveClass('bg-destructive');
        });
        it('applies outline variant styles', function () {
            var container = render(_jsx(Button, { variant: "outline", children: "Outline" })).container;
            expect(container.firstChild).toHaveClass('border');
        });
        it('applies ghost variant styles', function () {
            var container = render(_jsx(Button, { variant: "ghost", children: "Ghost" })).container;
            expect(container.firstChild).toHaveClass('hover:bg-accent');
        });
        it('applies link variant styles', function () {
            var container = render(_jsx(Button, { variant: "link", children: "Link" })).container;
            expect(container.firstChild).toHaveClass('text-primary');
        });
    });
    describe('Sizes', function () {
        it('applies default size styles', function () {
            var container = render(_jsx(Button, { children: "Default" })).container;
            expect(container.firstChild).toHaveClass('h-10');
        });
        it('applies small size styles', function () {
            var container = render(_jsx(Button, { size: "sm", children: "Small" })).container;
            expect(container.firstChild).toHaveClass('h-9');
        });
        it('applies large size styles', function () {
            var container = render(_jsx(Button, { size: "lg", children: "Large" })).container;
            expect(container.firstChild).toHaveClass('h-11');
        });
        it('applies icon size styles', function () {
            var container = render(_jsx(Button, { size: "icon", children: "Icon" })).container;
            expect(container.firstChild).toHaveClass('h-10', 'w-10');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Button, { className: "custom-class", children: "Test" })).container;
            expect(container.firstChild).toHaveClass('custom-class');
        });
        it('merges custom className with variant styles', function () {
            var container = render(_jsx(Button, { variant: "secondary", className: "my-custom", children: "Test" })).container;
            expect(container.firstChild).toHaveClass('bg-secondary');
            expect(container.firstChild).toHaveClass('my-custom');
        });
        it('forwards ref correctly', function () {
            var ref = { current: null };
            render(_jsx(Button, { ref: ref, children: "Test" }));
            expect(ref.current).not.toBeNull();
        });
        it('has correct displayName', function () {
            expect(Button.displayName).toBe('Button');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Button, { "data-testid": "button", "aria-label": "Submit form", children: "Test" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'button');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Submit form');
        });
    });
    describe('Interactions', function () {
        it('handles onClick events', function () {
            var handleClick = vi.fn();
            render(_jsx(Button, { onClick: handleClick, children: "Click me" }));
            fireEvent.click(screen.getByText('Click me'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
        it('does not fire onClick when disabled', function () {
            var handleClick = vi.fn();
            render(_jsx(Button, { onClick: handleClick, disabled: true, children: "Disabled" }));
            fireEvent.click(screen.getByText('Disabled'));
            expect(handleClick).not.toHaveBeenCalled();
        });
        it('handles keyboard events', function () {
            var handleKeyDown = vi.fn();
            render(_jsx(Button, { onKeyDown: handleKeyDown, children: "Test" }));
            fireEvent.keyDown(screen.getByText('Test'), { key: 'Enter' });
            expect(handleKeyDown).toHaveBeenCalledTimes(1);
        });
    });
    describe('Disabled State', function () {
        it('applies disabled styles when disabled', function () {
            var container = render(_jsx(Button, { disabled: true, children: "Disabled" })).container;
            expect(container.firstChild).toHaveClass('disabled:pointer-events-none');
            expect(container.firstChild).toHaveClass('disabled:opacity-50');
        });
        it('sets disabled attribute', function () {
            var container = render(_jsx(Button, { disabled: true, children: "Disabled" })).container;
            expect(container.firstChild).toHaveAttribute('disabled');
        });
    });
    describe('asChild Prop', function () {
        it('renders as child element when asChild is true', function () {
            var _a;
            var container = render(_jsx(Button, { asChild: true, children: _jsx("a", { href: "/test", children: "Link Button" }) })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('A');
            expect(container.firstChild).toHaveAttribute('href', '/test');
        });
        it('applies button styles to child element', function () {
            var container = render(_jsx(Button, { asChild: true, variant: "secondary", children: _jsx("a", { href: "/test", children: "Link" }) })).container;
            expect(container.firstChild).toHaveClass('bg-secondary');
        });
    });
    describe('Accessibility', function () {
        it('supports aria-label', function () {
            var container = render(_jsx(Button, { "aria-label": "Close dialog", children: "\u00D7" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Close dialog');
        });
        it('supports aria-disabled', function () {
            var container = render(_jsx(Button, { "aria-disabled": "true", children: "Test" })).container;
            expect(container.firstChild).toHaveAttribute('aria-disabled', 'true');
        });
        it('supports role attribute', function () {
            var container = render(_jsx(Button, { role: "menuitem", children: "Menu Item" })).container;
            expect(container.firstChild).toHaveAttribute('role', 'menuitem');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty children', function () {
            var container = render(_jsx(Button, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex children', function () {
            render(_jsxs(Button, { children: [_jsx("span", { children: "Icon" }), _jsx("span", { children: "Text" })] }));
            expect(screen.getByText('Icon')).toBeInTheDocument();
            expect(screen.getByText('Text')).toBeInTheDocument();
        });
        it('handles loading state with disabled', function () {
            var container = render(_jsxs(Button, { disabled: true, children: [_jsx("svg", { className: "animate-spin" }), "Loading..."] })).container;
            expect(container.firstChild).toHaveAttribute('disabled');
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
    });
});
