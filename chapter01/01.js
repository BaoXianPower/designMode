
/**
 * 多态
 */

function basic() {
    var makeSound = function(animal) {
        if (animal instanceof Duck) {
            console.log('嘎嘎嘎');
        }
        else if (animal instanceof Chicken) {
            console.log('咯咯咯');
        }
    };

    var Duck = function () {};

    var Chicken = function () {};

    makeSound(new Duck());

    makeSound(new Chicken());
}

// basic();

/**
 * 多态的含义: 同一操作用与不同的对象上面, 可以产生不同的解释和不同的执行结果
 * 背后的思想: 将 '做什么' 和 '谁去做以及怎么样去做' 分离开来.
 *            本质就是 将 不变的事 和 可变的事 分离开来
 */

function basic1() {
    var makeSound = function(animal) {
        animal.sound();
    }

    var Duck = function() {};

    Duck.prototype.sound = function() {
        console.log('嘎嘎嘎');
    }

    var Chicken = function () {}

    Chicken.prototype.sound = function () {
        console.log('咯咯咯');
    };

    var Dog = function() {};

    Dog.prototype.sound = function() {
        console.log('汪汪汪');
    }

    makeSound(new Duck());

    makeSound(new Chicken());

    makeSound(new Dog());
}

// basic1();


/**
 *
 */
function basic2() {
    // 根对象就是 Object.prototype

    var obj1 = new Object();

    var obj2 = {};

    console.log(Object.getPrototypeOf(obj1) === Object.prototype); // true

    console.log(Object.getPrototypeOf(obj2) === Object.prototype); // true

}

basic2();




















