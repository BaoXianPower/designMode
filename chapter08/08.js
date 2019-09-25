/**
 * 发布-订阅模式
 * 定义对象间的一种 一对多 的依赖关系,
 * 当一个对象的状态发生改变时,
 * 所有依赖于它的对象都将得到通知
 */
function test1() {
    // 定义发布者
    var salesOffices = {};

    // 缓存列表, 存放订阅者的回调函数
    salesOffices.clientList = [];

    // 定义订阅者
    salesOffices.listen = function (fn) {
        this.clientList.push(fn);
    }

    // 发布消息
    salesOffices.trigger = function () {
        for (var i = 0, fn; fn = this.clientList[i++];) {
            fn.apply(this, arguments)
        }
    }

    /* 测试 */

    // 订阅者1
    salesOffices.listen(function (price, squareMeter) {
        console.log('价格=' + price);
        console.log('squareMeter= ' + squareMeter);
    });

    // 订阅者2
    salesOffices.listen(function (price, squareMeter) {
        console.log('价格=' + price);
        console.log('squareMeter= ' + squareMeter);
    });

    // 发布消息
    salesOffices.trigger(2000, 80);
    salesOffices.trigger(3000, 100);

    /**
     * 这样做, 只是简单实现了发布-订阅模式
     * 但是这样 导致了, 每个订阅者都会收到发布者发布的消息
     */
}

// test1();

/**
 * 增加缓存, 增加标示 key
 */
function test2() {
    // 定义发布者
    var salesOffices = {};

    // 缓存列表, 存放订阅者的回调函数
    salesOffices.clientList = {};

    // 定义订阅者 (增加缓存, 增加标示 key )
    salesOffices.listen = function (key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    }

    // 发布消息
    salesOffices.trigger = function () {

        // arguments 是一个类数组
        var key = Array.prototype.shift.call(arguments),
            fns = this.clientList[key];

        if (!fns || fns.length === 0) {
            return false;
        }

        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments)
        }
    }

    /* 测试 */

    // 订阅者1
    salesOffices.listen('squareMeter80', function (price) {
        console.log('价格=' + price);
    });

    // 订阅者2
    salesOffices.listen('squareMeter100', function (price) {
        console.log('价格=' + price);
    });

    // 发布消息
    salesOffices.trigger('squareMeter80', 20000);
    salesOffices.trigger('squareMeter100', 30000);
}

// test2();

/**
 * 提炼发布-订阅模式
 */
function test3() {

    // 核心事件
    var event = {
        clientList: {},
        listen: function (key, fn) {
            if (!this.clientList[key]) {
                this.clientList[key] = [];
            }
            this.clientList[key].push(fn);
        },
        trigger: function () {
            var key = Array.prototype.shift.call(arguments),
                fns = this.clientList[key];

            if (!fns || fns.length === 0) {
                return false
            }

            for (var i = 0, fn; fn = fns[i++];) {
                fn.apply(this, arguments);
            }
        }
    }

    // 取消订阅消息
    event.remove = function (key, fn) {
        var fns = this.clientList[key];

        if (!fns) {
            return false;
        }

        if (!fn) {
            // 没有传入fn 取消key对应的所有的订阅
            fns && (fns.length = 0);
        } else {
            // 传入fn 删除对应的fn
            for (var l = fns.length - 1; l >= 0; l--) {
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1)
                }
            }
        }
    }

    // 给任何对象动态增加发布-订阅功能
    var installEvent = function (obj) {
        for (var key in event) {
            if (event.hasOwnProperty(key)) {
                obj[key] = event[key];
            }
        }
    }

    /* 测试 */
    var salesOffices = {};

    installEvent(salesOffices);

    // 订阅者1
    salesOffices.listen('squareMeter80', function (price) {
        console.log('价格=' + price);
    });

    // 订阅者2
    salesOffices.listen('squareMeter100', function (price) {
        console.log('价格=' + price);
    });

    // 发布消息
    salesOffices.trigger('squareMeter80', 20000);
    salesOffices.trigger('squareMeter100', 30000);
}

// test3();


// 案例: 登录模块
function test4() {
    // 登录成功, 发布成功消息
    $.ajax('http://xxx.com/login', function (data) {
        login.trigger('loginSuccess', data);
    });

    // 这种写法也很好
    var header = (function () {
        // 订阅消息
        login.listen('loginSuccess', function (data) {
            header.setAvatar(data);
        })
        return {
            setAvatar: function (data) {
                console.log('header 模块拿到用户信息')
            }
        }
    })();
}

/**
 * 会有三问题:
 * 1. 需要一个类似'中介者'的角色, 把发布者和订阅者联系起来
 *    通过 全局的 Event 来解决
 * 2. 以上必须先订阅, 才能发布
 * 3. 全局命名的冲突
 */
