noodle.element = new class extends noodle.object.constructor {
    _toDataStr(args) {
        //Vars from args{
        var noodle = args.noodle;
        //If the object has already been serialized and has an idMap, use those. Otherwise, toSerial
        if (args.serialized && args.idMap) {
            var serialized = args.serialized;
            var idMap = args.idMap;
        }
        else
            var { serialized: serialized, idMap: idMap } = noodle.any._toSerial(args);
        //}

        var str = '';

        for (var i in serialized.obj) {

            if (i === 'children')
                var a = 42;

            var child = serialized.obj[i];
            if (!noodle.element.dataStrExcl[i] && child !== null && child !== '') {
                if (!child)
                    debugger; //TODO: Figure out why I want to pause here
                str += i + ':' + noodle.any._toDataStr({
                    noodle: noodle,
                    val: child.val,
                    obj: child.obj,
                    serialized: child,
                    idMap: idMap
                }).str;
            }
        }
        str = noodle.any._constructorOf({
            noodle: noodle,
            val: serialized.val
            //TODO: Seems like null pops up here sometimes
        }).name + serialized.id + '|' + str.length + '|' + str;

        return { str: str, idMap: idMap };
    }
    _fromDataStr(args) {
        //console.log('noodle.element.fromDataStr');

        args.idMap = args.idMap || {};
        var { noodle: noodle, str: str, val, constr: constr, idMap: idMap } = args;

        var tagName = constr.name.substr(4).split('Element')[0].toLowerCase();
        args.val = val = val || document.createElement(tagName); //TODO: What about {}?

        //Example: str == "42|26|a:String5|hellob:Number(7)y:Boolean1|"
        var i = str.indexOf('|'); //i == 2
        var id = str.substr(0, i); //id == 42
        idMap[id] = val;

        str = str.substr(i + 1); //str == "26|a:String5|hellob:Number(7)y:Boolean1|"
        i = str.indexOf('|'); //i == 2
        var length = parseInt(str.substr(0, i)); //length == 26
        str = str.substr(i + 1);
        var strRest = str.substr(length); //strRest == "y:Boolean1|"
        str = str.substr(0, length); //str == "a:String5|hellob:Number(7)"

        while (str) {
            i = str.indexOf(':'); //i == 1
            var key = str.substr(0, i); //key == "a"

            args.str = str.substr(i + 1); //args.str == "String5|hellob:Number(7)"
            args.val = undefined;
            var { val: prop, strRest: str } = noodle.any._fromDataStr(args); //str == "b:Number(7)"
            Object.defineProperty(val, key, { value: prop }); //val.a == "hello"
        }

        return { noodle: noodle, val: val, strRest: strRest };
    }
}();
noodle.element.dataStrExcl = {
    classList: true,
    innerHTML: true,
    parentNode: true,
    parentElement: true,
    offsetparent: true,
    nextElementSibling: true,
    previousElementSibling: true,
    nextSibling: true,
    previousSibling: true
    /*firstElementChild: true,
    lastElementChild: true*/

}

/*Object.defineProperties(Element.prototype, {
    toDataStr: {
        enumerable: false,
        writable: true,
        configurable: true,
        value(args = {}) {
            args.val = this;
            args.noodle = args.noodle || args.val.noodle || noodle;

            return noodle.element._toDataStr(args);
        }
    }
});*/

//HTMLDivElement.prototype.constructor = undefined;


Element.prototype.constructor = function (doc = document) {
    debugger;
    /*var tagName = this.constructor.name.substr(4).split('Element')[0].toLowerCase();
    doc.createElement(tagName);*/
};

Object.defineProperties(Element, {
    fromDataStr: {
        enumerable: false,
        writable: true,
        configurable: true,
        value(args) {
            return args.noodle.element._fromDataStr(args);
        }
    }
});

Object.defineProperties(Element.prototype, {
    toDataStr: {
        enumerable: false,
        writable: true,
        configurable: true,
        value(args = {}) {
            args.val = this;
            args.noodle = args.noodle || args.val.noodle || noodle;

            return noodle.element._toDataStr(args);
        }
    }
});