import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from './ScrollArea';
describe('ScrollArea', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default scroll area', function () {
            var container = render(_jsx(ScrollArea, { className: "h-[200px] w-[350px] rounded-md border p-4", children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(ScrollArea, { className: "h-[200px] w-[350px]", children: "Content" })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders children correctly', function () {
            render(_jsx(ScrollArea, { className: "h-[200px] w-[350px]", children: _jsx("div", { children: "Scrollable content" }) }));
            expect(screen.getByText('Scrollable content')).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsx(ScrollArea, { className: "h-[200px] w-[350px]", children: "Content" })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(ScrollArea, { className: "custom-scroll-area", children: "Content" })).container;
            expect(container.firstChild).toHaveClass('custom-scroll-area');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(ScrollArea, { "data-testid": "my-scroll-area", children: "Content" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-scroll-area');
        });
    });
    describe('ScrollBar', function () {
        it('renders horizontal scrollbar', function () {
            var container = render(_jsxs(ScrollArea, { className: "h-[200px] w-[350px]", children: [_jsx("div", { style: { width: '800px' }, children: "Wide content" }), _jsx(ScrollBar, { orientation: "horizontal" })] })).container;
            var scrollbar = container.querySelector('[data-orientation="horizontal"]');
            expect(scrollbar).toBeInTheDocument();
        });
        it('renders vertical scrollbar', function () {
            var container = render(_jsxs(ScrollArea, { className: "h-[200px] w-[350px]", children: [_jsx("div", { style: { height: '800px' }, children: "Tall content" }), _jsx(ScrollBar, { orientation: "vertical" })] })).container;
            var scrollbar = container.querySelector('[data-orientation="vertical"]');
            expect(scrollbar).toBeInTheDocument();
        });
        it('applies custom className to scrollbar', function () {
            var container = render(_jsxs(ScrollArea, { className: "h-[200px] w-[350px]", children: ["Content", _jsx(ScrollBar, { orientation: "vertical", className: "custom-scrollbar" })] })).container;
            var scrollbar = container.querySelector('[data-orientation="vertical"]');
            expect(scrollbar).toHaveClass('custom-scrollbar');
        });
    });
    describe('Accessibility', function () {
        it('supports aria-label', function () {
            var container = render(_jsx(ScrollArea, { "aria-label": "Scrollable content", children: "Content" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Scrollable content');
        });
        it('supports role attribute', function () {
            var container = render(_jsx(ScrollArea, { role: "region", children: "Content" })).container;
            expect(container.firstChild).toHaveAttribute('role', 'region');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty scroll area', function () {
            var container = render(_jsx(ScrollArea, { className: "h-[200px] w-[350px]" })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex nested content', function () {
            render(_jsx(ScrollArea, { className: "h-[200px] w-[350px]", children: _jsxs("div", { children: [_jsx("h2", { children: "Title" }), _jsx("p", { children: "Paragraph" }), _jsxs("ul", { children: [_jsx("li", { children: "Item 1" }), _jsx("li", { children: "Item 2" })] })] }) }));
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Paragraph')).toBeInTheDocument();
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
        });
        it('handles long content', function () {
            var longContent = Array.from({ length: 100 }, function (_, i) { return (_jsxs("p", { children: ["Paragraph ", i + 1] }, i)); });
            render(_jsx(ScrollArea, { className: "h-[200px] w-[350px]", children: longContent }));
            expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 100')).toBeInTheDocument();
        });
    });
});
