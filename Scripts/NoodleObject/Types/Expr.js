noodle.expr = {
    //Evaluation states{
    alwaysReady: 0,
    ready: 1,
    done: 2,
    wait: 3,
    //}

    //Functions{

    //Creates a new expression
    new(noodle, func, args = [], ans, noodleExp, state = noodle.expr.ready) { //TODO: Should state be done if ans isn't undefined/null?
        var expr = {
            noodleExp: noodleExp,
            func: func,
            args: args,
            ans: ans,
            state: state
        };
        Object.defineProperty(expr, 'type', { enumerable: false, writable: true, configurable: true, value: 'expr'});
        return expr;
    },

    //Returns expression with obj as answer
    fromObj(noodle, obj, noodleExp = noodle.expr.defaultNoodle(noodle, obj)) {
        return noodle.expr.new(
            noodle, //noodle
            function (noodle, obj) { //func
                return obj;
            },
            [],
            obj, //ans
            noodleExp, //noodleExp
            noodle.expr.done //state
        );
    },
    allFromObj(noodle, objs, noodleExp) {
        for (var i in objs) {
            objs[i] = noodle.expr.fromObj(noodle, objs[i], noodleExp);
        }
        return objs;
    },

    newGenerator(noodle, obj, noodleExp){
        if(typeof obj === 'object' || typeof obj ==='function'){
            noodleExp = noodleExp || noodle.expr.defaultNoodle(noodle, obj);
            return noodle.expr.new(
                noodle,
                function(noodle, obj){
                    return noodle.object.binClonePlus(noodle, obj);
                },
                [noodleExp, noodle.expr.fromObj(noodle, obj, noodleExp)], //TODO: Should I really use noodleExp as first argument?
                null,
                noodleExp,
                noodle.expr.alwaysReady
            );
        }
        return noodle.expr.fromObj(noodle, obj, noodleExp);
    },
    newGenerators(noodle, objs, noodleExps = []){
        var gens = new Array(objs.length);
        for(var i in objs){
            gens[i] = noodle.expr.newGenerator(noodle, objs[i], noodleExps[i]);
        }
        return gens;
    },

    ref(noodle, exp, noodleExp) {
        noodle.expr.new(noodle, function (val) { return val; }, [exp], undefined, noodleExp);
    },
    defaultNoodle(noodle, obj) {
        var innerNoodleExp = noodle.expr.new(noodle, function (noodle) { return noodle; }, [noodle], noodle, null, noodle.expr.done) //Can't use fromObj
        innerNoodleExp.noodleExp = innerNoodleExp; //TODO: Let outer noodleExp use itself? Needs parent
        return noodle.expr.new(
            noodle,
            function (noodle, obj) {
                if (obj && obj.parent)
                    return noodle.expr.eval(noodle, obj.parent.noodleExp) || noodle;
                return noodle;//Should this be considered bad?
            },
            noodle.expr.allFromObj(noodle, [noodle, obj], innerNoodleExp),
            null,
            innerNoodleExp,
            noodle.expr.alwaysReady
        );
    },

    eval(noodle, exp) {
        if (exp.state <= noodle.expr.ready) {
            var args = exp.args.concat(Array.from(arguments).slice(2, arguments.length)); //TODO: Move this to evalAll?
            exp.state = noodle.expr.wait;
            exp.ans = exp.func.apply(undefined, noodle.expr.evalAll(noodle, args));
            exp.state = noodle.expr.done;
        }
        return exp.ans;
    },
    evalAll(noodle, exps) {
        var ansList = new exps.constructor;
        for (var i in exps) {
            //if (i != 'parent' && i != 'parNode') {
            ansList[i] = noodle.expr.eval(noodle, exps[i]);
            //}
        }
        return ansList;
    }
    //}
};