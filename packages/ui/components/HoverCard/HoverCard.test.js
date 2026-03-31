import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HoverCard, HoverCardContent, HoverCardTrigger, } from './HoverCard';
describe('HoverCard', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default hover card', function () {
            var container = render(_jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders trigger successfully', function () {
            var container = render(_jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger text', function () {
            render(_jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] }));
            expect(screen.getByText('Hover me')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to trigger', function () {
            var container = render(_jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { className: "custom-trigger", children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] })).container;
            var trigger = container.querySelector('[data-state]');
            expect(trigger).toHaveClass('custom-trigger');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { "data-testid": "my-hover-card", children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] })).container;
            expect(screen.getByTestId('my-hover-card')).toBeInTheDocument();
        });
    });
    describe('Content', function () {
        it('renders content text', function () {
            render(_jsxs(HoverCard, { open: true, children: [_jsx(HoverCardTrigger, { children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] }));
            expect(screen.getByText('Hover content')).toBeInTheDocument();
        });
        it('renders complex content', function () {
            render(_jsxs(HoverCard, { open: true, children: [_jsx(HoverCardTrigger, { children: "Hover me" }), _jsx(HoverCardContent, { children: _jsxs("div", { children: [_jsx("h3", { children: "Title" }), _jsx("p", { children: "Description" }), _jsx("button", { children: "Action" })] }) })] }));
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });
    describe('Controlled State', function () {
        it('respects open prop', function () {
            render(_jsxs(HoverCard, { open: true, children: [_jsx(HoverCardTrigger, { children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] }));
            expect(screen.getByText('Hover content')).toBeInTheDocument();
        });
        it('does not show content when open is false', function () {
            render(_jsxs(HoverCard, { open: false, children: [_jsx(HoverCardTrigger, { children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] }));
            expect(screen.queryByText('Hover content')).not.toBeInTheDocument();
        });
    });
    describe('Accessibility', function () {
        it('trigger has correct role', function () {
            render(_jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] }));
            var trigger = screen.getByText('Hover me');
            expect(trigger).toHaveAttribute('data-state', 'closed');
        });
        it('supports aria-label', function () {
            render(_jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { "aria-label": "User profile", children: "Hover me" }), _jsx(HoverCardContent, { children: "Hover content" })] }));
            var trigger = screen.getByText('Hover me');
            expect(trigger).toHaveAttribute('aria-label', 'User profile');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty hover card', function () {
            var container = render(_jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { children: "Hover me" }), _jsx(HoverCardContent, {})] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex content in trigger', function () {
            render(_jsxs(HoverCard, { children: [_jsxs(HoverCardTrigger, { children: [_jsx("span", { children: "Icon" }), _jsx("span", { children: "Text" })] }), _jsx(HoverCardContent, { children: "Hover content" })] }));
            expect(screen.getByText('Icon')).toBeInTheDocument();
            expect(screen.getByText('Text')).toBeInTheDocument();
        });
    });
});
