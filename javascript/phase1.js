var tokenize = function(rogram)
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
var standard_env = function()
{       
        Env = {'+': function (p,q) { return p+q;},
               '-': function (p,q) {return p-q;},
               '*': function (p,q) {return p*q;},
               '/': function (p,q) {return p/q;}
               }
	return Env;
}
var global_env = standard_env();
var eval = function(x,env)
{	 var env = env || global_env;
	

	if (typeof x == "string"){
		return env[x];
		}
	else if (typeof x == "number"){
		return x;
		}
	else if (x[0] == "define"){
		var var_=x[1];
		var exp = x[2];
		env[var_]=eval(exp,env);
		}
	else if (x[0] == "begin"){
                var val;
                for (var i=1;i<x.length;i+=1){
                        val=eval(x[i], env);
                }
                return val;       
        }
        else{  
           
               var  proc = eval(x[0], env);
                return proc(eval(x[1],env), eval(x[2]), env);
            
        }
		
}

var program = "(begin (define n 100)(+ n 10))"
var l = parse(program);
//console.log(l);
console.log(eval(l));  
