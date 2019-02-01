/**
 * 面向切面编程(AOP)
 */
function test1() {

    Function.prototype.before = function (beforeFn) {
        // 主要 理解这个 this 指向. 谁调用指向谁
        var _self = this;
        return function() {
            // 谁调用 this 指向谁
            beforeFn.apply(this, arguments);

            // 返回原函数的调用
            return _self.apply(this, arguments);
        }
    }

    Function.prototype.after = function (afterFn) {
        // 主要 理解这个 this 指向. 谁调用指向谁
        var _self = this;
        return function () {

            // 先调用 原函数
            var ret = _self.apply(this, arguments);

            // 在执行 after 谁调用 this 指向谁
            afterFn.apply(this, arguments);

            // 返回 原函数的调用
            return ret;
        }
    };

    var func = function () {
        console.log(2);
    };

    // 绑定 before 和 after
    func = func.before(function () {
        console.log(1);
    }).after(function () {
        console.log(3);
    });

    func();

    // func 实际上现在指向的是 after 返回的函数
    // 而 after 中的 _self 是 before 返回的函数
    // 在 before 中的 _self 是 原函数
    // 所以再执行 func() 时
    // 先执行 after 返回的函数,
    // 然后先执行 before 返回的函数
    // 在执行 beforeFn,
    // 然后在 执行 原函数 并且返回原函数的值
    // 在 after 返回的函数中 暂时 保留 原函数的返回值
    // 执行 afterFn
    // 最终在返回 原函数的值

};
// test1();

/**
 * 函数科里化(currying)
 */
function test2() {

    // 计算每月的开销
    function fn1() {
        var monthlyCost = 0;
        var cost = function (money) {
            monthlyCost += money;
        }

        cost(100);
        cost(200);
        cost(300);

        console.log(monthlyCost);
    }
    // fn1()


    // 只需要在月底计算一次
    function fn2() {
        var cost = (function () {
            var args = [];
            return function () {
                if (arguments.length === 0) {
                    var money = 0;
                    for (var i = 0; i < args.length; i++) {
                        money += args[i];
                    }
                    return money;
                } else {
                    // 妙哉, 省去了遍历 arguments
                    [].push.apply(args, arguments);
                    // args = [...args, ...arguments];
                }
            }
        })();

        cost(100);
        cost(200);
        cost(300);

        console.log(cost());
    }
    // fn2();

    // 通用写法 currying 函数科里化
    function fn3() {
        var currying = function(fn) {
            var args = [];
            return function func() {
                if (arguments.length === 0) {
                    return fn.apply(this, args);
                } else {
                    [].push.apply(args, arguments);
                    // arguments.callee 返回正被执行的 Function 对象
                    // 不建议使用
                    // return arguments.callee;
                    return func;
                }
            }
        }

        var cost = (function () {
            var money = 0;
            return function () {
                for (var i = 0, l = arguments.length; i < l; i++) {
                    money += arguments[i];
                }
                return money;
            }
        })();

        cost = currying(cost);

        cost(100);
        cost(200);

        console.log(cost());
    }
    fn3();
}
// test2();

/**
 * uncuurying
 * 将泛化的 this 提取出来
 *
 */
function test3() {
    Function.prototype.uncurrying = function () {
        var self = this;
        return function () {
            var obj = Array.prototype.shift.call(arguments);
            return self.apply(obj, arguments);
        }
    }

    // 另一种实现方式
    Function.prototype.uncurrying = function () {
        var self = this;
        return function () {
            // call.apply(); 不是很明白
            return Function.prototype.call.apply(self, arguments);
        }
    }

    var push = Array.prototype.push.uncurrying();

    var obj = {
        // length: 3,
        0: 1,
        1: 2,
        3: 4
    }

    push(obj, 5);

    console.log(obj);
}
// test3();


/**
 * 函数节流
 * 解决函数被触发的频率太高
 * 限制同一个函数被频繁调用
 */
function test4() {

    var throttle = function (fn, interval) {
        var _self = fn,
            timer,
            firstTime = true;

        return function () {
            var agr = arguments,
                _me = this;

            if (firstTime) {
                _self.apply(_me, agr);
                return firstTime = false;
            }

            if (timer) {
                return false;
            }

            timer = setTimeout(function () {
                clearTimeout(timer);
                timer = null;
                _self.apply(_me, agr);
            }, interval || 500);
        }
    }


    // 测试
    // var execute = function () {
    //     console.log(2);
    // }

    var execute = throttle(function () {
        console.log(2);
    }, 1000);

    setInterval(function () {
        execute();
    }, 300);

}
// test4();


/**
 * 惰性加载函数
 * 每次进去分支判断时, 重写原函数
 */
function test5() {
    var addEvent = function (elem, type, handler) {
        if (window.addEventListener) {
            addEvent = function (elem, type, handler) {
                elem.addEventListener(type, handler, false);
            }
        } else if (window.attachEvent) {
            addEvent = function (elem, type, handler) {
                elem.attachEvent('on' + type, handler);
            }
        }
        addEvent(elem, type, handler);
    }
}
test5();
