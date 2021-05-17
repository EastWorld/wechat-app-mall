!function(t) {
    "use strict";
    var r, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", c = o.toStringTag || "@@toStringTag", u = "object" == typeof module, h = t.regeneratorRuntime;
    if (h) u && (module.exports = h); else {
        (h = t.regeneratorRuntime = u ? module.exports : {}).wrap = w;
        var f = "suspendedStart", s = "suspendedYield", l = "executing", p = "completed", y = {}, v = {};
        v[i] = function() {
            return this;
        };
        var d = Object.getPrototypeOf, g = d && d(d(P([])));
        g && g !== e && n.call(g, i) && (v = g);
        var m = b.prototype = x.prototype = Object.create(v);
        E.prototype = m.constructor = b, b.constructor = E, b[c] = E.displayName = "GeneratorFunction", 
        h.isGeneratorFunction = function(t) {
            var r = "function" == typeof t && t.constructor;
            return !!r && (r === E || "GeneratorFunction" === (r.displayName || r.name));
        }, h.mark = function(t) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(t, b) : (t.__proto__ = b, c in t || (t[c] = "GeneratorFunction")), 
            t.prototype = Object.create(m), t;
        }, h.awrap = function(t) {
            return {
                __await: t
            };
        }, _(j.prototype), j.prototype[a] = function() {
            return this;
        }, h.AsyncIterator = j, h.async = function(t, r, e, n) {
            var o = new j(w(t, r, e, n));
            return h.isGeneratorFunction(r) ? o : o.next().then(function(t) {
                return t.done ? t.value : o.next();
            });
        }, _(m), m[c] = "Generator", m[i] = function() {
            return this;
        }, m.toString = function() {
            return "[object Generator]";
        }, h.keys = function(t) {
            var r = [];
            for (var e in t) r.push(e);
            return r.reverse(), function e() {
                for (;r.length; ) {
                    var n = r.pop();
                    if (n in t) return e.value = n, e.done = !1, e;
                }
                return e.done = !0, e;
            };
        }, h.values = P, N.prototype = {
            constructor: N,
            reset: function(t) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = r, this.done = !1, this.delegate = null, 
                this.method = "next", this.arg = r, this.tryEntries.forEach(G), !t) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = r);
            },
            stop: function() {
                this.done = !0;
                var t = this.tryEntries[0].completion;
                if ("throw" === t.type) throw t.arg;
                return this.rval;
            },
            dispatchException: function(t) {
                if (this.done) throw t;
                var e = this;
                function o(n, o) {
                    return c.type = "throw", c.arg = t, e.next = n, o && (e.method = "next", e.arg = r), 
                    !!o;
                }
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var a = this.tryEntries[i], c = a.completion;
                    if ("root" === a.tryLoc) return o("end");
                    if (a.tryLoc <= this.prev) {
                        var u = n.call(a, "catchLoc"), h = n.call(a, "finallyLoc");
                        if (u && h) {
                            if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                            if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                        } else if (u) {
                            if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                        } else {
                            if (!h) throw new Error("try statement without catch or finally");
                            if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                        }
                    }
                }
            },
            abrupt: function(t, r) {
                for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var o = this.tryEntries[e];
                    if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                        var i = o;
                        break;
                    }
                }
                i && ("break" === t || "continue" === t) && i.tryLoc <= r && r <= i.finallyLoc && (i = null);
                var a = i ? i.completion : {};
                return a.type = t, a.arg = r, i ? (this.method = "next", this.next = i.finallyLoc, 
                y) : this.complete(a);
            },
            complete: function(t, r) {
                if ("throw" === t.type) throw t.arg;
                return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, 
                this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), 
                y;
            },
            finish: function(t) {
                for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var e = this.tryEntries[r];
                    if (e.finallyLoc === t) return this.complete(e.completion, e.afterLoc), G(e), y;
                }
            },
            catch: function(t) {
                for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var e = this.tryEntries[r];
                    if (e.tryLoc === t) {
                        var n = e.completion;
                        if ("throw" === n.type) {
                            var o = n.arg;
                            G(e);
                        }
                        return o;
                    }
                }
                throw new Error("illegal catch attempt");
            },
            delegateYield: function(t, e, n) {
                return this.delegate = {
                    iterator: P(t),
                    resultName: e,
                    nextLoc: n
                }, "next" === this.method && (this.arg = r), y;
            }
        };
    }
    function w(t, r, e, n) {
        var o = r && r.prototype instanceof x ? r : x, i = Object.create(o.prototype), a = new N(n || []);
        return i._invoke = function(t, r, e) {
            var n = f;
            return function(o, i) {
                if (n === l) throw new Error("Generator is already running");
                if (n === p) {
                    if ("throw" === o) throw i;
                    return F();
                }
                for (e.method = o, e.arg = i; ;) {
                    var a = e.delegate;
                    if (a) {
                        var c = O(a, e);
                        if (c) {
                            if (c === y) continue;
                            return c;
                        }
                    }
                    if ("next" === e.method) e.sent = e._sent = e.arg; else if ("throw" === e.method) {
                        if (n === f) throw n = p, e.arg;
                        e.dispatchException(e.arg);
                    } else "return" === e.method && e.abrupt("return", e.arg);
                    n = l;
                    var u = L(t, r, e);
                    if ("normal" === u.type) {
                        if (n = e.done ? p : s, u.arg === y) continue;
                        return {
                            value: u.arg,
                            done: e.done
                        };
                    }
                    "throw" === u.type && (n = p, e.method = "throw", e.arg = u.arg);
                }
            };
        }(t, e, a), i;
    }
    function L(t, r, e) {
        try {
            return {
                type: "normal",
                arg: t.call(r, e)
            };
        } catch (t) {
            return {
                type: "throw",
                arg: t
            };
        }
    }
    function x() {}
    function E() {}
    function b() {}
    function _(t) {
        [ "next", "throw", "return" ].forEach(function(r) {
            t[r] = function(t) {
                return this._invoke(r, t);
            };
        });
    }
    function j(t) {
        var r;
        this._invoke = function(e, o) {
            function i() {
                return new Promise(function(r, i) {
                    !function r(e, o, i, a) {
                        var c = L(t[e], t, o);
                        if ("throw" !== c.type) {
                            var u = c.arg, h = u.value;
                            return h && "object" == typeof h && n.call(h, "__await") ? Promise.resolve(h.__await).then(function(t) {
                                r("next", t, i, a);
                            }, function(t) {
                                r("throw", t, i, a);
                            }) : Promise.resolve(h).then(function(t) {
                                u.value = t, i(u);
                            }, function(t) {
                                return r("throw", t, i, a);
                            });
                        }
                        a(c.arg);
                    }(e, o, r, i);
                });
            }
            return r = r ? r.then(i, i) : i();
        };
    }
    function O(t, e) {
        var n = t.iterator[e.method];
        if (n === r) {
            if (e.delegate = null, "throw" === e.method) {
                if (t.iterator.return && (e.method = "return", e.arg = r, O(t, e), "throw" === e.method)) return y;
                e.method = "throw", e.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return y;
        }
        var o = L(n, t.iterator, e.arg);
        if ("throw" === o.type) return e.method = "throw", e.arg = o.arg, e.delegate = null, 
        y;
        var i = o.arg;
        return i ? i.done ? (e[t.resultName] = i.value, e.next = t.nextLoc, "return" !== e.method && (e.method = "next", 
        e.arg = r), e.delegate = null, y) : i : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), 
        e.delegate = null, y);
    }
    function k(t) {
        var r = {
            tryLoc: t[0]
        };
        1 in t && (r.catchLoc = t[1]), 2 in t && (r.finallyLoc = t[2], r.afterLoc = t[3]), 
        this.tryEntries.push(r);
    }
    function G(t) {
        var r = t.completion || {};
        r.type = "normal", delete r.arg, t.completion = r;
    }
    function N(t) {
        this.tryEntries = [ {
            tryLoc: "root"
        } ], t.forEach(k, this), this.reset(!0);
    }
    function P(t) {
        if (t) {
            var e = t[i];
            if (e) return e.call(t);
            if ("function" == typeof t.next) return t;
            if (!isNaN(t.length)) {
                var o = -1, a = function e() {
                    for (;++o < t.length; ) if (n.call(t, o)) return e.value = t[o], e.done = !1, e;
                    return e.value = r, e.done = !0, e;
                };
                return a.next = a;
            }
        }
        return {
            next: F
        };
    }
    function F() {
        return {
            value: r,
            done: !0
        };
    }
}(function() {
    return this || "object" == typeof self && self;
}() || Function("return this")());