import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from './Separator';
describe('Separator', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for horizontal separator', function () {
            var container = render(_jsx(Separator, {})).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for vertical separator', function () {
            var container = render(_jsx(Separator, { orientation: "vertical" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for decorative separator', function () {
            var container = render(_jsx(Separator, { decorative: true })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Separator, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsx(Separator, {})).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
        it('renders horizontal separator by default', function () {
            var container = render(_jsx(Separator, {})).container;
            expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal');
        });
        it('renders vertical separator', function () {
            var container = render(_jsx(Separator, { orientation: "vertical" })).container;
            expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Separator, { className: "custom-separator" })).container;
            expect(container.firstChild).toHaveClass('custom-separator');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Separator, { "data-testid": "my-separator", role: "separator" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-separator');
        });
    });
    describe('Accessibility', function () {
        it('has separator role', function () {
            var container = render(_jsx(Separator, {})).container;
            expect(container.firstChild).toHaveAttribute('role', 'separator');
        });
        it('supports aria-orientation', function () {
            var container = render(_jsx(Separator, { orientation: "vertical" })).container;
            expect(container.firstChild).toHaveAttribute('aria-orientation', 'vertical');
        });
        it('decorative separator has aria-hidden', function () {
            var container = render(_jsx(Separator, { decorative: true })).container;
            expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
        });
    });
    describe('Edge Cases', function () {
        it('handles horizontal orientation', function () {
            var container = render(_jsx(Separator, { orientation: "horizontal" })).container;
            expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal');
        });
        it('handles vertical orientation', function () {
            var container = render(_jsx(Separator, { orientation: "vertical" })).container;
            expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical');
        });
    });
});
