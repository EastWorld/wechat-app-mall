'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.useChildren = exports.useParent = void 0;
function useParent(name, onEffect) {
  var _a;
  var path = '../' + name + '/index';
  return {
    relations:
      ((_a = {}),
      (_a[path] = {
        type: 'ancestor',
        linked: function () {
          onEffect && onEffect.call(this);
        },
        linkChanged: function () {
          onEffect && onEffect.call(this);
        },
        unlinked: function () {
          onEffect && onEffect.call(this);
        },
      }),
      _a),
    mixin: Behavior({
      created: function () {
        var _this = this;
        Object.defineProperty(this, 'parent', {
          get: function () {
            return _this.getRelationNodes(path)[0];
          },
        });
        Object.defineProperty(this, 'index', {
          // @ts-ignore
          get: function () {
            var _a, _b;
            return (_b =
              (_a = _this.parent) === null || _a === void 0
                ? void 0
                : _a.children) === null || _b === void 0
              ? void 0
              : _b.indexOf(_this);
          },
        });
      },
    }),
  };
}
exports.useParent = useParent;
function useChildren(name, onEffect) {
  var _a;
  var path = '../' + name + '/index';
  return {
    relations:
      ((_a = {}),
      (_a[path] = {
        type: 'descendant',
        linked: function (target) {
          onEffect && onEffect.call(this, target);
        },
        linkChanged: function (target) {
          onEffect && onEffect.call(this, target);
        },
        unlinked: function (target) {
          onEffect && onEffect.call(this, target);
        },
      }),
      _a),
    mixin: Behavior({
      created: function () {
        var _this = this;
        Object.defineProperty(this, 'children', {
          get: function () {
            return _this.getRelationNodes(path) || [];
          },
        });
      },
    }),
  };
}
exports.useChildren = useChildren;
