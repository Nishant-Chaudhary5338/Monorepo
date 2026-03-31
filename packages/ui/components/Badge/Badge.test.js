import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
describe('Badge', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default variant', function () {
            var container = render(_jsx(Badge, { children: "Default Badge" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for secondary variant', function () {
            var container = render(_jsx(Badge, { variant: "secondary", children: "Secondary" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for destructive variant', function () {
            var container = render(_jsx(Badge, { variant: "destructive", children: "Destructive" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for outline variant', function () {
            var container = render(_jsx(Badge, { variant: "outline", children: "Outline" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Badge, { children: "Test Badge" })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders children correctly', function () {
            render(_jsx(Badge, { children: "Badge Content" }));
            expect(screen.getByText('Badge Content')).toBeInTheDocument();
        });
        it('renders without children', function () {
            var container = render(_jsx(Badge, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    describe('Variants', function () {
        it('applies default variant styles', function () {
            var container = render(_jsx(Badge, { children: "Default" })).container;
            expect(container.firstChild).toHaveClass('bg-primary');
        });
        it('applies secondary variant styles', function () {
            var container = render(_jsx(Badge, { variant: "secondary", children: "Secondary" })).container;
            expect(container.firstChild).toHaveClass('bg-secondary');
        });
        it('applies destructive variant styles', function () {
            var container = render(_jsx(Badge, { variant: "destructive", children: "Destructive" })).container;
            expect(container.firstChild).toHaveClass('bg-destructive');
        });
        it('applies outline variant styles', function () {
            var container = render(_jsx(Badge, { variant: "outline", children: "Outline" })).container;
            expect(container.firstChild).toHaveClass('text-foreground');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Badge, { className: "custom-class", children: "Test" })).container;
            expect(container.firstChild).toHaveClass('custom-class');
        });
        it('merges custom className with variant styles', function () {
            var container = render(_jsx(Badge, { variant: "secondary", className: "my-custom", children: "Test" })).container;
            expect(container.firstChild).toHaveClass('bg-secondary');
            expect(container.firstChild).toHaveClass('my-custom');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Badge, { "data-testid": "badge", "aria-label": "Status badge", children: "Test" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'badge');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Status badge');
        });
    });
    describe('Accessibility', function () {
        it('renders as a div element', function () {
            var _a;
            var container = render(_jsx(Badge, { children: "Test" })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Badge, { "aria-label": "Notification count", children: "5" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Notification count');
        });
        it('supports role attribute', function () {
            var container = render(_jsx(Badge, { role: "status", children: "Active" })).container;
            expect(container.firstChild).toHaveAttribute('role', 'status');
        });
    });
    describe('Edge Cases', function () {
        it('handles numeric children', function () {
            render(_jsx(Badge, { children: 42 }));
            expect(screen.getByText('42')).toBeInTheDocument();
        });
        it('handles complex children', function () {
            render(_jsxs(Badge, { children: [_jsx("span", { children: "Icon" }), _jsx("span", { children: "Text" })] }));
            expect(screen.getByText('Icon')).toBeInTheDocument();
            expect(screen.getByText('Text')).toBeInTheDocument();
        });
    });
});
