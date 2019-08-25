/**
 * 单例模式
 * 永远只返回一个实例
 */
function test1() {
    // singleton 单项, 一个, 独身
    var Singleton = function (name) {
        this.name = name;
        // instance 实例
        this.instance = null;
    };

    Singleton.prototype.getName = function () {
        console.log(this.name);
    };

    Singleton.queryInstance = function (name) {
        if (!this.instance) {
            this.instance = new Singleton(name)
        }
        return this.instance;
    }

    var a = Singleton.queryInstance('a');
    var b = Singleton.queryInstance('b');

    console.log(a);  // {name: 'a', instance: null}
    console.log(b);  // {name: 'a', instance: null}
    console.log(a === b);  // true

}
// test1();

/**
 * 透明的单例模式
 */
function test2() {
    var CreateDiv = (function () {
        var instance;
        var CreateDiv = function (html) {
            if (instance) {
                return instance;
            }
            this.html = html;

            this.init();

            return instance = this;
        };

        CreateDiv.prototype.init = function () {
            var div = document.createElement('div');
            div.innerHTML = this.html;
            document.body.appendChild(div);
        };

        return CreateDiv;
    })();

    var a = new CreateDiv('a');
    var b = new CreateDiv('b');

    console.log(a);
    console.log(b);
    console.log(a === b);
}
test2();

/**
 * 使用代理实现单例模式
 */
function test3() {
    var CreateDiv = function (html) {
        this.html = html;
        this.init();
    }
    CreateDiv.prototype.init = function () {
        var div = document.createElement('div');
        div.innerHTML = this.html;
        document.body.appendChild(div);
    }
    // 将负责管理单例的逻辑移到了代理类中.
    // 这样CreateDiv 就变成了一个普通的类
    var ProxySingletonCreateDiv = (function () {
        var instance;
        return function (html) {
            if (!instance) {
                instance = new CreateDiv(html);
            }
            return instance;
        }
    })();

    var a = new ProxySingletonCreateDiv('a');
    var b = new ProxySingletonCreateDiv('b');

}
// test3();

/**
 * 惰性单例
 * 在需要的时候才创建对象实例
 */
function test4() {

    // 这个函数就是创建一个 通用的惰性单例模式
    var getSingle = function (fn) {
        var result;
        return function () {
            return result || (result = fn.apply(this, arguments))
        }
    };

    // 以下的都是实例对象的 职责. 将两种区分开来
    var createLoginLayer = function () {
        var div = document.createElement('div');

        div.innerHTML = '我是登录浮框';

        div.style.display = 'none';

        document.body.appendChild(div);

        return div;
    };

    var createSingleLoginLayer = getSingle(createLoginLayer);

    document.getElementById('loginBtn').onclick = function () {
        var loginLayer = createSingleLoginLayer();
        loginLayer.style.display = 'block';
    }
}
// test4();
