(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartObjectDer', require('./components/cart/cartObject')).directive('cartButtonsDer', require('./components/cart/cartButtons')).directive('shifter', require('./directives/shifter')).directive('designADer', require('./components/design/designA')).directive('behavior', require('./directives/behavior')).directive('dotADer', require('./components/design/dotA')).directive('dotBDer', require('./components/design/dotB')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designBDer', require('./components/design/designB')).directive('regularDer', require('./components/regular/regular')).directive('derivativeADer', require('./components/derivative/derivativeA')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('designButtonsDer', require('./components/design/designButtons')).directive('boilerplateDer', require('./directives/boilerplate')).directive('cartDer', require('./directives/cartDer'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartObject":4,"./components/cart/cartPlot":5,"./components/cart/cartSim":6,"./components/derivative/derivativeA":7,"./components/derivative/derivativeB":8,"./components/design/designA":10,"./components/design/designB":11,"./components/design/designButtons":12,"./components/design/designCartA":13,"./components/design/designCartB":14,"./components/design/dotA":16,"./components/design/dotB":17,"./components/regular/regular":20,"./directives/behavior":21,"./directives/boilerplate":22,"./directives/cartDer":23,"./directives/d3Der":24,"./directives/datum":25,"./directives/shifter":27,"./directives/texture":28,"./directives/xAxis":29,"./directives/yAxis":30,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
var Cart, Ctrl, _, atan, der, exp, sqrt, template;

_ = require('lodash');

exp = Math.exp, sqrt = Math.sqrt, atan = Math.atan;

Cart = require('./cartData');

template = '<md-button class=\'myButton\' ng-click=\'vm.click()\' ng-init=\'vm.play()\'>{{vm.paused ? \'PLAY\' : \'PAUSE\'}} </md-button>';

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
  function Ctrl(scope) {
    this.scope = scope;
  }

  Ctrl.prototype.trans = function(tran) {
    return tran.duration(30).ease('linear');
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {
      size: '=',
      left: '=',
      top: '='
    },
    controllerAs: 'vm',
    templateNamespace: 'svg',
    controller: ['$scope', Ctrl],
    templateUrl: './app/components/cart/cart.svg',
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
      top: 10,
      right: 10,
      bottom: 40
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



},{"../../helpers":31,"./cartData":3,"angular":undefined,"d3":undefined,"lodash":undefined}],6:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min;

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Cart = require('./cartData');

require('../../helpers');

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.Cart = Cart;
    this.max = 4;
    this.sample = [];
  }

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: '<div cart-der data="vm.Cart" max="vm.max" sample="vm.sample"></div>',
    scope: {},
    restrict: 'A',
    bindToController: true,
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":31,"./cartData":3,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, Data, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'topChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'></g>\n	<g class=\'main\' ng-attr-clip-path=\'url(#{{vm.name}})\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.sthing]\'>\n				<text class=\'tri-label\' >$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(1.65), vm.Ver(1.38)]\'>\n			<text class=\'tri-label\'>$\\sin(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope1, el1, window) {
    this.scope = scope1;
    this.el = el1;
    this.window = window;
    this.move = bind(this.move, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.name = 'derivativeA';
    this.data = Data.data;
    this.Ver.domain([-1.5, 1.5]);
    this.Hor.domain([0, 6]);
    this.lineFun.y((function(_this) {
      return function(d) {
        return _this.Ver(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
  }

  Ctrl.prototype.move = function() {
    var t;
    t = this.Hor.invert(event.x - event.target.getBoundingClientRect().left);
    Data.move(t);
    return this.scope.$evalAsync();
  };

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

  return Ctrl;

})(PlotCtrl);

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    link: function(scope, el, attr, vm) {
      return d3.select(el[0]).select('rect.background').on('mousemove', function() {
        return vm.move();
      });
    },
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":26,"../../helpers":31,"./derivativeData":9,"angular":undefined,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
var Ctrl, Data, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'topChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'></g>\n	<g class=\'main\' ng-attr-clip-path="url(#{{vm.name}})" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.data)}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]\'>\n				<text class=\'tri-label\'>$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(.9), vm.Ver(1)]\'>\n			<text class=\'tri-label\'>$\\cos(t)$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]\' class=\'point dv\'/>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope1, el1, window) {
    this.scope = scope1;
    this.el = el1;
    this.window = window;
    this.move = bind(this.move, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Ver.domain([-1.5, 1.5]);
    this.Hor.domain([0, 6]);
    this.name = 'derivativeB';
    this.data = Data.data;
    this.lineFun.y((function(_this) {
      return function(d) {
        return _this.Ver(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
  }

  Ctrl.prototype.move = function() {
    var t;
    t = this.Hor.invert(event.x - event.target.getBoundingClientRect().left);
    Data.move(t);
    return this.scope.$evalAsync();
  };

  Ctrl.property('point', {
    get: function() {
      return Data.point;
    }
  });

  return Ctrl;

})(PlotCtrl);

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    link: function(scope, el, attr, vm) {
      return d3.select(el[0]).select('rect.background').on('mousemove', function() {
        return vm.move();
      });
    },
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":26,"../../helpers":31,"./derivativeData":9,"angular":undefined,"d3":undefined,"lodash":undefined}],9:[function(require,module,exports){
var Data, _, d3, dvFun, vFun;

_ = require('lodash');

vFun = Math.sin;

dvFun = Math.cos;

require('../../helpers');

d3 = require('d3');

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



},{"../../helpers":31,"d3":undefined,"lodash":undefined}],10:[function(require,module,exports){
var Ctrl, Data, Fake, PlotCtrl, Real, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

Fake = require('./fakeCart');

Real = require('./trueCart');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'bottomChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designA"\'></g>\n	<g class=\'main\' clip-path="url(#designA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<rect style=\'opacity:0\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' behavior=\'vm.drag_rect\'></rect>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<line d3-der=\'{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.Cart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-a-der=dot ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(vm.Data.first.t),vm.Ver(vm.Data.first.v)]\' />\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.Hor(4), vm.Ver(.33)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.Fake.v)]\' class=\'point fake\'/>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.Real.v)]\' class=\'point real\'/>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.on_drag = bind(this.on_drag, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Ver.domain([-.1, 2.1]);
    this.Hor.domain([-.1, 5]);
    this.Data = Data;
    this.Fake = Fake;
    this.Real = Real;
    this.lineFun.y((function(_this) {
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

  return Ctrl;

})(PlotCtrl);

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



},{"../../directives/plotCtrl":26,"../../helpers":31,"./designData":15,"./fakeCart":18,"./trueCart":19,"angular":undefined,"d3":undefined}],11:[function(require,module,exports){
var Ctrl, Data, PlotCtrl, angular, d3, der, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Data = require('./designData');

angular = require('angular');

d3 = require('d3');

require('../../helpers');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\'  class=\'bottomChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designB"\'></g>\n	<g class=\'main\' clip-path="url(#designB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$\\dot{v}$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}\'/>\n			<path d3-der=\'{d:vm.lineFun(vm.Data.target_data)}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.Hor(dot.v),vm.Ver(dot.dv)]\' dot-b-der=dot></g>\n		<foreignObject width=\'70\' height=\'30\' y=\'0\' shifter=\'[vm.Hor(1.7), vm.Ver(-1.2)]\'>\n				<text class=\'tri-label\' >$v\'=-.8v$</text>\n		</foreignObject>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Ver.domain([-1.9, .1]);
    this.Hor.domain([-.1, 2.15]);
    this.Data = Data;
    this.lineFun.y((function(_this) {
      return function(d) {
        return _this.Ver(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.v);
      };
    })(this));
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

  return Ctrl;

})(PlotCtrl);

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



},{"../../directives/plotCtrl":26,"../../helpers":31,"./designData":15,"angular":undefined,"d3":undefined}],12:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template;

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

template = '<md-button class=\'myButton\' ng-click=\'vm.click()\' ng-init=\'vm.play()\'>{{vm.paused ? \'PLAY\' : \'PAUSE\'}}</md-button>';

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
        if (Data.t > 4.5) {
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



},{"../../helpers":31,"./designData":15,"angular":undefined,"d3":undefined}],13:[function(require,module,exports){
var Cart, Ctrl, Data, _, d3, der, min, template;

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./fakeCart');

Data = require('./designData');

template = '<div cart-der data="vm.Cart" max="vm.max" sample=\'vm.sample\'></div>';

Ctrl = (function() {
  function Ctrl(scope) {
    this.scope = scope;
    this.Cart = Cart;
    this.max = 4;
    this.sample = _.range(0, 6, .5);
  }

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
    controller: ['$scope', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":31,"./designData":15,"./fakeCart":18,"d3":undefined,"lodash":undefined}],14:[function(require,module,exports){
var Cart, Ctrl, Data, _, d3, der, min, template;

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./trueCart');

Data = require('./designData');

template = '<div cart-der data="vm.Cart" max="vm.max" sample=\'vm.sample\'></div>';

Ctrl = (function() {
  function Ctrl(scope) {
    this.scope = scope;
    this.Cart = Cart;
    this.max = 4;
    this.sample = _.range(0, 6, .5);
  }

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
    controller: ['$scope', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":31,"./designData":15,"./trueCart":19,"d3":undefined,"lodash":undefined}],15:[function(require,module,exports){
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

  Data.property('maxX', {
    get: function() {
      var a, dt, dv, i, ref, ref1, t;
      t = 4.5;
      i = _.findLastIndex(this.dots, function(d) {
        return d.t <= t;
      });
      a = this.dots[i];
      dt = t - a.t;
      dv = (ref = (ref1 = this.dots[i + 1]) != null ? ref1.dv : void 0) != null ? ref : 0;
      return a.x + a.v * dt + 0.5 * dv * Math.pow(dt, 2);
    }
  });

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



},{"../../helpers":31,"../cart/cartData":3,"d3":undefined,"lodash":undefined}],16:[function(require,module,exports){
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
      dot: '=dotADer'
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

  Cart.property('v', {
    get: function() {
      var a, dt, dv, i, ref, ref1, t;
      t = Data.t;
      i = _.findLastIndex(Data.dots, function(d) {
        return d.t <= t;
      });
      a = Data.dots[i];
      dt = t - a.t;
      dv = (ref = (ref1 = Data.dots[i + 1]) != null ? ref1.dv : void 0) != null ? ref : 0;
      return a.v + dv * dt;
    }
  });

  return Cart;

})();

module.exports = new Cart;



},{"./designData":15,"lodash":undefined}],19:[function(require,module,exports){
var Cart, Data, _;

Data = require('./designData');

_ = require('lodash');

require('../../helpers');

Cart = (function() {
  function Cart() {}

  Cart.prototype.loc = function(t) {
    return 2 / .8 * (1 - Math.exp(-.8 * t));
  };

  Cart.property('x', {
    get: function() {
      return this.loc(Data.t);
    }
  });

  Cart.property('v', {
    get: function() {
      return 2 * Math.exp(-.8 * Data.t);
    }
  });

  return Cart;

})();

module.exports = new Cart;



},{"../../helpers":31,"./designData":15,"lodash":undefined}],20:[function(require,module,exports){
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



},{"../../helpers":31,"angular":undefined,"d3":undefined,"lodash":undefined}],21:[function(require,module,exports){
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
var der, template;

template = '<defs>\n	<clippath ng-attr-id=\'{{::vm.name}}\'>\n		<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' />\n	</clippath>\n</defs>\n<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n	<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' />\n	<g ver-axis-der width=\'vm.width\' scale=\'vm.ver\' fun=\'vm.verAxFun\'></g>\n	<g hor-axis-der height=\'vm.height\' scale=\'vm.hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n</g>';

der = function() {
  var directive;
  return directive = {
    controller: [
      '$scope', function(scope) {
        this.scope = scope;
      }
    ],
    controllerAs: 'vm',
    bindToController: true,
    scope: {
      width: '=',
      height: '=',
      verAxFun: '=',
      horAxFun: '=',
      mar: '=',
      ver: '=',
      hor: '=',
      name: '='
    },
    template: template,
    templateNamespace: 'svg'
  };
};

module.exports = der;



},{}],23:[function(require,module,exports){
var Ctrl, PlotCtrl, _, d3, der, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

d3 = require('d3');

require('../helpers');

PlotCtrl = require('./plotCtrl');

template = '<svg ng-init=\'vm.resize()\' ng-attr-height="{{vm.svgHeight}}">\n	<defs>\n		<clippath id=\'cartSim\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' clip-path="url(#cartSim)" >\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.Hor(vm.data.loc(t)) + ",0)"}\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.Hor(vm.data.x)\' top=\'vm.height\' size=\'vm.size\'></g>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Hor.domain([-.1, 3]);
  }

  Ctrl.prototype.tran = function(tran) {
    return tran.ease('linear').duration(60);
  };

  Ctrl.property('size', {
    get: function() {
      return (this.Hor(0.4) - this.Hor(0)) / 80;
    }
  });

  return Ctrl;

})(PlotCtrl);

der = function() {
  var directive;
  return directive = {
    template: template,
    scope: {
      data: '=',
      max: '=',
      sample: '='
    },
    restrict: 'A',
    bindToController: true,
    transclude: true,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../helpers":31,"./plotCtrl":26,"d3":undefined,"lodash":undefined}],24:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],25:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],26:[function(require,module,exports){
var Ctrl, d3,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

d3 = require('d3');

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
    this.Ver = d3.scale.linear();
    this.Hor = d3.scale.linear();
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).ticks(5).orient('left');
    this.lineFun = d3.svg.line();
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
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

module.exports = Ctrl;



},{"d3":undefined}],27:[function(require,module,exports){
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



},{"d3":undefined}],28:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined,"textures":undefined}],29:[function(require,module,exports){
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
      height: '=',
      fun: '='
    },
    link: function(scope, el, attr, vm) {
      var scale, sel, update;
      scale = vm.fun.scale();
      sel = d3.select(el[0]).classed('x axis', true);
      update = (function(_this) {
        return function() {
          vm.fun.tickSize(-vm.height);
          return sel.call(vm.fun);
        };
      })(this);
      return scope.$watch(function() {
        return [scale.domain(), scale.range(), vm.height];
      }, update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],30:[function(require,module,exports){
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
      width: '=',
      fun: '='
    },
    link: function(scope, el, attr, vm) {
      var scale, sel, update;
      scale = vm.fun.scale();
      sel = d3.select(el[0]).classed('y axis', true);
      update = (function(_this) {
        return function() {
          vm.fun.tickSize(-vm.width);
          return sel.call(vm.fun);
        };
      })(this);
      return scope.$watch(function() {
        return [scale.domain(), scale.range(), vm.width];
      }, update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],31:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRPYmplY3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZURhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRBLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0Qi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduRGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZG90QS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZG90Qi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZmFrZUNhcnQuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL3RydWVDYXJ0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL3JlZ3VsYXIvcmVndWxhci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9iZWhhdmlvci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9ib2lsZXJwbGF0ZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9jYXJ0RGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2QzRGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RhdHVtLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3Bsb3RDdHJsLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3NoaWZ0ZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvdGV4dHVyZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy94QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy95QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvaGVscGVycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBOztBQUFBLE9BQ0EsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxHQUdBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmLEVBQTBCLENBQUMsT0FBQSxDQUFRLGtCQUFSLENBQUQsQ0FBMUIsQ0FDTCxDQUFDLFNBREksQ0FDTSxZQUROLEVBQ29CLE9BQUEsQ0FBUSxvQkFBUixDQURwQixDQUVMLENBQUMsU0FGSSxDQUVNLFlBRk4sRUFFb0IsT0FBQSxDQUFRLG9CQUFSLENBRnBCLENBR0wsQ0FBQyxTQUhJLENBR00sWUFITixFQUdvQixPQUFBLENBQVEsMkJBQVIsQ0FIcEIsQ0FJTCxDQUFDLFNBSkksQ0FJTSxlQUpOLEVBSXVCLE9BQUEsQ0FBUSw4QkFBUixDQUp2QixDQUtMLENBQUMsU0FMSSxDQUtN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ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5hcHAgPSBhbmd1bGFyLm1vZHVsZSAnbWFpbkFwcCcsIFtyZXF1aXJlICdhbmd1bGFyLW1hdGVyaWFsJ11cblx0LmRpcmVjdGl2ZSAnaG9yQXhpc0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy94QXhpcydcblx0LmRpcmVjdGl2ZSAndmVyQXhpc0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy95QXhpcydcblx0LmRpcmVjdGl2ZSAnY2FydFNpbURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0nXG5cdC5kaXJlY3RpdmUgJ2NhcnRPYmplY3REZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0T2JqZWN0J1xuXHQuZGlyZWN0aXZlICdjYXJ0QnV0dG9uc0RlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRCdXR0b25zJ1xuXHQuZGlyZWN0aXZlICdzaGlmdGVyJyAsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9zaGlmdGVyJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25BRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BJ1xuXHQuZGlyZWN0aXZlICdiZWhhdmlvcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9iZWhhdmlvcidcblx0LmRpcmVjdGl2ZSAnZG90QURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZG90QSdcblx0LmRpcmVjdGl2ZSAnZG90QkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZG90Qidcblx0LmRpcmVjdGl2ZSAnZGF0dW0nLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZGF0dW0nXG5cdC5kaXJlY3RpdmUgJ2QzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2QzRGVyJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25CRGVyJyAsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQidcblx0LmRpcmVjdGl2ZSAncmVndWxhckRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9yZWd1bGFyL3JlZ3VsYXInXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUEnXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUInXG5cdC5kaXJlY3RpdmUgJ2NhcnRQbG90RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydFBsb3QnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkNhcnRBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QSdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQ2FydEJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRCJ1xuXHQuZGlyZWN0aXZlICd0ZXh0dXJlRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3RleHR1cmUnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkJ1dHRvbnNEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkJ1dHRvbnMnXG5cdC5kaXJlY3RpdmUgJ2JvaWxlcnBsYXRlRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JvaWxlcnBsYXRlJ1xuXHQuZGlyZWN0aXZlICdjYXJ0RGVyJyAsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9jYXJ0RGVyJ1xuXHRcbmxvb3BlciA9IC0+XG4gICAgc2V0VGltZW91dCggKCktPlxuICAgIFx0XHRcdGQzLnNlbGVjdEFsbCAnY2lyY2xlLmRvdC5sYXJnZSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdncm93J1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMzQpJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ3NocmluaydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjApJ1xuICAgIFx0XHRcdGxvb3BlcigpXG4gICAgXHRcdCwgMTAwMClcblxubG9vcGVyKClcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8bWQtYnV0dG9uIGNsYXNzPSdteUJ1dHRvbicgbmctY2xpY2s9J3ZtLmNsaWNrKCknIG5nLWluaXQ9J3ZtLnBsYXkoKSc+e3t2bS5wYXVzZWQgPyAnUExBWScgOiAnUEFVU0UnfX0gPC9tZC1idXR0b24+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSktPlxuXG5cdGNsaWNrOiAtPlxuXHRcdGlmIEBwYXVzZWQgdGhlbiBAcGxheSgpIGVsc2UgQHBhdXNlKClcblxuXHRwbGF5OiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdFx0ZDMudGltZXIuZmx1c2goKVxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXHRcdGxhc3QgPSAwXG5cdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0ZHQgPSBlbGFwc2VkIC0gbGFzdFxuXHRcdFx0XHRDYXJ0LmluY3JlbWVudCBkdC8xMDAwXG5cdFx0XHRcdGxhc3QgPSBlbGFwc2VkXG5cdFx0XHRcdGlmIENhcnQudCA+IDRcblx0XHRcdFx0XHRDYXJ0LnNldF90IDBcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRAcGF1c2VkXG5cdFx0XHQsIDFcblxuXHRwYXVzZTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgQ3RybF1cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cH0gPSBNYXRoXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucyktPlxuXHRcdHtAdjAsIEBrfSA9IEBvcHRpb25zXG5cdFx0QHJlc3RhcnQoKVxuXHRyZXN0YXJ0OiAtPlxuXHRcdEB0ID0gQHggPSAwXG5cdFx0QHRyYWplY3RvcnkgPSBfLnJhbmdlIDAgLCA2ICwgMS81MFxuXHRcdFx0Lm1hcCAodCk9PlxuXHRcdFx0XHR2ID0gQHYwICogZXhwKC1AayAqIHQpXG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHY6IHZcblx0XHRcdFx0XHR4OiBAdjAvQGsgKiAoMS1leHAoLUBrKnQpKVxuXHRcdFx0XHRcdGR2OiAtQGsqdlxuXHRcdFx0XHRcdHQ6IHRcblx0XHRAbW92ZSAwXG5cdFx0QHBhdXNlZCA9IHRydWVcblx0c2V0X3Q6ICh0KS0+XG5cdFx0QHQgPSB0XG5cdFx0QG1vdmUgdFxuXHRpbmNyZW1lbnQ6IChkdCktPlxuXHRcdEB0Kz1kdFxuXHRcdEBtb3ZlIEB0XG5cdG1vdmU6ICh0KS0+XG5cdFx0QHYgPSBAdjAgKiBleHAoIC1AayAqIHQpXG5cdFx0QHggPSBAdjAvQGsgKiAoMS1leHAoLUBrKnQpKVxuXHRcdEBkdiA9IC1AaypAdlxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDYXJ0IHt2MDogMiwgazogLjh9IiwiXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOihAc2NvcGUpLT5cblxuXHR0cmFuczogKHRyYW4pLT5cblx0XHR0cmFuXG5cdFx0XHQuZHVyYXRpb24gMzBcblx0XHRcdC5lYXNlICdsaW5lYXInXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2l6ZTogJz0nXG5cdFx0XHRsZWZ0OiAnPSdcblx0XHRcdHRvcDogJz0nXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLEN0cmxdXG5cdFx0dGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL2NhcnQvY2FydC5zdmcnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2NhcnRQbG90Jz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTcnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTMxLCB2bS5oZWlnaHQvMi04XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiAwICwgeDI6IHZtLndpZHRoLCB5MTogdm0uVigwKSwgeTI6IHZtLlYoMCl9XCIgLz4gXG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLlQoMCkgLCB4Mjogdm0uVCgwKSwgeTE6IDAsIHkyOiB2bS5oZWlnaHR9XCIgLz4gXG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI2NhcnRQbG90KVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLlQodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nIHN0eWxlPSdmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiAxMDA7Jz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnIGZvbnQtc2l6ZT0nMTNweCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uVCh2bS5wb2ludC50KS0xLCB4Mjogdm0uVCh2bS5wb2ludC50KS0xLCB5MTogdm0uVigwKSwgeTI6IHZtLlYodm0ucG9pbnQudil9Jy8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgc2hpZnRlcj0nW3ZtLlQodm0ucG9pbnQudCksIHZtLlYodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uVCg0KSwgdm0uViguNCldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHRib3R0b206IDQwXG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDIuNV1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cblx0XHRAcG9pbnQgPSBDYXJ0XG5cdFx0QHRyYWplY3RvcnkgPSBDYXJ0LnRyYWplY3RvcnlcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHRpZiBub3QgQ2FydC5wYXVzZWQgdGhlbiByZXR1cm5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0dCA9IE1hdGgubWF4IDAgLCB0XG5cdFx0XHRDYXJ0LnNldF90IHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N0aGluZycsIGdldDotPlxuXHRcdEBWKEBwb2ludC52LzIpIC0gN1xuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFQucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxuIyB0ZW1wbGF0ZSA9ICcnXG5cbiMgdGVtcGxhdGUgPSAnJydcbiMgXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9XCJ7e3ZtLnN2Z0hlaWdodH19XCI+XG4jIFx0XHQ8ZGVmcz5cbiMgXHRcdFx0PGNsaXBwYXRoIGlkPSdjYXJ0U2ltJz5cbiMgXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cbiMgXHRcdFx0PC9jbGlwcGF0aD5cbiMgXHRcdDwvZGVmcz5cbiMgXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgPlxuIyBcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgY2xhc3M9J2JhY2tncm91bmQnLz5cbiMgXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uWCcgZnVuPSd2bS5heGlzRnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG4jIFx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cbiMgXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR4JDwvdGV4dD5cbiMgXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuIyBcdFx0PC9nPlxuIyBcdFx0PGcgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgY2xpcC1wYXRoPVwidXJsKCNjYXJ0U2ltKVwiID5cbiMgXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuIyBcdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuIyBcdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG4jIFx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5YKHZtLkNhcnQueCknIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nIHNpemU9J3ZtLnNpemUnPjwvZz5cbiMgXHRcdDwvZz5cbiMgXHQ8L3N2Zz5cbiMgJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBDYXJ0ID0gQ2FydFxuXHRcdEBtYXggPSA0XG5cdFx0QHNhbXBsZSA9IFtdXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS5DYXJ0XCIgbWF4PVwidm0ubWF4XCIgc2FtcGxlPVwidm0uc2FtcGxlXCI+PC9kaXY+J1xuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0IyB0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVyaXZhdGl2ZURhdGEnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4uLy4uL2RpcmVjdGl2ZXMvcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0ndm0ubmFtZSc+PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBuZy1hdHRyLWNsaXAtcGF0aD0ndXJsKCN7e3ZtLm5hbWV9fSknIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKDApfScvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uZGF0YSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KS0xLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WZXIodm0ucG9pbnQudiksIHkyOiB2bS5WZXIoKHZtLnBvaW50LnYgKyB2bS5wb2ludC5kdikpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uc3RoaW5nXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiRcXFxcZG90e3l9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMS42NSksIHZtLlZlcigxLjM4KV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXHNpbih0KSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cdFx0QG5hbWUgPSAnZGVyaXZhdGl2ZUEnXG5cdFx0QGRhdGEgPSBEYXRhLmRhdGFcblx0XHRAVmVyLmRvbWFpbiBbLTEuNSwxLjVdXG5cdFx0QEhvci5kb21haW4gWzAsNl1cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0bW92ZTogPT5cblx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0RGF0YS5tb3ZlIHRcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdGhpbmcnLCBnZXQ6LT5cblx0XHRAVmVyKEBwb2ludC5kdi8yICsgQHBvaW50LnYpIC0gN1xuXG5cdEBwcm9wZXJ0eSAncG9pbnQnLCBnZXQ6LT5cblx0XHREYXRhLnBvaW50XG5cblx0QHByb3BlcnR5ICd0cmlhbmdsZURhdGEnLCBnZXQ6LT5cblx0XHRAbGluZUZ1biBbe3Y6IEBwb2ludC52LCB0OiBAcG9pbnQudH0sIHt2OkBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudCsxfSwge3Y6IEBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudH1dXG5cblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIsIHZtKS0+XG5cdFx0XHRkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0LnNlbGVjdCAncmVjdC5iYWNrZ3JvdW5kJ1xuXHRcdFx0XHQub24gJ21vdXNlbW92ZScsIC0+XG5cdFx0XHRcdFx0dm0ubW92ZSgpXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVyaXZhdGl2ZURhdGEnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4uLy4uL2RpcmVjdGl2ZXMvcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0ndm0ubmFtZSc+PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBuZy1hdHRyLWNsaXAtcGF0aD1cInVybCgje3t2bS5uYW1lfX0pXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8cGF0aCBkMy1kZXI9J3tkOnZtLmxpbmVGdW4odm0uZGF0YSl9JyBjbGFzcz0nZnVuIGR2JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KSwgeDI6IHZtLkhvcih2bS5wb2ludC50KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5wb2ludC5kdil9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5WZXIodm0ucG9pbnQuZHYqLjUpLTZdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKC45KSwgdm0uVmVyKDEpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiRcXFxcY29zKHQpJDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LmR2KV0nIGNsYXNzPSdwb2ludCBkdicvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXHRcdEBWZXIuZG9tYWluIFstMS41LDEuNV1cblx0XHRASG9yLmRvbWFpbiBbMCw2XVxuXHRcdEBuYW1lID0gJ2Rlcml2YXRpdmVCJ1xuXHRcdEBkYXRhID0gRGF0YS5kYXRhXG5cdFx0QGxpbmVGdW5cblx0XHRcdC55IChkKT0+IEBWZXIgZC5kdlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRtb3ZlOiA9PlxuXHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0XHREYXRhLm1vdmUgdFxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0RGF0YS5wb2ludFxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciwgdm0pLT5cblx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuc2VsZWN0ICdyZWN0LmJhY2tncm91bmQnXG5cdFx0XHRcdC5vbiAnbW91c2Vtb3ZlJywgLT5cblx0XHRcdFx0XHR2bS5tb3ZlKClcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnZGdW4gPSBNYXRoLnNpblxuZHZGdW4gPSBNYXRoLmNvc1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxuZDMgPSByZXF1aXJlICdkMydcblxuIyBjbGFzcyBDdHJsXG4jIFx0Y29uc3RydWN0b3I6IChAc2NvcGUpLT5cblxuIyBcdGNsaWNrOiAtPlxuIyBcdFx0aWYgQHBhdXNlZCB0aGVuIEBwbGF5KCkgZWxzZSBAcGF1c2UoKVxuXG4jIFx0cGxheTogLT5cbiMgXHRcdEBwYXVzZWQgPSB0cnVlXG4jIFx0XHRkMy50aW1lci5mbHVzaCgpXG4jIFx0XHRAcGF1c2VkID0gZmFsc2VcbiMgXHRcdGxhc3QgPSAwXG4jIFx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuIyBcdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3RcbiMgXHRcdFx0XHREYXRhLmluY3JlbWVudCBkdC8xMDAwXG4jIFx0XHRcdFx0bGFzdCA9IGVsYXBzZWRcbiMgXHRcdFx0XHRpZiBEYXRhLnQgPiA0LjVcbiMgXHRcdFx0XHRcdERhdGEuc2V0X3QgMFxuIyBcdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcbiMgXHRcdFx0XHRAcGF1c2VkXG4jIFx0XHRcdCwgMVxuXG4jIFx0cGF1c2U6IC0+IEBwYXVzZWQgPSB0cnVlXG5cbmNsYXNzIERhdGFcblx0Y29uc3RydWN0b3I6IC0+XG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAgLCA4ICwgMS81MFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHRkdjogZHZGdW4gdFxuXHRcdFx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0XHRcdHQ6IHRcblxuXHRcdEBwb2ludCA9IF8uc2FtcGxlIEBkYXRhXG5cblx0bW92ZTogKHQpLT5cblx0XHRAcG9pbnQgPSBcblx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHR2OiB2RnVuIHRcblx0XHRcdHQ6IHRcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGF0YSIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuRmFrZSA9IHJlcXVpcmUgJy4vZmFrZUNhcnQnXG5SZWFsID0gcmVxdWlyZSAnLi90cnVlQ2FydCdcblBsb3RDdHJsID0gcmVxdWlyZSAnLi4vLi4vZGlyZWN0aXZlcy9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgY2xhc3M9J2JvdHRvbUNoYXJ0Jz5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSdcImRlc2lnbkFcIic+PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI2Rlc2lnbkEpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXScgPlxuXHRcdFx0PHJlY3Qgc3R5bGU9J29wYWNpdHk6MCcgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgYmVoYXZpb3I9J3ZtLmRyYWdfcmVjdCc+PC9yZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTM4LCB2bS5oZWlnaHQvMl0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiB2bS5Ib3IoMCksIHgyOiB2bS5Ib3IoMCksIHkxOiB2bS5oZWlnaHQsIHkyOiAwfVwiIC8+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC50KS0xLCB4Mjogdm0uSG9yKHZtLnNlbGVjdGVkLnQpLTEsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0uc2VsZWN0ZWQudil9Jy8+XG5cdFx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGEoKX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0XHQ8bGluZSBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnQpKzEsIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCkrMSwgeTE6IHZtLlZlcih2bS5zZWxlY3RlZC52KSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC52ICsgdm0uc2VsZWN0ZWQuZHYpfScgY2xhc3M9J3RyaSBkdicgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEuQ2FydC50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHRhcmdldCcgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEuZG90cyl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGcgbmctcmVwZWF0PSdkb3QgaW4gdm0uZG90cyB0cmFjayBieSBkb3QuaWQnIGRhdHVtPWRvdCBzaGlmdGVyPSdbdm0uSG9yKGRvdC50KSx2bS5WZXIoZG90LnYpXScgYmVoYXZpb3I9J3ZtLmRyYWcnIGRvdC1hLWRlcj1kb3QgPjwvZz5cblx0XHRcdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCcgc2hpZnRlcj0nW3ZtLkhvcih2bS5EYXRhLmZpcnN0LnQpLHZtLlZlcih2bS5EYXRhLmZpcnN0LnYpXScgLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSc3MCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvcig0KSwgdm0uVmVyKC4zMyldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0uRGF0YS50KSwgdm0uVmVyKHZtLkZha2UudildJyBjbGFzcz0ncG9pbnQgZmFrZScvPlxuXHRcdFx0PGNpcmNsZSByPSc0cHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLkRhdGEudCksIHZtLlZlcih2bS5SZWFsLnYpXScgY2xhc3M9J3BvaW50IHJlYWwnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmwgZXh0ZW5kcyBQbG90Q3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblx0XHRAVmVyLmRvbWFpbiBbLS4xLDIuMV1cblx0XHRASG9yLmRvbWFpbiBbLS4xLDVdXG5cdFx0QERhdGEgPSBEYXRhXG5cdFx0QEZha2UgPSBGYWtlXG5cdFx0QFJlYWwgPSBSZWFsXG5cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRAZHJhZ19yZWN0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsICgpPT5cblx0XHRcdFx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCA9PSAzXG5cdFx0XHRcdFx0cmV0dXJuIFxuXHRcdFx0XHREYXRhLnNldF9zaG93IHRydWVcblx0XHRcdFx0cmVjdCA9IGV2ZW50LnRvRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdFx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0XHR2ICA9IEBWZXIuaW52ZXJ0IGV2ZW50LnkgLSByZWN0LnRvcFxuXHRcdFx0XHREYXRhLmFkZF9kb3QgdCAsIHZcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgPT4gQG9uX2RyYWcgQHNlbGVjdGVkXG5cdFx0XHQub24gJ2RyYWdlbmQnLD0+XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0RGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cblx0XHRAZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuXHRcdFx0Lm9uICdkcmFnc3RhcnQnLCAoZG90KT0+XG5cdFx0XHRcdGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoID09IDNcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0RGF0YS5yZW1vdmVfZG90IGRvdFxuXHRcdFx0XHRcdERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCBAb25fZHJhZ1xuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPiBcblx0XHREYXRhLmRvdHMuZmlsdGVyIChkKS0+IChkLmlkICE9J2ZpcnN0JykgYW5kIChkLmlkICE9J2xhc3QnKVxuXG5cdEBwcm9wZXJ0eSAnc2VsZWN0ZWQnLCBnZXQ6LT5cblx0XHREYXRhLnNlbGVjdGVkXG5cblxuXHRvbl9kcmFnOiAoZG90KT0+IFxuXHRcdFx0IyBpZiBldmVudC53aGljaCBpcyAzXG5cdFx0XHQjIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0IyBcdHJldHVyblxuXHRcdFx0RGF0YS51cGRhdGVfZG90IGRvdCwgQEhvci5pbnZlcnQoZDMuZXZlbnQueCksIEBWZXIuaW52ZXJ0KGQzLmV2ZW50LnkpXG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0dHJpYW5nbGVEYXRhOi0+XG5cdFx0cG9pbnQgPSBAc2VsZWN0ZWRcblx0XHRAbGluZUZ1biBbe3Y6IHBvaW50LnYsIHQ6IHBvaW50LnR9LCB7djpwb2ludC5kdiArIHBvaW50LnYsIHQ6IHBvaW50LnQrMX0sIHt2OiBwb2ludC5kdiArIHBvaW50LnYsIHQ6IHBvaW50LnR9XVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblBsb3RDdHJsID0gcmVxdWlyZSAnLi4vLi4vZGlyZWN0aXZlcy9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgIGNsYXNzPSdib3R0b21DaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0nXCJkZXNpZ25CXCInPjwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXNpZ25CKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTM4LCB2bS5oZWlnaHQvMl0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JFxcXFxkb3R7dn0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcigwKSwgeTE6IHZtLmhlaWdodCwgeTI6IDB9XCIgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEudGFyZ2V0X2RhdGEpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PGcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5zaG93fScgPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3IoMCksIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudiksIHkxOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KX0nLz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC5kdil9Jy8+XG5cdFx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS5EYXRhLnRhcmdldF9kYXRhKX0nIGNsYXNzPSdmdW4gY29ycmVjdCcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5jb3JyZWN0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBzaGlmdGVyPSdbdm0uSG9yKGRvdC52KSx2bS5WZXIoZG90LmR2KV0nIGRvdC1iLWRlcj1kb3Q+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyB5PScwJyBzaGlmdGVyPSdbdm0uSG9yKDEuNyksIHZtLlZlcigtMS4yKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kdic9LS44diQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cblx0XHRAVmVyLmRvbWFpbiBbLTEuOSwgLjFdXG5cdFx0QEhvci5kb21haW4gWy0uMSwyLjE1XVxuXG5cdFx0QERhdGEgPSBEYXRhXG5cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLmR2XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudlxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPlxuXHRcdERhdGEuZG90c1xuXHRcdFx0LmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0JylcblxuXHRAcHJvcGVydHkgJ3NlbGVjdGVkJywgZ2V0Oi0+XG5cdFx0RGF0YS5zZWxlY3RlZFxuXHRcdFxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xudGVtcGxhdGUgPSAnJydcblx0PG1kLWJ1dHRvbiBjbGFzcz0nbXlCdXR0b24nIG5nLWNsaWNrPSd2bS5jbGljaygpJyBuZy1pbml0PSd2bS5wbGF5KCknPnt7dm0ucGF1c2VkID8gJ1BMQVknIDogJ1BBVVNFJ319PC9tZC1idXR0b24+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSktPlxuXG5cdGNsaWNrOiAtPlxuXHRcdGlmIEBwYXVzZWQgdGhlbiBAcGxheSgpIGVsc2UgQHBhdXNlKClcblxuXHRwbGF5OiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdFx0ZDMudGltZXIuZmx1c2goKVxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXHRcdGxhc3QgPSAwXG5cdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0ZHQgPSBlbGFwc2VkIC0gbGFzdFxuXHRcdFx0XHREYXRhLmluY3JlbWVudCBkdC8xMDAwXG5cdFx0XHRcdGxhc3QgPSBlbGFwc2VkXG5cdFx0XHRcdGlmIERhdGEudCA+IDQuNVxuXHRcdFx0XHRcdERhdGEuc2V0X3QgMFxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdEBwYXVzZWRcblx0XHRcdCwgMVxuXG5cdHBhdXNlOiAtPiBAcGF1c2VkID0gdHJ1ZVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xue21pbn0gPSBNYXRoXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuQ2FydCA9IHJlcXVpcmUgJy4vZmFrZUNhcnQnXG5EYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS5DYXJ0XCIgbWF4PVwidm0ubWF4XCIgc2FtcGxlPSd2bS5zYW1wbGUnPjwvZGl2PlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUpLT5cblx0XHRAQ2FydCA9IENhcnRcblx0XHRAbWF4ID0gNFxuXHRcdEBzYW1wbGUgPSBfLnJhbmdlIDAsIDYgLCAuNVxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5DYXJ0ID0gcmVxdWlyZSAnLi90cnVlQ2FydCdcbkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxkaXYgY2FydC1kZXIgZGF0YT1cInZtLkNhcnRcIiBtYXg9XCJ2bS5tYXhcIiBzYW1wbGU9J3ZtLnNhbXBsZSc+PC9kaXY+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSktPlxuXHRcdEBDYXJ0ID0gQ2FydFxuXHRcdEBtYXggPSA0XG5cdFx0QHNhbXBsZSA9IF8ucmFuZ2UgMCwgNiAsIC41XG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5DYXJ0ID0gcmVxdWlyZSAnLi4vY2FydC9jYXJ0RGF0YSdcbmQzID0gcmVxdWlyZSAnZDMnXG5cbmNsYXNzIERvdFxuXHRjb25zdHJ1Y3RvcjogKEB0LCBAdiktPlxuXHRcdEBpZCA9IF8udW5pcXVlSWQgJ2RvdCdcblxuY2xhc3MgRGF0YVxuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRAdCA9IEB4ID0gMFxuXHRcdEBDYXJ0ID0gQ2FydFxuXHRcdGZpcnN0RG90ID0gbmV3IERvdCAwICwgQ2FydC52MFxuXHRcdGZpcnN0RG90LmlkID0gJ2ZpcnN0J1xuXHRcdG1pZERvdCA9IG5ldyBEb3QgQ2FydC50cmFqZWN0b3J5WzEwXS50ICwgQ2FydC50cmFqZWN0b3J5WzEwXS52XG5cdFx0bGFzdERvdCA9IG5ldyBEb3QgNiAsIENhcnQudHJhamVjdG9yeVsxMF0udlxuXHRcdGxhc3REb3QuaWQgPSAnbGFzdCdcblx0XHRAZG90cyA9IFsgZmlyc3REb3QsIFxuXHRcdFx0bWlkRG90LFxuXHRcdFx0bGFzdERvdFxuXHRcdF1cblx0XHRAY29ycmVjdCA9IEBzaG93ID0gZmFsc2Vcblx0XHRAZmlyc3QgPSBmaXJzdERvdFxuXHRcdEB0YXJnZXRfZGF0YSA9IENhcnQudHJhamVjdG9yeVxuXHRcdEB1cGRhdGVfZG90cygpXG5cdFx0QHNlbGVjdF9kb3QgQGRvdHNbMV1cblxuXHRzZXRfc2hvdzogKHYpLT5cblx0XHRAc2hvdyA9IHZcblx0XHRcblx0c2V0X3Q6ICh0KS0+XG5cdFx0QHQgPSB0XG5cblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCArPSBkdFxuXG5cdHNlbGVjdF9kb3Q6IChkb3QpLT5cblx0XHRAc2VsZWN0ZWQgPSBkb3RcblxuXHRhZGRfZG90OiAodCwgdiktPlxuXHRcdG5ld0RvdCA9IG5ldyBEb3QgdCx2XG5cdFx0QGRvdHMucHVzaCBuZXdEb3Rcblx0XHRAdXBkYXRlX2RvdCBuZXdEb3QsIHQsIHZcblxuXHRAcHJvcGVydHkgJ21heFgnLCBnZXQ6LT5cblx0XHR0ID0gNC41XG5cdFx0aSA9IF8uZmluZExhc3RJbmRleCBAZG90cywgKGQpLT5cblx0XHRcdGQudCA8PSB0XG5cdFx0YSA9IEBkb3RzW2ldXG5cdFx0ZHQgPSB0IC0gYS50XG5cdFx0ZHYgPSBAZG90c1tpKzFdPy5kdiA/IDBcblx0XHRhLnggKyBhLnYgKiBkdCArIDAuNSpkdiAqIGR0KioyXG5cblx0cmVtb3ZlX2RvdDogKGRvdCktPlxuXHRcdEBkb3RzLnNwbGljZSBAZG90cy5pbmRleE9mKGRvdCksIDFcblx0XHRAdXBkYXRlX2RvdHMoKVxuXG5cdHVwZGF0ZV9kb3RzOiAtPiBcblx0XHRAZG90cy5zb3J0IChhLGIpLT4gYS50IC0gYi50XG5cdFx0QGRvdHMuZm9yRWFjaCAoZG90LCBpLCBrKS0+XG5cdFx0XHRwcmV2ID0ga1tpLTFdXG5cdFx0XHRpZiBkb3QuaWQgPT0gJ2xhc3QnXG5cdFx0XHRcdGRvdC52ID0gcHJldi52XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgcHJldlxuXHRcdFx0XHRkdCA9IGRvdC50IC0gcHJldi50XG5cdFx0XHRcdGRvdC54ID0gcHJldi54ICsgZHQgKiAoZG90LnYgKyBwcmV2LnYpLzJcblx0XHRcdFx0ZG90LmR2ID0gKGRvdC52IC0gcHJldi52KS9NYXRoLm1heChkdCwgLjAwMDEpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRvdC54ID0gMFxuXHRcdFx0XHRkb3QuZHYgPSAwXG5cblx0dXBkYXRlX2RvdDogKGRvdCwgdCwgdiktPlxuXHRcdGlmIGRvdC5pZCA9PSAnZmlyc3QnIHRoZW4gcmV0dXJuXG5cdFx0QHNlbGVjdF9kb3QgZG90XG5cdFx0ZG90LnQgPSB0XG5cdFx0ZG90LnYgPSB2XG5cdFx0QHVwZGF0ZV9kb3RzKClcblx0XHRAY29ycmVjdCA9IE1hdGguYWJzKENhcnQuayAqIGRvdC52ICsgZG90LmR2KSA8IDAuMDVcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGF0YSIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBsYXJnZSc+PC9jaXJjbGU+XG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsKS0+XG5cdFx0cmFkID0gNyAjdGhlIHJhZGl1cyBvZiB0aGUgbGFyZ2UgY2lyY2xlIG5hdHVyYWxseVxuXHRcdHNlbCA9IGQzLnNlbGVjdCBAZWxbMF1cblx0XHRiaWcgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LmxhcmdlJ1xuXHRcdFx0LmF0dHIgJ3InLCByYWRcblx0XHRjaXJjID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5zbWFsbCdcblxuXHRcdGJpZy5vbiAnbW91c2VvdmVyJywgQG1vdXNlb3ZlclxuXHRcdFx0Lm9uICdjb250ZXh0bWVudScsIC0+IFxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHQub24gJ21vdXNlZG93bicsIC0+XG5cdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0LmF0dHIgJ3InLCByYWQqMS43XG5cdFx0XHQub24gJ21vdXNldXAnLCAtPlxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuM1xuXHRcdFx0Lm9uICdtb3VzZW91dCcgLCBAbW91c2VvdXRcblxuXHRcdEBzY29wZS4kd2F0Y2ggPT5cblx0XHRcdFx0KERhdGEuc2VsZWN0ZWQgPT0gQGRvdCkgYW5kIChEYXRhLnNob3cpXG5cdFx0XHQsICh2LCBvbGQpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZCAqIDEuNVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS4zXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ3Nocmluaydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAzNTBcblx0XHRcdFx0XHRcdC5lYXNlICdib3VuY2Utb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cdFx0XHQgXG5cdG1vdXNlb3V0OiA9PlxuXHRcdERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0bW91c2VvdmVyOiA9PlxuXHRcdERhdGEuc2VsZWN0X2RvdCBAZG90XG5cdFx0RGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGRvdDogJz1kb3RBRGVyJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JyxDdHJsXVxuXHRcdHJlc3RyaWN0OiAnQSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0Jz48L2NpcmNsZT5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwpLT5cblx0XHRjaXJjID0gZDMuc2VsZWN0IEBlbFswXVxuXG5cdFx0Y2lyYy5vbiAnbW91c2VvdmVyJyxAbW91c2VvdmVyXG5cdFx0XHQub24gJ21vdXNlb3V0JyAsIEBtb3VzZW91dFxuXHRcdFx0IyAub24gJ2NvbnRleHRtZW51JywgLT4gXG5cdFx0XHQjIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0IyBcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cblx0XHRAc2NvcGUuJHdhdGNoID0+XG5cdFx0XHRcdChEYXRhLnNlbGVjdGVkID09IEBkb3QpIGFuZCAoRGF0YS5zaG93KVxuXHRcdFx0LCAodiwgb2xkKS0+XG5cdFx0XHRcdCMgaWYgdiA9PSBvbGQgdGhlbiByZXR1cm5cblx0XHRcdFx0XG5cdFx0XHRcdGlmIHZcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXHRcdFx0IFxuXHRtb3VzZW91dDogPT5cblx0XHREYXRhLnNldF9zaG93IGZhbHNlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdG1vdXNlb3ZlcjogPT5cblx0XHREYXRhLnNlbGVjdF9kb3QgQGRvdFxuXHRcdERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZTogXG5cdFx0XHRkb3Q6ICc9ZG90QkRlcidcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsQ3RybF1cblx0XHRyZXN0cmljdDogJ0EnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5jbGFzcyBDYXJ0XG5cdGNvbnN0cnVjdG9yOiAtPlxuXG5cdGxvYzogKHQpLT5cblx0XHRpID0gXy5maW5kTGFzdEluZGV4IERhdGEuZG90cywgKGQpLT5cblx0XHRcdGQudCA8PSB0XG5cdFx0YSA9IERhdGEuZG90c1tpXVxuXHRcdGR0ID0gdCAtIGEudFxuXHRcdGR2ID0gRGF0YS5kb3RzW2krMV0/LmR2ID8gMFxuXHRcdGEueCArIGEudiAqIGR0ICsgMC41KmR2ICogZHQqKjJcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6LT4gQGxvYyBEYXRhLnRcblxuXHRAcHJvcGVydHkgJ3YnLCBnZXQ6LT5cblx0XHR0ID0gRGF0YS50XG5cdFx0aSA9IF8uZmluZExhc3RJbmRleCBEYXRhLmRvdHMsIChkKS0+XG5cdFx0XHRkLnQgPD0gdFxuXHRcdGEgPSBEYXRhLmRvdHNbaV1cblx0XHRkdCA9IHQgLSBhLnRcblx0XHRkdiA9IERhdGEuZG90c1tpKzFdPy5kdiA/IDBcblx0XHRhLnYgKyBkdiAqIGR0XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IENhcnQiLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IC0+XG5cblx0bG9jOiAodCktPlxuXHRcdDIvLjggKiAoMS1NYXRoLmV4cCgtLjgqdCkpXG5cblx0QHByb3BlcnR5ICd4JywgZ2V0Oi0+IEBsb2MgRGF0YS50XG5cblx0QHByb3BlcnR5ICd2JywgZ2V0Oi0+XG5cdFx0MiogTWF0aC5leHAoLS44KkRhdGEudClcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FydCIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3JlZyc+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgbmctbW91c2Vtb3ZlPSd2bS5tb3ZlKCRldmVudCknIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVmVyJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5Ib3InIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTgnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcmVnKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIG5nLWNsYXNzPSd7XCJjb3JyZWN0XCI6IHZtLmNvcnJlY3R9JyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKDApfScvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnBvaW50LnQpLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKHZtLnBvaW50LnYgKX0nLz5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyBzaGlmdGVyPSdbdm0uSG9yKHZtLnBvaW50LnQpLCB2bS5WZXIodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLmRhdGEpfScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uVmVyKHZtLnBvaW50LnYvMikgLSA3XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgZm9udC1zaXplPScxM3B4Jz4keSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMjAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDEpLCB2bS5WZXIoLjkpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiQ1KHQtLjUpKHQtMSkodC0xKV4yJDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogNDBcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0xLDFdXG5cdFx0QEhvciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCwyLjVdXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tGb3JtYXQoZDMuZm9ybWF0ICdkJylcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0LnRpY2tGb3JtYXQgKGQpLT5cblx0XHRcdFx0aWYgTWF0aC5mbG9vcihkKSAhPSBkIHRoZW4gcmV0dXJuXG5cdFx0XHRcdGRcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWZXIgZC52XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudFxuXG5cdFx0dkZ1biA9ICh0KS0+NSogKHQtLjUpICogKHQtMSkgKiAodC0yKSoqMlxuXG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAgLCAzICwgMS81MFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR2OiB2RnVuIHRcblx0XHRcdFx0XHR0OiB0XG5cblx0XHRAcG9pbnQgPSBfLnNhbXBsZSBAZGF0YVxuXG5cdFx0QGNvcnJlY3QgPSBmYWxzZVxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHRyZWN0ID0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0diA9IHZGdW4gdFxuXHRcdFx0QHBvaW50ID0gXG5cdFx0XHRcdHQ6IHRcblx0XHRcdFx0djogdlxuXHRcdFx0QGNvcnJlY3QgPSBNYXRoLmFicyhAcG9pbnQudikgPD0gMC4wNSBcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBWZXIucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QEhvci5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZHJhZyA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSlcblx0XHRcdHNlbC5jYWxsKCRwYXJzZShhdHRyLmJlaGF2aW9yKShzY29wZSkpXG5cbm1vZHVsZS5leHBvcnRzID0gZHJhZyIsInRlbXBsYXRlID0gJycnXG5cdDxkZWZzPlxuXHRcdDxjbGlwcGF0aCBuZy1hdHRyLWlkPSd7ezo6dm0ubmFtZX19Jz5cblx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIC8+XG5cdFx0PC9jbGlwcGF0aD5cblx0PC9kZWZzPlxuXHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyAvPlxuXHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS52ZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5ob3InIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0PC9nPlxuJycnXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgKEBzY29wZSkgLT5dXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHNjb3BlOiBcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGhlaWdodDogJz0nXG5cdFx0XHR2ZXJBeEZ1bjogJz0nXG5cdFx0XHRob3JBeEZ1bjogJz0nXG5cdFx0XHRtYXI6ICc9J1xuXHRcdFx0dmVyOiAnPSdcblx0XHRcdGhvcjogJz0nXG5cdFx0XHRuYW1lOiAnPSdcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2ZydcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vaGVscGVycydcblBsb3RDdHJsID0gcmVxdWlyZSAnLi9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgbmctYXR0ci1oZWlnaHQ9XCJ7e3ZtLnN2Z0hlaWdodH19XCI+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2NhcnRTaW0nPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgPlxuXHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4keCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nIGNsaXAtcGF0aD1cInVybCgjY2FydFNpbSlcIiA+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGcgbmctcmVwZWF0PSd0IGluIHZtLnNhbXBsZScgZDMtZGVyPSd7dHJhbnNmb3JtOiBcInRyYW5zbGF0ZShcIiArIHZtLkhvcih2bS5kYXRhLmxvYyh0KSkgKyBcIiwwKVwifSc+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0aW1lLWxpbmUnIGQzLWRlcj0ne3gxOiAwLCB4MjogMCwgeTE6IDAsIHkyOiA2MH0nIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBjYXJ0LW9iamVjdC1kZXIgbGVmdD0ndm0uSG9yKHZtLmRhdGEueCknIHRvcD0ndm0uaGVpZ2h0JyBzaXplPSd2bS5zaXplJz48L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cblx0XHRASG9yLmRvbWFpbiBbLS4xLDNdXG5cblx0XHQjIEBzY29wZS4kd2F0Y2ggJ21heCcsID0+XG5cdFx0IyBcdEBIb3IuZG9tYWluIFstLjEsIEBtYXhdXG5cblx0dHJhbjogKHRyYW4pLT5cblx0XHR0cmFuLmVhc2UgJ2xpbmVhcidcblx0XHRcdC5kdXJhdGlvbiA2MFxuXG5cdEBwcm9wZXJ0eSAnc2l6ZScsIGdldDogLT4gKEBIb3IoMC40KSAtIEBIb3IoMCkpLzgwXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiBcblx0XHRcdGRhdGE6ICc9J1xuXHRcdFx0bWF4OiAnPSdcblx0XHRcdHNhbXBsZTogJz0nXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0cmFuc2NsdWRlOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkcGFyc2UpLT4gI2dvZXMgb24gYSBzdmcgZWxlbWVudFxuXHRkaXJlY3RpdmUgPSBcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZDNEZXI6ICc9J1xuXHRcdFx0dHJhbjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHR1ID0gJ3QtJyArIE1hdGgucmFuZG9tKClcblx0XHRcdHNjb3BlLiR3YXRjaCAnZDNEZXInXG5cdFx0XHRcdCwgKHYpLT5cblx0XHRcdFx0XHRpZiBzY29wZS50cmFuXG5cdFx0XHRcdFx0XHRzZWwudHJhbnNpdGlvbiB1XG5cdFx0XHRcdFx0XHRcdC5hdHRyIHZcblx0XHRcdFx0XHRcdFx0LmNhbGwgc2NvcGUudHJhblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHNlbC5hdHRyIHZcblxuXHRcdFx0XHQsIHRydWVcbm1vZHVsZS5leHBvcnRzID0gZGVyIiwibW9kdWxlLmV4cG9ydHMgPSAoJHBhcnNlKS0+XG5cdChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRkMy5zZWxlY3QoZWxbMF0pLmRhdHVtICRwYXJzZShhdHRyLmRhdHVtKShzY29wZSkiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM1XG5cblx0XHRAVmVyID1kMy5zY2FsZS5saW5lYXIoKVxuXHRcdFxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0IyAudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0IyBcdGlmIE1hdGguZmxvb3IoIGQgKSAhPSBkIHRoZW4gcmV0dXJuXG5cdFx0XHQjIFx0ZFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiA9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDdHJsIiwiZDMgPSByZXF1aXJlICdkMydcblxuZGVyID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPVxuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHJlc2hpZnQgPSAodiktPiBcblx0XHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScgLCBcInRyYW5zbGF0ZSgje3ZbMF19LCN7dlsxXX0pXCJcblxuXHRcdFx0c2NvcGUuJHdhdGNoIC0+XG5cdFx0XHRcdFx0JHBhcnNlKGF0dHIuc2hpZnRlcikoc2NvcGUpXG5cdFx0XHRcdCwgcmVzaGlmdFxuXHRcdFx0XHQsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG50ZXh0dXJlcyA9IHJlcXVpcmUgJ3RleHR1cmVzJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHR0ID0gdGV4dHVyZXMubGluZXMoKVxuXHRcdFx0Lm9yaWVudGF0aW9uIFwiMy84XCIsIFwiNy84XCJcblx0XHRcdC5zaXplIDRcblx0XHRcdC5zdHJva2UoJyNFNkU2RTYnKVxuXHRcdCAgICAuc3Ryb2tlV2lkdGggLjZcblxuXHRcdHQuaWQgJ215VGV4dHVyZSdcblxuXHRcdGQzLnNlbGVjdCBAZWxbMF1cblx0XHRcdC5zZWxlY3QgJ3N2Zydcblx0XHRcdC5jYWxsIHRcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6ICc8c3ZnIGhlaWdodD1cIjBweFwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1wiIHdpZHRoPVwiMHB4XCI+PC9zdmc+J1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0aGVpZ2h0OiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHNjYWxlID0gdm0uZnVuLnNjYWxlKClcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdC5jbGFzc2VkICd4IGF4aXMnLCB0cnVlXG5cblx0XHRcdHVwZGF0ZSA9ID0+XG5cdFx0XHRcdHZtLmZ1bi50aWNrU2l6ZSAtdm0uaGVpZ2h0XG5cdFx0XHRcdHNlbC5jYWxsIHZtLmZ1blxuXHRcdFx0XHRcblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHRbc2NhbGUuZG9tYWluKCksIHNjYWxlLnJhbmdlKCkgLHZtLmhlaWdodF1cblx0XHRcdCwgdXBkYXRlXG5cdFx0XHQsIHRydWVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsImQzID0gcmVxdWlyZSAnZDMnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCR3aW5kb3cpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlcjogYW5ndWxhci5ub29wXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRzY29wZTogXG5cdFx0XHR3aWR0aDogJz0nXG5cdFx0XHRmdW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHRzY2FsZSA9IHZtLmZ1bi5zY2FsZSgpXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSkuY2xhc3NlZCgneSBheGlzJywgdHJ1ZSlcblxuXHRcdFx0dXBkYXRlID0gPT5cblx0XHRcdFx0dm0uZnVuLnRpY2tTaXplKCAtdm0ud2lkdGgpXG5cdFx0XHRcdHNlbC5jYWxsIHZtLmZ1blxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggLT5cblx0XHRcdFx0IyBjb25zb2xlLmxvZyBzY2FsZS5yYW5nZSgpXG5cdFx0XHRcdFtzY2FsZS5kb21haW4oKSwgc2NhbGUucmFuZ2UoKSAsdm0ud2lkdGhdXG5cdFx0XHQsIHVwZGF0ZVxuXHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzLnRpbWVvdXQgPSAoZnVuLCB0aW1lKS0+XG5cdFx0ZDMudGltZXIoKCk9PlxuXHRcdFx0ZnVuKClcblx0XHRcdHRydWVcblx0XHQsdGltZSlcblxuXG5GdW5jdGlvbjo6cHJvcGVydHkgPSAocHJvcCwgZGVzYykgLT5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IEBwcm90b3R5cGUsIHByb3AsIGRlc2MiXX0=
