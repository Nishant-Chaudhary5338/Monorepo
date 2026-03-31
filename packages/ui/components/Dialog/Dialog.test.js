var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, } from './Dialog';
describe('Dialog', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for closed dialog', function () {
            var container = render(_jsxs(Dialog, { children: [_jsx(DialogTrigger, { children: "Open" }), _jsx(DialogContent, { children: _jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Dialog Title" }), _jsx(DialogDescription, { children: "Dialog description" })] }) })] })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for open dialog', function () {
            var container = render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Open Dialog" }), _jsx(DialogDescription, { children: "This dialog is open" })] }) }) })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for dialog with footer', function () {
            var container = render(_jsx(Dialog, { open: true, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Confirm Action" }) }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { children: "Cancel" }), _jsx("button", { children: "Confirm" })] })] }) })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders trigger button', function () {
            render(_jsxs(Dialog, { children: [_jsx(DialogTrigger, { children: "Open Dialog" }), _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Test" }) })] }));
            expect(screen.getByText('Open Dialog')).toBeInTheDocument();
        });
        it('renders dialog content when open', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Dialog Title" }), _jsx(DialogDescription, { children: "Dialog description" })] }) }) }));
            expect(screen.getByText('Dialog Title')).toBeInTheDocument();
            expect(screen.getByText('Dialog description')).toBeInTheDocument();
        });
        it('renders dialog header with correct structure', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Title" }), _jsx(DialogDescription, { children: "Description" })] }) }) }));
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
        });
        it('renders dialog footer', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsxs(DialogFooter, { children: [_jsx("button", { children: "Cancel" }), _jsx("button", { children: "Save" })] }) }) }));
            expect(screen.getByText('Cancel')).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
        });
    });
    describe('Interactions', function () {
        it('opens dialog when trigger is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsxs(Dialog, { children: [_jsx(DialogTrigger, { children: "Open" }), _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Opened Dialog" }) })] }));
                        fireEvent.click(screen.getByText('Open'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Opened Dialog')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls onOpenChange when dialog state changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleOpenChange;
            return __generator(this, function (_a) {
                handleOpenChange = vi.fn();
                render(_jsxs(Dialog, { onOpenChange: handleOpenChange, children: [_jsx(DialogTrigger, { children: "Open" }), _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Test" }) })] }));
                fireEvent.click(screen.getByText('Open'));
                expect(handleOpenChange).toHaveBeenCalledWith(true);
                return [2 /*return*/];
            });
        }); });
        it('closes dialog when close button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var closeButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(Dialog, { defaultOpen: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Test Dialog" }) }) }));
                        closeButton = screen.getByRole('button', { name: /close/i });
                        fireEvent.click(closeButton);
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('closes dialog when Escape key is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(Dialog, { defaultOpen: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Test Dialog" }) }) }));
                        fireEvent.keyDown(document, { key: 'Escape' });
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Controlled State', function () {
        it('respects open prop', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Controlled Dialog" }) }) }));
            expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
        });
        it('does not show content when open is false', function () {
            render(_jsx(Dialog, { open: false, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Hidden Dialog" }) }) }));
            expect(screen.queryByText('Hidden Dialog')).not.toBeInTheDocument();
        });
        it('updates when open prop changes', function () {
            var rerender = render(_jsx(Dialog, { open: false, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Dynamic Dialog" }) }) })).rerender;
            expect(screen.queryByText('Dynamic Dialog')).not.toBeInTheDocument();
            rerender(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Dynamic Dialog" }) }) }));
            expect(screen.getByText('Dynamic Dialog')).toBeInTheDocument();
        });
    });
    describe('Accessibility', function () {
        it('dialog has correct role', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Accessible Dialog" }) }) }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('dialog title is associated with dialog', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Dialog Title" }) }) }));
            var dialog = screen.getByRole('dialog');
            var title = screen.getByText('Dialog Title');
            expect(dialog).toContainElement(title);
        });
        it('supports aria-labelledby', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { "aria-labelledby": "custom-title", children: _jsx(DialogTitle, { id: "custom-title", children: "Custom Title" }) }) }));
            var dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-labelledby', 'custom-title');
        });
        it('supports aria-describedby', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { "aria-describedby": "custom-desc", children: _jsx(DialogDescription, { id: "custom-desc", children: "Dialog description" }) }) }));
            var dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-describedby', 'custom-desc');
        });
        it('focus is trapped inside dialog when open', function () { return __awaiter(void 0, void 0, void 0, function () {
            var firstButton, secondButton;
            return __generator(this, function (_a) {
                render(_jsx(Dialog, { defaultOpen: true, children: _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Focus Trap Test" }), _jsx("button", { children: "First Button" }), _jsx("button", { children: "Second Button" })] }) }));
                firstButton = screen.getByText('First Button');
                secondButton = screen.getByText('Second Button');
                firstButton.focus();
                expect(firstButton).toHaveFocus();
                fireEvent.keyDown(firstButton, { key: 'Tab' });
                expect(secondButton).toHaveFocus();
                return [2 /*return*/];
            });
        }); });
    });
    describe('Props', function () {
        it('applies custom className to content', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { className: "custom-dialog", children: _jsx(DialogTitle, { children: "Test" }) }) }));
            var dialog = screen.getByRole('dialog');
            expect(dialog).toHaveClass('custom-dialog');
        });
        it('passes through additional HTML attributes', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { "data-testid": "dialog-content", children: _jsx(DialogTitle, { children: "Test" }) }) }));
            expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
        });
    });
    describe('Edge Cases', function () {
        it('handles dialog without title', function () {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogDescription, { children: "Description only" }) }) }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('handles dialog with complex children', function () {
            render(_jsx(Dialog, { open: true, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Complex Dialog" }) }), _jsxs("div", { children: [_jsx("p", { children: "Paragraph 1" }), _jsx("p", { children: "Paragraph 2" })] }), _jsx(DialogFooter, { children: _jsx("button", { children: "Action" }) })] }) }));
            expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
        it('handles multiple dialogs', function () {
            render(_jsxs(_Fragment, { children: [_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "First Dialog" }) }) }), _jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Second Dialog" }) }) })] }));
            expect(screen.getByText('First Dialog')).toBeInTheDocument();
            expect(screen.getByText('Second Dialog')).toBeInTheDocument();
        });
    });
});
