import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from './Breadcrumb';
describe('Breadcrumb', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default breadcrumb', function () {
            var container = render(_jsx(Breadcrumb, { children: _jsxs(BreadcrumbList, { children: [_jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }), _jsx(BreadcrumbSeparator, {}), _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/products", children: "Products" }) }), _jsx(BreadcrumbSeparator, {}), _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Current Page" }) })] }) })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }) }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders breadcrumb links', function () {
            render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }) }) }));
            expect(screen.getByText('Home')).toBeInTheDocument();
        });
        it('renders breadcrumb page', function () {
            render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Current" }) }) }) }));
            expect(screen.getByText('Current')).toBeInTheDocument();
        });
        it('renders separators', function () {
            var container = render(_jsx(Breadcrumb, { children: _jsxs(BreadcrumbList, { children: [_jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }), _jsx(BreadcrumbSeparator, {}), _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Current" }) })] }) })).container;
            var separators = container.querySelectorAll('li[role="presentation"]');
            expect(separators.length).toBeGreaterThan(0);
        });
    });
    describe('Props', function () {
        it('applies custom className to breadcrumb', function () {
            var container = render(_jsx(Breadcrumb, { className: "custom-breadcrumb", children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }) }) })).container;
            expect(container.firstChild).toHaveClass('custom-breadcrumb');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Breadcrumb, { "data-testid": "my-breadcrumb", children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-breadcrumb');
        });
    });
    describe('Accessibility', function () {
        it('has navigation role', function () {
            var container = render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('role', 'navigation');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Breadcrumb, { "aria-label": "Breadcrumb navigation", children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Breadcrumb navigation');
        });
        it('list has list role', function () {
            var container = render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }) }) }) })).container;
            var list = container.querySelector('ol');
            expect(list).toBeInTheDocument();
        });
    });
    describe('Links', function () {
        it('renders link with href', function () {
            render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { href: "/home", children: "Home" }) }) }) }));
            var link = screen.getByText('Home');
            expect(link).toHaveAttribute('href', '/home');
        });
        it('renders page without href', function () {
            render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Current Page" }) }) }) }));
            var page = screen.getByText('Current Page');
            expect(page).not.toHaveAttribute('href');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty breadcrumb', function () {
            var container = render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, {}) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles single item breadcrumb', function () {
            render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Only Page" }) }) }) }));
            expect(screen.getByText('Only Page')).toBeInTheDocument();
        });
        it('handles many items', function () {
            var items = Array.from({ length: 10 }, function (_, i) { return (_jsx(BreadcrumbItem, { children: _jsxs(BreadcrumbLink, { href: "/page".concat(i), children: ["Page ", i] }) }, i)); });
            render(_jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: items }) }));
            expect(screen.getByText('Page 0')).toBeInTheDocument();
            expect(screen.getByText('Page 9')).toBeInTheDocument();
        });
    });
});
