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
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
describe('Tabs', function () {
    describe('Snapshot Tests', function () {
        it('matches snapshot for basic tabs', function () {
            var container = render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }), _jsx(TabsContent, { value: "tab1", children: "Content 1" }), _jsx(TabsContent, { value: "tab2", children: "Content 2" })] })).container;
            expect(container).toMatchSnapshot();
        });
        it('matches snapshot for controlled tabs', function () {
            var container = render(_jsxs(Tabs, { value: "tab2", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }), _jsx(TabsContent, { value: "tab1", children: "Content 1" }), _jsx(TabsContent, { value: "tab2", children: "Content 2" })] })).container;
            expect(container).toMatchSnapshot();
        });
    });
    describe('Rendering', function () {
        it('renders successfully', function () {
            var container = render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }), _jsx(TabsContent, { value: "tab1", children: "Content 1" })] })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('renders tab triggers', function () {
            render(_jsx(Tabs, { defaultValue: "tab1", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }) }));
            expect(screen.getByText('Tab 1')).toBeInTheDocument();
            expect(screen.getByText('Tab 2')).toBeInTheDocument();
        });
        it('renders tab content', function () {
            render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }), _jsx(TabsContent, { value: "tab1", children: "Tab 1 Content" })] }));
            expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
        });
        it('renders multiple tabs', function () {
            render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "First" }), _jsx(TabsTrigger, { value: "tab2", children: "Second" }), _jsx(TabsTrigger, { value: "tab3", children: "Third" })] }), _jsx(TabsContent, { value: "tab1", children: "First Content" }), _jsx(TabsContent, { value: "tab2", children: "Second Content" }), _jsx(TabsContent, { value: "tab3", children: "Third Content" })] }));
            expect(screen.getByText('First')).toBeInTheDocument();
            expect(screen.getByText('Second')).toBeInTheDocument();
            expect(screen.getByText('Third')).toBeInTheDocument();
        });
    });
    describe('Tab Selection', function () {
        it('shows content for default value', function () {
            render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }), _jsx(TabsContent, { value: "tab1", children: "Content 1" }), _jsx(TabsContent, { value: "tab2", children: "Content 2" })] }));
            expect(screen.getByText('Content 1')).toBeInTheDocument();
            expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
        });
        it('switches content when tab is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }), _jsx(TabsContent, { value: "tab1", children: "Content 1" }), _jsx(TabsContent, { value: "tab2", children: "Content 2" })] }));
                        fireEvent.click(screen.getByText('Tab 2'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Content 2')).toBeInTheDocument();
                                expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls onValueChange when tab is selected', function () {
            var handleValueChange = vi.fn();
            render(_jsxs(Tabs, { defaultValue: "tab1", onValueChange: handleValueChange, children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }), _jsx(TabsContent, { value: "tab1", children: "Content 1" }), _jsx(TabsContent, { value: "tab2", children: "Content 2" })] }));
            fireEvent.click(screen.getByText('Tab 2'));
            expect(handleValueChange).toHaveBeenCalledWith('tab2');
        });
    });
    describe('Controlled State', function () {
        it('respects value prop', function () {
            render(_jsxs(Tabs, { value: "tab2", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }), _jsx(TabsContent, { value: "tab1", children: "Content 1" }), _jsx(TabsContent, { value: "tab2", children: "Content 2" })] }));
            expect(screen.getByText('Content 2')).toBeInTheDocument();
            expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
        });
        it('updates when value prop changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rerender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rerender = render(_jsxs(Tabs, { value: "tab1", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }), _jsx(TabsContent, { value: "tab1", children: "Content 1" }), _jsx(TabsContent, { value: "tab2", children: "Content 2" })] })).rerender;
                        expect(screen.getByText('Content 1')).toBeInTheDocument();
                        rerender(_jsxs(Tabs, { value: "tab2", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }), _jsx(TabsContent, { value: "tab1", children: "Content 1" }), _jsx(TabsContent, { value: "tab2", children: "Content 2" })] }));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Content 2')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Disabled Tabs', function () {
        it('does not select disabled tab', function () {
            render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", disabled: true, children: "Tab 2" })] }), _jsx(TabsContent, { value: "tab1", children: "Content 1" }), _jsx(TabsContent, { value: "tab2", children: "Content 2" })] }));
            fireEvent.click(screen.getByText('Tab 2'));
            expect(screen.getByText('Content 1')).toBeInTheDocument();
            expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
        });
        it('applies disabled styles to disabled tab', function () {
            render(_jsx(Tabs, { defaultValue: "tab1", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", disabled: true, children: "Tab 2" })] }) }));
            expect(screen.getByText('Tab 2')).toHaveAttribute('disabled');
        });
    });
    describe('Props', function () {
        it('applies custom className to tabs', function () {
            var container = render(_jsxs(Tabs, { defaultValue: "tab1", className: "custom-tabs", children: [_jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }), _jsx(TabsContent, { value: "tab1", children: "Content" })] })).container;
            expect(container.firstChild).toHaveClass('custom-tabs');
        });
        it('applies custom className to tabs list', function () {
            var container = render(_jsx(Tabs, { defaultValue: "tab1", children: _jsx(TabsList, { className: "custom-list", children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }) })).container;
            expect(container.querySelector('[role="tablist"]')).toHaveClass('custom-list');
        });
        it('applies custom className to trigger', function () {
            render(_jsx(Tabs, { defaultValue: "tab1", children: _jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", className: "custom-trigger", children: "Tab 1" }) }) }));
            expect(screen.getByText('Tab 1')).toHaveClass('custom-trigger');
        });
        it('applies custom className to content', function () {
            var container = render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }), _jsx(TabsContent, { value: "tab1", className: "custom-content", children: "Content" })] })).container;
            expect(container.querySelector('[role="tabpanel"]')).toHaveClass('custom-content');
        });
        it('passes through additional HTML attributes', function () {
            var container = render(_jsxs(Tabs, { defaultValue: "tab1", "data-testid": "my-tabs", children: [_jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }), _jsx(TabsContent, { value: "tab1", children: "Content" })] })).container;
            expect(container.firstChild).toHaveAttribute('data-testid', 'my-tabs');
        });
    });
    describe('Accessibility', function () {
        it('tab list has correct role', function () {
            var container = render(_jsx(Tabs, { defaultValue: "tab1", children: _jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }) })).container;
            expect(container.querySelector('[role="tablist"]')).toBeInTheDocument();
        });
        it('triggers have tab role', function () {
            render(_jsx(Tabs, { defaultValue: "tab1", children: _jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }) }));
            expect(screen.getByRole('tab')).toBeInTheDocument();
        });
        it('content has tabpanel role', function () {
            var container = render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }), _jsx(TabsContent, { value: "tab1", children: "Content" })] })).container;
            expect(container.querySelector('[role="tabpanel"]')).toBeInTheDocument();
        });
        it('selected tab has aria-selected true', function () {
            render(_jsx(Tabs, { defaultValue: "tab1", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }) }));
            expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
            expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'false');
        });
        it('supports aria-label', function () {
            var container = render(_jsxs(Tabs, { defaultValue: "tab1", "aria-label": "Navigation tabs", children: [_jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }), _jsx(TabsContent, { value: "tab1", children: "Content" })] })).container;
            expect(container.firstChild).toHaveAttribute('aria-label', 'Navigation tabs');
        });
    });
    describe('Keyboard Navigation', function () {
        it('can focus tabs', function () {
            render(_jsx(Tabs, { defaultValue: "tab1", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }) }));
            var tab = screen.getByText('Tab 1');
            tab.focus();
            expect(tab).toHaveFocus();
        });
        it('navigates with arrow keys', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tab1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(Tabs, { defaultValue: "tab1", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" }), _jsx(TabsTrigger, { value: "tab3", children: "Tab 3" })] }) }));
                        tab1 = screen.getByText('Tab 1');
                        tab1.focus();
                        fireEvent.keyDown(tab1, { key: 'ArrowRight' });
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Tab 2')).toHaveFocus();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Edge Cases', function () {
        it('handles empty tabs', function () {
            var container = render(_jsx(Tabs, { defaultValue: "tab1", children: _jsx(TabsList, {}) })).container;
            expect(container.firstChild).toBeInTheDocument();
        });
        it('handles tabs without content', function () {
            render(_jsx(Tabs, { defaultValue: "tab1", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }), _jsx(TabsTrigger, { value: "tab2", children: "Tab 2" })] }) }));
            expect(screen.getByText('Tab 1')).toBeInTheDocument();
            expect(screen.getByText('Tab 2')).toBeInTheDocument();
        });
        it('handles complex content in tabs', function () {
            render(_jsxs(Tabs, { defaultValue: "tab1", children: [_jsx(TabsList, { children: _jsx(TabsTrigger, { value: "tab1", children: "Tab 1" }) }), _jsx(TabsContent, { value: "tab1", children: _jsxs("div", { children: [_jsx("h2", { children: "Heading" }), _jsx("p", { children: "Paragraph" }), _jsx("button", { children: "Action" })] }) })] }));
            expect(screen.getByText('Heading')).toBeInTheDocument();
            expect(screen.getByText('Paragraph')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });
});
