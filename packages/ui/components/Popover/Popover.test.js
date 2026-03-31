import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popover, PopoverContent, PopoverTrigger, } from './Popover';
describe('Popover', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default popover', function () {
            var container = render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for open popover', function () {
            var container = render(_jsxs(Popover, { open: true, children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders trigger successfully', function () {
            var container = render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: "Open Popover" }), _jsx(PopoverContent, { children: "Popover content" })] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger text', function () {
            render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: "Open Popover" }), _jsx(PopoverContent, { children: "Popover content" })] }));
            expect(screen.getByText('Open Popover')).toBeInTheDocument();
        });
        it('renders content when open', function () {
            render(_jsxs(Popover, { open: true, children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] }));
            expect(screen.getByText('Popover content')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to trigger', function () {
            var container = render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { className: "custom-trigger", children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] })).container;
            var trigger = container.querySelector('[data-state]');
            expect(trigger).toHaveClass('custom-trigger');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { "data-testid": "my-popover", children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] })).container;
            expect(screen.getByTestId('my-popover')).toBeInTheDocument();
        });
    });
    describe('Controlled State', function () {
        it('respects open prop', function () {
            render(_jsxs(Popover, { open: true, children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] }));
            expect(screen.getByText('Popover content')).toBeInTheDocument();
        });
        it('does not show content when open is false', function () {
            render(_jsxs(Popover, { open: false, children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] }));
            expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
        });
    });
    describe('Interactions', function () {
        it('calls onOpenChange when state changes', function () {
            var handleOpenChange = vi.fn();
            render(_jsxs(Popover, { onOpenChange: handleOpenChange, children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] }));
            fireEvent.click(screen.getByText('Open'));
            expect(handleOpenChange).toHaveBeenCalled();
        });
    });
    describe('Accessibility', function () {
        it('trigger has correct role', function () {
            render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] }));
            var trigger = screen.getByText('Open');
            expect(trigger).toHaveAttribute('data-state', 'closed');
        });
        it('supports aria-label', function () {
            render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { "aria-label": "Open popover", children: "Open" }), _jsx(PopoverContent, { children: "Popover content" })] }));
            var trigger = screen.getByText('Open');
            expect(trigger).toHaveAttribute('aria-label', 'Open popover');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty popover', function () {
            var container = render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, {})] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex content', function () {
            render(_jsxs(Popover, { open: true, children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: _jsxs("div", { children: [_jsx("h3", { children: "Title" }), _jsx("p", { children: "Description" }), _jsx("button", { children: "Action" })] }) })] }));
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });
});
