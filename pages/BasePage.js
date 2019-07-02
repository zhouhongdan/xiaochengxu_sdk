var t = require("../http"), e = require("../sdk"), n = "https://oauth.xgt588.com/wechat-miniprogram/";

module.exports = function(o, i) {
    return {
        data: {
            step: -1,
            first: !1
        },
        onShareAppMessage: function() {
            return i;
        },
        onLoad: function(t) {
            this.t_salesNo = decodeURIComponent(t.scene), t.plat && (e.getCache("c_p") != t.plat && e.clearCache(), 
            e.setCache("c_p", t.plat));
        },
        onShow: function() {
            var t = this;
            this.plat = e.getCache("c_p") || "cf1p1-asst-mp";
            var n = e.getCache("c_s");
            n ? e.checkSession().then(function(o) {
                if (o) {
                    t.session = n;
                    var i = e.getCache("c_t");
                    if (i && i.expire > Date.now()) {
                        if (t.token = i.id, t.data.step > 0) return;
                        t.login();
                    } else t.token = !1, t.setData({
                        step: 0
                    });
                } else t.login();
            }) : this.login();
        },
        login: function() {
            var o = this;
            wx.showLoading({
                title: "数据请求中..."
            }), e.login().then(function(e) {
                return t.post(n + o.plat + "/sessions", {}, {
                    code: e
                });
            }).then(function(n) {
                var i = n.id, s = n.token;
                if (console.info("登录成功"), o.session = i, e.setCache("c_s", i), s && s.user && s.user.nickname) {
                    o.token = s.id;
                    var a = s.createTime + 1e3 * s.ttl - 6e4;
                    e.setCache("c_t", {
                        id: s.id,
                        expire: a
                    });
                    var r = {
                        "X-Token": o.token
                    };
                    return t.get("https://shapi.xgt588.com/xgt/me", {}, r);
                }
            }).then(function(t) {
                wx.hideLoading(), t ? "0" == t.ret && t.info.attrs.phone ? o.setData({
                    step: 2
                }) : o.setData({
                    step: 1
                }) : o.setData({
                    step: 0
                });
            }).catch(function(t) {
                wx.hideLoading(), wx.showToast({
                    title: "请求失败",
                    icon: "none"
                }), console.error("登录失败", t);
            });
        },
        onGetUserInfo: function(i) {
            var s = this, a = i.detail;
            if (wx.reportAnalytics("event", {
                type: o + "-用户信息-0"
            }), "getUserInfo:ok" == a.errMsg) {
                wx.reportAnalytics("event", {
                    type: o + "-用户信息-1"
                }), wx.showLoading({
                    title: "数据请求中..."
                });
                var r = {
                    t_salesNo: this.t_salesNo
                }, c = {
                    "X-Session-Id": this.session
                }, h = {
                    encryptedData: a.encryptedData,
                    iv: a.iv,
                    rawData: a.rawData,
                    signature: a.signature
                };
                t.post(n + this.plat + "/callback", h, r, c).then(function(t) {
                    s.token = t.id;
                    var n = t.createTime + 1e3 * t.ttl - 6e4;
                    e.setCache("c_t", {
                        id: t.id,
                        expire: n
                    }), s.setData({
                        step: 1
                    }), console.info("授权成功"), wx.hideLoading();
                }).catch(function(t) {
                    wx.hideLoading(), wx.showToast({
                        title: "授权失败",
                        icon: "none"
                    }), console.error("授权失败", t);
                });
            }
        },
        onGetPhoneNumber: function(e) {
            var n = this, i = e.detail;
            if (wx.reportAnalytics("event", {
                type: o + "-手机号-0"
            }), "getPhoneNumber:ok" == i.errMsg) {
                wx.reportAnalytics("event", {
                    type: o + "-手机号-1"
                }), wx.showLoading({
                    title: "数据请求中..."
                });
                var s = {
                    "X-Token": this.token
                }, a = {
                    sessionId: this.session,
                    iv: i.iv,
                    encryptData: i.encryptedData,
                    app: this.plat
                };
                t.post("https://shapi.xgt588.com/xgt/my-profile/wechat-binded-phone", a, {}, s).then(function(t) {
                    "0" == t.ret ? (console.info("获取手机号成功"), n.setData({
                        step: 2,
                        first: !0
                    }), wx.navigateBack({
                        delta: 10
                    })) : wx.showToast({
                        title: "绑定手机号失败",
                        icon: "none"
                    }), wx.hideLoading();
                }).catch(function(t) {
                    wx.hideLoading(), wx.showToast({
                        title: "绑定手机号失败",
                        icon: "none"
                    }), console.error("获取手机号失败", t);
                });
            }
        },
        onContact: function() {
            wx.reportAnalytics("event", {
                type: o + "-客服"
            });
        }
    };
};