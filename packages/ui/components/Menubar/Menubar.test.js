import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarTrigger, } from './Menubar';
describe('Menubar', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default menubar', function () {
            var container = render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "File" }), _jsxs(MenubarContent, { children: [_jsx(MenubarItem, { children: "New Tab" }), _jsx(MenubarItem, { children: "New Window" })] })] }) })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "File" }), _jsx(MenubarContent, { children: _jsx(MenubarItem, { children: "New Tab" }) })] }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger text', function () {
            render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "File" }), _jsx(MenubarContent, { children: _jsx(MenubarItem, { children: "New Tab" }) })] }) }));
            expect(screen.getByText('File')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Menubar, { className: "custom-menubar", children: _jsx(MenubarMenu, { children: _jsx(MenubarTrigger, { children: "File" }) }) })).container;
            expect(container.firstChild).toHaveClass('custom-menubar');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Menubar, { "data-testid": "my-menubar", children: _jsx(MenubarMenu, { children: _jsx(MenubarTrigger, { children: "File" }) }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-menubar');
        });
    });
    describe('Items', function () {
        it('renders menu items', function () {
            render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "File" }), _jsxs(MenubarContent, { children: [_jsx(MenubarItem, { children: "New Tab" }), _jsx(MenubarItem, { children: "New Window" })] })] }) }));
            expect(screen.getByText('New Tab')).toBeInTheDocument();
            expect(screen.getByText('New Window')).toBeInTheDocument();
        });
        it('handles item selection', function () {
            var handleSelect = vi.fn();
            render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "File" }), _jsx(MenubarContent, { children: _jsx(MenubarItem, { onSelect: handleSelect, children: "New Tab" }) })] }) }));
            fireEvent.click(screen.getByText('New Tab'));
            expect(handleSelect).toHaveBeenCalled();
        });
    });
    describe('Checkbox Items', function () {
        it('renders checkbox items', function () {
            render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "View" }), _jsx(MenubarContent, { children: _jsx(MenubarCheckboxItem, { checked: true, children: "Show Bookmarks" }) })] }) }));
            expect(screen.getByText('Show Bookmarks')).toBeInTheDocument();
        });
    });
    describe('Radio Items', function () {
        it('renders radio items', function () {
            render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "Theme" }), _jsx(MenubarContent, { children: _jsxs(MenubarRadioGroup, { value: "light", children: [_jsx(MenubarRadioItem, { value: "light", children: "Light" }), _jsx(MenubarRadioItem, { value: "dark", children: "Dark" })] }) })] }) }));
            expect(screen.getByText('Light')).toBeInTheDocument();
            expect(screen.getByText('Dark')).toBeInTheDocument();
        });
    });
    describe('Labels and Separators', function () {
        it('renders labels', function () {
            render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "File" }), _jsxs(MenubarContent, { children: [_jsx(MenubarLabel, { children: "Actions" }), _jsx(MenubarItem, { children: "New Tab" })] })] }) }));
            expect(screen.getByText('Actions')).toBeInTheDocument();
        });
        it('renders separators', function () {
            var container = render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "File" }), _jsxs(MenubarContent, { children: [_jsx(MenubarItem, { children: "New Tab" }), _jsx(MenubarSeparator, {}), _jsx(MenubarItem, { children: "New Window" })] })] }) })).container;
            var separators = container.querySelectorAll('[role="separator"]');
            expect(separators.length).toBeGreaterThan(0);
        });
    });
    describe('Shortcuts', function () {
        it('renders shortcuts', function () {
            render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "File" }), _jsx(MenubarContent, { children: _jsxs(MenubarItem, { children: ["New Tab", _jsx(MenubarShortcut, { children: "\u2318T" })] }) })] }) }));
            expect(screen.getByText('⌘T')).toBeInTheDocument();
        });
    });
    describe('Disabled Items', function () {
        it('disables items', function () {
            render(_jsx(Menubar, { children: _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { children: "File" }), _jsx(MenubarContent, { children: _jsx(MenubarItem, { disabled: true, children: "New Tab" }) })] }) }));
            var item = screen.getByText('New Tab');
            expect(item).toHaveAttribute('data-disabled', 'true');
        });
    });
    describe('Accessibility', function () {
        it('has menubar role', function () {
            var container = render(_jsx(Menubar, { children: _jsx(MenubarMenu, { children: _jsx(MenubarTrigger, { children: "File" }) }) })).container;
            expect(container.firstChild).toHaveAttribute('role', 'menubar');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Menubar, { "aria-label": "Main menu", children: _jsx(MenubarMenu, { children: _jsx(MenubarTrigger, { children: "File" }) }) })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Main menu');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty menubar', function () {
            var container = render(_jsx(Menubar, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles many menus', function () {
            var menus = Array.from({ length: 5 }, function (_, i) { return (_jsxs(MenubarMenu, { children: [_jsxs(MenubarTrigger, { children: ["Menu ", i] }), _jsx(MenubarContent, { children: _jsxs(MenubarItem, { children: ["Item ", i] }) })] }, i)); });
            render(_jsx(Menubar, { children: menus }));
            expect(screen.getByText('Menu 0')).toBeInTheDocument();
            expect(screen.getByText('Menu 4')).toBeInTheDocument();
        });
    });
});
