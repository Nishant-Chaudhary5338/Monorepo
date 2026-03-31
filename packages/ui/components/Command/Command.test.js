import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, } from './Command';
describe('Command', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default command', function () {
            var container = render(_jsxs(Command, { children: [_jsx(CommandInput, { placeholder: "Type a command..." }), _jsxs(CommandList, { children: [_jsx(CommandEmpty, { children: "No results found." }), _jsxs(CommandGroup, { heading: "Suggestions", children: [_jsx(CommandItem, { children: "Calendar" }), _jsx(CommandItem, { children: "Search" })] })] })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsxs(Command, { children: [_jsx(CommandInput, { placeholder: "Type a command..." }), _jsx(CommandList, { children: _jsx(CommandEmpty, { children: "No results found." }) })] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders input', function () {
            render(_jsx(Command, { children: _jsx(CommandInput, { placeholder: "Search..." }) }));
            expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
        });
        it('renders command items', function () {
            render(_jsx(Command, { children: _jsx(CommandList, { children: _jsxs(CommandGroup, { children: [_jsx(CommandItem, { children: "Calendar" }), _jsx(CommandItem, { children: "Search" })] }) }) }));
            expect(screen.getByText('Calendar')).toBeInTheDocument();
            expect(screen.getByText('Search')).toBeInTheDocument();
        });
        it('renders empty state', function () {
            render(_jsx(Command, { children: _jsx(CommandList, { children: _jsx(CommandEmpty, { children: "No results found." }) }) }));
            expect(screen.getByText('No results found.')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Command, { className: "custom-command", children: _jsx(CommandInput, {}) })).container;
            expect(container.firstChild).toHaveClass('custom-command');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Command, { "data-testid": "my-command", children: _jsx(CommandInput, {}) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-command');
        });
    });
    describe('Input', function () {
        it('handles input changes', function () {
            var handleValueChange = vi.fn();
            render(_jsx(Command, { children: _jsx(CommandInput, { onValueChange: handleValueChange }) }));
            var input = screen.getByRole('combobox');
            fireEvent.change(input, { target: { value: 'test' } });
            expect(handleValueChange).toHaveBeenCalledWith('test');
        });
        it('applies placeholder', function () {
            render(_jsx(Command, { children: _jsx(CommandInput, { placeholder: "Enter command" }) }));
            expect(screen.getByPlaceholderText('Enter command')).toBeInTheDocument();
        });
    });
    describe('Groups', function () {
        it('renders group heading', function () {
            render(_jsx(Command, { children: _jsx(CommandList, { children: _jsx(CommandGroup, { heading: "Actions", children: _jsx(CommandItem, { children: "Action 1" }) }) }) }));
            expect(screen.getByText('Actions')).toBeInTheDocument();
        });
    });
    describe('Items', function () {
        it('renders item with shortcut', function () {
            render(_jsx(Command, { children: _jsx(CommandList, { children: _jsx(CommandGroup, { children: _jsxs(CommandItem, { children: ["Calendar", _jsx(CommandShortcut, { children: "\u2318K" })] }) }) }) }));
            expect(screen.getByText('⌘K')).toBeInTheDocument();
        });
        it('handles item selection', function () {
            var handleSelect = vi.fn();
            render(_jsx(Command, { children: _jsx(CommandList, { children: _jsx(CommandGroup, { children: _jsx(CommandItem, { onSelect: handleSelect, children: "Calendar" }) }) }) }));
            fireEvent.click(screen.getByText('Calendar'));
            expect(handleSelect).toHaveBeenCalled();
        });
    });
    describe('Separator', function () {
        it('renders separator', function () {
            var container = render(_jsx(Command, { children: _jsxs(CommandList, { children: [_jsx(CommandGroup, { children: _jsx(CommandItem, { children: "Item 1" }) }), _jsx(CommandSeparator, {}), _jsx(CommandGroup, { children: _jsx(CommandItem, { children: "Item 2" }) })] }) })).container;
            var separators = container.querySelectorAll('[role="separator"]');
            expect(separators.length).toBeGreaterThan(0);
        });
    });
    describe('Accessibility', function () {
        it('input has combobox role', function () {
            render(_jsx(Command, { children: _jsx(CommandInput, {}) }));
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Command, { "aria-label": "Command palette", children: _jsx(CommandInput, {}) })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Command palette');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty command', function () {
            var container = render(_jsx(Command, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles many items', function () {
            var items = Array.from({ length: 20 }, function (_, i) { return (_jsxs(CommandItem, { children: ["Item ", i] }, i)); });
            render(_jsx(Command, { children: _jsx(CommandList, { children: _jsx(CommandGroup, { children: items }) }) }));
            expect(screen.getByText('Item 0')).toBeInTheDocument();
            expect(screen.getByText('Item 19')).toBeInTheDocument();
        });
    });
});
