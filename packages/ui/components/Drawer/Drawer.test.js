import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from './Drawer';
describe('Drawer', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default drawer', function () {
            var container = render(_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { children: "Open" }), _jsxs(DrawerContent, { children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Drawer Title" }), _jsx(DrawerDescription, { children: "Drawer description" })] }), _jsx(DrawerFooter, { children: _jsx(DrawerClose, { children: "Close" }) })] })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders trigger successfully', function () {
            var container = render(_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { children: "Open Drawer" }), _jsx(DrawerContent, { children: _jsx(DrawerTitle, { children: "Drawer Title" }) })] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger text', function () {
            render(_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { children: "Open Drawer" }), _jsx(DrawerContent, { children: _jsx(DrawerTitle, { children: "Drawer Title" }) })] }));
            expect(screen.getByText('Open Drawer')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className to trigger', function () {
            var container = render(_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { className: "custom-trigger", children: "Open" }), _jsx(DrawerContent, { children: _jsx(DrawerTitle, { children: "Drawer Title" }) })] })).container;
            var trigger = container.querySelector('[data-state]');
            expect(trigger).toHaveClass('custom-trigger');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { "data-testid": "my-drawer", children: "Open" }), _jsx(DrawerContent, { children: _jsx(DrawerTitle, { children: "Drawer Title" }) })] })).container;
            expect(screen.getByTestId('my-drawer')).toBeInTheDocument();
        });
    });
    describe('Header', function () {
        it('renders drawer title', function () {
            render(_jsx(Drawer, { open: true, children: _jsx(DrawerContent, { children: _jsx(DrawerHeader, { children: _jsx(DrawerTitle, { children: "My Drawer" }) }) }) }));
            expect(screen.getByText('My Drawer')).toBeInTheDocument();
        });
        it('renders drawer description', function () {
            render(_jsx(Drawer, { open: true, children: _jsx(DrawerContent, { children: _jsx(DrawerHeader, { children: _jsx(DrawerDescription, { children: "This is a description" }) }) }) }));
            expect(screen.getByText('This is a description')).toBeInTheDocument();
        });
    });
    describe('Footer', function () {
        it('renders footer content', function () {
            render(_jsx(Drawer, { open: true, children: _jsx(DrawerContent, { children: _jsx(DrawerFooter, { children: _jsx("button", { children: "Action" }) }) }) }));
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });
    describe('Close', function () {
        it('renders close button', function () {
            render(_jsx(Drawer, { open: true, children: _jsx(DrawerContent, { children: _jsx(DrawerClose, { children: "Close" }) }) }));
            expect(screen.getByText('Close')).toBeInTheDocument();
        });
        it('calls onClose when close is clicked', function () {
            var handleClose = vi.fn();
            render(_jsx(Drawer, { open: true, onClose: handleClose, children: _jsx(DrawerContent, { children: _jsx(DrawerClose, { children: "Close" }) }) }));
            fireEvent.click(screen.getByText('Close'));
            expect(handleClose).toHaveBeenCalled();
        });
    });
    describe('Controlled State', function () {
        it('respects open prop', function () {
            render(_jsx(Drawer, { open: true, children: _jsx(DrawerContent, { children: _jsx(DrawerTitle, { children: "Open Drawer" }) }) }));
            expect(screen.getByText('Open Drawer')).toBeInTheDocument();
        });
        it('does not show content when open is false', function () {
            render(_jsx(Drawer, { open: false, children: _jsx(DrawerContent, { children: _jsx(DrawerTitle, { children: "Hidden Drawer" }) }) }));
            expect(screen.queryByText('Hidden Drawer')).not.toBeInTheDocument();
        });
    });
    describe('Accessibility', function () {
        it('dialog has correct role', function () {
            render(_jsx(Drawer, { open: true, children: _jsx(DrawerContent, { children: _jsx(DrawerTitle, { children: "Accessible Drawer" }) }) }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('supports aria-label', function () {
            render(_jsx(Drawer, { open: true, children: _jsx(DrawerContent, { "aria-label": "Drawer panel", children: _jsx(DrawerTitle, { children: "Drawer" }) }) }));
            var dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-label', 'Drawer panel');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty drawer', function () {
            var container = render(_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { children: "Open" }), _jsx(DrawerContent, {})] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles complex content', function () {
            render(_jsx(Drawer, { open: true, children: _jsxs(DrawerContent, { children: [_jsx(DrawerHeader, { children: _jsx(DrawerTitle, { children: "Complex Drawer" }) }), _jsxs("div", { children: [_jsx("p", { children: "Paragraph 1" }), _jsx("p", { children: "Paragraph 2" })] }), _jsx(DrawerFooter, { children: _jsx("button", { children: "Action" }) })] }) }));
            expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });
});
