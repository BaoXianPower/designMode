/**
 * create by 2019-01-14 on jbx
 */

// 丢失的 this
function test1() {
    var obj = {
        myName: 'sven',
        getName: function () {
            return this.myName;
        }
    }

    console.log(obj.getName());

    var getName2 = obj.getName;
    console.log(getName2()); // 在这里就是作为普通函数调用
}

test1();
