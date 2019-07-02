module.exports = {
    checkSession: function() {
        return new Promise(function(n) {
            wx.checkSession({
                success: function() {
                    n(!0);
                },
                fail: function(e) {
                    console.error("[err]wx.checkSession", e), n(!1);
                }
            });
        });
    },
    login: function() {
        return new Promise(function(n) {
            wx.login({
                success: function(e) {
                    var o = e.code;
                    n(o);
                },
                fail: function(e) {
                    console.error("[err]wx.login", e), n(!1);
                }
            });
        });
    },
    getUserInfo: function() {
        return new Promise(function(n) {
            wx.getUserInfo({
                withCredentials: !0,
                lang: "zh_CN",
                success: function(e) {
                    n(e);
                },
                fail: function(e) {
                    console.error("[err]wx.getUserInfo", e), n(!1);
                }
            });
        });
    },
    getCache: function(n) {
        return wx.getStorageSync(n);
    },
    setCache: function(n, e) {
        wx.setStorageSync(n, e);
    },
    clearCache: function() {
        wx.clearStorageSync();
    }
};