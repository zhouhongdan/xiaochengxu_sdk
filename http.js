function e(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

var t = function() {
    function e(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
            Object.defineProperty(e, r.key, r);
        }
    }
    return function(t, n, r) {
        return n && e(t.prototype, n), r && e(t, r), t;
    };
}(), n = function() {
    function n() {
        e(this, n);
    }
    return t(n, [ {
        key: "request",
        value: function(e, t, n) {
            var r = n.query, u = n.body, o = n.header;
            return e = e.toUpperCase(), r && (r = Object.keys(r).filter(function(e) {
                return void 0 != r[e] && null != r[e];
            }).map(function(e) {
                return e + "=" + r[e];
            }).join("&")) && (t.indexOf("?") >= 0 ? t += "&" + r : t += "?" + r), new Promise(function(n, r) {
                wx.request({
                    method: e,
                    url: t,
                    header: o,
                    data: u,
                    success: function(e) {
                        if (e.statusCode >= 200 && e.statusCode <= 204) n(e.data); else {
                            var u = new Error();
                            u.status = e.statusCode, u.data = e.data, console.error(t, u.status, u.data), r(u);
                        }
                    },
                    fail: function(e) {
                        wx.showToast({
                            title: "网络错误",
                            icon: "none"
                        }), r(new Error("wx.request fail"));
                    }
                });
            });
        }
    }, {
        key: "get",
        value: function(e, t, n) {
            return this.request("get", e, {
                query: t,
                header: n
            });
        }
    }, {
        key: "post",
        value: function(e, t, n, r) {
            return this.request("post", e, {
                body: t,
                query: n,
                header: r
            });
        }
    } ]), n;
}();

module.exports = new n();