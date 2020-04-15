"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var basic_1 = require("../mixins/basic");
var relationFunctions = {
    ancestor: {
        linked: function (parent) {
            this.parent = parent;
        },
        unlinked: function () {
            this.parent = null;
        },
    },
    descendant: {
        linked: function (child) {
            this.children = this.children || [];
            this.children.push(child);
        },
        unlinked: function (child) {
            this.children = (this.children || []).filter(function (it) { return it !== child; });
        },
    },
};
function mapKeys(source, target, map) {
    Object.keys(map).forEach(function (key) {
        if (source[key]) {
            target[map[key]] = source[key];
        }
    });
}
function makeRelation(options, vantOptions, relation) {
    var _a;
    var type = relation.type, name = relation.name, linked = relation.linked, unlinked = relation.unlinked, linkChanged = relation.linkChanged;
    var beforeCreate = vantOptions.beforeCreate, destroyed = vantOptions.destroyed;
    if (type === 'descendant') {
        options.created = function () {
            beforeCreate && beforeCreate.bind(this)();
            this.children = this.children || [];
        };
        options.detached = function () {
            this.children = [];
            destroyed && destroyed.bind(this)();
        };
    }
    options.relations = Object.assign(options.relations || {}, (_a = {},
        _a["../" + name + "/index"] = {
            type: type,
            linked: function (node) {
                relationFunctions[type].linked.bind(this)(node);
                linked && linked.bind(this)(node);
            },
            linkChanged: function (node) {
                linkChanged && linkChanged.bind(this)(node);
            },
            unlinked: function (node) {
                relationFunctions[type].unlinked.bind(this)(node);
                unlinked && unlinked.bind(this)(node);
            },
        },
        _a));
}
function VantComponent(vantOptions) {
    if (vantOptions === void 0) { vantOptions = {}; }
    var options = {};
    mapKeys(vantOptions, options, {
        data: 'data',
        props: 'properties',
        mixins: 'behaviors',
        methods: 'methods',
        beforeCreate: 'created',
        created: 'attached',
        mounted: 'ready',
        relations: 'relations',
        destroyed: 'detached',
        classes: 'externalClasses'
    });
    var relation = vantOptions.relation;
    if (relation) {
        makeRelation(options, vantOptions, relation);
    }
    // add default externalClasses
    options.externalClasses = options.externalClasses || [];
    options.externalClasses.push('custom-class');
    // add default behaviors
    options.behaviors = options.behaviors || [];
    options.behaviors.push(basic_1.basic);
    // map field to form-field behavior
    if (vantOptions.field) {
        options.behaviors.push('wx://form-field');
    }
    if (options.properties) {
        Object.keys(options.properties).forEach(function (name) {
            if (Array.isArray(options.properties[name])) {
                // miniprogram do not allow multi type
                options.properties[name] = null;
            }
        });
    }
    // add default options
    options.options = {
        multipleSlots: true,
        addGlobalClass: true
    };
    Component(options);
}
exports.VantComponent = VantComponent;
