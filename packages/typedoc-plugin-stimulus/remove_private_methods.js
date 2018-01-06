"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var CommentPlugin_1 = require("typedoc/dist/lib/converter/plugins/CommentPlugin");
var components_1 = require("typedoc/dist/lib/converter/components");
var converter_1 = require("typedoc/dist/lib/converter");
var reflections_1 = require("typedoc/dist/lib/models/reflections");
var RemovePrivateMethodsPlugin = /** @class */ (function (_super) {
    __extends(RemovePrivateMethodsPlugin, _super);
    function RemovePrivateMethodsPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemovePrivateMethodsPlugin.prototype.initialize = function () {
        this.markedReflections = [];
        this.listenTo(this.owner, (_a = {},
            _a[converter_1.Converter.EVENT_CREATE_SIGNATURE] = this.createSignature,
            _a[converter_1.Converter.EVENT_RESOLVE_BEGIN] = this.resolveBegin,
            _a));
        var _a;
    };
    RemovePrivateMethodsPlugin.prototype.createSignature = function (context, reflection, node) {
        if (reflection.flags.isPrivate) {
            this.markedReflections.push(reflection);
        }
    };
    RemovePrivateMethodsPlugin.prototype.resolveBegin = function (context, reflection, node) {
        var _this = this;
        this.markedReflections.forEach(function (reflection) {
            _this.removeReflectionFromProject(reflection, context.project);
        });
    };
    RemovePrivateMethodsPlugin.prototype.removeReflectionFromProject = function (reflection, project) {
        CommentPlugin_1.CommentPlugin.removeReflection(project, reflection);
        if (reflection.parent && (reflection.parent.kind & reflections_1.ReflectionKind.FunctionOrMethod)) {
            CommentPlugin_1.CommentPlugin.removeReflection(project, reflection.parent);
        }
    };
    RemovePrivateMethodsPlugin = __decorate([
        components_1.Component({ name: "remove-private-methods" })
    ], RemovePrivateMethodsPlugin);
    return RemovePrivateMethodsPlugin;
}(components_1.ConverterComponent));
exports.RemovePrivateMethodsPlugin = RemovePrivateMethodsPlugin;
