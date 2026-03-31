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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';
describe('Accordion', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for basic accordion', function () {
            var container = render(_jsx(Accordion, { type: "single", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for multiple accordion', function () {
            var container = render(_jsxs(Accordion, { type: "multiple", children: [_jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Item 1" }), _jsx(AccordionContent, { children: "Content 1" })] }), _jsxs(AccordionItem, { value: "item-2", children: [_jsx(AccordionTrigger, { children: "Item 2" }), _jsx(AccordionContent, { children: "Content 2" })] })] })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for collapsible accordion', function () {
            var container = render(_jsx(Accordion, { type: "single", collapsible: true, children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Collapsible" }), _jsx(AccordionContent, { children: "Content" })] }) })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsx(Accordion, { type: "single", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders trigger text', function () {
            render(_jsx(Accordion, { type: "single", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Click me" }), _jsx(AccordionContent, { children: "Expanded content" })] }) }));
            expect(screen.getByText('Click me')).toBeInTheDocument();
        });
        it('renders multiple items', function () {
            render(_jsxs(Accordion, { type: "multiple", children: [_jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Item 1" }), _jsx(AccordionContent, { children: "Content 1" })] }), _jsxs(AccordionItem, { value: "item-2", children: [_jsx(AccordionTrigger, { children: "Item 2" }), _jsx(AccordionContent, { children: "Content 2" })] }), _jsxs(AccordionItem, { value: "item-3", children: [_jsx(AccordionTrigger, { children: "Item 3" }), _jsx(AccordionContent, { children: "Content 3" })] })] }));
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.getByText('Item 3')).toBeInTheDocument();
        });
    });
    describe('Single Accordion', function () {
        it('expands item when trigger is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(Accordion, { type: "single", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Expanded Content" })] }) }));
                        fireEvent.click(screen.getByText('Trigger'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Expanded Content')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('only allows one item open at a time', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsxs(Accordion, { type: "single", children: [_jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Item 1" }), _jsx(AccordionContent, { children: "Content 1" })] }), _jsxs(AccordionItem, { value: "item-2", children: [_jsx(AccordionTrigger, { children: "Item 2" }), _jsx(AccordionContent, { children: "Content 2" })] })] }));
                        fireEvent.click(screen.getByText('Item 1'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Content 1')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        fireEvent.click(screen.getByText('Item 2'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Content 2')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('supports collapsible prop', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(Accordion, { type: "single", collapsible: true, children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) }));
                        fireEvent.click(screen.getByText('Trigger'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Content')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        fireEvent.click(screen.getByText('Trigger'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.queryByText('Content')).not.toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Multiple Accordion', function () {
        it('allows multiple items open', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsxs(Accordion, { type: "multiple", children: [_jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Item 1" }), _jsx(AccordionContent, { children: "Content 1" })] }), _jsxs(AccordionItem, { value: "item-2", children: [_jsx(AccordionTrigger, { children: "Item 2" }), _jsx(AccordionContent, { children: "Content 2" })] })] }));
                        fireEvent.click(screen.getByText('Item 1'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Content 1')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        fireEvent.click(screen.getByText('Item 2'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Content 1')).toBeInTheDocument();
                                expect(screen.getByText('Content 2')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Controlled State', function () {
        it('respects value prop for single accordion', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsxs(Accordion, { type: "single", value: "item-1", children: [_jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Item 1" }), _jsx(AccordionContent, { children: "Content 1" })] }), _jsxs(AccordionItem, { value: "item-2", children: [_jsx(AccordionTrigger, { children: "Item 2" }), _jsx(AccordionContent, { children: "Content 2" })] })] }));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Content 1')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls onValueChange when item is toggled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleValueChange;
            return __generator(this, function (_a) {
                handleValueChange = vi.fn();
                render(_jsx(Accordion, { type: "single", onValueChange: handleValueChange, children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Item 1" }), _jsx(AccordionContent, { children: "Content 1" })] }) }));
                fireEvent.click(screen.getByText('Item 1'));
                expect(handleValueChange).toHaveBeenCalledWith('item-1');
                return [2 /*return*/];
            });
        }); });
    });
    describe('Props', function () {
        it('applies custom className to accordion', function () {
            var container = render(_jsx(Accordion, { type: "single", className: "custom-accordion", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) })).container;
            expect(container.firstChild).toHaveClass('custom-accordion');
        });
        it('applies custom className to item', function () {
            var container = render(_jsx(Accordion, { type: "single", children: _jsxs(AccordionItem, { value: "item-1", className: "custom-item", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) })).container;
            expect(container.querySelector('[data-state]')).toHaveClass('custom-item');
        });
        it('applies custom className to trigger', function () {
            render(_jsx(Accordion, { type: "single", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { className: "custom-trigger", children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) }));
            expect(screen.getByText('Trigger')).toHaveClass('custom-trigger');
        });
        it('applies custom className to content', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = render(_jsx(Accordion, { type: "single", defaultValue: "item-1", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { className: "custom-content", children: "Content" })] }) })).container;
                        return [4 /*yield*/, waitFor(function () {
                                expect(container.querySelector('[role="region"]')).toHaveClass('custom-content');
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsx(Accordion, { type: "single", "data-testid": "my-accordion", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-accordion');
        });
    });
    describe('Accessibility', function () {
        it('trigger has button role', function () {
            render(_jsx(Accordion, { type: "single", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) }));
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
        it('content has region role when expanded', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = render(_jsx(Accordion, { type: "single", defaultValue: "item-1", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) })).container;
                        return [4 /*yield*/, waitFor(function () {
                                expect(container.querySelector('[role="region"]')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('trigger has aria-expanded when open', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(Accordion, { type: "single", defaultValue: "item-1", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) }));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('supports aria-controls', function () { return __awaiter(void 0, void 0, void 0, function () {
            var trigger, controls;
            return __generator(this, function (_a) {
                render(_jsx(Accordion, { type: "single", defaultValue: "item-1", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Trigger" }), _jsx(AccordionContent, { children: "Content" })] }) }));
                trigger = screen.getByRole('button');
                controls = trigger.getAttribute('aria-controls');
                expect(controls).toBeTruthy();
                return [2 /*return*/];
            });
        }); });
    });
    describe('Edge Cases', function () {
        it('handles empty accordion', function () {
            var container = render(_jsx(Accordion, { type: "single" })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles item without content', function () {
            render(_jsx(Accordion, { type: "single", children: _jsx(AccordionItem, { value: "item-1", children: _jsx(AccordionTrigger, { children: "Trigger Only" }) }) }));
            expect(screen.getByText('Trigger Only')).toBeInTheDocument();
        });
        it('handles complex content', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(Accordion, { type: "single", defaultValue: "item-1", children: _jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Complex" }), _jsx(AccordionContent, { children: _jsxs("div", { children: [_jsx("p", { children: "Paragraph 1" }), _jsx("p", { children: "Paragraph 2" }), _jsx("button", { children: "Action" })] }) })] }) }));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
                                expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
                                expect(screen.getByText('Action')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('handles disabled items', function () {
            render(_jsx(Accordion, { type: "single", children: _jsxs(AccordionItem, { value: "item-1", disabled: true, children: [_jsx(AccordionTrigger, { children: "Disabled" }), _jsx(AccordionContent, { children: "Content" })] }) }));
            fireEvent.click(screen.getByText('Disabled'));
            expect(screen.queryByText('Content')).not.toBeInTheDocument();
        });
    });
});