function test5() {
    var Event = (function() {
        var global = this,
            Event,
            _default = 'default';

        Event = function () {
            var _listen,
                _trigger,
                _remove,
                _slice = Array.prototype.slice,
                _shift = Array.prototype.shift,
                _unshift = Array.prototype.unshift,
                namespaceCache = {},
                _create,
                find,
                each = function(arr, fn) {
                    var ret;
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var n = arr[i];
                        ret = fn.call(n, i, n);
                    }
                    return ret;
                };

            _listen = function (key, fn, cache) {
                if (!cache[key]) {
                    cache[key] = [];
                }
                cache[key].push(fn);
            };

            _remove = function (key, cache, fn) {
                if (cache[eky]) {
                    if (fn) {
                        for (var i = cache[key].length - 1; i >= 0; i--) {
                            if (cache[key][i] === fn) {
                                cache[key].splice(i, 1);
                            }
                        }
                    } else {
                        cache[key] = [];
                    }
                }
            }

            _trigger = function () {
                var cache = _shift.call(arguments),
                    key = _shift.call(arguments),
                    args = arguments,
                    _self = this,
                    ret,
                    stack = cache[key];

                if (!stack || !stack.length) {
                    return;
                }

                return each(stack, function () {
                    return this.apply(_self, args);
                })
            };

            _create = function (namespace) {
                namespace = namespace || _default;
                var cache = {},
                    offlineStack = [],
                    ret = {
                        listen: function (key, fn, last) {
                            _listen(key, fn, cache);

                            if (offlineStack === null) {
                                return;
                            }

                            if (last === 'last') {
                                offlineStack.length && offlineStack.pop()();
                            } else {
                                each(offlineStack, function () {
                                    this();
                                })
                            }

                            offlineStack = null;
                        },

                        one: function (key, fn, last) {
                            _remove(key, fn, cache);
                            this.listen(key, fn, last);
                        },

                        remove: function (key, fn) {
                            _remove(key, cache, fn);
                        },

                        trigger: function () {
                            var fn,
                                args,
                                _self = this;

                            _unshift.call(arguments, cache);

                            args = arguments;

                            fn = function () {
                                return _trigger.apply(_self, args);
                            }

                            if (offlineStack) {
                                return offlineStack.push(fn);
                            }

                            return fn();
                        }
                    };

                return  namespace
                            ? (namespaceCache[namespace]
                                ? namespaceCache[namespace]
                                : namespaceCache[namespace] = ret)
                            : ret
            }

            return {
                create: _create,
                one: function (key, fn, last) {
                    var event = this.create();
                    event.one(key, fn, last);
                },
                remove: function (key, fn) {
                    var event = this.create();
                    event.remove(key, fn);
                },
                listen: function (key, fn, last) {
                    var event = this.create();
                    event.listen(key, fn, last);
                },
                trigger: function () {
                    var event = this.create();
                    event.trigger.apply(this, arguments);
                }
            }
        }()

        return Event;
    })();

    console.log(Event);

    /**
     * 优点1: 时间上的解耦,
     * 优点2: 对象之间的解耦
     * 缺点1: 创建订阅者本生要消耗内存和时间
     * 缺点2: 弱化了对象之间的联系之后, 对象之间的必要联系也被埋没
     *
     */
}

// test5();

/**
 * 观察者(observer) 模式 和 发布/订阅模式 之间的区别
 * 本质上的区别及时在调度的地方不同
 * 观察者模式中主体和观察者是互相感知的
 * 发布-订阅模式是借助第三方来实现调度的, 发布者和订阅者之间互不感知
 */
function test6() {
    /**
     * 观察者模式
     */
    function ObserverList() {
        this.observerList = [];
    }

    ObserverList.prototype.add = function (obj) {
        return this.observerList.push(obj);
    }

    ObserverList.prototype.count = function () {
        return this.observerList.length;
    }

    ObserverList.prototype.get = function (index) {
        if (index > -1 && this.observerList.length) {
            return this.observerList[index];
        }
    }

    ObserverList.prototype.indexOf = function (obj, startIndex) {
        var i = startIndex;

        while(i < this.observerList.length) {
            if (this.observerList[i] === obj) {
                return i;
            }
            i++;
        }

        return -1;
    }

    ObserverList.prototype.removeAt = function (index) {
        this.observerList.splice(index, 1);
    }

    // 发布者
    function Subject() {
        this.observers = new ObserverList();
    }

    Subject.prototype.addObserver = function (observer) {
        this.observers.add(observer);
    }

    Subject.prototype.removeObserver = function (observer) {
        this.observers.removeAt(this.observers.indexOf(observer, 0));
    }

    Subject.prototype.notify = function (context) {
        var observerCount = this.observers.count();
        for (var i = 0; i < observerCount; i++) {
            this.observers.get(i).update(context);
        }
    }

    // 观察者
    function Observer() {
        this.update = function () {
            // ...
        }
    }

    // 可以用在 做全选变化
    // 全选控制子节点下的变化每个checkbox的变化
    // subject(发布) 中的目标发生变化. Observer(观察) 能接受到变化

    /**
     * 发布(Publish)/订阅(Subscribe)模式
     */
    var pubsub = {};
    (function (myObject) {
        var topics = {};

        var subUid = -1;

        // 发布
        myObject.publish = function (topic, args) {
            if (!topics[topic]) {
                return false;
            }

            var subscribers = topics[topic],
                len = subscribers ? subscribers.length : 0;

            while (len--) {
                subscribers[len].func(topic, args);
            }

            return this;
        }

        // 订阅者
        myObject.subscribe = function (topic, func) {
            if (!topics[topic]) {
                topics[topic] = [];
            }

            var token = (++subUid).toString();

            topics[topic].push({
                token: token,
                func: func
            })
        }

        // 取消订阅
        myObject.unsubscribe = function (token) {
            for (var m in topics) {
                if (topics[m]) {
                    for (var i = 0, j = topics[m].length; i < j; i++) {
                        if (topics[m][i].token === token) {
                            topics[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return this;
        }
    })(pubsub)
}

test6();
