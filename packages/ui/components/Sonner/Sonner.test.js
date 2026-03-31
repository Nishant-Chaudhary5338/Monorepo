import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Toaster } from './Sonner';
describe('Sonner', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default toaster', function () {
            var container = render(_jsx(Toaster, {})).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Toaster, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as sonner-toaster element', function () {
            var container = render(_jsx(Toaster, {})).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Toaster, { className: "custom-toaster" })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveClass('custom-toaster');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Toaster, { "data-testid": "my-toaster" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-toaster');
        });
    });
    describe('Position', function () {
        it('applies position prop', function () {
            var container = render(_jsx(Toaster, { position: "top-right" })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-position', 'top-right');
        });
        it('applies bottom-right position by default', function () {
            var container = render(_jsx(Toaster, {})).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-position', 'bottom-right');
        });
    });
    describe('Theme', function () {
        it('applies theme prop', function () {
            var container = render(_jsx(Toaster, { theme: "dark" })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-theme', 'dark');
        });
        it('applies light theme by default', function () {
            var container = render(_jsx(Toaster, {})).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-theme', 'light');
        });
    });
    describe('Rich Colors', function () {
        it('applies richColors prop', function () {
            var container = render(_jsx(Toaster, { richColors: true })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-rich-colors', 'true');
        });
    });
    describe('Expand', function () {
        it('applies expand prop', function () {
            var container = render(_jsx(Toaster, { expand: true })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-expand', 'true');
        });
    });
    describe('Visible Toasts', function () {
        it('applies visibleToasts prop', function () {
            var container = render(_jsx(Toaster, { visibleToasts: 5 })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-visible-toasts', '5');
        });
        it('applies 3 visible toasts by default', function () {
            var container = render(_jsx(Toaster, {})).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-visible-toasts', '3');
        });
    });
    describe('Close Button', function () {
        it('applies closeButton prop', function () {
            var container = render(_jsx(Toaster, { closeButton: true })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-close-button', 'true');
        });
    });
    describe('Duration', function () {
        it('applies duration prop', function () {
            var container = render(_jsx(Toaster, { duration: 5000 })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    describe('Gap', function () {
        it('applies gap prop', function () {
            var container = render(_jsx(Toaster, { gap: 16 })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-gap', '16');
        });
    });
    describe('Offset', function () {
        it('applies offset prop', function () {
            var container = render(_jsx(Toaster, { offset: 32 })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-offset', '32');
        });
    });
    describe('Dir', function () {
        it('applies dir prop', function () {
            var container = render(_jsx(Toaster, { dir: "rtl" })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('dir', 'rtl');
        });
    });
    describe('Style', function () {
        it('applies style prop', function () {
            var container = render(_jsx(Toaster, { style: { '--normal-bg': 'red' } })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    describe('Toast Options', function () {
        it('applies toastOptions prop', function () {
            var container = render(_jsx(Toaster, { toastOptions: {
                    className: 'custom-toast',
                    duration: 3000,
                } })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    describe('Edge Cases', function () {
        it('handles empty toaster', function () {
            var container = render(_jsx(Toaster, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles multiple props', function () {
            var container = render(_jsx(Toaster, { position: "top-left", theme: "dark", richColors: true, expand: true, visibleToasts: 5, closeButton: true, duration: 5000, gap: 16, offset: 32 })).container;
            var toaster = container.querySelector('[data-sonner-toaster]');
            expect(toaster).toHaveAttribute('data-position', 'top-left');
            expect(toaster).toHaveAttribute('data-theme', 'dark');
            expect(toaster).toHaveAttribute('data-rich-colors', 'true');
            expect(toaster).toHaveAttribute('data-expand', 'true');
            expect(toaster).toHaveAttribute('data-visible-toasts', '5');
            expect(toaster).toHaveAttribute('data-close-button', 'true');
            expect(toaster).toHaveAttribute('data-gap', '16');
            expect(toaster).toHaveAttribute('data-offset', '32');
        });
    });
});
