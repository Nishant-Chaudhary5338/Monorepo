import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from './Alert';
describe('Alert', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default alert', function () {
            var container = render(_jsxs(Alert, { children: [_jsx(AlertTitle, { children: "Alert Title" }), _jsx(AlertDescription, { children: "Alert description" })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for destructive alert', function () {
            var container = render(_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertTitle, { children: "Error" }), _jsx(AlertDescription, { children: "Something went wrong" })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Alert, { children: _jsx(AlertTitle, { children: "Test Alert" }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders alert title', function () {
            render(_jsx(Alert, { children: _jsx(AlertTitle, { children: "My Title" }) }));
            expect(screen.getByText('My Title')).toBeInTheDocument();
        });
        it('renders alert description', function () {
            render(_jsx(Alert, { children: _jsx(AlertDescription, { children: "My Description" }) }));
            expect(screen.getByText('My Description')).toBeInTheDocument();
        });
        it('renders complete alert', function () {
            render(_jsxs(Alert, { children: [_jsx(AlertTitle, { children: "Title" }), _jsx(AlertDescription, { children: "Description" })] }));
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
        });
    });
    describe('Variants', function () {
        it('applies default variant styles', function () {
            var container = render(_jsx(Alert, { children: _jsx(AlertTitle, { children: "Default" }) })).container;
            expect(container.firstChild).toHaveClass('bg-background');
        });
        it('applies destructive variant styles', function () {
            var container = render(_jsx(Alert, { variant: "destructive", children: _jsx(AlertTitle, { children: "Destructive" }) })).container;
            expect(container.firstChild).toHaveClass('border-destructive/50');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Alert, { className: "custom-alert", children: _jsx(AlertTitle, { children: "Test" }) })).container;
            expect(container.firstChild).toHaveClass('custom-alert');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Alert, { "data-testid": "my-alert", role: "alert", children: _jsx(AlertTitle, { children: "Test" }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-alert');
            expect(container.firstChild).toHaveAttribute('role', 'alert');
        });
    });
    describe('Accessibility', function () {
        it('has alert role', function () {
            var container = render(_jsx(Alert, { children: _jsx(AlertTitle, { children: "Accessible Alert" }) })).container;
            expect(container.firstChild).toHaveAttribute('role', 'alert');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Alert, { "aria-label": "Notification", children: _jsx(AlertTitle, { children: "Test" }) })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Notification');
        });
    });
    describe('Edge Cases', function () {
        it('handles alert without title', function () {
            render(_jsx(Alert, { children: _jsx(AlertDescription, { children: "Description only" }) }));
            expect(screen.getByText('Description only')).toBeInTheDocument();
        });
        it('handles alert without description', function () {
            render(_jsx(Alert, { children: _jsx(AlertTitle, { children: "Title only" }) }));
            expect(screen.getByText('Title only')).toBeInTheDocument();
        });
        it('handles complex children', function () {
            render(_jsxs(Alert, { children: [_jsx(AlertTitle, { children: "Complex Alert" }), _jsx(AlertDescription, { children: _jsxs("div", { children: [_jsx("p", { children: "Paragraph 1" }), _jsx("p", { children: "Paragraph 2" })] }) })] }));
            expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
        });
    });
});
