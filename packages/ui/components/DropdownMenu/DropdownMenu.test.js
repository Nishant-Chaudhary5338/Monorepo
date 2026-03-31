import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger, } from './DropdownMenu';
describe('DropdownMenu', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default dropdown menu', function () {
            var container = render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { children: "Profile" }), _jsx(DropdownMenuItem, { children: "Billing" }), _jsx(DropdownMenuItem, { children: "Settings" })] })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders trigger successfully', function () {
            var container = render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open Menu" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Profile" }) })] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger text', function () {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open Menu" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Profile" }) })] }));
            expect(screen.getByText('Open Menu')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to trigger', function () {
            var container = render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { className: "custom-trigger", children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Profile" }) })] })).container;
            var trigger = container.querySelector('[data-state]');
            expect(trigger).toHaveClass('custom-trigger');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { "data-testid": "my-dropdown", children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Profile" }) })] })).container;
            expect(screen.getByTestId('my-dropdown')).toBeInTheDocument();
        });
    });
    describe('Items', function () {
        it('renders menu items', function () {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { children: "Profile" }), _jsx(DropdownMenuItem, { children: "Billing" })] })] }));
            expect(screen.getByText('Profile')).toBeInTheDocument();
            expect(screen.getByText('Billing')).toBeInTheDocument();
        });
        it('handles item selection', function () {
            var handleSelect = vi.fn();
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { onSelect: handleSelect, children: "Profile" }) })] }));
            fireEvent.click(screen.getByText('Profile'));
            expect(handleSelect).toHaveBeenCalled();
        });
    });
    describe('Checkbox Items', function () {
        it('renders checkbox items', function () {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuCheckboxItem, { checked: true, children: "Show Bookmarks" }) })] }));
            expect(screen.getByText('Show Bookmarks')).toBeInTheDocument();
        });
    });
    describe('Radio Items', function () {
        it('renders radio items', function () {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: _jsxs(DropdownMenuRadioGroup, { value: "light", children: [_jsx(DropdownMenuRadioItem, { value: "light", children: "Light" }), _jsx(DropdownMenuRadioItem, { value: "dark", children: "Dark" })] }) })] }));
            expect(screen.getByText('Light')).toBeInTheDocument();
            expect(screen.getByText('Dark')).toBeInTheDocument();
        });
    });
    describe('Labels and Separators', function () {
        it('renders labels', function () {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuLabel, { children: "My Account" }), _jsx(DropdownMenuItem, { children: "Profile" })] })] }));
            expect(screen.getByText('My Account')).toBeInTheDocument();
        });
        it('renders separators', function () {
            var container = render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { children: "Profile" }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { children: "Settings" })] })] })).container;
            var separators = container.querySelectorAll('[role="separator"]');
            expect(separators.length).toBeGreaterThan(0);
        });
    });
    describe('Shortcuts', function () {
        it('renders shortcuts', function () {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: _jsxs(DropdownMenuItem, { children: ["Profile", _jsx(DropdownMenuShortcut, { children: "\u2318P" })] }) })] }));
            expect(screen.getByText('⌘P')).toBeInTheDocument();
        });
    });
    describe('Disabled Items', function () {
        it('disables items', function () {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { disabled: true, children: "Profile" }) })] }));
            var item = screen.getByText('Profile');
            expect(item).toHaveAttribute('data-disabled', 'true');
        });
    });
    describe('Accessibility', function () {
        it('trigger has button role', function () {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Profile" }) })] }));
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
        it('supports aria-label', function () {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { "aria-label": "Open menu", children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Profile" }) })] }));
            var trigger = screen.getByRole('button');
            expect(trigger).toHaveAttribute('aria-label', 'Open menu');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty dropdown menu', function () {
            var container = render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, {})] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles many items', function () {
            var items = Array.from({ length: 10 }, function (_, i) { return (_jsxs(DropdownMenuItem, { children: ["Item ", i] }, i)); });
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: items })] }));
            expect(screen.getByText('Item 0')).toBeInTheDocument();
            expect(screen.getByText('Item 9')).toBeInTheDocument();
        });
    });
});
