import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger, } from './ContextMenu';
describe('ContextMenu', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default context menu', function () {
            var container = render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsxs(ContextMenuContent, { children: [_jsx(ContextMenuItem, { children: "Profile" }), _jsx(ContextMenuItem, { children: "Billing" }), _jsx(ContextMenuItem, { children: "Settings" })] })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders trigger successfully', function () {
            var container = render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsx(ContextMenuItem, { children: "Profile" }) })] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger text', function () {
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsx(ContextMenuItem, { children: "Profile" }) })] }));
            expect(screen.getByText('Right click me')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to trigger', function () {
            var container = render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { className: "custom-trigger", children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsx(ContextMenuItem, { children: "Profile" }) })] })).container;
            var trigger = container.querySelector('[data-state]');
            expect(trigger).toHaveClass('custom-trigger');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { "data-testid": "my-context-menu", children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsx(ContextMenuItem, { children: "Profile" }) })] })).container;
            expect(screen.getByTestId('my-context-menu')).toBeInTheDocument();
        });
    });
    describe('Items', function () {
        it('renders menu items', function () {
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsxs(ContextMenuContent, { children: [_jsx(ContextMenuItem, { children: "Profile" }), _jsx(ContextMenuItem, { children: "Billing" })] })] }));
            expect(screen.getByText('Profile')).toBeInTheDocument();
            expect(screen.getByText('Billing')).toBeInTheDocument();
        });
        it('handles item selection', function () {
            var handleSelect = vi.fn();
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsx(ContextMenuItem, { onSelect: handleSelect, children: "Profile" }) })] }));
            fireEvent.click(screen.getByText('Profile'));
            expect(handleSelect).toHaveBeenCalled();
        });
    });
    describe('Checkbox Items', function () {
        it('renders checkbox items', function () {
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsx(ContextMenuCheckboxItem, { checked: true, children: "Show Bookmarks" }) })] }));
            expect(screen.getByText('Show Bookmarks')).toBeInTheDocument();
        });
    });
    describe('Radio Items', function () {
        it('renders radio items', function () {
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsxs(ContextMenuRadioGroup, { value: "light", children: [_jsx(ContextMenuRadioItem, { value: "light", children: "Light" }), _jsx(ContextMenuRadioItem, { value: "dark", children: "Dark" })] }) })] }));
            expect(screen.getByText('Light')).toBeInTheDocument();
            expect(screen.getByText('Dark')).toBeInTheDocument();
        });
    });
    describe('Labels and Separators', function () {
        it('renders labels', function () {
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsxs(ContextMenuContent, { children: [_jsx(ContextMenuLabel, { children: "My Account" }), _jsx(ContextMenuItem, { children: "Profile" })] })] }));
            expect(screen.getByText('My Account')).toBeInTheDocument();
        });
        it('renders separators', function () {
            var container = render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsxs(ContextMenuContent, { children: [_jsx(ContextMenuItem, { children: "Profile" }), _jsx(ContextMenuSeparator, {}), _jsx(ContextMenuItem, { children: "Settings" })] })] })).container;
            var separators = container.querySelectorAll('[role="separator"]');
            expect(separators.length).toBeGreaterThan(0);
        });
    });
    describe('Shortcuts', function () {
        it('renders shortcuts', function () {
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsxs(ContextMenuItem, { children: ["Profile", _jsx(ContextMenuShortcut, { children: "\u2318P" })] }) })] }));
            expect(screen.getByText('⌘P')).toBeInTheDocument();
        });
    });
    describe('Disabled Items', function () {
        it('disables items', function () {
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsx(ContextMenuItem, { disabled: true, children: "Profile" }) })] }));
            var item = screen.getByText('Profile');
            expect(item).toHaveAttribute('data-disabled', 'true');
        });
    });
    describe('Accessibility', function () {
        it('trigger has correct role', function () {
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, { children: _jsx(ContextMenuItem, { children: "Profile" }) })] }));
            var trigger = screen.getByText('Right click me');
            expect(trigger).toHaveAttribute('data-state', 'closed');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty context menu', function () {
            var container = render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, {})] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles many items', function () {
            var items = Array.from({ length: 10 }, function (_, i) { return (_jsxs(ContextMenuItem, { children: ["Item ", i] }, i)); });
            render(_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { children: "Right click me" }), _jsx(ContextMenuContent, { children: items })] }));
            expect(screen.getByText('Item 0')).toBeInTheDocument();
            expect(screen.getByText('Item 9')).toBeInTheDocument();
        });
    });
});
