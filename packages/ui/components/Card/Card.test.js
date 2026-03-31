import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from './Card';
describe('Card', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for basic card', function () {
            var container = render(_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Card Title" }) }), _jsx(CardContent, { children: "Card content" })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for complete card', function () {
            var container = render(_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Title" }), _jsx(CardDescription, { children: "Description" })] }), _jsx(CardContent, { children: "Content" }), _jsx(CardFooter, { children: "Footer" })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for card with custom className', function () {
            var container = render(_jsx(Card, { className: "custom-card", children: _jsx(CardContent, { children: "Content" }) })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Card, { children: _jsx(CardContent, { children: "Test" }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsx(Card, { children: _jsx(CardContent, { children: "Test" }) })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
        it('renders card header', function () {
            render(_jsx(Card, { children: _jsx(CardHeader, { children: _jsx(CardTitle, { children: "Header Title" }) }) }));
            expect(screen.getByText('Header Title')).toBeInTheDocument();
        });
        it('renders card title', function () {
            render(_jsx(Card, { children: _jsx(CardHeader, { children: _jsx(CardTitle, { children: "My Title" }) }) }));
            expect(screen.getByText('My Title')).toBeInTheDocument();
        });
        it('renders card description', function () {
            render(_jsx(Card, { children: _jsx(CardHeader, { children: _jsx(CardDescription, { children: "My Description" }) }) }));
            expect(screen.getByText('My Description')).toBeInTheDocument();
        });
        it('renders card content', function () {
            render(_jsx(Card, { children: _jsx(CardContent, { children: "Main Content" }) }));
            expect(screen.getByText('Main Content')).toBeInTheDocument();
        });
        it('renders card footer', function () {
            render(_jsx(Card, { children: _jsx(CardFooter, { children: "Footer Content" }) }));
            expect(screen.getByText('Footer Content')).toBeInTheDocument();
        });
    });
    describe('Card Structure', function () {
        it('renders complete card structure', function () {
            render(_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Complete Card" }), _jsx(CardDescription, { children: "This is a complete card" })] }), _jsx(CardContent, { children: _jsx("p", { children: "Card body content" }) }), _jsx(CardFooter, { children: _jsx("button", { children: "Action" }) })] }));
            expect(screen.getByText('Complete Card')).toBeInTheDocument();
            expect(screen.getByText('This is a complete card')).toBeInTheDocument();
            expect(screen.getByText('Card body content')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
        it('renders card with multiple sections', function () {
            render(_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Title 1" }) }), _jsx(CardContent, { children: "Content 1" }), _jsx(CardHeader, { children: _jsx(CardTitle, { children: "Title 2" }) }), _jsx(CardContent, { children: "Content 2" })] }));
            expect(screen.getByText('Title 1')).toBeInTheDocument();
            expect(screen.getByText('Content 1')).toBeInTheDocument();
            expect(screen.getByText('Title 2')).toBeInTheDocument();
            expect(screen.getByText('Content 2')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to card', function () {
            var container = render(_jsx(Card, { className: "my-card", children: _jsx(CardContent, { children: "Test" }) })).container;
            expect(container.firstChild).toHaveClass('my-card');
        });
        it('merges custom className with default styles', function () {
            var container = render(_jsx(Card, { className: "custom", children: _jsx(CardContent, { children: "Test" }) })).container;
            expect(container.firstChild).toHaveClass('custom');
            expect(container.firstChild).toHaveClass('rounded-lg');
        });
        it('applies custom className to header', function () {
            var container = render(_jsx(Card, { children: _jsx(CardHeader, { className: "custom-header", children: _jsx(CardTitle, { children: "Title" }) }) })).container;
            expect(container.querySelector('[class*="flex flex-col"]')).toHaveClass('custom-header');
        });
        it('applies custom className to title', function () {
            render(_jsx(Card, { children: _jsx(CardHeader, { children: _jsx(CardTitle, { className: "custom-title", children: "Title" }) }) }));
            expect(screen.getByText('Title')).toHaveClass('custom-title');
        });
        it('applies custom className to description', function () {
            render(_jsx(Card, { children: _jsx(CardHeader, { children: _jsx(CardDescription, { className: "custom-desc", children: "Desc" }) }) }));
            expect(screen.getByText('Desc')).toHaveClass('custom-desc');
        });
        it('applies custom className to content', function () {
            var container = render(_jsx(Card, { children: _jsx(CardContent, { className: "custom-content", children: "Test" }) })).container;
            expect(container.querySelector('p, div')).toHaveClass('custom-content');
        });
        it('applies custom className to footer', function () {
            var container = render(_jsx(Card, { children: _jsx(CardFooter, { className: "custom-footer", children: "Footer" }) })).container;
            expect(container.querySelector('[class*="flex"]')).toHaveClass('custom-footer');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Card, { "data-testid": "my-card", "aria-label": "Info card", children: _jsx(CardContent, { children: "Test" }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-card');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Info card');
        });
    });
    describe('Accessibility', function () {
        it('supports aria-label', function () {
            var container = render(_jsx(Card, { "aria-label": "User profile", children: _jsx(CardContent, { children: "Test" }) })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'User profile');
        });
        it('supports role attribute', function () {
            var container = render(_jsx(Card, { role: "article", children: _jsx(CardContent, { children: "Test" }) })).container;
            expect(container.firstChild).toHaveAttribute('role', 'article');
        });
        it('title has correct heading structure', function () {
            render(_jsx(Card, { children: _jsx(CardHeader, { children: _jsx(CardTitle, { children: "Heading Title" }) }) }));
            var title = screen.getByText('Heading Title');
            expect(title.nodeName).toBe('H3');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty card', function () {
            var container = render(_jsx(Card, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles card with only content', function () {
            render(_jsx(Card, { children: _jsx(CardContent, { children: "Only content" }) }));
            expect(screen.getByText('Only content')).toBeInTheDocument();
        });
        it('handles card with complex children', function () {
            render(_jsx(Card, { children: _jsx(CardContent, { children: _jsxs("div", { children: [_jsx("span", { children: "Nested" }), _jsx("span", { children: "Content" })] }) }) }));
            expect(screen.getByText('Nested')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('handles card with multiple footers', function () {
            render(_jsxs(Card, { children: [_jsx(CardFooter, { children: "Footer 1" }), _jsx(CardFooter, { children: "Footer 2" })] }));
            expect(screen.getByText('Footer 1')).toBeInTheDocument();
            expect(screen.getByText('Footer 2')).toBeInTheDocument();
        });
    });
});
