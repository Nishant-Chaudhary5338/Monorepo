import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from './Collapsible';
describe('Collapsible', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default collapsible', function () {
            var container = render(_jsxs(Collapsible, { children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for open collapsible', function () {
            var container = render(_jsxs(Collapsible, { open: true, children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsxs(Collapsible, { children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger', function () {
            render(_jsxs(Collapsible, { children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] }));
            expect(screen.getByText('Toggle')).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsxs(Collapsible, { children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
    });
    describe('Interactions', function () {
        it('toggles content when trigger is clicked', function () {
            render(_jsxs(Collapsible, { children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] }));
            var trigger = screen.getByText('Toggle');
            fireEvent.click(trigger);
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('calls onOpenChange when toggled', function () {
            var handleOpenChange = vi.fn();
            render(_jsxs(Collapsible, { onOpenChange: handleOpenChange, children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] }));
            var trigger = screen.getByText('Toggle');
            fireEvent.click(trigger);
            expect(handleOpenChange).toHaveBeenCalled();
        });
    });
    describe('Controlled State', function () {
        it('respects open prop', function () {
            render(_jsxs(Collapsible, { open: true, children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('does not show content when open is false', function () {
            render(_jsxs(Collapsible, { open: false, children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] }));
            expect(screen.queryByText('Content')).not.toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsxs(Collapsible, { className: "custom-collapsible", children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] })).container;
            expect(container.firstChild).toHaveClass('custom-collapsible');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsxs(Collapsible, { "data-testid": "my-collapsible", children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-collapsible');
        });
    });
    describe('Disabled State', function () {
        it('disables trigger when disabled', function () {
            render(_jsxs(Collapsible, { disabled: true, children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] }));
            var trigger = screen.getByText('Toggle');
            expect(trigger).toHaveAttribute('disabled');
        });
    });
    describe('Accessibility', function () {
        it('trigger has button role', function () {
            render(_jsxs(Collapsible, { children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] }));
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
        it('supports aria-label', function () {
            render(_jsxs(Collapsible, { children: [_jsx(CollapsibleTrigger, { "aria-label": "Toggle section", children: "Toggle" }), _jsx(CollapsibleContent, { children: "Content" })] }));
            var trigger = screen.getByRole('button');
            expect(trigger).toHaveAttribute('aria-label', 'Toggle section');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty collapsible', function () {
            var container = render(_jsx(Collapsible, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex content', function () {
            render(_jsxs(Collapsible, { open: true, children: [_jsx(CollapsibleTrigger, { children: "Toggle" }), _jsx(CollapsibleContent, { children: _jsxs("div", { children: [_jsx("h2", { children: "Heading" }), _jsx("p", { children: "Paragraph" }), _jsx("button", { children: "Action" })] }) })] }));
            expect(screen.getByText('Heading')).toBeInTheDocument();
            expect(screen.getByText('Paragraph')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });
});
