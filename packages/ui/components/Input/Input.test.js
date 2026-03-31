import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
describe('Input', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default input', function () {
            var container = render(_jsx(Input, {})).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for input with placeholder', function () {
            var container = render(_jsx(Input, { placeholder: "Enter text" })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for disabled input', function () {
            var container = render(_jsx(Input, { disabled: true })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for input with value', function () {
            var container = render(_jsx(Input, { value: "Test value", readOnly: true })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Input, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as input element', function () {
            var _a;
            var container = render(_jsx(Input, {})).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('INPUT');
        });
        it('renders with placeholder', function () {
            render(_jsx(Input, { placeholder: "Enter your name" }));
            expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
        });
        it('renders with value', function () {
            render(_jsx(Input, { value: "Test Value", readOnly: true }));
            expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
        });
        it('renders with default value', function () {
            render(_jsx(Input, { defaultValue: "Default" }));
            expect(screen.getByDisplayValue('Default')).toBeInTheDocument();
        });
    });
    describe('Input Types', function () {
        it('renders text input by default', function () {
            var container = render(_jsx(Input, {})).container;
            expect(container.firstChild).toHaveAttribute('type', 'text');
        });
        it('renders email input', function () {
            var container = render(_jsx(Input, { type: "email" })).container;
            expect(container.firstChild).toHaveAttribute('type', 'email');
        });
        it('renders password input', function () {
            var container = render(_jsx(Input, { type: "password" })).container;
            expect(container.firstChild).toHaveAttribute('type', 'password');
        });
        it('renders number input', function () {
            var container = render(_jsx(Input, { type: "number" })).container;
            expect(container.firstChild).toHaveAttribute('type', 'number');
        });
        it('renders search input', function () {
            var container = render(_jsx(Input, { type: "search" })).container;
            expect(container.firstChild).toHaveAttribute('type', 'search');
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Input, { className: "custom-input" })).container;
            expect(container.firstChild).toHaveClass('custom-input');
        });
        it('merges custom className with default styles', function () {
            var container = render(_jsx(Input, { className: "my-custom" })).container;
            expect(container.firstChild).toHaveClass('my-custom');
            expect(container.firstChild).toHaveClass('flex');
        });
        it('forwards ref correctly', function () {
            var ref = { current: null };
            render(_jsx(Input, { ref: ref }));
            expect(ref.current).not.toBeNull();
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Input, { "data-testid": "my-input", "aria-label": "Username" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-input');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Username');
        });
        it('sets name attribute', function () {
            var container = render(_jsx(Input, { name: "username" })).container;
            expect(container.firstChild).toHaveAttribute('name', 'username');
        });
        it('sets id attribute', function () {
            var container = render(_jsx(Input, { id: "email-input" })).container;
            expect(container.firstChild).toHaveAttribute('id', 'email-input');
        });
    });
    describe('Interactions', function () {
        it('handles onChange events', function () {
            var handleChange = vi.fn();
            render(_jsx(Input, { onChange: handleChange }));
            fireEvent.change(screen.getByRole('textbox'), {
                target: { value: 'new value' },
            });
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
        it('handles onFocus events', function () {
            var handleFocus = vi.fn();
            render(_jsx(Input, { onFocus: handleFocus }));
            fireEvent.focus(screen.getByRole('textbox'));
            expect(handleFocus).toHaveBeenCalledTimes(1);
        });
        it('handles onBlur events', function () {
            var handleBlur = vi.fn();
            render(_jsx(Input, { onBlur: handleBlur }));
            fireEvent.blur(screen.getByRole('textbox'));
            expect(handleBlur).toHaveBeenCalledTimes(1);
        });
        it('handles onKeyDown events', function () {
            var handleKeyDown = vi.fn();
            render(_jsx(Input, { onKeyDown: handleKeyDown }));
            fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
            expect(handleKeyDown).toHaveBeenCalledTimes(1);
        });
        it('allows typing when not disabled', function () {
            render(_jsx(Input, {}));
            var input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'Hello' } });
            expect(input).toHaveValue('Hello');
        });
    });
    describe('Disabled State', function () {
        it('applies disabled styles', function () {
            var container = render(_jsx(Input, { disabled: true })).container;
            expect(container.firstChild).toHaveClass('disabled:cursor-not-allowed');
            expect(container.firstChild).toHaveClass('disabled:opacity-50');
        });
        it('sets disabled attribute', function () {
            var container = render(_jsx(Input, { disabled: true })).container;
            expect(container.firstChild).toHaveAttribute('disabled');
        });
        it('does not fire onChange when disabled', function () {
            var handleChange = vi.fn();
            render(_jsx(Input, { onChange: handleChange, disabled: true }));
            fireEvent.change(screen.getByRole('textbox'), {
                target: { value: 'test' },
            });
            expect(handleChange).not.toHaveBeenCalled();
        });
    });
    describe('Readonly State', function () {
        it('sets readonly attribute', function () {
            var container = render(_jsx(Input, { readOnly: true })).container;
            expect(container.firstChild).toHaveAttribute('readonly');
        });
        it('does not allow typing when readonly', function () {
            render(_jsx(Input, { value: "readonly value", readOnly: true }));
            var input = screen.getByRole('textbox');
            expect(input).toHaveValue('readonly value');
        });
    });
    describe('Accessibility', function () {
        it('supports aria-label', function () {
            var container = render(_jsx(Input, { "aria-label": "Email address" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Email address');
        });
        it('supports aria-describedby', function () {
            var container = render(_jsx(Input, { "aria-describedby": "email-hint" })).container;
            expect(container.firstChild).toHaveAttribute('aria-describedby', 'email-hint');
        });
        it('supports aria-invalid', function () {
            var container = render(_jsx(Input, { "aria-invalid": "true" })).container;
            expect(container.firstChild).toHaveAttribute('aria-invalid', 'true');
        });
        it('supports aria-required', function () {
            var container = render(_jsx(Input, { "aria-required": "true" })).container;
            expect(container.firstChild).toHaveAttribute('aria-required', 'true');
        });
        it('has textbox role', function () {
            render(_jsx(Input, {}));
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
    });
    describe('Edge Cases', function () {
        it('handles empty input', function () {
            var container = render(_jsx(Input, {})).container;
            expect(container.firstChild).toHaveValue('');
        });
        it('handles controlled input', function () {
            var rerender = render(_jsx(Input, { value: "initial", readOnly: true })).rerender;
            expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
            rerender(_jsx(Input, { value: "updated", readOnly: true }));
            expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
        });
        it('handles maxLength', function () {
            var container = render(_jsx(Input, { maxLength: 10 })).container;
            expect(container.firstChild).toHaveAttribute('maxlength', '10');
        });
        it('handles min and max for number input', function () {
            var container = render(_jsx(Input, { type: "number", min: 0, max: 100 })).container;
            expect(container.firstChild).toHaveAttribute('min', '0');
            expect(container.firstChild).toHaveAttribute('max', '100');
        });
        it('handles autoComplete', function () {
            var container = render(_jsx(Input, { autoComplete: "email" })).container;
            expect(container.firstChild).toHaveAttribute('autocomplete', 'email');
        });
        it('handles autoFocus', function () {
            render(_jsx(Input, { autoFocus: true }));
            var input = screen.getByRole('textbox');
            expect(input).toHaveFocus();
        });
    });
});
