import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './Textarea';
describe('Textarea', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for default textarea', function () {
            var container = render(_jsx(Textarea, {})).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for textarea with placeholder', function () {
            var container = render(_jsx(PlaceholderTextarea, {})).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for disabled textarea', function () {
            var container = render(_jsx(Textarea, { disabled: true })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
        it('matches snapshot for textarea with value', function () {
            var container = render(_jsx(Textarea, { value: "Test value", readOnly: true })).container;
            expect(container.firstChild).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Textarea, {})).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders as textarea element', function () {
            var _a;
            var container = render(_jsx(Textarea, {})).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName).toBe('TEXTAREA');
        });
        it('renders with placeholder', function () {
            render(_jsx(Textarea, { placeholder: "Enter your message" }));
            expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
        });
        it('renders with value', function () {
            render(_jsx(Textarea, { value: "Test Value", readOnly: true }));
            expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
        });
        it('renders with default value', function () {
            render(_jsx(Textarea, { defaultValue: "Default" }));
            expect(screen.getByDisplayValue('Default')).toBeInTheDocument();
        });
    });
    describe('Props', function () {
        it('applies custom className', function () {
            var container = render(_jsx(Textarea, { className: "custom-textarea" })).container;
            expect(container.firstChild).toHaveClass('custom-textarea');
        });
        it('merges custom className with default styles', function () {
            var container = render(_jsx(Textarea, { className: "my-custom" })).container;
            expect(container.firstChild).toHaveClass('my-custom');
            expect(container.firstChild).toHaveClass('flex');
        });
        it('forwards ref correctly', function () {
            var ref = { current: null };
            render(_jsx(Textarea, { ref: ref }));
            expect(ref.current).not.toBeNull();
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Textarea, { "data-testid": "my-textarea", "aria-label": "Message" })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-textarea');
            expect(container.firstChild).toHaveAttribute('aria-label', 'Message');
        });
        it('sets name attribute', function () {
            var container = render(_jsx(Textarea, { name: "message" })).container;
            expect(container.firstChild).toHaveAttribute('name', 'message');
        });
        it('sets id attribute', function () {
            var container = render(_jsx(Textarea, { id: "message-input" })).container;
            expect(container.firstChild).toHaveAttribute('id', 'message-input');
        });
        it('sets rows attribute', function () {
            var container = render(_jsx(Textarea, { rows: 5 })).container;
            expect(container.firstChild).toHaveAttribute('rows', '5');
        });
    });
    describe('Interactions', function () {
        it('handles onChange events', function () {
            var handleChange = vi.fn();
            render(_jsx(Textarea, { onChange: handleChange }));
            fireEvent.change(screen.getByRole('textbox'), {
                target: { value: 'new value' },
            });
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
        it('handles onFocus events', function () {
            var handleFocus = vi.fn();
            render(_jsx(Textarea, { onFocus: handleFocus }));
            fireEvent.focus(screen.getByRole('textbox'));
            expect(handleFocus).toHaveBeenCalledTimes(1);
        });
        it('handles onBlur events', function () {
            var handleBlur = vi.fn();
            render(_jsx(Textarea, { onBlur: handleBlur }));
            fireEvent.blur(screen.getByRole('textbox'));
            expect(handleBlur).toHaveBeenCalledTimes(1);
        });
        it('allows typing when not disabled', function () {
            render(_jsx(Textarea, {}));
            var textarea = screen.getByRole('textbox');
            fireEvent.change(textarea, { target: { value: 'Hello' } });
            expect(textarea).toHaveValue('Hello');
        });
    });
    describe('Disabled State', function () {
        it('applies disabled styles', function () {
            var container = render(_jsx(Textarea, { disabled: true })).container;
            expect(container.firstChild).toHaveClass('disabled:cursor-not-allowed');
            expect(container.firstChild).toHaveClass('disabled:opacity-50');
        });
        it('sets disabled attribute', function () {
            var container = render(_jsx(Textarea, { disabled: true })).container;
            expect(container.firstChild).toHaveAttribute('disabled');
        });
        it('does not fire onChange when disabled', function () {
            var handleChange = vi.fn();
            render(_jsx(Textarea, { onChange: handleChange, disabled: true }));
            fireEvent.change(screen.getByRole('textbox'), {
                target: { value: 'test' },
            });
            expect(handleChange).not.toHaveBeenCalled();
        });
    });
    describe('Readonly State', function () {
        it('sets readonly attribute', function () {
            var container = render(_jsx(Textarea, { readOnly: true })).container;
            expect(container.firstChild).toHaveAttribute('readonly');
        });
        it('does not allow typing when readonly', function () {
            render(_jsx(Textarea, { value: "readonly value", readOnly: true }));
            var textarea = screen.getByRole('textbox');
            expect(textarea).toHaveValue('readonly value');
        });
    });
    describe('Accessibility', function () {
        it('supports aria-label', function () {
            var container = render(_jsx(Textarea, { "aria-label": "Message content" })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Message content');
        });
        it('supports aria-describedby', function () {
            var container = render(_jsx(Textarea, { "aria-describedby": "message-hint" })).container;
            expect(container.firstChild).toHaveAttribute('aria-describedby', 'message-hint');
        });
        it('supports aria-invalid', function () {
            var container = render(_jsx(Textarea, { "aria-invalid": "true" })).container;
            expect(container.firstChild).toHaveAttribute('aria-invalid', 'true');
        });
        it('supports aria-required', function () {
            var container = render(_jsx(Textarea, { "aria-required": "true" })).container;
            expect(container.firstChild).toHaveAttribute('aria-required', 'true');
        });
        it('has textbox role', function () {
            render(_jsx(Textarea, {}));
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
    });
    describe('Edge Cases', function () {
        it('handles empty textarea', function () {
            var container = render(_jsx(Textarea, {})).container;
            expect(container.firstChild).toHaveValue('');
        });
        it('handles controlled textarea', function () {
            var rerender = render(_jsx(Textarea, { value: "initial", readOnly: true })).rerender;
            expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
            rerender(_jsx(Textarea, { value: "updated", readOnly: true }));
            expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
        });
        it('handles maxLength', function () {
            var container = render(_jsx(Textarea, { maxLength: 100 })).container;
            expect(container.firstChild).toHaveAttribute('maxlength', '100');
        });
        it('handles autoFocus', function () {
            render(_jsx(Textarea, { autoFocus: true }));
            var textarea = screen.getByRole('textbox');
            expect(textarea).toHaveFocus();
        });
    });
});
function PlaceholderTextarea() {
    return _jsx(Textarea, { placeholder: "Enter text" });
}
