import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from './Calendar';
describe('Calendar', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default calendar', function () {
            var container = render(_jsx(Calendar, { mode: "single" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for calendar with selected date', function () {
            var container = render(_jsx(Calendar, { mode: "single", selected: new Date(2024, 0, 15) })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Calendar, { mode: "single" })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsx(Calendar, { mode: "single" })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
        it('renders month and year', function () {
            render(_jsx(Calendar, { mode: "single", month: new Date(2024, 0, 1) }));
            expect(screen.getByText('January 2024')).toBeInTheDocument();
        });
        it('renders day names', function () {
            render(_jsx(Calendar, { mode: "single" }));
            expect(screen.getByText('Mo')).toBeInTheDocument();
            expect(screen.getByText('Tu')).toBeInTheDocument();
            expect(screen.getByText('We')).toBeInTheDocument();
        });
    });
    describe('Navigation', function () {
        it('navigates to next month', function () {
            render(_jsx(Calendar, { mode: "single", month: new Date(2024, 0, 1) }));
            var nextButton = screen.getByRole('button', { name: /next/i });
            fireEvent.click(nextButton);
            expect(screen.getByText('February 2024')).toBeInTheDocument();
        });
        it('navigates to previous month', function () {
            render(_jsx(Calendar, { mode: "single", month: new Date(2024, 0, 1) }));
            var prevButton = screen.getByRole('button', { name: /previous/i });
            fireEvent.click(prevButton);
            expect(screen.getByText('December 2023')).toBeInTheDocument();
        });
    });
    describe('Date Selection', function () {
        it('selects a date when clicked', function () {
            var handleSelect = vi.fn();
            render(_jsx(Calendar, { mode: "single", onSelect: handleSelect }));
            var dayButton = screen.getByText('15');
            fireEvent.click(dayButton);
            expect(handleSelect).toHaveBeenCalled();
        });
        it('highlights selected date', function () {
            var selectedDate = new Date(2024, 0, 15);
            var container = render(_jsx(Calendar, { mode: "single", selected: selectedDate })).container;
            var selectedDay = container.querySelector('[aria-selected="true"]');
            expect(selectedDay).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Calendar, { mode: "single", className: "custom-calendar" })).container;
            expect(container.firstChild).toHaveClass('custom-calendar');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Calendar, { mode: "single", "data-testid": "my-calendar" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-calendar');
        });
    });
    describe('Disabled Dates', function () {
        it('disables specific dates', function () {
            var disabledDate = new Date(2024, 0, 15);
            render(_jsx(Calendar, { mode: "single", disabled: [disabledDate] }));
            var dayButton = screen.getByText('15');
            expect(dayButton).toHaveAttribute('disabled');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty calendar', function () {
            var container = render(_jsx(Calendar, { mode: "single" })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles different months', function () {
            render(_jsx(Calendar, { mode: "single", month: new Date(2024, 11, 1) }));
            expect(screen.getByText('December 2024')).toBeInTheDocument();
        });
    });
});
