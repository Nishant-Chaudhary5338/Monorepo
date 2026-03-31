import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, } from './InputOTP';
describe('InputOTP', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default input OTP', function () {
            var container = render(_jsxs(InputOTP, { maxLength: 6, children: [_jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 }), _jsx(InputOTPSlot, { index: 2 })] }), _jsx(InputOTPSeparator, {}), _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 3 }), _jsx(InputOTPSlot, { index: 4 }), _jsx(InputOTPSlot, { index: 5 })] })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(InputOTP, { maxLength: 4, children: _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 }), _jsx(InputOTPSlot, { index: 2 }), _jsx(InputOTPSlot, { index: 3 })] }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders correct number of slots', function () {
            render(_jsx(InputOTP, { maxLength: 4, children: _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 }), _jsx(InputOTPSlot, { index: 2 }), _jsx(InputOTPSlot, { index: 3 })] }) }));
            var slots = screen.getAllByRole('textbox');
            expect(slots.length).toBeGreaterThan(0);
        });
        it('renders separator', function () {
            var container = render(_jsxs(InputOTP, { maxLength: 6, children: [_jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 }), _jsx(InputOTPSlot, { index: 2 })] }), _jsx(InputOTPSeparator, {}), _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 3 }), _jsx(InputOTPSlot, { index: 4 }), _jsx(InputOTPSlot, { index: 5 })] })] })).container;
            var separators = container.querySelectorAll('[role="separator"]');
            expect(separators.length).toBeGreaterThan(0);
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(InputOTP, { maxLength: 4, className: "custom-otp", children: _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 })] }) })).container;
            expect(container.firstChild).toHaveClass('custom-otp');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(InputOTP, { maxLength: 4, "data-testid": "my-otp", children: _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 })] }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-otp');
        });
    });
    describe('Interactions', function () {
        it('handles value change', function () {
            var handleValueChange = vi.fn();
            render(_jsx(InputOTP, { maxLength: 4, onChange: handleValueChange, children: _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 })] }) }));
            var input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '12' } });
            expect(handleValueChange).toHaveBeenCalled();
        });
    });
    describe('Disabled State', function () {
        it('disables input when disabled prop is set', function () {
            render(_jsx(InputOTP, { maxLength: 4, disabled: true, children: _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 })] }) }));
            var input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('disabled');
        });
    });
    describe('Accessibility', function () {
        it('has input role', function () {
            render(_jsx(InputOTP, { maxLength: 4, children: _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 })] }) }));
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
        it('supports aria-label', function () {
            render(_jsx(InputOTP, { maxLength: 4, "aria-label": "Enter OTP", children: _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 })] }) }));
            var input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('aria-label', 'Enter OTP');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty OTP', function () {
            var container = render(_jsx(InputOTP, { maxLength: 4, children: _jsxs(InputOTPGroup, { children: [_jsx(InputOTPSlot, { index: 0 }), _jsx(InputOTPSlot, { index: 1 })] }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles many slots', function () {
            var slots = Array.from({ length: 10 }, function (_, i) { return (_jsx(InputOTPSlot, { index: i }, i)); });
            var container = render(_jsx(InputOTP, { maxLength: 10, children: _jsx(InputOTPGroup, { children: slots }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
