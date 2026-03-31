import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter, } from './Table';
describe('Table', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for basic table', function () {
            var container = render(_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Name" }), _jsx(TableHead, { children: "Email" })] }) }), _jsx(TableBody, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "John Doe" }), _jsx(TableCell, { children: "john@example.com" })] }) })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for table with caption', function () {
            var container = render(_jsxs(Table, { children: [_jsx(TableCaption, { children: "User List" }), _jsx(TableHeader, { children: _jsx(TableRow, { children: _jsx(TableHead, { children: "Name" }) }) }), _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "John" }) }) })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for table with footer', function () {
            var container = render(_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Item" }), _jsx(TableHead, { children: "Price" })] }) }), _jsx(TableBody, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Product" }), _jsx(TableCell, { children: "$100" })] }) }), _jsx(TableFooter, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Total" }), _jsx(TableCell, { children: "$100" })] }) })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Table, { children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Test" }) }) }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as table element', function () {
            var container = render(_jsx(Table, { children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Test" }) }) }) })).container;
            var table = container.querySelector('table');
            expect(table).toBeInTheDocument();
        });
        it('renders table header', function () {
            render(_jsx(Table, { children: _jsx(TableHeader, { children: _jsx(TableRow, { children: _jsx(TableHead, { children: "Header" }) }) }) }));
            expect(screen.getByText('Header')).toBeInTheDocument();
        });
        it('renders table body', function () {
            render(_jsx(Table, { children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Body Content" }) }) }) }));
            expect(screen.getByText('Body Content')).toBeInTheDocument();
        });
        it('renders table caption', function () {
            render(_jsxs(Table, { children: [_jsx(TableCaption, { children: "Table Caption" }), _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Content" }) }) })] }));
            expect(screen.getByText('Table Caption')).toBeInTheDocument();
        });
        it('renders table footer', function () {
            render(_jsx(Table, { children: _jsx(TableFooter, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Footer Content" }) }) }) }));
            expect(screen.getByText('Footer Content')).toBeInTheDocument();
        });
    });
    describe('Table Structure', function () {
        it('renders multiple rows', function () {
            render(_jsx(Table, { children: _jsxs(TableBody, { children: [_jsx(TableRow, { children: _jsx(TableCell, { children: "Row 1" }) }), _jsx(TableRow, { children: _jsx(TableCell, { children: "Row 2" }) }), _jsx(TableRow, { children: _jsx(TableCell, { children: "Row 3" }) })] }) }));
            expect(screen.getByText('Row 1')).toBeInTheDocument();
            expect(screen.getByText('Row 2')).toBeInTheDocument();
            expect(screen.getByText('Row 3')).toBeInTheDocument();
        });
        it('renders multiple columns', function () {
            render(_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Col 1" }), _jsx(TableHead, { children: "Col 2" }), _jsx(TableHead, { children: "Col 3" })] }) }), _jsx(TableBody, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "A" }), _jsx(TableCell, { children: "B" }), _jsx(TableCell, { children: "C" })] }) })] }));
            expect(screen.getByText('Col 1')).toBeInTheDocument();
            expect(screen.getByText('Col 2')).toBeInTheDocument();
            expect(screen.getByText('Col 3')).toBeInTheDocument();
            expect(screen.getByText('A')).toBeInTheDocument();
            expect(screen.getByText('B')).toBeInTheDocument();
            expect(screen.getByText('C')).toBeInTheDocument();
        });
        it('renders complete table structure', function () {
            render(_jsxs(Table, { children: [_jsx(TableCaption, { children: "Users Table" }), _jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Name" }), _jsx(TableHead, { children: "Email" })] }) }), _jsxs(TableBody, { children: [_jsxs(TableRow, { children: [_jsx(TableCell, { children: "John" }), _jsx(TableCell, { children: "john@test.com" })] }), _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Jane" }), _jsx(TableCell, { children: "jane@test.com" })] })] }), _jsx(TableFooter, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Total" }), _jsx(TableCell, { children: "2 users" })] }) })] }));
            expect(screen.getByText('Users Table')).toBeInTheDocument();
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('John')).toBeInTheDocument();
            expect(screen.getByText('Jane')).toBeInTheDocument();
            expect(screen.getByText('Total')).toBeInTheDocument();
            expect(screen.getByText('2 users')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to table', function () {
            var container = render(_jsx(Table, { className: "custom-table", children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Test" }) }) }) })).container;
            var table = container.querySelector('table');
            expect(table).toHaveClass('custom-table');
        });
        it('applies custom className to header', function () {
            var container = render(_jsx(Table, { children: _jsx(TableHeader, { className: "custom-header", children: _jsx(TableRow, { children: _jsx(TableHead, { children: "Header" }) }) }) })).container;
            expect(container.querySelector('thead')).toHaveClass('custom-header');
        });
        it('applies custom className to body', function () {
            var container = render(_jsx(Table, { children: _jsx(TableBody, { className: "custom-body", children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Body" }) }) }) })).container;
            expect(container.querySelector('tbody')).toHaveClass('custom-body');
        });
        it('applies custom className to row', function () {
            var container = render(_jsx(Table, { children: _jsx(TableBody, { children: _jsx(TableRow, { className: "custom-row", children: _jsx(TableCell, { children: "Cell" }) }) }) })).container;
            expect(container.querySelector('tr')).toHaveClass('custom-row');
        });
        it('applies custom className to header cell', function () {
            var container = render(_jsx(Table, { children: _jsx(TableHeader, { children: _jsx(TableRow, { children: _jsx(TableHead, { className: "custom-head", children: "Header" }) }) }) })).container;
            expect(container.querySelector('th')).toHaveClass('custom-head');
        });
        it('applies custom className to cell', function () {
            var container = render(_jsx(Table, { children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { className: "custom-cell", children: "Cell" }) }) }) })).container;
            expect(container.querySelector('td')).toHaveClass('custom-cell');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Table, { "data-testid": "my-table", "aria-label": "Data table", children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Test" }) }) }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-table');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Data table');
        });
    });
    describe('Accessibility', function () {
        it('table has correct role', function () {
            var container = render(_jsx(Table, { children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Test" }) }) }) })).container;
            var table = container.querySelector('table');
            expect(table === null || table === void 0 ? void 0 : table.nodeName).toBe('TABLE');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Table, { "aria-label": "User data", children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Test" }) }) }) })).container;
            var table = container.querySelector('table');
            expect(table).toHaveAttribute('aria-label', 'User data');
        });
        it('supports aria-describedby', function () {
            var container = render(_jsx(Table, { "aria-describedby": "table-description", children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: "Test" }) }) }) })).container;
            var table = container.querySelector('table');
            expect(table).toHaveAttribute('aria-describedby', 'table-description');
        });
        it('header cells have correct scope', function () {
            var container = render(_jsx(Table, { children: _jsx(TableHeader, { children: _jsx(TableRow, { children: _jsx(TableHead, { scope: "col", children: "Column Header" }) }) }) })).container;
            var th = container.querySelector('th');
            expect(th).toHaveAttribute('scope', 'col');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty table', function () {
            var container = render(_jsx(Table, { children: _jsx(TableBody, {}) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles table with only header', function () {
            render(_jsx(Table, { children: _jsx(TableHeader, { children: _jsx(TableRow, { children: _jsx(TableHead, { children: "Header Only" }) }) }) }));
            expect(screen.getByText('Header Only')).toBeInTheDocument();
        });
        it('handles table with complex cell content', function () {
            render(_jsx(Table, { children: _jsx(TableBody, { children: _jsx(TableRow, { children: _jsx(TableCell, { children: _jsxs("div", { children: [_jsx("span", { children: "Nested" }), _jsx("span", { children: "Content" })] }) }) }) }) }));
            expect(screen.getByText('Nested')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('handles table with many rows', function () {
            var rows = Array.from({ length: 10 }, function (_, i) { return (_jsx(TableRow, { children: _jsxs(TableCell, { children: ["Row ", i + 1] }) }, i)); });
            render(_jsx(Table, { children: _jsx(TableBody, { children: rows }) }));
            expect(screen.getByText('Row 1')).toBeInTheDocument();
            expect(screen.getByText('Row 10')).toBeInTheDocument();
        });
        it('handles table with many columns', function () {
            var headers = Array.from({ length: 5 }, function (_, i) { return (_jsxs(TableHead, { children: ["Col ", i + 1] }, i)); });
            var cells = Array.from({ length: 5 }, function (_, i) { return (_jsxs(TableCell, { children: ["Cell ", i + 1] }, i)); });
            render(_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsx(TableRow, { children: headers }) }), _jsx(TableBody, { children: _jsx(TableRow, { children: cells }) })] }));
            expect(screen.getByText('Col 1')).toBeInTheDocument();
            expect(screen.getByText('Col 5')).toBeInTheDocument();
            expect(screen.getByText('Cell 1')).toBeInTheDocument();
            expect(screen.getByText('Cell 5')).toBeInTheDocument();
        });
    });
});
