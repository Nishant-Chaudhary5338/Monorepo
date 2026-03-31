import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
describe('ToggleGroup', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default toggle group', function () {
            var container = render(_jsxs(ToggleGroup, { type: "single", children: [_jsx(ToggleGroupItem, { value: "a", children: "A" }), _jsx(ToggleGroupItem, { value: "b", children: "B" })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(ToggleGroup, { type: "single", children: _jsx(ToggleGroupItem, { value: "a", children: "A" }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders toggle items', function () {
            render(_jsxs(ToggleGroup, { type: "single", children: [_jsx(ToggleGroupItem, { value: "a", children: "A" }), _jsx(ToggleGroupItem, { value: "b", children: "B" })] }));
            expect(screen.getByText('A')).toBeInTheDocument();
            expect(screen.getByText('B')).toBeInTheDocument();
        });
    });
    describe('Single Selection', function () {
        it('allows single selection', function () {
            var container = render(_jsxs(ToggleGroup, { type: "single", defaultValue: "a", children: [_jsx(ToggleGroupItem, { value: "a", children: "A" }), _jsx(ToggleGroupItem, { value: "b", children: "B" })] })).container;
            var items = container.querySelectorAll('[data-state="on"]');
            expect(items).toHaveLength(1);
        });
        it('calls onValueChange for single selection', function () {
            var handleValueChange = vi.fn();
            render(_jsxs(ToggleGroup, { type: "single", onValueChange: handleValueChange, children: [_jsx(ToggleGroupItem, { value: "a", children: "A" }), _jsx(ToggleGroupItem, { value: "b", children: "B" })] }));
            fireEvent.click(screen.getByText('B'));
            expect(handleValueChange).toHaveBeenCalledWith('b');
        });
    });
    describe('Multiple Selection', function () {
        it('allows multiple selection', function () {
            var container = render(_jsxs(ToggleGroup, { type: "multiple", defaultValue: ["a", "b"], children: [_jsx(ToggleGroupItem, { value: "a", children: "A" }), _jsx(ToggleGroupItem, { value: "b", children: "B" }), _jsx(ToggleGroupItem, { value: "c", children: "C" })] })).container;
            var items = container.querySelectorAll('[data-state="on"]');
            expect(items).toHaveLength(2);
        });
        it('calls onValueChange for multiple selection', function () {
            var handleValueChange = vi.fn();
            render(_jsxs(ToggleGroup, { type: "multiple", onValueChange: handleValueChange, children: [_jsx(ToggleGroupItem, { value: "a", children: "A" }), _jsx(ToggleGroupItem, { value: "b", children: "B" })] }));
            fireEvent.click(screen.getByText('A'));
            expect(handleValueChange).toHaveBeenCalled();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(ToggleGroup, { type: "single", className: "custom-group", children: _jsx(ToggleGroupItem, { value: "a", children: "A" }) })).container;
            expect(container.firstChild).toHaveClass('custom-group');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(ToggleGroup, { type: "single", "data-testid": "my-toggle-group", children: _jsx(ToggleGroupItem, { value: "a", children: "A" }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-toggle-group');
        });
    });
    describe('Accessibility', function () {
        it('has group role', function () {
            var container = render(_jsx(ToggleGroup, { type: "single", children: _jsx(ToggleGroupItem, { value: "a", children: "A" }) })).container;
            expect(container.firstChild).toHaveAttribute('role', 'group');
        });
    });
});
