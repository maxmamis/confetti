var slice = Array.prototype.slice;

function copy () {
	var dest = arguments[0],
		src = slice.call(arguments, 1);

	for (var i = 0; i < src.length; i++) {
		for (var key in src[i]) {
			dest[key] = src[i][key];
		}
	}
}

function bind (fn, ctx) {
	return function () {
		return fn.apply(ctx, arguments);
	}
}

function isFunction (obj) {
	var checkType = {};
	return obj && checkType.toString.call(obj) === '[object Function]';
}

function Module () {
	this.bindMethods();

	if (this.parent && this.parent.init && isFunction (this.parent.init)) {
		this.parent.init.apply(this, arguments);
	}
	
	if (this.init && isFunction (this.init)) {
		this.init.apply(this, arguments);
	}
}

Module.extend = function (instance, static) {
	var tmp = this;
	var obj = function () {
		return tmp.apply(this, arguments);
	}

	// Copy the instance methods
	copy(obj.prototype, this.prototype, instance);
	
	// Copy the static methods
	copy(obj, this, static);
	
	// Set up the "parent" object
	obj.prototype.parent = this.prototype;
		
	return obj;
}

Module.prototype.bindMethods = function () {
	for (var key in this) {
		if (isFunction (this[key])) {
			this[key] = bind(this[key], this);
		}
	}
}