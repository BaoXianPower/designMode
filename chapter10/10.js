/** 
 * 组合模式
 * 组合模式是将对象组合成树形结构, 以表示 "部分-整体" 的层次结构,
 * 再者, 利用对象的多态性统一对待组合对象和单个对象.
 * (感觉这就是 javascript 鸭子类型, 或者说多态, 就是javascript 的特点.)
 * 理解: 为了表示一堆 层次结构的东西. 将其组合起来.
 * 注意点: 组合模式不是父子关系,
 * 对叶对象操作的一致性,
 * 双向映射关系
 * 利用职责链模式提高组合模式性能.
 */


/**
 * 扫描文件夹
 */
function test1() {

    /* * * * * * 文件夹(Folder) * * * * * * */
    var Folder = function(name) {
        this.name = name;
        this.files = [];
        this.parent = null;
    }

    Folder.prototype.add = function(file) {
        file.parent = this;
        this.files.push(file);
    }

    Folder.prototype.scan = function() {
        console.log('开始扫描文件夹:' + this.name);
        var i = 0,
            len = this.files.length,
            file;
        
        for(; i < len; i++) {
            file = this.files[i];
            file.scan();
        }
    }

    Folder.prototype.remove = function() {
        if (!this.parent) {
            return;
        }
        var i = this.parent.files.length - 1,
            files = this.parent.files,
            file;

        for(; i >= 0; i--) {
            file = files[i];
            if (file === this) {
                files.splice(i, 1);
            }
        }
    }

    /* * * * * * 文件(File) * * * * * * */
    var File = function(name) {
        this.name = name;
        this.parent = null;
    }

    File.prototype.add = function() {
        throw new Error('文件下面不能再添加文件');
    }

    File.prototype.scan = function() {
        console.log('开始扫描文件:' + this.name);
    }

    File.prototype.remove = function() {
        if (!this.parent) {
            return;
        }
        var i = this.parent.files.length - 1,
            files = this.parent.files,
            file;

        for(; i >= 0; i--) {
            file = files[i];
            if (file === this) {
                files.splice(i, 1);
            }
        }
    }
}