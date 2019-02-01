/**
 * 策略模式
 */
function test1() {

    // 策略类
    var performanceS = function () {}

    performanceS.prototype.calculate = function (salary) {
        return salary * 4;
    }

    var performanceA = function () {}

    performanceA.prototype.calculate = function (salary) {
        return salary * 3;
    }

    var performanceB = function () {

    }

    performanceB.prototype.calculate = function (salary) {
        return salary * 2;
    }

    // 环境类
    var Bonus = function () {
        this.salary = null;
        this.strategy = null;
    }

    Bonus.prototype.setSalary = function (salary) {
        this.salary = salary;
    }

    Bonus.prototype.setStrategy = function (strategy) {
        this.strategy = strategy;
    }

    Bonus.prototype.getBonus = function () {
        return this.strategy.calculate(this.salary);
    }

    var bonus = new Bonus();
    bonus.setSalary(1000); // 设置原始工资
    bonus.setStrategy(new performanceS()); // 设置策略对象
    console.log(bonus.getBonus());

}

test1();
