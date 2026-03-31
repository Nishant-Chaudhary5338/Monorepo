import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
describe('Avatar', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default avatar', function () {
            var container = render(_jsx(Avatar, { children: _jsx(AvatarFallback, { children: "JD" }) })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot with image', function () {
            var container = render(_jsxs(Avatar, { children: [_jsx(AvatarImage, { src: "https://example.com/avatar.jpg", alt: "User avatar" }), _jsx(AvatarFallback, { children: "JD" })] })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for fallback only', function () {
            var container = render(_jsx(Avatar, { children: _jsx(AvatarFallback, { children: "AB" }) })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Avatar, { children: _jsx(AvatarFallback, { children: "JD" }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders children correctly', function () {
            render(_jsx(Avatar, { children: _jsx(AvatarFallback, { children: "JD" }) }));
            expect(screen.getByText('JD')).toBeInTheDocument();
        });
        it('renders avatar with custom className', function () {
            var container = render(_jsx(Avatar, { className: "custom-avatar", children: _jsx(AvatarFallback, { children: "JD" }) })).container;
            expect(container.firstChild).toHaveClass('custom-avatar');
        });
    });
    describe('AvatarImage', function () {
        it('renders image with correct src', function () {
            render(_jsx(Avatar, { children: _jsx(AvatarImage, { src: "https://example.com/avatar.jpg", alt: "User" }) }));
            var img = screen.getByRole('img');
            expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
        });
        it('renders image with correct alt text', function () {
            render(_jsx(Avatar, { children: _jsx(AvatarImage, { src: "https://example.com/avatar.jpg", alt: "John Doe" }) }));
            expect(screen.getByAltText('John Doe')).toBeInTheDocument();
        });
        it('applies custom className to image', function () {
            var container = render(_jsx(Avatar, { children: _jsx(AvatarImage, { src: "https://example.com/avatar.jpg", alt: "User", className: "custom-image" }) })).container;
            expect(container.querySelector('img')).toHaveClass('custom-image');
        });
    });
    describe('AvatarFallback', function () {
        it('renders fallback text', function () {
            render(_jsx(Avatar, { children: _jsx(AvatarFallback, { children: "AB" }) }));
            expect(screen.getByText('AB')).toBeInTheDocument();
        });
        it('applies custom className to fallback', function () {
            var container = render(_jsx(Avatar, { children: _jsx(AvatarFallback, { className: "custom-fallback", children: "JD" }) })).container;
            expect(container.querySelector('span')).toHaveClass('custom-fallback');
        });
        it('renders fallback with complex content', function () {
            render(_jsx(Avatar, { children: _jsx(AvatarFallback, { children: _jsx("span", { children: "User Icon" }) }) }));
            expect(screen.getByText('User Icon')).toBeInTheDocument();
        });
    });
    describe('Accessibility', function () {
        it('renders as a span element', function () {
            var _a;
            var container = render(_jsx(Avatar, { children: _jsx(AvatarFallback, { children: "JD" }) })).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('SPAN');
        });
        it('supports aria-label', function () {
            var container = render(_jsx(Avatar, { "aria-label": "User avatar", children: _jsx(AvatarFallback, { children: "JD" }) })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'User avatar');
        });
        it('supports role attribute', function () {
            var container = render(_jsx(Avatar, { role: "img", children: _jsx(AvatarFallback, { children: "JD" }) })).container;
            expect(container.firstChild).toHaveAttribute('role', 'img');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty fallback', function () {
            var container = render(_jsx(Avatar, { children: _jsx(AvatarFallback, {}) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles long fallback text', function () {
            render(_jsx(Avatar, { children: _jsx(AvatarFallback, { children: "VeryLongFallbackText" }) }));
            expect(screen.getByText('VeryLongFallbackText')).toBeInTheDocument();
        });
        it('handles multiple fallbacks', function () {
            render(_jsxs(Avatar, { children: [_jsx(AvatarFallback, { children: "First" }), _jsx(AvatarFallback, { children: "Second" })] }));
            expect(screen.getByText('First')).toBeInTheDocument();
            expect(screen.getByText('Second')).toBeInTheDocument();
        });
    });
});
