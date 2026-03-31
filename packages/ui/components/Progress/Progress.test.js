import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Progress } from './Progress';
describe('Progress', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default progress', function () {
            var container = render(_jsx(Progress, {})).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for progress with value', function () {
            var container = render(_jsx(Progress, { value: 50 })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for complete progress', function () {
            var container = render(_jsx(Progress, { value: 100 })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Progress, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsx(Progress, {})).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
        it('renders indicator element', function () {
            var container = render(_jsx(Progress, { value: 50 })).container;
            var indicator = container.querySelector('[data-state]');
            expect(indicator).toBeInTheDocument();
        });
    });
    describe('Value', function () {
        it('applies value correctly', function () {
            var container = render(_jsx(Progress, { value: 75 })).container;
            var indicator = container.querySelector('[data-state]');
            expect(indicator).toHaveStyle('transform: translateX(-25%)');
        });
        it('handles 0 value', function () {
            var container = render(_jsx(Progress, { value: 0 })).container;
            var indicator = container.querySelector('[data-state]');
            expect(indicator).toHaveStyle('transform: translateX(-100%)');
        });
        it('handles 100 value', function () {
            var container = render(_jsx(Progress, { value: 100 })).container;
            var indicator = container.querySelector('[data-state]');
            expect(indicator).toHaveStyle('transform: translateX(-0%)');
        });
        it('handles undefined value', function () {
            var container = render(_jsx(Progress, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Progress, { className: "custom-progress" })).container;
            expect(container.firstChild).toHaveClass('custom-progress');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Progress, { "data-testid": "my-progress", "aria-label": "Loading progress" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-progress');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Loading progress');
        });
    });
    describe('Accessibility', function () {
        it('has progressbar role', function () {
            var container = render(_jsx(Progress, { value: 50 })).container;
            expect(container.firstChild).toHaveAttribute('role', 'progressbar');
        });
        it('supports aria-valuenow', function () {
            var container = render(_jsx(Progress, { value: 50 })).container;
            expect(container.firstChild).toHaveAttribute('aria-valuenow', '50');
        });
        it('supports aria-valuemin', function () {
            var container = render(_jsx(Progress, { value: 50 })).container;
            expect(container.firstChild).toHaveAttribute('aria-valuemin', '0');
        });
        it('supports aria-valuemax', function () {
            var container = render(_jsx(Progress, { value: 50 })).container;
            expect(container.firstChild).toHaveAttribute('aria-valuemax', '100');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Progress, { "aria-label": "Upload progress" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Upload progress');
        });
    });
    describe('Edge Cases', function () {
        it('handles negative value', function () {
            var container = render(_jsx(Progress, { value: -10 })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles value over 100', function () {
            var container = render(_jsx(Progress, { value: 150 })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles decimal value', function () {
            var container = render(_jsx(Progress, { value: 33.33 })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
