/** 
 * 命令模式
 * 指的是一个执行某些特定事情的指令
 * 设计模式的主题: 总是把不变的事物和变化的事物分离开来
 * 在javascript 中, 函数作为一等对象, 
 * 所以, 命令模式其实是回调函数的一个面向对象的替代品
 */

function test1() {

    // 设置命令
    var setCommand = function(button, func) {
        button.onclick = function () {
            func();
        }
    } 

    // 命令集合
    var MenuBar = {
        refresh: function() {
            console.log('刷新菜单界面');
        }
    };

    // 命令触发条件 receiver 接受者
    var RefreshMenuBarCommand = function (receiver) {
        return function() {
            receiver.refresh();
        }
    }

    var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
    
    // 绑定命令
    setCommand(button1, refreshMenuBarCommand);
}