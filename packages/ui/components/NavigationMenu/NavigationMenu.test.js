import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, } from './NavigationMenu';
describe('NavigationMenu', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default navigation menu', function () {
            var container = render(_jsx(NavigationMenu, { children: _jsx(NavigationMenuList, { children: _jsxs(NavigationMenuItem, { children: [_jsx(NavigationMenuTrigger, { children: "Getting Started" }), _jsx(NavigationMenuContent, { children: _jsx(NavigationMenuLink, { href: "/docs", children: "Documentation" }) })] }) }) })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(NavigationMenu, { children: _jsx(NavigationMenuList, { children: _jsxs(NavigationMenuItem, { children: [_jsx(NavigationMenuTrigger, { children: "Getting Started" }), _jsx(NavigationMenuContent, { children: _jsx(NavigationMenuLink, { href: "/docs", children: "Documentation" }) })] }) }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger text', function () {
            render(_jsx(NavigationMenu, { children: _jsx(NavigationMenuList, { children: _jsxs(NavigationMenuItem, { children: [_jsx(NavigationMenuTrigger, { children: "Getting Started" }), _jsx(NavigationMenuContent, { children: _jsx(NavigationMenuLink, { href: "/docs", children: "Documentation" }) })] }) }) }));
            expect(screen.getByText('Getting Started')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(NavigationMenu, { className: "custom-nav", children: _jsx(NavigationMenuList, { children: _jsx(NavigationMenuItem, { children: _jsx(NavigationMenuTrigger, { children: "Getting Started" }) }) }) })).container;
            expect(container.firstChild).toHaveClass('custom-nav');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(NavigationMenu, { "data-testid": "my-nav", children: _jsx(NavigationMenuList, { children: _jsx(NavigationMenuItem, { children: _jsx(NavigationMenuTrigger, { children: "Getting Started" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-nav');
        });
    });
    describe('Links', function () {
        it('renders navigation links', function () {
            render(_jsx(NavigationMenu, { children: _jsx(NavigationMenuList, { children: _jsxs(NavigationMenuItem, { children: [_jsx(NavigationMenuTrigger, { children: "Getting Started" }), _jsxs(NavigationMenuContent, { children: [_jsx(NavigationMenuLink, { href: "/docs", children: "Documentation" }), _jsx(NavigationMenuLink, { href: "/tutorial", children: "Tutorial" })] })] }) }) }));
            expect(screen.getByText('Documentation')).toBeInTheDocument();
            expect(screen.getByText('Tutorial')).toBeInTheDocument();
        });
        it('renders link with href', function () {
            render(_jsx(NavigationMenu, { children: _jsx(NavigationMenuList, { children: _jsxs(NavigationMenuItem, { children: [_jsx(NavigationMenuTrigger, { children: "Getting Started" }), _jsx(NavigationMenuContent, { children: _jsx(NavigationMenuLink, { href: "/docs", children: "Documentation" }) })] }) }) }));
            var link = screen.getByText('Documentation');
            expect(link).toHaveAttribute('href', '/docs');
        });
    });
    describe('Multiple Items', function () {
        it('renders multiple menu items', function () {
            render(_jsx(NavigationMenu, { children: _jsxs(NavigationMenuList, { children: [_jsxs(NavigationMenuItem, { children: [_jsx(NavigationMenuTrigger, { children: "Getting Started" }), _jsx(NavigationMenuContent, { children: _jsx(NavigationMenuLink, { href: "/docs", children: "Documentation" }) })] }), _jsxs(NavigationMenuItem, { children: [_jsx(NavigationMenuTrigger, { children: "Components" }), _jsx(NavigationMenuContent, { children: _jsx(NavigationMenuLink, { href: "/button", children: "Button" }) })] })] }) }));
            expect(screen.getByText('Getting Started')).toBeInTheDocument();
            expect(screen.getByText('Components')).toBeInTheDocument();
        });
    });
    describe('Accessibility', function () {
        it('has navigation role', function () {
            var container = render(_jsx(NavigationMenu, { children: _jsx(NavigationMenuList, { children: _jsx(NavigationMenuItem, { children: _jsx(NavigationMenuTrigger, { children: "Getting Started" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('role', 'navigation');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(NavigationMenu, { "aria-label": "Main navigation", children: _jsx(NavigationMenuList, { children: _jsx(NavigationMenuItem, { children: _jsx(NavigationMenuTrigger, { children: "Getting Started" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Main navigation');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty navigation menu', function () {
            var container = render(_jsx(NavigationMenu, { children: _jsx(NavigationMenuList, {}) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles many items', function () {
            var items = Array.from({ length: 10 }, function (_, i) { return (_jsxs(NavigationMenuItem, { children: [_jsxs(NavigationMenuTrigger, { children: ["Item ", i] }), _jsx(NavigationMenuContent, { children: _jsxs(NavigationMenuLink, { href: "/item".concat(i), children: ["Link ", i] }) })] }, i)); });
            render(_jsx(NavigationMenu, { children: _jsx(NavigationMenuList, { children: items }) }));
            expect(screen.getByText('Item 0')).toBeInTheDocument();
            expect(screen.getByText('Item 9')).toBeInTheDocument();
        });
    });
});
