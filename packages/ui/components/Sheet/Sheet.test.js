import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from './Sheet';
describe('Sheet', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default sheet', function () {
            var container = render(_jsxs(Sheet, { children: [_jsx(SheetTrigger, { children: "Open" }), _jsxs(SheetContent, { children: [_jsxs(SheetHeader, { children: [_jsx(SheetTitle, { children: "Sheet Title" }), _jsx(SheetDescription, { children: "Sheet description" })] }), _jsx(SheetFooter, { children: _jsx(SheetClose, { children: "Close" }) })] })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders trigger successfully', function () {
            var container = render(_jsxs(Sheet, { children: [_jsx(SheetTrigger, { children: "Open Sheet" }), _jsx(SheetContent, { children: _jsx(SheetTitle, { children: "Sheet Title" }) })] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger text', function () {
            render(_jsxs(Sheet, { children: [_jsx(SheetTrigger, { children: "Open Sheet" }), _jsx(SheetContent, { children: _jsx(SheetTitle, { children: "Sheet Title" }) })] }));
            expect(screen.getByText('Open Sheet')).toBeInTheDocument();
        });
        it('renders content when open', function () {
            render(_jsx(Sheet, { open: true, children: _jsx(SheetContent, { children: _jsx(SheetTitle, { children: "Sheet Title" }) }) }));
            expect(screen.getByText('Sheet Title')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to trigger', function () {
            var container = render(_jsxs(Sheet, { children: [_jsx(SheetTrigger, { className: "custom-trigger", children: "Open" }), _jsx(SheetContent, { children: _jsx(SheetTitle, { children: "Sheet Title" }) })] })).container;
            var trigger = container.querySelector('[data-state]');
            expect(trigger).toHaveClass('custom-trigger');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsxs(Sheet, { children: [_jsx(SheetTrigger, { "data-testid": "my-sheet", children: "Open" }), _jsx(SheetContent, { children: _jsx(SheetTitle, { children: "Sheet Title" }) })] })).container;
            expect(screen.getByTestId('my-sheet')).toBeInTheDocument();
        });
    });
    describe('Header', function () {
        it('renders sheet title', function () {
            render(_jsx(Sheet, { open: true, children: _jsx(SheetContent, { children: _jsx(SheetHeader, { children: _jsx(SheetTitle, { children: "My Sheet" }) }) }) }));
            expect(screen.getByText('My Sheet')).toBeInTheDocument();
        });
        it('renders sheet description', function () {
            render(_jsx(Sheet, { open: true, children: _jsx(SheetContent, { children: _jsx(SheetHeader, { children: _jsx(SheetDescription, { children: "This is a description" }) }) }) }));
            expect(screen.getByText('This is a description')).toBeInTheDocument();
        });
    });
    describe('Footer', function () {
        it('renders footer content', function () {
            render(_jsx(Sheet, { open: true, children: _jsx(SheetContent, { children: _jsx(SheetFooter, { children: _jsx("button", { children: "Action" }) }) }) }));
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });
    describe('Close', function () {
        it('renders close button', function () {
            render(_jsx(Sheet, { open: true, children: _jsx(SheetContent, { children: _jsx(SheetClose, { children: "Close" }) }) }));
            expect(screen.getByText('Close')).toBeInTheDocument();
        });
        it('calls onOpenChange when close is clicked', function () {
            var handleOpenChange = vi.fn();
            render(_jsx(Sheet, { open: true, onOpenChange: handleOpenChange, children: _jsx(SheetContent, { children: _jsx(SheetClose, { children: "Close" }) }) }));
            fireEvent.click(screen.getByText('Close'));
            expect(handleOpenChange).toHaveBeenCalled();
        });
    });
    describe('Controlled State', function () {
        it('respects open prop', function () {
            render(_jsx(Sheet, { open: true, children: _jsx(SheetContent, { children: _jsx(SheetTitle, { children: "Open Sheet" }) }) }));
            expect(screen.getByText('Open Sheet')).toBeInTheDocument();
        });
        it('does not show content when open is false', function () {
            render(_jsx(Sheet, { open: false, children: _jsx(SheetContent, { children: _jsx(SheetTitle, { children: "Hidden Sheet" }) }) }));
            expect(screen.queryByText('Hidden Sheet')).not.toBeInTheDocument();
        });
    });
    describe('Accessibility', function () {
        it('dialog has correct role', function () {
            render(_jsx(Sheet, { open: true, children: _jsx(SheetContent, { children: _jsx(SheetTitle, { children: "Accessible Sheet" }) }) }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('supports aria-label', function () {
            render(_jsx(Sheet, { open: true, children: _jsx(SheetContent, { "aria-label": "Sheet panel", children: _jsx(SheetTitle, { children: "Sheet" }) }) }));
            var dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-label', 'Sheet panel');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty sheet', function () {
            var container = render(_jsxs(Sheet, { children: [_jsx(SheetTrigger, { children: "Open" }), _jsx(SheetContent, {})] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex content', function () {
            render(_jsx(Sheet, { open: true, children: _jsxs(SheetContent, { children: [_jsx(SheetHeader, { children: _jsx(SheetTitle, { children: "Complex Sheet" }) }), _jsxs("div", { children: [_jsx("p", { children: "Paragraph 1" }), _jsx("p", { children: "Paragraph 2" })] }), _jsx(SheetFooter, { children: _jsx("button", { children: "Action" }) })] }) }));
            expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });
});
