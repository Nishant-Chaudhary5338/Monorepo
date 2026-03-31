import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from './Tooltip';
describe('Tooltip', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default tooltip', function () {
            var container = render(_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { children: "Hover me" }), _jsx(TooltipContent, { children: "Tooltip content" })] }) })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders trigger successfully', function () {
            render(_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { children: "Hover me" }), _jsx(TooltipContent, { children: "Tooltip content" })] }) }));
            expect(screen.getByText('Hover me')).toBeInTheDocument();
        });
        it('renders trigger as button by default', function () {
            render(_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { children: "Hover me" }), _jsx(TooltipContent, { children: "Tooltip content" })] }) }));
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to trigger', function () {
            render(_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { className: "custom-trigger", children: "Hover me" }), _jsx(TooltipContent, { children: "Tooltip content" })] }) }));
            var trigger = screen.getByRole('button');
            expect(trigger).toHaveClass('custom-trigger');
        });
        it('passes through additional HTML attributes to trigger', function () {
            render(_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { "data-testid": "my-tooltip-trigger", children: "Hover me" }), _jsx(TooltipContent, { children: "Tooltip content" })] }) }));
            expect(screen.getByTestId('my-tooltip-trigger')).toBeInTheDocument();
        });
    });
    describe('Accessibility', function () {
        it('trigger has button role', function () {
            render(_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { children: "Hover me" }), _jsx(TooltipContent, { children: "Tooltip content" })] }) }));
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
        it('supports aria-label on trigger', function () {
            render(_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { "aria-label": "Help", children: "?" }), _jsx(TooltipContent, { children: "Tooltip content" })] }) }));
            var trigger = screen.getByRole('button');
            expect(trigger).toHaveAttribute('aria-label', 'Help');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty tooltip', function () {
            var container = render(_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { children: "Hover me" }), _jsx(TooltipContent, {})] }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex content in trigger', function () {
            render(_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsxs(TooltipTrigger, { children: [_jsx("span", { children: "Icon" }), _jsx("span", { children: "Text" })] }), _jsx(TooltipContent, { children: "Tooltip content" })] }) }));
            expect(screen.getByText('Icon')).toBeInTheDocument();
            expect(screen.getByText('Text')).toBeInTheDocument();
        });
    });
});
