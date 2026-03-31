import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AspectRatio } from './AspectRatio';
describe('AspectRatio', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default aspect ratio', function () {
            var container = render(_jsx(AspectRatio, { ratio: 16 / 9, children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for square aspect ratio', function () {
            var container = render(_jsx(AspectRatio, { ratio: 1, children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(AspectRatio, { ratio: 16 / 9, children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders children correctly', function () {
            render(_jsx(AspectRatio, { ratio: 16 / 9, children: _jsx("img", { src: "/test.jpg", alt: "Test image" }) }));
            expect(screen.getByAltText('Test image')).toBeInTheDocument();
        });
        it('renders as div element', function () {
            var _a;
            var container = render(_jsx(AspectRatio, { ratio: 16 / 9, children: _jsx("div", { children: "Content" }) })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('DIV');
        });
    });
    describe('Ratio', function () {
        it('applies 16:9 ratio correctly', function () {
            var container = render(_jsx(AspectRatio, { ratio: 16 / 9, children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            var wrapper = container.firstChild;
            expect(wrapper.style.paddingBottom).toBe('56.25%');
        });
        it('applies 1:1 ratio correctly', function () {
            var container = render(_jsx(AspectRatio, { ratio: 1, children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            var wrapper = container.firstChild;
            expect(wrapper.style.paddingBottom).toBe('100%');
        });
        it('applies 4:3 ratio correctly', function () {
            var container = render(_jsx(AspectRatio, { ratio: 4 / 3, children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            var wrapper = container.firstChild;
            expect(wrapper.style.paddingBottom).toBe('75%');
        });
        it('applies custom ratio', function () {
            var container = render(_jsx(AspectRatio, { ratio: 2, children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            var wrapper = container.firstChild;
            expect(wrapper.style.paddingBottom).toBe('50%');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(AspectRatio, { ratio: 16 / 9, className: "custom-aspect", children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            expect(container.firstChild).toHaveClass('custom-aspect');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(AspectRatio, { ratio: 16 / 9, "data-testid": "my-aspect-ratio", children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-aspect-ratio');
        });
    });
    describe('Overflow', function () {
        it('has overflow-hidden class', function () {
            var container = render(_jsx(AspectRatio, { ratio: 16 / 9, children: _jsx("img", { src: "/test.jpg", alt: "Test" }) })).container;
            expect(container.firstChild).toHaveClass('overflow-hidden');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty aspect ratio', function () {
            var container = render(_jsx(AspectRatio, { ratio: 16 / 9, children: _jsx("div", {}) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex children', function () {
            render(_jsx(AspectRatio, { ratio: 16 / 9, children: _jsxs("div", { children: [_jsx("h2", { children: "Title" }), _jsx("p", { children: "Description" }), _jsx("button", { children: "Action" })] }) }));
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
        it('handles image with fill', function () {
            var container = render(_jsx(AspectRatio, { ratio: 16 / 9, children: _jsx("img", { src: "/test.jpg", alt: "Test", style: { objectFit: 'cover', width: '100%', height: '100%' } }) })).container;
            var img = screen.getByAltText('Test');
            expect(img).toHaveStyle({ objectFit: 'cover' });
        });
    });
});
