import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from './Pagination';
describe('Pagination', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default pagination', function () {
            var container = render(_jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: function () { } }) }), _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, children: "1" }) }), _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, isActive: true, children: "2" }) }), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: function () { } }) })] }) })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, children: "1" }) }) }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as nav element', function () {
            var _a;
            var container = render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, children: "1" }) }) }) })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('NAV');
        });
        it('renders pagination links', function () {
            render(_jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, children: "1" }) }), _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, children: "2" }) })] }) }));
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });
    describe('Navigation', function () {
        it('renders previous button', function () {
            render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: function () { } }) }) }) }));
            expect(screen.getByText('Previous')).toBeInTheDocument();
        });
        it('renders next button', function () {
            render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: function () { } }) }) }) }));
            expect(screen.getByText('Next')).toBeInTheDocument();
        });
        it('calls onClick when previous is clicked', function () {
            var handleClick = vi.fn();
            render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: handleClick }) }) }) }));
            fireEvent.click(screen.getByText('Previous'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
        it('calls onClick when next is clicked', function () {
            var handleClick = vi.fn();
            render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: handleClick }) }) }) }));
            fireEvent.click(screen.getByText('Next'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });
    describe('Links', function () {
        it('calls onClick when link is clicked', function () {
            var handleClick = vi.fn();
            render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: handleClick, children: "1" }) }) }) }));
            fireEvent.click(screen.getByText('1'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
        it('renders active link', function () {
            var container = render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, isActive: true, children: "2" }) }) }) })).container;
            var activeLink = container.querySelector('[aria-current="page"]');
            expect(activeLink).toBeInTheDocument();
        });
    });
    describe('Ellipsis', function () {
        it('renders ellipsis', function () {
            var container = render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationEllipsis, {}) }) }) })).container;
            var ellipsis = container.querySelector('[aria-hidden="true"]');
            expect(ellipsis).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Pagination, { className: "custom-pagination", children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, size: "icon", children: "1" }) }) }) })).container;
            expect(container.firstChild).toHaveClass('custom-pagination');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Pagination, { "data-testid": "my-pagination", children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, size: "icon", children: "1" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-pagination');
        });
    });
    describe('Accessibility', function () {
        it('has navigation role', function () {
            var container = render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, size: "icon", children: "1" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('role', 'navigation');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Pagination, { "aria-label": "Pagination navigation", children: _jsx(PaginationContent, { children: _jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, size: "icon", children: "1" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Pagination navigation');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty pagination', function () {
            var container = render(_jsx(Pagination, { children: _jsx(PaginationContent, {}) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles many page links', function () {
            var links = Array.from({ length: 10 }, function (_, i) { return (_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: function () { }, size: "icon", children: i + 1 }) }, i)); });
            render(_jsx(Pagination, { children: _jsx(PaginationContent, { children: links }) }));
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
        });
    });
});
