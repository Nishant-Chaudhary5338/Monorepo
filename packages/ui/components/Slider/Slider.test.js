import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';
describe('Slider', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default slider', function () {
            var container = render(_jsx(Slider, {})).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for slider with value', function () {
            var container = render(_jsx(Slider, { defaultValue: [50] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for range slider', function () {
            var container = render(_jsx(Slider, { defaultValue: [25, 75] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Slider, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsx(Slider, {})).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
        it('renders track element', function () {
            var container = render(_jsx(Slider, {})).container;
            var track = container.querySelector('[data-orientation]');
            expect(track).toBeInTheDocument();
        });
        it('renders thumb element', function () {
            var container = render(_jsx(Slider, { defaultValue: [50] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toBeInTheDocument();
        });
    });
    describe('Value', function () {
        it('applies default value correctly', function () {
            var container = render(_jsx(Slider, { defaultValue: [50] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toHaveAttribute('aria-valuenow', '50');
        });
        it('handles multiple values for range', function () {
            var container = render(_jsx(Slider, { defaultValue: [25, 75] })).container;
            var thumbs = container.querySelectorAll('[role="slider"]');
            expect(thumbs).toHaveLength(2);
        });
        it('handles undefined value', function () {
            var container = render(_jsx(Slider, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Slider, { className: "custom-slider" })).container;
            expect(container.firstChild).toHaveClass('custom-slider');
        });
        it('applies min prop', function () {
            var container = render(_jsx(Slider, { min: 0, defaultValue: [50] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toHaveAttribute('aria-valuemin', '0');
        });
        it('applies max prop', function () {
            var container = render(_jsx(Slider, { max: 200, defaultValue: [50] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toHaveAttribute('aria-valuemax', '200');
        });
        it('applies step prop', function () {
            var container = render(_jsx(Slider, { step: 10, defaultValue: [50] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Slider, { "data-testid": "my-slider", "aria-label": "Volume" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-slider');
        });
    });
    describe('Interactions', function () {
        it('calls onValueChange when value changes', function () {
            var handleValueChange = vi.fn();
            var container = render(_jsx(Slider, { onValueChange: handleValueChange, defaultValue: [50] })).container;
            var thumb = container.querySelector('[role="slider"]');
            if (thumb) {
                fireEvent.keyDown(thumb, { key: 'ArrowRight' });
            }
            expect(handleValueChange).toHaveBeenCalled();
        });
    });
    describe('Disabled State', function () {
        it('applies disabled attribute', function () {
            var container = render(_jsx(Slider, { disabled: true })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toHaveAttribute('data-disabled', '');
        });
    });
    describe('Accessibility', function () {
        it('has slider role', function () {
            var container = render(_jsx(Slider, { defaultValue: [50] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toBeInTheDocument();
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Slider, { "aria-label": "Brightness" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Brightness');
        });
        it('thumb has aria-valuenow', function () {
            var container = render(_jsx(Slider, { defaultValue: [50] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toHaveAttribute('aria-valuenow', '50');
        });
        it('thumb has aria-valuemin', function () {
            var container = render(_jsx(Slider, { min: 0, defaultValue: [50] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toHaveAttribute('aria-valuemin', '0');
        });
        it('thumb has aria-valuemax', function () {
            var container = render(_jsx(Slider, { max: 100, defaultValue: [50] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toHaveAttribute('aria-valuemax', '100');
        });
    });
    describe('Orientation', function () {
        it('applies horizontal orientation by default', function () {
            var container = render(_jsx(Slider, {})).container;
            var track = container.querySelector('[data-orientation]');
            expect(track).toHaveAttribute('data-orientation', 'horizontal');
        });
        it('applies vertical orientation', function () {
            var container = render(_jsx(Slider, { orientation: "vertical" })).container;
            var track = container.querySelector('[data-orientation]');
            expect(track).toHaveAttribute('data-orientation', 'vertical');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty slider', function () {
            var container = render(_jsx(Slider, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles value at min', function () {
            var container = render(_jsx(Slider, { min: 0, defaultValue: [0] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toHaveAttribute('aria-valuenow', '0');
        });
        it('handles value at max', function () {
            var container = render(_jsx(Slider, { max: 100, defaultValue: [100] })).container;
            var thumb = container.querySelector('[role="slider"]');
            expect(thumb).toHaveAttribute('aria-valuenow', '100');
        });
    });
});
