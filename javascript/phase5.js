var tokenize = function(program)
{
	var list_tokens = program.replace(/\(/g,' ( ').replace(/\)/g,' ) ').trim().split(/\s+/);
	return list_tokens;
}
var parse = function(program)
{
	
	tokens= tokenize(program);
	return read_from_tokens(tokens);
	

}
var read_from_tokens = function(tokens)
{
	token=tokens.shift();
	if (token == "("){
		var L=[];
		while(tokens[0] != ")"){
			L.push(read_from_tokens(tokens))
			}
		tokens.shift();
		return L;
	}
	else if (token == ")" ){
		console.log("unexpected");
	}
	else {
		return atom(token);
	}
}

var atom = function(token)
{
	if (parseInt(token)){
		return parseInt(token);
	}
	else if(isNaN(token)){
		return (token);
	}
	else ;
}
var global_env_ = function(s)
{
        var  env = {};
        var  o = s.o || {};
        if(s.parms.length != 0){
                for(var i = 0; i < s.parms.length; i += 1){
                        env[s.parms[i]] = s.args[i];
                }
        }
        env.find = function (var_){
                if(env.hasOwnProperty(var_)){
                        return env;
                }
                else{
                        return outer.find(var_)
                }
        }
        return env
}

var standard_env = function(env)
{       
        env['+']= function (p,q){ return p+q;},
              env['-']= function (p,q){return p-q;},
               env['*']= function (p,q){return p*q;},
               env['/']= function (p,q){return p/q;},
	       env['>']= function (p,q){return p>q;},
               env['<']= function (p,q){return p<q;},
               env['>=']= function (p,q){return p>=q},
	       env['<=']= function(p,q) {return p<=q;},
               env['==']= function (p,q) {return p==q;},
	       env['equal?']=function(p,q){return p==q;},
               env['eq?']= function(p,q){return p==q;},
               env['not']= function(p){return !p;},
	       env['car']= function(p){return(p.length !==0) ? p[0] : null;},
               env['cdr']= function(p){return(p.length>1) ? p.slice(1) : null;},
	       env['cons']= function(p,q){return [p].concat(p);},
               env['length']= function(p){return p.length; },
	       env['list']= function(p){return Array.prototype.slice.call(arguments);},
               env['list?']= function (p){return(p instanceof Array);},
	       env['map']= function(p){return (Math.apply.max(p));},
	       env['min']=function(p){return(Math.apply.min(p));},
	       env['null?']= function (a){return(a.length == 0);},
	       env['round']=function(p){return(Math.round(p));},
	       env['symbol?']= function(a){return(typeof a == 'string');}
		

	return env;
}
var global_env = standard_env(global_env_({parms: [], args: []}));


	
var eval = function(x, env) 
{
        env = env || global_env;
        if(typeof x == 'string'){
                return env.find(x)[x];
        }
        else if(typeof x == 'number'){
                return x;
        }
        else if(x[0] == 'quote'){
                return x[1];
        }
        else if(x[0] == 'if'){
                var test = x[1];
                var conseq = x[2];
                var alt = x[3];
                if(eval(test, env)){
                        return eval(conseq, env);
                }
                else{
                        return eval(alt, env);
                }
        }
        else if(x[0] == 'set!'){
                env.find(x[1])[x[1]] = eval(x[2], env);
        } 
        else if(x[0] == 'define'){
                var var_ = x[1];
                var exp = x[2];
                env[var_] = eval(exp, env);
                return
        }
        else if(x[0] == 'lambda'){
                var vars = x[1];
                var exp = x[2];
               // console.log(vars);
               // console.log(exp);
                return function(){
                        return eval(exp, env_({parms: vars, args: arguments, outer: env }));
                }
        } 
        else if (x[0] == 'begin'){
                var val;
                var i;
                for(i=1; i < x.length; i += 1){
                        val = eval(x[i], env);
                }
                return val;
        } 
        else{
                var exps = [];
                var j;
                for (j = 0; j < x.length; j += 1) {
                        exps[j] = eval(x[j], env);
                }
                var proc = exps.shift();
                return proc.apply(env, exps);
        }
}

var repl = function(){
        console.log("LISP REPL in Nodejs");
        var stdin = process.stdin;
        var stdout = process.stdout;
        stdin.resume();
        stdout.write(">>>");
        stdin.on('data',function(data){
                data = data.toString().trim();
                if(data == undefined){
                        stdin.write('>>>');
                }
                var result = eval(parse(data))
                if (result != undefined) {
                        stdout.write(result+'\n>>>');
                }
                else {
                        stdout.write('>>>');
                }
        })
}

repl();

