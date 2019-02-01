/**
 * 代理模式
 * 缓存代理
 */
function test1() {

    // 原函数
    var multi = function () {
        var a = 1;
        for (var i = 0, l = arguments.length; i < l; i++) {
            a = a * arguments[i];
        }
        console.log(a);
        return a;
    }

    // 代理函数
    var proxyMulti = (function () {
        var cache = {};
        return function () {
            var args = Array.prototype.join.call(arguments, ',');
            if (args in cache) {
                return cache[args];
            }
            return cache[args] = multi.apply(this, arguments);
        }
    })();

    proxyMulti(1, 2, 3, 4, 5);
    proxyMulti(1, 2, 3, 4, 5);
}

test1();
