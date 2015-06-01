(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartObjectDer', require('./components/cart/cartObject')).directive('cartButtonsDer', require('./components/cart/cartButtons')).directive('shifter', require('./directives/shifter')).directive('designADer', require('./components/design/designA')).directive('behavior', require('./directives/behavior')).directive('dotDer', require('./components/design/dot')).directive('dotBDer', require('./components/design/dotB')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designBDer', require('./components/design/designB')).directive('regularDer', require('./components/regular/regular')).directive('derivativeDer', require('./components/derivative/derivative')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('designButtonsDer', require('./components/design/designButtons'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartObject":4,"./components/cart/cartPlot":5,"./components/cart/cartSim":6,"./components/derivative/derivative":7,"./components/derivative/derivativeB":8,"./components/design/designA":10,"./components/design/designB":11,"./components/design/designButtons":12,"./components/design/designCartA":13,"./components/design/designCartB":14,"./components/design/dot":16,"./components/design/dotB":17,"./components/regular/regular":20,"./directives/behavior":21,"./directives/d3Der":22,"./directives/datum":23,"./directives/shifter":24,"./directives/texture":25,"./directives/xAxis":26,"./directives/yAxis":27,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
var Cart, Ctrl, _, atan, der, exp, sqrt, template;

_ = require('lodash');

exp = Math.exp, sqrt = Math.sqrt, atan = Math.atan;

Cart = require('./cartData');

template = '<md-button class=\'md-raised\' ng-click=\'vm.click()\' ng-init=\'vm.play()\'>{{vm.paused ? \'PLAY\' : \'PAUSE\'}} </md-button>';

Ctrl = (function() {
  function Ctrl(scope) {
    this.scope = scope;
  }

  Ctrl.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Ctrl.prototype.play = function() {
    var last;
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    last = 0;
    return d3.timer((function(_this) {
      return function(elapsed) {
        var dt;
        dt = elapsed - last;
        Cart.increment(dt / 1000);
        last = elapsed;
        if (Cart.t > 4) {
          Cart.set_t(0);
        }
        _this.scope.$evalAsync();
        return _this.paused;
      };
    })(this), 1);
  };

  Ctrl.prototype.pause = function() {
    return this.paused = true;
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    controller: ['$scope', Ctrl],
    template: template
  };
};

module.exports = der;



},{"./cartData":3,"lodash":undefined}],3:[function(require,module,exports){
var Cart, _, exp;

_ = require('lodash');

exp = Math.exp;

Cart = (function() {
  function Cart(options) {
    var ref;
    this.options = options;
    ref = this.options, this.v0 = ref.v0, this.k = ref.k;
    this.restart();
  }

  Cart.prototype.restart = function() {
    this.t = this.x = 0;
    this.trajectory = _.range(0, 6, 1 / 50).map((function(_this) {
      return function(t) {
        var res, v;
        v = _this.v0 * exp(-_this.k * t);
        return res = {
          v: v,
          x: _this.v0 / _this.k * (1 - exp(-_this.k * t)),
          dv: -_this.k * v,
          t: t
        };
      };
    })(this));
    this.move(0);
    return this.paused = true;
  };

  Cart.prototype.set_t = function(t) {
    this.t = t;
    return this.move(t);
  };

  Cart.prototype.increment = function(dt) {
    this.t += dt;
    return this.move(this.t);
  };

  Cart.prototype.move = function(t) {
    this.v = this.v0 * exp(-this.k * t);
    this.x = this.v0 / this.k * (1 - exp(-this.k * t));
    return this.dv = -this.k * this.v;
  };

  return Cart;

})();

module.exports = new Cart({
  v0: 2,
  k: .8
});



},{"lodash":undefined}],4:[function(require,module,exports){
var Ctrl, der;

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
  }

  Ctrl.prototype.trans = function(tran) {
    return tran.duration(50).ease('linear');
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {
      left: '='
    },
    controllerAs: 'vm',
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    templateUrl: '../app/components/cart/cart.svg',
    bindToController: true,
    restrict: 'A'
  };
};

module.exports = der;



},{}],5:[function(require,module,exports){
var Cart, Ctrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Cart = require('./cartData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'topChart\'>\n	<defs>\n		<clippath id=\'cartPlot\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2-8]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der="{x1: 0 , x2: vm.width, y1: vm.V(0), y2: vm.V(0)}" /> \n		<line class=\'zero-line\' d3-der="{x1: vm.T(0) , x2: vm.T(0), y1: 0, y2: vm.height}" /> \n	</g>\n	<g class=\'main\' clip-path="url(#cartPlot)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.T(vm.point.t) - 16), vm.sthing]\' style=\'font-size: 13px; font-weight: 100;\'>\n				<text class=\'label\' font-size=\'13px\'>$v$</text>\n		</foreignObject>\n		<line class=\'tri v\' d3-der=\'{x1: vm.T(vm.point.t)-1, x2: vm.T(vm.point.t)-1, y1: vm.V(0), y2: vm.V(vm.point.v)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.trajectory)}}\' class=\'fun v\' />\n		<circle r=\'3px\' shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point v\'/>\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.T(4), vm.V(.4)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 20,
      right: 20,
      bottom: 35
    };
    this.V = d3.scale.linear().domain([-.1, 2.5]);
    this.T = d3.scale.linear().domain([-.1, 5]);
    this.point = Cart;
    this.trajectory = Cart.trajectory;
    this.horAxFun = d3.svg.axis().scale(this.T).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.V).ticks(5).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.V(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.T(d.t);
      };
    })(this));
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var rect, t;
        if (!Cart.paused) {
          return;
        }
        rect = event.target.getBoundingClientRect();
        t = _this.T.invert(event.x - rect.left);
        t = Math.max(0, t);
        Cart.set_t(t);
        return _this.scope.$evalAsync();
      };
    })(this);
  }

  Ctrl.property('sthing', {
    get: function() {
      return this.V(this.point.v / 2) - 7;
    }
  });

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.left - this.mar.right;
    this.V.range([this.height, 0]);
    this.T.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":28,"./cartData":3,"angular":undefined,"d3":undefined,"lodash":undefined}],6:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Cart = require('./cartData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height="{{vm.svgHeight}}">\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' transform=\'translate(0,25)\'></g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.Cart = Cart;
    this.mar = {
      left: 30,
      right: 10,
      top: 10,
      bottom: 18
    };
    this.X = d3.scale.linear().domain([-.1, 3]);
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    angular.element(this.window).on('resize', (function(_this) {
      return function() {
        return _this.resize();
      };
    })(this));
  }

  Ctrl.prototype.tran = function(tran) {
    return tran.ease('linear').duration(60);
  };

  Ctrl.property('svgHeight', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = 60;
    this.X.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: template,
    scope: {},
    restrict: 'A',
    bindToController: true,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":28,"./cartData":3,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, Data, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'topChart\'>\n	<defs>\n		<clippath id=\'derClip\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#derClip)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.sthing]\'>\n				<text class=\'tri-label\' >$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(1.65), vm.Ver(1.38)]\'>\n			<text class=\'tri-label\'>$\\sin(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 20,
      right: 20,
      bottom: 35
    };
    this.Ver = d3.scale.linear().domain([-1.5, 1.5]);
    this.Hor = d3.scale.linear().domain([0, 6]);
    this.data = Data.data;
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).tickFormat(function(d) {
      if (Math.floor(d) !== d) {
        return;
      }
      return d;
    }).ticks(5).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var t;
        t = _this.Hor.invert(event.x - event.target.getBoundingClientRect().left);
        Data.move(t);
        return _this.scope.$evalAsync();
      };
    })(this);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.property('sthing', {
    get: function() {
      return this.Ver(this.point.dv / 2 + this.point.v) - 7;
    }
  });

  Ctrl.property('point', {
    get: function() {
      return Data.point;
    }
  });

  Ctrl.property('triangleData', {
    get: function() {
      return this.lineFun([
        {
          v: this.point.v,
          t: this.point.t
        }, {
          v: this.point.dv + this.point.v,
          t: this.point.t + 1
        }, {
          v: this.point.dv + this.point.v,
          t: this.point.t
        }
      ]);
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.top - this.mar.bottom - 8;
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":28,"./derivativeData":9,"angular":undefined,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
var Ctrl, Data, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\'  class=\'topChart\'>\n	<defs>\n		<clippath id=\'dervativeB\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#dervativeB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.data)}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]\'>\n				<text class=\'tri-label\'>$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(.9), vm.Ver(1)]\'>\n			<text class=\'tri-label\'>$\\cos(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]\' class=\'point dv\'/>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 20,
      right: 20,
      bottom: 40
    };
    this.Ver = d3.scale.linear().domain([-1.5, 1.5]);
    this.Hor = d3.scale.linear().domain([0, 6]);
    this.data = Data.data;
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).tickFormat(function(d) {
      if (Math.floor(d) !== d) {
        return;
      }
      return d;
    }).ticks(5).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var t;
        t = _this.Hor.invert(event.x - event.target.getBoundingClientRect().left);
        Data.move(t);
        return _this.scope.$evalAsync();
      };
    })(this);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.property('point', {
    get: function() {
      return Data.point;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.top - this.mar.bottom;
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":28,"./derivativeData":9,"angular":undefined,"d3":undefined,"lodash":undefined}],9:[function(require,module,exports){
var Data, _, dvFun, vFun;

_ = require('lodash');

vFun = Math.sin;

dvFun = Math.cos;

Data = (function() {
  function Data() {
    this.data = _.range(0, 8, 1 / 50).map(function(t) {
      var res;
      return res = {
        dv: dvFun(t),
        v: vFun(t),
        t: t
      };
    });
    this.point = _.sample(this.data);
  }

  Data.prototype.move = function(t) {
    return this.point = {
      dv: dvFun(t),
      v: vFun(t),
      t: t
    };
  };

  return Data;

})();

module.exports = new Data;



},{"lodash":undefined}],10:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'bottomChart\'>\n	<defs>\n		<clippath id=\'plotA\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' behavior=\'vm.drag_rect\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<line d3-der=\'{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.Cart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-der=dot ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(vm.Data.first.t),vm.Ver(vm.Data.first.v)]\' />\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.Hor(4), vm.Ver(.33)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.on_drag = bind(this.on_drag, this);
    this.mar = {
      left: 38,
      top: 0,
      right: 10,
      bottom: 37
    };
    this.Ver = d3.scale.linear().domain([-.1, 2.1]);
    this.Hor = d3.scale.linear().domain([-.1, 5]);
    this.Data = Data;
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).ticks(5).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
    this.drag_rect = d3.behavior.drag().on('dragstart', (function(_this) {
      return function() {
        var rect, t, v;
        d3.event.sourceEvent.stopPropagation();
        event.preventDefault();
        if (event.which === 3) {
          return;
        }
        Data.set_show(true);
        rect = event.toElement.getBoundingClientRect();
        t = _this.Hor.invert(event.x - rect.left);
        v = _this.Ver.invert(event.y - rect.top);
        Data.add_dot(t, v);
        return _this.scope.$evalAsync();
      };
    })(this)).on('drag', (function(_this) {
      return function() {
        return _this.on_drag(_this.selected);
      };
    })(this)).on('dragend', (function(_this) {
      return function() {
        event.preventDefault();
        Data.set_show(true);
        console.log('hello');
        return event.stopPropagation();
      };
    })(this));
    this.drag = d3.behavior.drag().on('dragstart', (function(_this) {
      return function(dot) {
        d3.event.sourceEvent.stopPropagation();
        if (event.which === 3) {
          event.preventDefault();
          Data.remove_dot(dot);
          Data.set_show(false);
          return _this.scope.$evalAsync();
        }
      };
    })(this)).on('drag', this.on_drag);
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('dots', {
    get: function() {
      return Data.dots.filter(function(d) {
        return (d.id !== 'first') && (d.id !== 'last');
      });
    }
  });

  Ctrl.property('selected', {
    get: function() {
      return Data.selected;
    }
  });

  Ctrl.prototype.on_drag = function(dot) {
    Data.update_dot(dot, this.Hor.invert(d3.event.x), this.Ver.invert(d3.event.y));
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.triangleData = function() {
    var point;
    point = this.selected;
    return this.lineFun([
      {
        v: point.v,
        t: point.t
      }, {
        v: point.dv + point.v,
        t: point.t + 1
      }, {
        v: point.dv + point.v,
        t: point.t
      }
    ]);
  };

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.top - this.mar.bottom;
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":28,"./designData":15,"angular":undefined,"d3":undefined}],11:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

angular = require('angular');

d3 = require('d3');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\'  width=\'100%\' class=\'bottomChart\'>\n	<defs>\n		<clippath id=\'plotB\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.V\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$\\dot{v}$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}\'/>\n			<path d3-der=\'{d:vm.lineFun(vm.Data.target_data)}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.Hor(dot.v),vm.Ver(dot.dv)]\' dot-b-der=dot></g>\n		<foreignObject width=\'70\' height=\'30\' y=\'0\' shifter=\'[vm.Hor(1.7), vm.Ver(-1.2)]\'>\n				<text class=\'tri-label\' >$v\'=-.8v$</text>\n		</foreignObject>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 40,
      top: 0,
      right: 10,
      bottom: 37
    };
    this.Ver = d3.scale.linear().domain([-1.9, .1]);
    this.Hor = d3.scale.linear().domain([-.1, 2.15]);
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).ticks(5).orient('left');
    this.Data = Data;
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.v);
      };
    })(this));
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('dots', {
    get: function() {
      return Data.dots.filter(function(d) {
        return (d.id !== 'first') && (d.id !== 'last');
      });
    }
  });

  Ctrl.property('selected', {
    get: function() {
      return Data.selected;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.top - this.mar.bottom;
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":28,"./designData":15,"angular":undefined,"d3":undefined}],12:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template;

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

template = '<md-button ng-click=\'vm.click()\' ng-init=\'vm.play()\'>{{vm.paused ? \'PLAY\' : \'PAUSE\'}} </md-button>';

Ctrl = (function() {
  function Ctrl(scope) {
    this.scope = scope;
  }

  Ctrl.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Ctrl.prototype.play = function() {
    var last;
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    last = 0;
    return d3.timer((function(_this) {
      return function(elapsed) {
        var dt;
        dt = elapsed - last;
        Data.increment(dt / 1000);
        last = elapsed;
        if (Data.t > 4) {
          Data.set_t(0);
        }
        _this.scope.$evalAsync();
        return _this.paused;
      };
    })(this), 1);
  };

  Ctrl.prototype.pause = function() {
    return this.paused = true;
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":28,"./designData":15,"angular":undefined,"d3":undefined}],13:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./fakeCart');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'cartChart\' ng-attr-height=\'{{::vm.svgHeight}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.x) + ",30)"}\' >\n			<rect class=\'cart\' x=\'-12.5\' width=\'25\' y=\'-12.5\' height=\'25\'/>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 10,
      right: 10,
      top: 0,
      bottom: 0
    };
    this.X = d3.scale.linear().domain([-.1, 3]);
    this.sample = _.range(0, 5, .5);
    this.Cart = Cart;
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.tran = function(tran) {
      return tran.ease('linear').duration(60);
    };
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('svgHeight', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = 60;
    this.X.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: template,
    scope: {},
    restrict: 'A',
    bindToController: true,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":28,"./fakeCart":18,"d3":undefined,"lodash":undefined}],14:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./trueCart');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'cartChart\' ng-attr-height=\'{{::vm.svgHeight}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.x) + ",30)"}\' >\n			<rect class=\'cart\' x=\'-12.5\' width=\'25\' y=\'-12.5\' height=\'25\'/>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 10,
      right: 10,
      top: 10,
      bottom: 15
    };
    this.X = d3.scale.linear().domain([-.1, 3]);
    this.sample = _.range(0, 5, .5);
    this.Cart = Cart;
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.tran = function(tran) {
      return tran.ease('linear').duration(60);
    };
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = 60;
    this.X.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  Ctrl.property('svgHeight', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: template,
    scope: {},
    restrict: 'A',
    bindToController: true,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":28,"./trueCart":19,"d3":undefined,"lodash":undefined}],15:[function(require,module,exports){
var Cart, Data, Dot, _, d3;

_ = require('lodash');

require('../../helpers');

Cart = require('../cart/cartData');

d3 = require('d3');

Dot = (function() {
  function Dot(t1, v1) {
    this.t = t1;
    this.v = v1;
    this.id = _.uniqueId('dot');
  }

  return Dot;

})();

Data = (function() {
  function Data() {
    var firstDot, lastDot, midDot;
    this.t = this.x = 0;
    this.Cart = Cart;
    firstDot = new Dot(0, Cart.v0);
    firstDot.id = 'first';
    midDot = new Dot(Cart.trajectory[10].t, Cart.trajectory[10].v);
    lastDot = new Dot(6, Cart.trajectory[10].v);
    lastDot.id = 'last';
    this.dots = [firstDot, midDot, lastDot];
    this.correct = this.show = false;
    this.first = firstDot;
    this.target_data = Cart.trajectory;
    this.update_dots();
    this.select_dot(this.dots[1]);
  }

  Data.prototype.set_show = function(v) {
    return this.show = v;
  };

  Data.prototype.set_t = function(t) {
    return this.t = t;
  };

  Data.prototype.increment = function(dt) {
    return this.t += dt;
  };

  Data.prototype.select_dot = function(dot) {
    return this.selected = dot;
  };

  Data.prototype.add_dot = function(t, v) {
    var newDot;
    newDot = new Dot(t, v);
    this.dots.push(newDot);
    return this.update_dot(newDot, t, v);
  };

  Data.prototype.remove_dot = function(dot) {
    this.dots.splice(this.dots.indexOf(dot), 1);
    return this.update_dots();
  };

  Data.prototype.update_dots = function() {
    this.dots.sort(function(a, b) {
      return a.t - b.t;
    });
    return this.dots.forEach(function(dot, i, k) {
      var dt, prev;
      prev = k[i - 1];
      if (dot.id === 'last') {
        dot.v = prev.v;
        return;
      }
      if (prev) {
        dt = dot.t - prev.t;
        dot.x = prev.x + dt * (dot.v + prev.v) / 2;
        return dot.dv = (dot.v - prev.v) / Math.max(dt, .0001);
      } else {
        dot.x = 0;
        return dot.dv = 0;
      }
    });
  };

  Data.prototype.update_dot = function(dot, t, v) {
    if (dot.id === 'first') {
      return;
    }
    this.select_dot(dot);
    dot.t = t;
    dot.v = v;
    this.update_dots();
    return this.correct = Math.abs(Cart.k * dot.v + dot.dv) < 0.05;
  };

  return Data;

})();

module.exports = new Data;



},{"../../helpers":28,"../cart/cartData":3,"d3":undefined,"lodash":undefined}],16:[function(require,module,exports){
var Ctrl, Data, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

template = '<circle class=\'dot large\'></circle>\n<circle class=\'dot small\' r=\'4\'></circle>';

Ctrl = (function() {
  function Ctrl(scope, el) {
    var big, circ, rad, sel;
    this.scope = scope;
    this.el = el;
    this.mouseover = bind(this.mouseover, this);
    this.mouseout = bind(this.mouseout, this);
    rad = 7;
    sel = d3.select(this.el[0]);
    big = sel.select('circle.dot.large').attr('r', rad);
    circ = sel.select('circle.dot.small');
    big.on('mouseover', this.mouseover).on('contextmenu', function() {
      event.preventDefault();
      return event.stopPropagation();
    }).on('mousedown', function() {
      return big.transition('grow').duration(150).ease('cubic').attr('r', rad * 1.7);
    }).on('mouseup', function() {
      return big.transition('grow').duration(150).ease('cubic-in').attr('r', rad * 1.3);
    }).on('mouseout', this.mouseout);
    this.scope.$watch((function(_this) {
      return function() {
        return (Data.selected === _this.dot) && Data.show;
      };
    })(this), function(v, old) {
      if (v) {
        big.transition('grow').duration(150).ease('cubic-out').attr('r', rad * 1.5).transition().duration(150).ease('cubic-in').attr('r', rad * 1.3);
        return circ.transition().duration(150).ease('cubic-out').style({
          'stroke-width': 2.5
        });
      } else {
        big.transition('shrink').duration(350).ease('bounce-out').attr('r', rad);
        return circ.transition().duration(100).ease('cubic').style({
          'stroke-width': 1.6,
          stroke: 'white'
        });
      }
    });
  }

  Ctrl.prototype.mouseout = function() {
    Data.set_show(false);
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.mouseover = function() {
    Data.select_dot(this.dot);
    Data.set_show(true);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: template,
    controllerAs: 'vm',
    scope: {
      dot: '=dotDer'
    },
    bindToController: true,
    controller: ['$scope', '$element', Ctrl],
    restrict: 'A'
  };
};

module.exports = der;



},{"./designData":15}],17:[function(require,module,exports){
var Ctrl, Data, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

template = '<circle class=\'dot small\' r=\'4\'></circle>';

Ctrl = (function() {
  function Ctrl(scope, el) {
    var circ;
    this.scope = scope;
    this.el = el;
    this.mouseover = bind(this.mouseover, this);
    this.mouseout = bind(this.mouseout, this);
    circ = d3.select(this.el[0]);
    circ.on('mouseover', this.mouseover).on('mouseout', this.mouseout);
    this.scope.$watch((function(_this) {
      return function() {
        return (Data.selected === _this.dot) && Data.show;
      };
    })(this), function(v, old) {
      if (v) {
        return circ.transition().duration(150).ease('cubic-out').style({
          'stroke-width': 2.5
        });
      } else {
        return circ.transition().duration(100).ease('cubic').style({
          'stroke-width': 1.6,
          stroke: 'white'
        });
      }
    });
  }

  Ctrl.prototype.mouseout = function() {
    Data.set_show(false);
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.mouseover = function() {
    Data.select_dot(this.dot);
    Data.set_show(true);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: template,
    controllerAs: 'vm',
    scope: {
      dot: '=dotBDer'
    },
    bindToController: true,
    controller: ['$scope', '$element', Ctrl],
    restrict: 'A'
  };
};

module.exports = der;



},{"./designData":15}],18:[function(require,module,exports){
var Cart, Data, _;

Data = require('./designData');

_ = require('lodash');

Cart = (function() {
  function Cart() {}

  Cart.prototype.loc = function(t) {
    var a, dt, dv, i, ref, ref1;
    i = _.findLastIndex(Data.dots, function(d) {
      return d.t <= t;
    });
    a = Data.dots[i];
    dt = t - a.t;
    dv = (ref = (ref1 = Data.dots[i + 1]) != null ? ref1.dv : void 0) != null ? ref : 0;
    return a.x + a.v * dt + 0.5 * dv * Math.pow(dt, 2);
  };

  Cart.property('x', {
    get: function() {
      return this.loc(Data.t);
    }
  });

  return Cart;

})();

module.exports = new Cart;



},{"./designData":15,"lodash":undefined}],19:[function(require,module,exports){
var Cart, Data, Real, _;

Real = require('../cart/cartData');

Data = require('./designData');

_ = require('lodash');

require('../../helpers');

Cart = (function() {
  function Cart() {}

  Cart.prototype.loc = function(t) {
    var traj;
    return traj = _.findLast(Real.trajectory, function(d) {
      return d.t <= t;
    }).x;
  };

  Cart.property('x', {
    get: function() {
      return this.loc(Data.t);
    }
  });

  return Cart;

})();

module.exports = new Cart;



},{"../../helpers":28,"../cart/cartData":3,"./designData":15,"lodash":undefined}],20:[function(require,module,exports){
var Ctrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'topChart\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'18\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\'>$t$</text>\n		</foreignObject>\n\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' ng-class=\'{"correct": vm.correct}\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.v )}\'/>\n		<circle r=\'3px\' shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.data)}\' class=\'fun v\' />\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.v/2) - 7]\'>\n				<text class=\'tri-label\' font-size=\'13px\'>$y$</text>\n		</foreignObject>\n		<foreignObject width=\'200\' height=\'30\' shifter=\'[vm.Hor(1), vm.Ver(.9)]\'>\n			<text class=\'tri-label\'>$5(t-.5)(t-1)(t-1)^2$</text>\n		</foreignObject>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    var vFun;
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 10,
      right: 20,
      bottom: 40
    };
    this.Ver = d3.scale.linear().domain([-1, 1]);
    this.Hor = d3.scale.linear().domain([0, 2.5]);
    this.horAxFun = d3.svg.axis().scale(this.Hor).tickFormat(d3.format('d')).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).ticks(5).tickFormat(function(d) {
      if (Math.floor(d) !== d) {
        return;
      }
      return d;
    }).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
    vFun = function(t) {
      return 5 * (t - .5) * (t - 1) * Math.pow(t - 2, 2);
    };
    this.data = _.range(0, 3, 1 / 50).map(function(t) {
      var res;
      return res = {
        v: vFun(t),
        t: t
      };
    });
    this.point = _.sample(this.data);
    this.correct = false;
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var rect, t, v;
        rect = event.target.getBoundingClientRect();
        t = _this.Hor.invert(event.x - rect.left);
        v = vFun(t);
        _this.point = {
          t: t,
          v: v
        };
        _this.correct = Math.abs(_this.point.v) <= 0.05;
        return _this.scope.$evalAsync();
      };
    })(this);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.left - this.mar.right;
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":28,"angular":undefined,"d3":undefined,"lodash":undefined}],21:[function(require,module,exports){
var drag;

drag = function($parse) {
  var directive;
  return directive = {
    link: function(scope, el, attr) {
      var sel;
      sel = d3.select(el[0]);
      return sel.call($parse(attr.behavior)(scope));
    }
  };
};

module.exports = drag;



},{}],22:[function(require,module,exports){
var angular, d3, der;

d3 = require('d3');

angular = require('angular');

der = function($parse) {
  var directive;
  return directive = {
    restrict: 'A',
    scope: {
      d3Der: '=',
      tran: '='
    },
    link: function(scope, el, attr) {
      var sel, u;
      sel = d3.select(el[0]);
      u = 't-' + Math.random();
      return scope.$watch('d3Der', function(v) {
        if (scope.tran) {
          return sel.transition(u).attr(v).call(scope.tran);
        } else {
          return sel.attr(v);
        }
      }, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],23:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],24:[function(require,module,exports){
var d3, der;

d3 = require('d3');

der = function($parse) {
  var directive;
  return directive = {
    link: function(scope, el, attr) {
      var reshift;
      reshift = function(v) {
        return d3.select(el[0]).attr('transform', "translate(" + v[0] + "," + v[1] + ")");
      };
      return scope.$watch(function() {
        return $parse(attr.shifter)(scope);
      }, reshift, true);
    }
  };
};

module.exports = der;



},{"d3":undefined}],25:[function(require,module,exports){
var Ctrl, angular, d3, der, textures;

angular = require('angular');

d3 = require('d3');

textures = require('textures');

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    var t;
    this.scope = scope;
    this.el = el;
    this.window = window;
    t = textures.lines().orientation("3/8", "7/8").size(4).stroke('#E6E6E6').strokeWidth(.6);
    t.id('myTexture');
    d3.select(this.el[0]).select('svg').call(t);
  }

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: '<svg height="0px" style="position: absolute;" width="0px"></svg>',
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined,"textures":undefined}],26:[function(require,module,exports){
var angular, d3, der;

d3 = require('d3');

angular = require('angular');

der = function($window) {
  var directive;
  return directive = {
    controller: angular.noop,
    controllerAs: 'vm',
    bindToController: true,
    restrict: 'A',
    templateNamespace: 'svg',
    scope: {
      scale: '=',
      height: '=',
      fun: '='
    },
    link: function(scope, el, attr, vm) {
      var ref, sel, update, xAxisFun;
      xAxisFun = (ref = vm.fun) != null ? ref : d3.svg.axis().scale(vm.scale).orient('bottom');
      sel = d3.select(el[0]).classed('x axis', true);
      update = (function(_this) {
        return function() {
          xAxisFun.tickSize(-vm.height);
          return sel.call(xAxisFun);
        };
      })(this);
      update();
      scope.$watch('vm.scale.domain()', update, true);
      scope.$watch('vm.scale.range()', update, true);
      return scope.$watch('vm.height', update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],27:[function(require,module,exports){
var angular, d3, der;

d3 = require('d3');

angular = require('angular');

der = function($window) {
  var directive;
  return directive = {
    controller: angular.noop,
    controllerAs: 'vm',
    bindToController: true,
    restrict: 'A',
    templateNamespace: 'svg',
    scope: {
      scale: '=',
      width: '=',
      fun: '='
    },
    link: function(scope, el, attr, vm) {
      var ref, sel, update, yAxisFun;
      yAxisFun = (ref = vm.fun) != null ? ref : d3.svg.axis().scale(vm.scale).orient('left');
      sel = d3.select(el[0]).classed('y axis', true);
      update = (function(_this) {
        return function() {
          yAxisFun.tickSize(-vm.width);
          return sel.call(yAxisFun);
        };
      })(this);
      update();
      scope.$watch('vm.scale.domain()', update, true);
      scope.$watch('vm.scale.range()', update, true);
      return scope.$watch('vm.scale.ticks()', update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],28:[function(require,module,exports){
'use strict';
module.exports.timeout = function(fun, time) {
  return d3.timer((function(_this) {
    return function() {
      fun();
      return true;
    };
  })(this), time);
};

Function.prototype.property = function(prop, desc) {
  return Object.defineProperty(this.prototype, prop, desc);
};



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRPYmplY3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlRGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQnV0dG9ucy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25EYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kb3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2RvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Zha2VDYXJ0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi90cnVlQ2FydC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9yZWd1bGFyL3JlZ3VsYXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvYmVoYXZpb3IuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZDNEZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZGF0dW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvc2hpZnRlci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy90ZXh0dXJlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3hBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3lBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQUEsQ0FBQTtBQUFBLElBQUEsd0JBQUE7O0FBQUEsT0FDQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEdBR0EsR0FBTSxPQUFPLENBQUMsTUFBUixDQUFlLFNBQWYsRUFBMEIsQ0FBQyxPQUFBLENBQVEsa0JBQVIsQ0FBRCxDQUExQixDQUNMLENBQUMsU0FESSxDQUNNLFlBRE4sRUFDb0IsT0FBQSxDQUFRLG9CQUFSLENBRHBCLENBRUwsQ0FBQyxTQUZJLENBRU0sWUFGTixFQUVvQixPQUFBLENBQVEsb0JBQVIsQ0FGcEIsQ0FHTCxDQUFDLFNBSEksQ0FHTSxZQUhOLEVBR29CLE9BQUEsQ0FBUSwyQkFBUixDQUhwQixDQUlMLENBQUMsU0FKSSxDQUlNLGVBSk4sRUFJdUIsT0FBQSxDQUFRLDhCQUFSLENBSnZCLENBS0wsQ0FBQyxTQUxJLENBS00sZ0JBTE4sRUFLd0IsT0FBQSxDQUFRLCtCQUFSLENBTHhCLENBTUwsQ0FBQyxTQU5JLENBTU0sU0FOTixFQU1rQixPQUFBLENBQVEsc0JBQVIsQ0FObEIsQ0FPTCxDQUFDLFNBUEksQ0FPTSxZQVBOLEVBT29CLE9BQUEsQ0FBUSw2QkFBUixDQVBwQixDQVFMLENBQUMsU0FSSSxDQVFNLFVBUk4sRUFRa0IsT0FBQSxDQUFRLHVCQUFSLENBUmxCLENBU0wsQ0FB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QU4sQ0FBYSxtQkFBYixFQUFrQyxNQUFsQyxFQUEyQyxJQUEzQyxDQVpBLENBQUE7QUFBQSxNQWFBLEtBQUssQ0FBQyxNQUFOLENBQWEsa0JBQWIsRUFBaUMsTUFBakMsRUFBMEMsSUFBMUMsQ0FiQSxDQUFBO2FBY0EsS0FBSyxDQUFDLE1BQU4sQ0FBYSxrQkFBYixFQUFpQyxNQUFqQyxFQUEwQyxJQUExQyxFQWZLO0lBQUEsQ0FUTjtJQUZJO0FBQUEsQ0FITixDQUFBOztBQUFBLE1BZ0NNLENBQUMsT0FBUCxHQUFpQixHQWhDakIsQ0FBQTs7Ozs7QUNBQSxZQUFBLENBQUE7QUFBQSxNQUVNLENBQUMsT0FBTyxDQUFDLE9BQWYsR0FBeUIsU0FBQyxHQUFELEVBQU0sSUFBTixHQUFBO1NBQ3ZCLEVBQUUsQ0FBQyxLQUFILENBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUEsR0FBQTtBQUNSLE1BQUEsR0FBQSxDQUFBLENBQUEsQ0FBQTthQUNBLEtBRlE7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFULEVBR0MsSUFIRCxFQUR1QjtBQUFBLENBRnpCLENBQUE7O0FBQUEsUUFTUSxDQUFBLFNBQUUsQ0FBQSxRQUFWLEdBQXFCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtTQUNuQixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUFDLENBQUEsU0FBdkIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsRUFEbUI7QUFBQSxDQVRyQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuYXBwID0gYW5ndWxhci5tb2R1bGUgJ21haW5BcHAnLCBbcmVxdWlyZSAnYW5ndWxhci1tYXRlcmlhbCddXG5cdC5kaXJlY3RpdmUgJ2hvckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveEF4aXMnXG5cdC5kaXJlY3RpdmUgJ3ZlckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveUF4aXMnXG5cdC5kaXJlY3RpdmUgJ2NhcnRTaW1EZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0U2ltJ1xuXHQuZGlyZWN0aXZlICdjYXJ0T2JqZWN0RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydE9iamVjdCdcblx0LmRpcmVjdGl2ZSAnY2FydEJ1dHRvbnNEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0QnV0dG9ucydcblx0LmRpcmVjdGl2ZSAnc2hpZnRlcicgLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvc2hpZnRlcidcblx0LmRpcmVjdGl2ZSAnZGVzaWduQURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQSdcblx0LmRpcmVjdGl2ZSAnYmVoYXZpb3InLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvYmVoYXZpb3InXG5cdC5kaXJlY3RpdmUgJ2RvdERlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZG90J1xuXHQuZGlyZWN0aXZlICdkb3RCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kb3RCJ1xuXHQuZGlyZWN0aXZlICdkYXR1bScsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kYXR1bSdcblx0LmRpcmVjdGl2ZSAnZDNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZDNEZXInXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkJEZXInICwgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CJ1xuXHQuZGlyZWN0aXZlICdyZWd1bGFyRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL3JlZ3VsYXIvcmVndWxhcidcblx0LmRpcmVjdGl2ZSAnZGVyaXZhdGl2ZURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmUnXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUInXG5cdC5kaXJlY3RpdmUgJ2NhcnRQbG90RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydFBsb3QnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkNhcnRBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QSdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQ2FydEJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRCJ1xuXHQuZGlyZWN0aXZlICd0ZXh0dXJlRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3RleHR1cmUnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkJ1dHRvbnNEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkJ1dHRvbnMnXG5cbmxvb3BlciA9IC0+XG4gICAgc2V0VGltZW91dCggKCktPlxuICAgIFx0XHRcdGQzLnNlbGVjdEFsbCAnY2lyY2xlLmRvdC5sYXJnZSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdncm93J1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMzQpJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ3NocmluaydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjApJ1xuICAgIFx0XHRcdGxvb3BlcigpXG4gICAgXHRcdCwgMTAwMClcblxubG9vcGVyKClcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8bWQtYnV0dG9uIGNsYXNzPSdtZC1yYWlzZWQnIG5nLWNsaWNrPSd2bS5jbGljaygpJyBuZy1pbml0PSd2bS5wbGF5KCknPnt7dm0ucGF1c2VkID8gJ1BMQVknIDogJ1BBVVNFJ319IDwvbWQtYnV0dG9uPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUpLT5cblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRsYXN0ID0gMFxuXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3Rcblx0XHRcdFx0Q2FydC5pbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBDYXJ0LnQgPiA0XG5cdFx0XHRcdFx0Q2FydC5zZXRfdCAwXG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0QHBhdXNlZFxuXHRcdFx0LCAxXG5cblx0cGF1c2U6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsIEN0cmxdXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbntleHB9ID0gTWF0aFxuXG5jbGFzcyBDYXJ0XG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpLT5cblx0XHR7QHYwLCBAa30gPSBAb3B0aW9uc1xuXHRcdEByZXN0YXJ0KClcblx0cmVzdGFydDogLT5cblx0XHRAdCA9IEB4ID0gMFxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwICwgNiAsIDEvNTBcblx0XHRcdC5tYXAgKHQpPT5cblx0XHRcdFx0diA9IEB2MCAqIGV4cCgtQGsgKiB0KVxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR2OiB2XG5cdFx0XHRcdFx0eDogQHYwL0BrICogKDEtZXhwKC1Aayp0KSlcblx0XHRcdFx0XHRkdjogLUBrKnZcblx0XHRcdFx0XHR0OiB0XG5cdFx0QG1vdmUgMFxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdHNldF90OiAodCktPlxuXHRcdEB0ID0gdFxuXHRcdEBtb3ZlIHRcblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCs9ZHRcblx0XHRAbW92ZSBAdFxuXHRtb3ZlOiAodCktPlxuXHRcdEB2ID0gQHYwICogZXhwKCAtQGsgKiB0KVxuXHRcdEB4ID0gQHYwL0BrICogKDEtZXhwKC1Aayp0KSlcblx0XHRAZHYgPSAtQGsqQHZcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FydCB7djA6IDIsIGs6IC44fSIsIlxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjooQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblxuXHR0cmFuczogKHRyYW4pLT5cblx0XHR0cmFuXG5cdFx0XHQuZHVyYXRpb24gNTBcblx0XHRcdC5lYXNlICdsaW5lYXInXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IFxuXHRcdFx0IyBkYXRhOiAnPUNhcnRPYmplY3REZXInXG5cdFx0XHRsZWZ0OiAnPSdcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJHdpbmRvdycsIEN0cmxdXG5cdFx0dGVtcGxhdGVVcmw6ICcuLi9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnQuc3ZnJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5DYXJ0ID0gcmVxdWlyZSAnLi9jYXJ0RGF0YSdcbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBjbGFzcz0ndG9wQ2hhcnQnPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdjYXJ0UGxvdCc+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5UJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzE3JyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWy0zMSwgdm0uaGVpZ2h0LzItOF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj1cInt4MTogMCAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlYoMCksIHkyOiB2bS5WKDApfVwiIC8+IFxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiB2bS5UKDApICwgeDI6IHZtLlQoMCksIHkxOiAwLCB5Mjogdm0uaGVpZ2h0fVwiIC8+IFxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNjYXJ0UGxvdClcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWyh2bS5UKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5zdGhpbmddJyBzdHlsZT0nZm9udC1zaXplOiAxM3B4OyBmb250LXdlaWdodDogMTAwOyc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyBmb250LXNpemU9JzEzcHgnPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLlQodm0ucG9pbnQudCktMSwgeDI6IHZtLlQodm0ucG9pbnQudCktMSwgeTE6IHZtLlYoMCksIHkyOiB2bS5WKHZtLnBvaW50LnYpfScvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0udHJhamVjdG9yeSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGNpcmNsZSByPSczcHgnIHNoaWZ0ZXI9J1t2bS5UKHZtLnBvaW50LnQpLCB2bS5WKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50IHYnLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSc3MCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLlQoNCksIHZtLlYoLjQpXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiQyZV57LS44dH0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMjBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiAzNVxuXG5cdFx0QFYgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwyLjVdXG5cdFx0QFQgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSw1XVxuXG5cdFx0QHBvaW50ID0gQ2FydFxuXHRcdEB0cmFqZWN0b3J5ID0gQ2FydC50cmFqZWN0b3J5XG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFRcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXHRcdFxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFYgZC52XG5cdFx0XHQueCAoZCk9PiBAVCBkLnRcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRcdEBtb3ZlID0gKGV2ZW50KSA9PlxuXHRcdFx0aWYgbm90IENhcnQucGF1c2VkIHRoZW4gcmV0dXJuXG5cdFx0XHRyZWN0ID0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHR0ID0gQFQuaW52ZXJ0IGV2ZW50LnggLSByZWN0LmxlZnRcblx0XHRcdHQgPSBNYXRoLm1heCAwICwgdFxuXHRcdFx0Q2FydC5zZXRfdCB0XG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdGhpbmcnLCBnZXQ6LT5cblx0XHRAVihAcG9pbnQudi8yKSAtIDdcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xue21pbn0gPSBNYXRoXG5DYXJ0ID0gcmVxdWlyZSAnLi9jYXJ0RGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD1cInt7dm0uc3ZnSGVpZ2h0fX1cIj5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19Jz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgbmctbW91c2Vtb3ZlPSd2bS5tb3ZlKCRldmVudCknIC8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5YJyBmdW49J3ZtLmF4aXNGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBjYXJ0LW9iamVjdC1kZXIgbGVmdD0ndm0uWCh2bS5DYXJ0LngpJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwLDI1KSc+PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QENhcnQgPSBDYXJ0XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHJpZ2h0OiAxMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0Ym90dG9tOiAxOFxuXHRcdEBYID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsM10gXG5cblx0XHRAYXhpc0Z1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAWFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScgLCAoKT0+QHJlc2l6ZSgpXG5cblx0dHJhbjogKHRyYW4pLT5cblx0XHR0cmFuLmVhc2UgJ2xpbmVhcidcblx0XHRcdC5kdXJhdGlvbiA2MFxuXG5cdEBwcm9wZXJ0eSAnc3ZnSGVpZ2h0JywgZ2V0Oi0+IEBoZWlnaHQgKyBAbWFyLnRvcCtAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gNjBcblx0XHRAWC5yYW5nZShbMCwgQHdpZHRoXSlcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkRhdGEgPSByZXF1aXJlICcuL2Rlcml2YXRpdmVEYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J3RvcENoYXJ0Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0nZGVyQ2xpcCc+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBuZy1tb3VzZW1vdmU9J3ZtLm1vdmUoJGV2ZW50KScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLkhvcicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVyQ2xpcClcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKDApfScvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uZGF0YSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KS0xLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WZXIodm0ucG9pbnQudiksIHkyOiB2bS5WZXIoKHZtLnBvaW50LnYgKyB2bS5wb2ludC5kdikpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uc3RoaW5nXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiRcXFxcZG90e3l9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMS42NSksIHZtLlZlcigxLjM4KV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXHNpbih0KSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXHRcdFx0XG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM1XG5cblx0XHRAVmVyID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMS41LDEuNV1cblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFswLDZdXG5cblx0XHRAZGF0YSA9IERhdGEuZGF0YVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tGb3JtYXQgKGQpLT5cblx0XHRcdFx0aWYgTWF0aC5mbG9vciggZCApICE9IGQgdGhlbiByZXR1cm5cblx0XHRcdFx0ZFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWZXIgZC52XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0XHREYXRhLm1vdmUgdFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRAcHJvcGVydHkgJ3N0aGluZycsIGdldDotPlxuXHRcdEBWZXIoQHBvaW50LmR2LzIgKyBAcG9pbnQudikgLSA3XG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDotPlxuXHRcdERhdGEucG9pbnRcblxuXHRAcHJvcGVydHkgJ3RyaWFuZ2xlRGF0YScsIGdldDotPlxuXHRcdEBsaW5lRnVuIFt7djogQHBvaW50LnYsIHQ6IEBwb2ludC50fSwge3Y6QHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50KzF9LCB7djogQHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50fV1cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tIC0gOFxuXHRcdEBWZXIucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QEhvci5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5EYXRhID0gcmVxdWlyZSAnLi9kZXJpdmF0aXZlRGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnICBjbGFzcz0ndG9wQ2hhcnQnPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdkZXJ2YXRpdmVCJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBuZy1tb3VzZW1vdmU9J3ZtLm1vdmUoJGV2ZW50KScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLkhvcicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVydmF0aXZlQilcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKDApfScvPlxuXHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLmRhdGEpfScgY2xhc3M9J2Z1biBkdicgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeDI6IHZtLkhvcih2bS5wb2ludC50KS0xLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKHZtLnBvaW50LmR2KX0nLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWyh2bS5Ib3Iodm0ucG9pbnQudCkgLSAxNiksIHZtLlZlcih2bS5wb2ludC5kdiouNSktNl0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiRcXFxcZG90e3l9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoLjkpLCB2bS5WZXIoMSldJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxjb3ModCkkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGNpcmNsZSByPSczcHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLnBvaW50LnQpLCB2bS5WZXIodm0ucG9pbnQuZHYpXScgY2xhc3M9J3BvaW50IGR2Jy8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXHRcdFx0XG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDQwXG5cblx0XHRAVmVyID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMS41LDEuNV1cblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFswLDZdXG5cblx0XHRAZGF0YSA9IERhdGEuZGF0YVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tGb3JtYXQgKGQpLT5cblx0XHRcdFx0aWYgTWF0aC5mbG9vciggZCApICE9IGQgdGhlbiByZXR1cm5cblx0XHRcdFx0ZFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWZXIgZC5kdlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRcdEBtb3ZlID0gKGV2ZW50KSA9PlxuXHRcdFx0dCA9IEBIb3IuaW52ZXJ0IGV2ZW50LnggLSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuXHRcdFx0RGF0YS5tb3ZlIHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDotPlxuXHRcdERhdGEucG9pbnRcblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xudkZ1biA9IE1hdGguc2luXG5kdkZ1biA9IE1hdGguY29zXG5cbmNsYXNzIERhdGFcblx0Y29uc3RydWN0b3I6IC0+XG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAgLCA4ICwgMS81MFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHRkdjogZHZGdW4gdFxuXHRcdFx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0XHRcdHQ6IHRcblxuXHRcdEBwb2ludCA9IF8uc2FtcGxlIEBkYXRhXG5cblx0bW92ZTogKHQpLT5cblx0XHRAcG9pbnQgPSBcblx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHR2OiB2RnVuIHRcblx0XHRcdHQ6IHRcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGF0YSIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSdib3R0b21DaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3Bsb3RBJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIGJlaGF2aW9yPSd2bS5kcmFnX3JlY3QnIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVmVyJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5Ib3InIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWy0zOCwgdm0uaGVpZ2h0LzJdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3Bsb3RBKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nID5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiB2bS5Ib3IoMCksIHgyOiB2bS5Ib3IoMCksIHkxOiB2bS5oZWlnaHQsIHkyOiAwfVwiIC8+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC50KS0xLCB4Mjogdm0uSG9yKHZtLnNlbGVjdGVkLnQpLTEsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0uc2VsZWN0ZWQudil9Jy8+XG5cdFx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGEoKX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0XHQ8bGluZSBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnQpKzEsIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCkrMSwgeTE6IHZtLlZlcih2bS5zZWxlY3RlZC52KSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC52ICsgdm0uc2VsZWN0ZWQuZHYpfScgY2xhc3M9J3RyaSBkdicgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEuQ2FydC50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHRhcmdldCcgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEuZG90cyl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGcgbmctcmVwZWF0PSdkb3QgaW4gdm0uZG90cyB0cmFjayBieSBkb3QuaWQnIGRhdHVtPWRvdCBzaGlmdGVyPSdbdm0uSG9yKGRvdC50KSx2bS5WZXIoZG90LnYpXScgYmVoYXZpb3I9J3ZtLmRyYWcnIGRvdC1kZXI9ZG90ID48L2c+XG5cdFx0XHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0uRGF0YS5maXJzdC50KSx2bS5WZXIodm0uRGF0YS5maXJzdC52KV0nIC8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nNzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoNCksIHZtLlZlciguMzMpXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiQyZV57LS44dH0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzhcblx0XHRcdHRvcDogMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHRib3R0b206IDM3XG5cblx0XHRAVmVyID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsMi4xXVxuXG5cdFx0QEhvciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cblx0XHRARGF0YSA9IERhdGFcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBASG9yXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWZXJcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXHRcdFxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRAZHJhZ19yZWN0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsICgpPT5cblx0XHRcdFx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCA9PSAzXG5cdFx0XHRcdFx0cmV0dXJuIFxuXHRcdFx0XHREYXRhLnNldF9zaG93IHRydWVcblx0XHRcdFx0cmVjdCA9IGV2ZW50LnRvRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdFx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0XHR2ICA9IEBWZXIuaW52ZXJ0IGV2ZW50LnkgLSByZWN0LnRvcFxuXHRcdFx0XHREYXRhLmFkZF9kb3QgdCAsIHZcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgPT4gQG9uX2RyYWcgQHNlbGVjdGVkXG5cdFx0XHQub24gJ2RyYWdlbmQnLD0+XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0RGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0XHRcdGNvbnNvbGUubG9nICdoZWxsbydcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0IyBAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0XHRAZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuXHRcdFx0Lm9uICdkcmFnc3RhcnQnLCAoZG90KT0+XG5cdFx0XHRcdGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoID09IDNcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0RGF0YS5yZW1vdmVfZG90IGRvdFxuXHRcdFx0XHRcdERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCBAb25fZHJhZ1xuXG5cblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ2RvdHMnLCBnZXQ6LT4gXG5cdFx0RGF0YS5kb3RzLmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0JylcblxuXHRAcHJvcGVydHkgJ3NlbGVjdGVkJywgZ2V0Oi0+XG5cdFx0RGF0YS5zZWxlY3RlZFxuXG5cdG9uX2RyYWc6IChkb3QpPT4gXG5cdFx0XHQjIGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdCMgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHQjIFx0cmV0dXJuXG5cdFx0XHREYXRhLnVwZGF0ZV9kb3QgZG90LCBASG9yLmludmVydChkMy5ldmVudC54KSwgQFZlci5pbnZlcnQoZDMuZXZlbnQueSlcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHR0cmlhbmdsZURhdGE6LT5cblx0XHRwb2ludCA9IEBzZWxlY3RlZFxuXHRcdEBsaW5lRnVuIFt7djogcG9pbnQudiwgdDogcG9pbnQudH0sIHt2OnBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudCsxfSwge3Y6IHBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudH1dXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci50b3AgLSBAbWFyLmJvdHRvbVxuXHRcdEBWZXIucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QEhvci5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknICB3aWR0aD0nMTAwJScgY2xhc3M9J2JvdHRvbUNoYXJ0Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncGxvdEInPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVmVyJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5WJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1stMzgsIHZtLmhlaWdodC8yXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kXFxcXGRvdHt2fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNwbG90QilcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiB2bS5Ib3IoMCksIHgyOiB2bS5Ib3IoMCksIHkxOiB2bS5oZWlnaHQsIHkyOiAwfVwiIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLnRhcmdldF9kYXRhKX19JyBjbGFzcz0nZnVuIHRhcmdldCcgLz5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKDApLCB4Mjogdm0uSG9yKHZtLnNlbGVjdGVkLnYpLCB5MTogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC5kdil9Jy8+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudiksIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudiksIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpfScvPlxuXHRcdFx0XHQ8cGF0aCBkMy1kZXI9J3tkOnZtLmxpbmVGdW4odm0uRGF0YS50YXJnZXRfZGF0YSl9JyBjbGFzcz0nZnVuIGNvcnJlY3QnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuY29ycmVjdH0nIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgc2hpZnRlcj0nW3ZtLkhvcihkb3Qudiksdm0uVmVyKGRvdC5kdildJyBkb3QtYi1kZXI9ZG90PjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSc3MCcgaGVpZ2h0PSczMCcgeT0nMCcgc2hpZnRlcj0nW3ZtLkhvcigxLjcpLCB2bS5WZXIoLTEuMildJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JHYnPS0uOHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogNDBcblx0XHRcdHRvcDogMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHRib3R0b206IDM3XG5cblx0XHRAVmVyID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMS45LCAuMV1cblxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwyLjE1XVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRARGF0YSA9IERhdGFcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLmR2XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudlxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPlxuXHRcdERhdGEuZG90c1xuXHRcdFx0LmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0JylcblxuXHRAcHJvcGVydHkgJ3NlbGVjdGVkJywgZ2V0Oi0+XG5cdFx0RGF0YS5zZWxlY3RlZFxuXHRcdFxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdIFxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xudGVtcGxhdGUgPSAnJydcblx0PG1kLWJ1dHRvbiBuZy1jbGljaz0ndm0uY2xpY2soKScgbmctaW5pdD0ndm0ucGxheSgpJz57e3ZtLnBhdXNlZCA/ICdQTEFZJyA6ICdQQVVTRSd9fSA8L21kLWJ1dHRvbj5cbicnJ1xuXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUpLT5cblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRsYXN0ID0gMFxuXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3Rcblx0XHRcdFx0RGF0YS5pbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBEYXRhLnQgPiA0XG5cdFx0XHRcdFx0RGF0YS5zZXRfdCAwXG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0QHBhdXNlZFxuXHRcdFx0LCAxXG5cblx0cGF1c2U6IC0+IEBwYXVzZWQgPSB0cnVlXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzPSByZXF1aXJlICdkMydcbnttaW59ID0gTWF0aFxucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbkNhcnQgPSByZXF1aXJlICcuL2Zha2VDYXJ0J1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J2NhcnRDaGFydCcgbmctYXR0ci1oZWlnaHQ9J3t7Ojp2bS5zdmdIZWlnaHR9fSc+XG5cdFx0PGcgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fSc+XG5cdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgY2xhc3M9J2JhY2tncm91bmQnLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlgnIGZ1bj0ndm0uYXhpc0Z1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCcgbmctcmVwZWF0PSd0IGluIHZtLnNhbXBsZScgZDMtZGVyPSd7dHJhbnNmb3JtOiBcInRyYW5zbGF0ZShcIiArIHZtLlgodm0uQ2FydC5sb2ModCkpICsgXCIsMClcIn0nIHN0eWxlPSdvcGFjaXR5Oi4zOyc+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0aW1lLWxpbmUnIGQzLWRlcj0ne3gxOiAwLCB4MjogMCwgeTE6IDAsIHkyOiA2MH0nIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uWCh2bS5DYXJ0LngpICsgXCIsMzApXCJ9JyA+XG5cdFx0XHRcdDxyZWN0IGNsYXNzPSdjYXJ0JyB4PSctMTIuNScgd2lkdGg9JzI1JyB5PSctMTIuNScgaGVpZ2h0PScyNScvPlxuXHRcdFx0PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMTBcblx0XHRcdHJpZ2h0OiAxMFxuXHRcdFx0dG9wOiAwXG5cdFx0XHRib3R0b206IDBcblx0XHRcdFxuXHRcdEBYID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsM10gXG5cblx0XHRAc2FtcGxlID0gXy5yYW5nZSggMCwgNSAsIC41KVxuXG5cdFx0QENhcnQgPSBDYXJ0XG5cblx0XHRAYXhpc0Z1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAWFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB0cmFuID0gKHRyYW4pLT5cblx0XHRcdHRyYW4uZWFzZSAnbGluZWFyJ1xuXHRcdFx0XHQuZHVyYXRpb24gNjBcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScgLCBAcmVzaXplXG5cblx0QHByb3BlcnR5ICdzdmdIZWlnaHQnICwgZ2V0Oi0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSA2MFxuXHRcdEBYLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xue21pbn0gPSBNYXRoXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuQ2FydCA9IHJlcXVpcmUgJy4vdHJ1ZUNhcnQnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBjbGFzcz0nY2FydENoYXJ0JyBuZy1hdHRyLWhlaWdodD0ne3s6OnZtLnN2Z0hlaWdodH19Jz5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19Jz5cblx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBjbGFzcz0nYmFja2dyb3VuZCcvPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uWCcgZnVuPSd2bS5heGlzRnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHgkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCcgbmctcmVwZWF0PSd0IGluIHZtLnNhbXBsZScgZDMtZGVyPSd7dHJhbnNmb3JtOiBcInRyYW5zbGF0ZShcIiArIHZtLlgodm0uQ2FydC5sb2ModCkpICsgXCIsMClcIn0nIHN0eWxlPSdvcGFjaXR5Oi4zOyc+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0aW1lLWxpbmUnIGQzLWRlcj0ne3gxOiAwLCB4MjogMCwgeTE6IDAsIHkyOiA2MH0nIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uWCh2bS5DYXJ0LngpICsgXCIsMzApXCJ9JyA+XG5cdFx0XHRcdDxyZWN0IGNsYXNzPSdjYXJ0JyB4PSctMTIuNScgd2lkdGg9JzI1JyB5PSctMTIuNScgaGVpZ2h0PScyNScvPlxuXHRcdFx0PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMTBcblx0XHRcdHJpZ2h0OiAxMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0Ym90dG9tOiAxNVxuXHRcdFx0XG5cdFx0QFggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwzXSBcblxuXHRcdEBzYW1wbGUgPSBfLnJhbmdlKCAwLCA1ICwgLjUpXG5cblx0XHRAQ2FydCA9IENhcnRcblxuXHRcdEBheGlzRnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBYXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHRyYW4gPSAodHJhbiktPlxuXHRcdFx0dHJhbi5lYXNlICdsaW5lYXInXG5cdFx0XHRcdC5kdXJhdGlvbiA2MFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJyAsIEByZXNpemVcblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IDYwXG5cdFx0QFgucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdmdIZWlnaHQnLCBnZXQ6LT4gQGhlaWdodCArIEBtYXIudG9wK0BtYXIuYm90dG9tXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuQ2FydCA9IHJlcXVpcmUgJy4uL2NhcnQvY2FydERhdGEnXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuXG5jbGFzcyBEb3Rcblx0Y29uc3RydWN0b3I6IChAdCwgQHYpLT5cblx0XHRAaWQgPSBfLnVuaXF1ZUlkICdkb3QnXG5cbmNsYXNzIERhdGFcblx0Y29uc3RydWN0b3I6IC0+XG5cdFx0QHQgPSBAeCA9IDBcblx0XHRAQ2FydCA9IENhcnRcblx0XHRmaXJzdERvdCA9IG5ldyBEb3QgMCAsIENhcnQudjBcblx0XHRmaXJzdERvdC5pZCA9ICdmaXJzdCdcblx0XHRtaWREb3QgPSBuZXcgRG90IENhcnQudHJhamVjdG9yeVsxMF0udCAsIENhcnQudHJhamVjdG9yeVsxMF0udlxuXHRcdGxhc3REb3QgPSBuZXcgRG90IDYgLCBDYXJ0LnRyYWplY3RvcnlbMTBdLnZcblx0XHRsYXN0RG90LmlkID0gJ2xhc3QnXG5cdFx0QGRvdHMgPSBbIGZpcnN0RG90LCBcblx0XHRcdG1pZERvdCxcblx0XHRcdGxhc3REb3Rcblx0XHRdXG5cdFx0QGNvcnJlY3QgPSBAc2hvdyA9IGZhbHNlXG5cdFx0QGZpcnN0ID0gZmlyc3REb3Rcblx0XHRAdGFyZ2V0X2RhdGEgPSBDYXJ0LnRyYWplY3Rvcnlcblx0XHRAdXBkYXRlX2RvdHMoKVxuXHRcdEBzZWxlY3RfZG90IEBkb3RzWzFdXG5cblx0c2V0X3Nob3c6ICh2KS0+XG5cdFx0QHNob3cgPSB2XG5cdHNldF90OiAodCktPlxuXHRcdEB0ID0gdFxuXG5cdGluY3JlbWVudDogKGR0KS0+XG5cdFx0QHQgKz0gZHRcblxuXHRzZWxlY3RfZG90OiAoZG90KS0+XG5cdFx0QHNlbGVjdGVkID0gZG90XG5cblx0YWRkX2RvdDogKHQsIHYpLT5cblx0XHRuZXdEb3QgPSBuZXcgRG90IHQsdlxuXHRcdEBkb3RzLnB1c2ggbmV3RG90XG5cdFx0QHVwZGF0ZV9kb3QgbmV3RG90LCB0LCB2XG5cblx0cmVtb3ZlX2RvdDogKGRvdCktPlxuXHRcdEBkb3RzLnNwbGljZSBAZG90cy5pbmRleE9mKGRvdCksIDFcblx0XHRAdXBkYXRlX2RvdHMoKVxuXG5cdHVwZGF0ZV9kb3RzOiAtPiBcblx0XHRAZG90cy5zb3J0IChhLGIpLT4gYS50IC0gYi50XG5cdFx0QGRvdHMuZm9yRWFjaCAoZG90LCBpLCBrKS0+XG5cdFx0XHRwcmV2ID0ga1tpLTFdXG5cdFx0XHRpZiBkb3QuaWQgPT0gJ2xhc3QnXG5cdFx0XHRcdGRvdC52ID0gcHJldi52XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgcHJldlxuXHRcdFx0XHRkdCA9IGRvdC50IC0gcHJldi50XG5cdFx0XHRcdGRvdC54ID0gcHJldi54ICsgZHQgKiAoZG90LnYgKyBwcmV2LnYpLzJcblx0XHRcdFx0ZG90LmR2ID0gKGRvdC52IC0gcHJldi52KS9NYXRoLm1heChkdCwgLjAwMDEpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRvdC54ID0gMFxuXHRcdFx0XHRkb3QuZHYgPSAwXG5cblx0dXBkYXRlX2RvdDogKGRvdCwgdCwgdiktPlxuXHRcdGlmIGRvdC5pZCA9PSAnZmlyc3QnIHRoZW4gcmV0dXJuXG5cdFx0QHNlbGVjdF9kb3QgZG90XG5cdFx0ZG90LnQgPSB0XG5cdFx0ZG90LnYgPSB2XG5cdFx0QHVwZGF0ZV9kb3RzKClcblx0XHRAY29ycmVjdCA9IE1hdGguYWJzKENhcnQuayAqIGRvdC52ICsgZG90LmR2KSA8IDAuMDVcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGF0YSIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBsYXJnZSc+PC9jaXJjbGU+XG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsKS0+XG5cdFx0cmFkID0gNyAjdGhlIHJhZGl1cyBvZiB0aGUgbGFyZ2UgY2lyY2xlIG5hdHVyYWxseVxuXHRcdHNlbCA9IGQzLnNlbGVjdCBAZWxbMF1cblx0XHRiaWcgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LmxhcmdlJ1xuXHRcdFx0LmF0dHIgJ3InLCByYWRcblx0XHRjaXJjID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5zbWFsbCdcblxuXHRcdGJpZy5vbiAnbW91c2VvdmVyJywgQG1vdXNlb3ZlclxuXHRcdFx0Lm9uICdjb250ZXh0bWVudScsIC0+IFxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHQub24gJ21vdXNlZG93bicsIC0+XG5cdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0LmF0dHIgJ3InLCByYWQqMS43XG5cdFx0XHQub24gJ21vdXNldXAnLCAtPlxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuM1xuXHRcdFx0Lm9uICdtb3VzZW91dCcgLCBAbW91c2VvdXRcblxuXHRcdEBzY29wZS4kd2F0Y2ggPT5cblx0XHRcdFx0KERhdGEuc2VsZWN0ZWQgPT0gQGRvdCkgYW5kIChEYXRhLnNob3cpXG5cdFx0XHQsICh2LCBvbGQpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZCAqIDEuNVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS4zXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ3Nocmluaydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAzNTBcblx0XHRcdFx0XHRcdC5lYXNlICdib3VuY2Utb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cdFx0XHQgXG5cdG1vdXNlb3V0OiA9PlxuXHRcdERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0bW91c2VvdmVyOiA9PlxuXHRcdERhdGEuc2VsZWN0X2RvdCBAZG90XG5cdFx0RGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGRvdDogJz1kb3REZXInXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLEN0cmxdXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCktPlxuXHRcdGNpcmMgPSBkMy5zZWxlY3QgQGVsWzBdXG5cblx0XHRjaXJjLm9uICdtb3VzZW92ZXInLEBtb3VzZW92ZXJcblx0XHRcdC5vbiAnbW91c2VvdXQnICwgQG1vdXNlb3V0XG5cdFx0XHQjIC5vbiAnY29udGV4dG1lbnUnLCAtPiBcblx0XHRcdCMgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHQjIFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblxuXHRcdEBzY29wZS4kd2F0Y2ggPT5cblx0XHRcdFx0KERhdGEuc2VsZWN0ZWQgPT0gQGRvdCkgYW5kIChEYXRhLnNob3cpXG5cdFx0XHQsICh2LCBvbGQpLT5cblx0XHRcdFx0IyBpZiB2ID09IG9sZCB0aGVuIHJldHVyblxuXHRcdFx0XHRcblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cdFx0XHQgXG5cdG1vdXNlb3V0OiA9PlxuXHRcdERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0bW91c2VvdmVyOiA9PlxuXHRcdERhdGEuc2VsZWN0X2RvdCBAZG90XG5cdFx0RGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGRvdDogJz1kb3RCRGVyJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JyxDdHJsXVxuXHRcdHJlc3RyaWN0OiAnQSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IC0+XG5cblx0bG9jOiAodCktPlxuXHRcdGkgPSBfLmZpbmRMYXN0SW5kZXggRGF0YS5kb3RzLCAoZCktPlxuXHRcdFx0ZC50IDw9IHRcblx0XHRhID0gRGF0YS5kb3RzW2ldXG5cdFx0ZHQgPSB0IC0gYS50XG5cdFx0ZHYgPSBEYXRhLmRvdHNbaSsxXT8uZHYgPyAwXG5cdFx0YS54ICsgYS52ICogZHQgKyAwLjUqZHYgKiBkdCoqMlxuXG5cdEBwcm9wZXJ0eSAneCcsIGdldDotPiBAbG9jIERhdGEudFxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDYXJ0IiwiUmVhbCA9IHJlcXVpcmUgJy4uL2NhcnQvY2FydERhdGEnXG5EYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IC0+XG5cblx0bG9jOiAodCktPlxuXHRcdHRyYWogPSBfLmZpbmRMYXN0IFJlYWwudHJhamVjdG9yeSwgKGQpLT5cblx0XHRcdFx0ZC50PD10XG5cdFx0XHQueFxuXG5cdEBwcm9wZXJ0eSAneCcsIGdldDotPiBAbG9jIERhdGEudFxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDYXJ0IiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J3RvcENoYXJ0Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncmVnJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBuZy1tb3VzZW1vdmU9J3ZtLm1vdmUoJGV2ZW50KScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLkhvcicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScxOCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNyZWcpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lIGhvcicgbmctY2xhc3M9J3tcImNvcnJlY3RcIjogdm0uY29ycmVjdH0nIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCksIHgyOiB2bS5Ib3Iodm0ucG9pbnQudCksIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0ucG9pbnQudiApfScvPlxuXHRcdFx0PGNpcmNsZSByPSczcHgnIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0XHQ8cGF0aCBkMy1kZXI9J3tkOnZtLmxpbmVGdW4odm0uZGF0YSl9JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5WZXIodm0ucG9pbnQudi8yKSAtIDddJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyBmb250LXNpemU9JzEzcHgnPiR5JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPScyMDAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMSksIHZtLlZlciguOSldJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JDUodC0uNSkodC0xKSh0LTEpXjIkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMTBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiA0MFxuXG5cdFx0QFZlciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTEsMV1cblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFswLDIuNV1cblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBASG9yXG5cdFx0XHQudGlja0Zvcm1hdChkMy5mb3JtYXQgJ2QnKVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWZXJcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0XHRpZiBNYXRoLmZsb29yKGQpICE9IGQgdGhlbiByZXR1cm5cblx0XHRcdFx0ZFxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHR2RnVuID0gKHQpLT41KiAodC0uNSkgKiAodC0xKSAqICh0LTIpKioyXG5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDMgLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0XHRcdHQ6IHRcblxuXHRcdEBwb2ludCA9IF8uc2FtcGxlIEBkYXRhXG5cblx0XHRAY29ycmVjdCA9IGZhbHNlXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHR2ID0gdkZ1biB0XG5cdFx0XHRAcG9pbnQgPSBcblx0XHRcdFx0dDogdFxuXHRcdFx0XHR2OiB2XG5cdFx0XHRAY29ycmVjdCA9IE1hdGguYWJzKEBwb2ludC52KSA8PSAwLjA1IFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkcmFnID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKVxuXHRcdFx0c2VsLmNhbGwoJHBhcnNlKGF0dHIuYmVoYXZpb3IpKHNjb3BlKSlcblxubW9kdWxlLmV4cG9ydHMgPSBkcmFnIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHBhcnNlKS0+ICNnb2VzIG9uIGEgc3ZnIGVsZW1lbnRcblx0ZGlyZWN0aXZlID0gXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGQzRGVyOiAnPSdcblx0XHRcdHRyYW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0dSA9ICd0LScgKyBNYXRoLnJhbmRvbSgpXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ2QzRGVyJ1xuXHRcdFx0XHQsICh2KS0+XG5cdFx0XHRcdFx0aWYgc2NvcGUudHJhblxuXHRcdFx0XHRcdFx0c2VsLnRyYW5zaXRpb24gdVxuXHRcdFx0XHRcdFx0XHQuYXR0ciB2XG5cdFx0XHRcdFx0XHRcdC5jYWxsIHNjb3BlLnRyYW5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzZWwuYXR0ciB2XG5cblx0XHRcdFx0LCB0cnVlXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIm1vZHVsZS5leHBvcnRzID0gKCRwYXJzZSktPlxuXHQoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0ZDMuc2VsZWN0KGVsWzBdKS5kYXR1bSAkcGFyc2UoYXR0ci5kYXR1bSkoc2NvcGUpIiwiZDMgPSByZXF1aXJlICdkMydcblxuZGVyID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPVxuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHJlc2hpZnQgPSAodiktPiBcblx0XHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScgLCBcInRyYW5zbGF0ZSgje3ZbMF19LCN7dlsxXX0pXCJcblxuXHRcdFx0c2NvcGUuJHdhdGNoIC0+XG5cdFx0XHRcdFx0JHBhcnNlKGF0dHIuc2hpZnRlcikoc2NvcGUpXG5cdFx0XHRcdCwgcmVzaGlmdFxuXHRcdFx0XHQsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG50ZXh0dXJlcyA9IHJlcXVpcmUgJ3RleHR1cmVzJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHR0ID0gdGV4dHVyZXMubGluZXMoKVxuXHRcdFx0Lm9yaWVudGF0aW9uIFwiMy84XCIsIFwiNy84XCJcblx0XHRcdC5zaXplIDRcblx0XHRcdC5zdHJva2UoJyNFNkU2RTYnKVxuXHRcdCAgICAuc3Ryb2tlV2lkdGggLjZcblxuXHRcdHQuaWQgJ215VGV4dHVyZSdcblxuXHRcdGQzLnNlbGVjdCBAZWxbMF1cblx0XHRcdC5zZWxlY3QgJ3N2Zydcblx0XHRcdC5jYWxsIHRcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6ICc8c3ZnIGhlaWdodD1cIjBweFwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1wiIHdpZHRoPVwiMHB4XCI+PC9zdmc+J1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0aGVpZ2h0OiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHhBeGlzRnVuID0gdm0uZnVuID8gKGQzLnN2Zy5heGlzKClcblx0XHRcdFx0XHRcdFx0LnNjYWxlIHZtLnNjYWxlXG5cdFx0XHRcdFx0XHRcdC5vcmllbnQgJ2JvdHRvbScpXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuY2xhc3NlZCAneCBheGlzJywgdHJ1ZVxuXG5cdFx0XHR1cGRhdGUgPSAoKT0+XG5cdFx0XHRcdHhBeGlzRnVuLnRpY2tTaXplIC12bS5oZWlnaHRcblx0XHRcdFx0c2VsLmNhbGwgeEF4aXNGdW5cblx0XHRcdFx0XG5cdFx0XHR1cGRhdGUoKVxuXHRcdFx0XHRcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUuZG9tYWluKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLnJhbmdlKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLmhlaWdodCcsIHVwZGF0ZSAsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0d2lkdGg6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0eUF4aXNGdW4gPSB2bS5mdW4gPyBkMy5zdmcuYXhpcygpXG5cdFx0XHRcdC5zY2FsZSB2bS5zY2FsZVxuXHRcdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QoZWxbMF0pLmNsYXNzZWQoJ3kgYXhpcycsIHRydWUpXG5cblx0XHRcdHVwZGF0ZSA9ICgpPT5cblx0XHRcdFx0eUF4aXNGdW4udGlja1NpemUoIC12bS53aWR0aClcblx0XHRcdFx0c2VsLmNhbGwoeUF4aXNGdW4pXG5cblx0XHRcdHVwZGF0ZSgpXG5cdFx0XHRcdFxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5kb21haW4oKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUucmFuZ2UoKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUudGlja3MoKScsIHVwZGF0ZSAsIHRydWVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cy50aW1lb3V0ID0gKGZ1biwgdGltZSktPlxuXHRcdGQzLnRpbWVyKCgpPT5cblx0XHRcdGZ1bigpXG5cdFx0XHR0cnVlXG5cdFx0LHRpbWUpXG5cblxuRnVuY3Rpb246OnByb3BlcnR5ID0gKHByb3AsIGRlc2MpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAcHJvdG90eXBlLCBwcm9wLCBkZXNjIl19
