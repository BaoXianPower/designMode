/**
 * 迭代器模式
 * 顺序访问一个对象的内部
 * 外部迭代器
 */
function test1() {
    var Iterator = function (obj) {
        var current = 0;

        var next = function () {
            current += 1;
        }

        var isDone = function () {
            return current >= obj.length;
        }

        var getCurrentItem = function () {
            return obj[current];
        }

        return {
            next: next,
            isDone: isDone,
            getCurrentItem: getCurrentItem,
            length: obj.length
        }
    }

    var compare = function (iterator1, iterator2) {
        if (iterator1.length !== iterator2.length) {
            console.log('不相等');
            return;
        }

        while (!iterator1.isDone() && !iterator2.isDone()) {
            if (iterator1.getCurrentItem() !== iterator2.getCurrentItem()) {
                throw new Error('不相等')
            };
            iterator1.next();
            iterator2.next();
        }

        console.log('相等');
    };

    compare(Iterator([1, 3, 4]), Iterator([34]));
    compare(Iterator([1, 3, 5]), Iterator([1, 3, 5]));
    compare(Iterator([1, 3, 4]), Iterator([1, 3, 5]));
}

// test1();
