(function (_root, $) {

	config = {
		G: .001,
		spreadX: .5,
		spreadZ: 3,
		rotation: .5,
		emitAtOnce: 60,
		radius: 20
	}

	// var colors = ['red', 'green', 'blue', 'purple', 'orange'];
	var colors = ['#EED6CE', '#D5F1E2', '#C9E2ED', '#DBECC6', '#EBF5E0', '#F6EEDF', '#EBEEA5', '#ECA19D']

	var slomo = false;

	function createParticleElement ($root) {
		$el = $('<div />').addClass('particle');

		if (random(0,1) == 1) {
			$el.addClass('circle');
		}

		$el.text('0');

		$root.append($el);
		return $el;
	}

	var Particle = Module.extend({
		init: function (x, y, rad, ivx, ivy, ivz, $root) {
			this.exists = true;
			this.x = x;
			this.y = y;
			this.z = 0;

			this.ry = 0;
			this.rz = 0;
			this.rx = 0;

			this.blur = 0;
			this.blurChange = false;

			this.color = randomChoice(colors);

			this.radius = rad;


			this.initialX = x;
			this.initialY = y;
			this.initialZ = 0;
			this.initialVelocity = {
				x: ivx,
				y: ivy,
				z: ivz,
				rx: randomFloat(config.rotation, -config.rotation),
				ry: randomFloat(config.rotation, -config.rotation),
				rx: randomFloat(config.rotation, -config.rotation)
			}

			this.initialT = currentTime();

			this.$el = createParticleElement($root);
			this.$el.css({
				top: 0,
				left: 0,
				width: this.radius,
				height: this.radius,
				backgroundColor: this.color
			});
		},

		kill: function () {
			this.exists = false;
			this.$el.remove();
		},

		move: function () {
			var t = this.currentT - this.initialT,
				ix = this.initialX, iy = this.initialY, iz = this.initialZ,
				irvx = this.initialVelocity.rx, irvy = this.initialVelocity.ry, irvz = this.initialVelocity.rz,
				ivx = this.initialVelocity.x, ivy = this.initialVelocity.y, ivz = this.initialVelocity.z;

			this.x = ix + (ivx * t);
			this.y = iy + (ivy * t) + ((config.G * (t * t)) * .5);
			this.z = iz + (ivz * t);

			this.setBlur();

			this.rx = irvx * t;
			this.ry = irvy * t;
			this.rz = irvz * t;


			if (this.y > window.innerHeight * 2) {
				this.kill();
			}
		},

		setBlur: function () {
			var blur = 0, z = Math.abs(this.z);

			if (z > 250) {
				blur = 1;
			} else if (z > 300) {
				blur = 2;
			} else if (z > 325) {
				blur = 3;
			} else if (z > 350) {
				blur = 4;
			} else if (z > 375) {
				blur = 5;
			} else if (z > 400) {
				blur = 6;
			} else if (z > 425) {
				blur = 7;
			} else if (z > 1250) {
				blur = 8;
			} else if (z > 1300) {
				blur = 9;
			} else if (z > 1350) {
				blur = 10;
			} else if (z > 1400) {
				blur = 11;
			} else if (z > 1425) {
				blur = 12;
			} else if (z > 1450) {
				blur = 13;
			} else if (z > 1475) {
				blur = 14;
			} else if (z > 1500) {
				blur = 15;
			}

			// this.$el.text('!' + blur + '!' + this.blur + '!' + parseInt(z));
			if (this.blur !== blur) {
				this.blur = blur;
				this.blurChange = true;
			} else {
				this.blurChange = false;
			}
		},

		draw: function () {
			var update = {
				'-webkit-transform': 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateX(' + this.rx + 'deg) rotateY(' + this.ry + 'deg) rotateZ(' + this.rx + 'deg)',
			};

			if (this.blurChange) {
				update['-webkit-filter'] = 'blur(' + this.blur + 'px)';
			}

			// this.$el.css(update);
			for (var key in update) {
				// console.log(key, this.cssUpdate[key]);
				this.$el[0].style[key] = update[key];
			}

			if (this.blurChange) {
				this.$el.text(parseInt(this.z));
			}
			// this.$el.text(parseInt(this.z));

		},

		render: function (t) {
			this.currentT = t;
			this.move();
			this.draw();
		}
	});

	var ParticleGenerator = Module.extend({
		init: function ($root) {
			this.particles = [];		
			requestAnimationFrame(this.render);
			this.intervalID = 0;
			this.emitting = false;
			this.velocityY = -.6;
			this.$root = $root;
			this.radius = config.radius;
			this.lastFrame = 0;
			this.fpsTrack = [];
		},

		set: function (param, value) {
			this[param] = value;
		},

		beginEmitting: function (rate, slow) {
			if (this.emitting) {
				return;
			}

			slomo = !!slow;
			var _this = this;

			this.intervalID = setInterval(function () {
				for (var i = 0; i < config.emitAtOnce; i++) {
					_this.emitParticle(_this.radius);
				}
			}, rate);

			this.emitting = true;
		},

		stopEmitting: function () {
			clearInterval(this.intervalID);
			this.emitting = false;
		},

		emitParticle: function (size) {
			var p = new Particle(this.x, this.y, size, randomFloat(config.spreadX, -config.spreadX), randomFloat(this.velocityY - .2, this.velocityY + .2), randomFloat(config.spreadZ, -config.spreadZ), this.$root);
			p.ctx = this.ctx;
			this.particles.push(p);
		},

		location: function (x, y) {
			this.x = x;
			this.y = y;
		},

		render: function () {
			this.renderParticles();
			requestAnimationFrame(this.render);
		},

		renderParticles: function () {
			var currentT = currentTime();
			
			for (var i in this.particles) {
				var p = this.particles[i];
				p.render(currentT);

				if (!p.exists) {
					this.particles.splice(i, 1);
				}
			}
		}
	});

	function random (min, max) {
		if (max === undefined) {
			max = min;
			min = 0;
		}
		return Math.floor(Math.random() * (max - min + 1)) + min; 
	}

	function randomFloat (min, max) {
		if (max === undefined) {
			max = min;
			min = 0;
		}
		
		return Math.random() * (max - min) + min; 
	}

	function randomChoice (arr) {
		var i = random(0, arr.length);
		return arr[i];
	}

	function currentTime () {
		if (slomo) {
			return new Date().getTime() * .1;
		} else {
			return new Date().getTime();
		}
	}

	_root.ParticleGenerator = ParticleGenerator;
}(this, jQuery))