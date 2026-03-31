import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';
describe('Skeleton', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default skeleton', function () {
            var container = render(_jsx(Skeleton, {})).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for skeleton with custom dimensions', function () {
            var container = render(_jsx(Skeleton, { className: "w-48 h-4" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Skeleton, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsx(Skeleton, {})).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Skeleton, { className: "custom-skeleton" })).container;
            expect(container.firstChild).toHaveClass('custom-skeleton');
        });
        it('applies custom dimensions', function () {
            var container = render(_jsx(Skeleton, { className: "w-20 h-10" })).container;
            expect(container.firstChild).toHaveClass('h-10');
            expect(container.firstChild).toHaveClass('w-20');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Skeleton, { "data-testid": "my-skeleton", "aria-label": "Loading" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-skeleton');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Loading');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty skeleton', function () {
            var container = render(_jsx(Skeleton, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('applies animate-pulse class', function () {
            var container = render(_jsx(Skeleton, {})).container;
            expect(container.firstChild).toHaveClass('animate-pulse');
        });
        it('applies rounded-md class', function () {
            var container = render(_jsx(Skeleton, {})).container;
            expect(container.firstChild).toHaveClass('rounded-md');
        });
    });
});
