(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var app, d3, looper;

d3 = require('d3');

app = angular.module('mainApp', ['ngMaterial']).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartObjectDer', require('./components/cart/cartObject')).directive('shifter', require('./directives/shifter')).directive('behavior', require('./directives/behavior')).directive('dotADer', require('./components/design/dotA')).directive('dotBDer', require('./components/design/dotB')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designADer', require('./components/design/designA')).directive('designBDer', require('./components/design/designB')).directive('derivativeADer', require('./components/derivative/derivativeA')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('boilerplateDer', require('./directives/boilerplate')).directive('cartDer', require('./directives/cartDer')).service('derivativeData', require('./components/derivative/derivativeData')).service('fakeCart', require('./components/design/fakeCart')).service('trueCart', require('./components/design/trueCart')).service('designData', require('./components/design/designData')).service('cartData', require('./components/cart/cartData'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartData":2,"./components/cart/cartObject":3,"./components/cart/cartPlot":4,"./components/cart/cartSim":5,"./components/derivative/derivativeA":6,"./components/derivative/derivativeB":7,"./components/derivative/derivativeData":8,"./components/design/designA":9,"./components/design/designB":10,"./components/design/designCartA":11,"./components/design/designCartB":12,"./components/design/designData":13,"./components/design/dotA":14,"./components/design/dotB":15,"./components/design/fakeCart":16,"./components/design/trueCart":17,"./directives/behavior":18,"./directives/boilerplate":19,"./directives/cartDer":20,"./directives/d3Der":21,"./directives/datum":22,"./directives/shifter":24,"./directives/texture":25,"./directives/xAxis":26,"./directives/yAxis":27,"d3":undefined}],2:[function(require,module,exports){
var Service, _, dvFun, vFun, xFun;

_ = require('lodash');

vFun = function(t) {
  return 2 * Math.exp(-.8 * t);
};

dvFun = function(t) {
  return -.8 * 2 * Math.exp(-.8 * t);
};

xFun = function(t) {
  return 2 / .8 * (1 - Math.exp(-.8 * t));
};

Service = (function() {
  function Service($rootScope) {
    this.rootScope = $rootScope;
    this.setT(0);
    this.paused = false;
    this.trajectory = _.range(0, 6, 1 / 10).map(function(t) {
      var res;
      return res = {
        x: xFun(t),
        dv: dvFun(t),
        v: vFun(t),
        t: t
      };
    });
    this.move(0);
  }

  Service.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Service.prototype.pause = function() {
    return this.paused = true;
  };

  Service.prototype.increment = function(dt) {
    this.t += dt;
    return this.move(this.t);
  };

  Service.prototype.setT = function(t) {
    this.t = t;
    return this.move(this.t);
  };

  Service.prototype.play = function() {
    var last;
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    last = 0;
    return d3.timer((function(_this) {
      return function(elapsed) {
        var dt;
        dt = elapsed - last;
        _this.increment(dt / 1000);
        last = elapsed;
        if (_this.t > 6) {
          _this.setT(0);
        }
        _this.rootScope.$evalAsync();
        return _this.paused;
      };
    })(this), 1);
  };

  Service.prototype.move = function(t) {
    return this.point = {
      x: xFun(t),
      dv: dvFun(t),
      v: vFun(t),
      t: t
    };
  };

  return Service;

})();

module.exports = Service;



},{"lodash":undefined}],3:[function(require,module,exports){
var Ctrl, der;

Ctrl = (function() {
  function Ctrl(scope) {
    this.scope = scope;
  }

  Ctrl.prototype.trans = function(tran) {
    return tran.duration(40).ease('linear');
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



},{}],4:[function(require,module,exports){
var Ctrl, PlotCtrl, _, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'bottomChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'5\' x=\'-8\' shifter=\'[vm.width, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'0\' x=\'-15\' shifter=\'[0, 0]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' ng-attr-clip-path=\'url(#{{vm.name}})\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.trajectory)}}\' class=\'fun v\' />\n		<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver(0)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.v/2)]\'>\n				<text class=\'tri-label\' >$v$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(3.5), vm.Ver(0.4)]\'>\n			<text class=\'tri-label\'>$2e^{-.8t}$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope1, el1, window, Data) {
    this.scope = scope1;
    this.el = el1;
    this.window = window;
    this.Data = Data;
    this.move = bind(this.move, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.name = 'cartPlot';
    this.Ver.domain([-.1, 2.3]);
    this.Hor.domain([-.1, 4.5]);
    this.lineFun.y((function(_this) {
      return function(d) {
        return _this.Ver(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
    this.Data.play();
  }

  Ctrl.prototype.move = function() {
    var t;
    t = this.Hor.invert(d3.event.x - d3.event.target.getBoundingClientRect().left);
    this.Data.setT(t);
    return this.scope.$evalAsync();
  };

  Ctrl.property('point', {
    get: function() {
      return this.Data.point;
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
      return d3.select(el[0]).select('rect.background').on('mouseover', function() {
        return vm.Data.pause();
      }).on('mousemove', function() {
        return vm.move();
      }).on('mouseout', function() {
        return vm.Data.play();
      });
    },
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', 'cartData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":23,"../../helpers":28,"d3":undefined,"lodash":undefined}],5:[function(require,module,exports){
var Ctrl, _, der, template;

_ = require('lodash');

require('../../helpers');

template = '<div cart-der data="vm.cartData.point" max="vm.max" sample=\'vm.sample\'></div>';

Ctrl = (function() {
  function Ctrl(scope, cartData) {
    this.scope = scope;
    this.cartData = cartData;
    this.sample = [];
    this.max = 3;
  }

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {},
    restrict: 'A',
    bindToController: true,
    template: template,
    controller: ['$scope', 'cartData', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":28,"lodash":undefined}],6:[function(require,module,exports){
var Ctrl, PlotCtrl, _, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

PlotCtrl = require('../../directives/plotCtrl');

template = '<div class=\'explainer\'>\n  <div>\n    <p>Hover to choose a time.</p>\n  </div>\n</div>\n<svg ng-init=\'vm.resize()\' class=\'topChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'>\n	</g>\n	<g class=\'main\' ng-attr-clip-path=\'url(#{{vm.name}})\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' x=\'-15\' y=\'-20\' shifter=\'[vm.width, vm.Ver(0)]\'>\n				<text class=\'label\'>$t$</text>\n		</foreignObject>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.trajectory)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.sthing]\'>\n				<text class=\'tri-label\' >$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(1.65), vm.Ver(1.38)]\'>\n			<text class=\'tri-label\'>$\\sin(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope1, el1, window, Data) {
    this.scope = scope1;
    this.el = el1;
    this.window = window;
    this.Data = Data;
    this.move = bind(this.move, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.name = 'derivativeA';
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
    setTimeout((function(_this) {
      return function() {
        return _this.Data.play();
      };
    })(this));
  }

  Ctrl.prototype.move = function() {
    var t;
    t = this.Hor.invert(d3.event.x - d3.event.target.getBoundingClientRect().left);
    this.Data.setT(t);
    return this.scope.$evalAsync();
  };

  Ctrl.property('sthing', {
    get: function() {
      return this.Ver(this.point.dv / 2 + this.point.v) - 7;
    }
  });

  Ctrl.property('point', {
    get: function() {
      return this.Data.point;
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
      return d3.select(el[0]).select('rect.background').on('mouseover', function() {
        return vm.Data.pause();
      }).on('mousemove', function() {
        return vm.move();
      }).on('mouseout', function() {
        return vm.Data.play();
      });
    },
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', 'derivativeData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":23,"../../helpers":28,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, PlotCtrl, _, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'topChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'></g>\n	<g class=\'main\' ng-attr-clip-path="url(#{{vm.name}})" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' x=\'-15\' y=\'-20\' shifter=\'[vm.width, vm.Ver(0)]\'>\n				<text class=\'label\'>$t$</text>\n		</foreignObject>\n		<path d3-der=\'{d:vm.lineFun(vm.Data.trajectory)}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]\'>\n				<text class=\'tri-label\'>$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(.9), vm.Ver(1)]\'>\n			<text class=\'tri-label\'>$\\cos(t)$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]\' class=\'point dv\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope1, el1, window, Data) {
    this.scope = scope1;
    this.el = el1;
    this.window = window;
    this.Data = Data;
    this.move = bind(this.move, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Ver.domain([-1.5, 1.5]);
    this.Hor.domain([0, 6]);
    this.name = 'derivativeB';
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
    t = this.Hor.invert(d3.event.x - d3.event.target.getBoundingClientRect().left);
    this.Data.setT(t);
    return this.scope.$evalAsync();
  };

  Ctrl.property('point', {
    get: function() {
      return this.Data.point;
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
      return d3.select(el[0]).select('rect.background').on('mouseover', function() {
        return vm.Data.pause();
      }).on('mousemove', function() {
        return vm.move();
      }).on('mouseout', function() {
        return vm.Data.play();
      });
    },
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', 'derivativeData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":23,"../../helpers":28,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
var Service, _, dvFun, vFun;

_ = require('lodash');

vFun = Math.sin;

dvFun = Math.cos;

Service = (function() {
  function Service($rootScope) {
    this.rootScope = $rootScope;
    this.setT(0);
    this.paused = false;
    this.trajectory = _.range(0, 6, .1).map(function(t) {
      var res;
      return res = {
        dv: dvFun(t),
        v: vFun(t),
        t: t
      };
    });
    this.move(0);
  }

  Service.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Service.prototype.pause = function() {
    return this.paused = true;
  };

  Service.prototype.increment = function(dt) {
    this.t += dt;
    return this.move(this.t);
  };

  Service.prototype.setT = function(t) {
    this.t = t;
    return this.move(this.t);
  };

  Service.prototype.play = function() {
    var last;
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    last = 0;
    return d3.timer((function(_this) {
      return function(elapsed) {
        var dt;
        dt = elapsed - last;
        _this.increment(dt / 1000);
        last = elapsed;
        if (_this.t > 6) {
          _this.setT(0);
        }
        _this.rootScope.$evalAsync();
        return _this.paused;
      };
    })(this), 1);
  };

  Service.prototype.move = function(t) {
    return this.point = {
      dv: dvFun(t),
      v: vFun(t),
      t: t
    };
  };

  return Service;

})();

module.exports = Service;



},{"lodash":undefined}],9:[function(require,module,exports){
var Ctrl, PlotCtrl, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('../../helpers');

PlotCtrl = require('../../directives/plotCtrl');

template = '<div class=\'explainer\'>\n  <div>\n    <p>Left-click to add a point $(v,t)$. <br>\n    	Click-and-drag to move it; <br>\n    	right-click to delete it.\n    </p>\n  </div>\n</div>\n<svg ng-init=\'vm.resize()\' class=\'bottomChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designA"\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'5\' x=\'-8\' shifter=\'[vm.width, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'0\' x=\'-15\' shifter=\'[0, 0]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#designA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<rect style=\'opacity:0\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' behavior=\'vm.drag_rect\'></rect>\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<line d3-der=\'{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.trueCart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.fakeCart.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-a-der=dot ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(0),vm.Ver(2)]\' />\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.Hor(3.7), vm.Ver(.33)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.fakeCart.v)]\' class=\'point fake\'/>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.trueCart.v)]\' class=\'point real\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window, fakeCart, trueCart, Data) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.fakeCart = fakeCart;
    this.trueCart = trueCart;
    this.Data = Data;
    this.on_drag = bind(this.on_drag, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Ver.domain([-.1, 2.3]);
    this.Hor.domain([-.1, 4.5]);
    this.tran = function(tran) {
      return tran.duration(30).ease('linear');
    };
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
        _this.Data.set_show(true);
        rect = event.toElement.getBoundingClientRect();
        t = _this.Hor.invert(event.x - rect.left);
        v = _this.Ver.invert(event.y - rect.top);
        _this.fakeCart.add_dot(t, v);
        return _this.scope.$evalAsync();
      };
    })(this)).on('drag', (function(_this) {
      return function() {
        return _this.on_drag(_this.selected);
      };
    })(this)).on('dragend', (function(_this) {
      return function() {
        event.preventDefault();
        _this.Data.set_show(true);
        return event.stopPropagation();
      };
    })(this));
    this.drag = d3.behavior.drag().on('dragstart', (function(_this) {
      return function(dot) {
        d3.event.sourceEvent.stopPropagation();
        if (event.which === 3) {
          event.preventDefault();
          _this.fakeCart.remove_dot(dot);
          _this.Data.set_show(false);
          return _this.scope.$evalAsync();
        }
      };
    })(this)).on('drag', this.on_drag);
    this.Data.play();
  }

  Ctrl.property('dots', {
    get: function() {
      return this.fakeCart.dots.filter(function(d) {
        return (d.id !== 'first') && (d.id !== 'last');
      });
    }
  });

  Ctrl.property('selected', {
    get: function() {
      return this.fakeCart.selected;
    }
  });

  Ctrl.prototype.on_drag = function(dot) {
    this.fakeCart.update_dot(dot, this.Hor.invert(d3.event.x), this.Ver.invert(d3.event.y));
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
    controller: ['$scope', '$element', '$window', 'fakeCart', 'trueCart', 'designData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":23,"../../helpers":28}],10:[function(require,module,exports){
var Ctrl, PlotCtrl, der, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('../../helpers');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\'  class=\'bottomChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designB"\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'5\' x=\'-8\' shifter=\'[vm.width, vm.height]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'0\' x=\'-15\' shifter=\'[0, 0]\'>\n				<text class=\'label\' >$\\dot{v}$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#designB)" shifter=\'[vm.mar.left, vm.mar.top]\'>	\n		<path ng-attr-d=\'{{vm.lineFun(vm.trueCart.trajectory)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}\'/>\n			<path d3-der=\'{d:vm.lineFun(vm.trueCart.trajectory)}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.Hor(dot.v),vm.Ver(dot.dv)]\' dot-b-der=dot></g>\n		<foreignObject width=\'70\' height=\'30\' y=\'0\' shifter=\'[vm.Hor(.3), vm.Ver(-.1)]\'>\n				<text class=\'tri-label\' >$v\'=-.8v$</text>\n		</foreignObject>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window, fakeCart, trueCart, Data) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.fakeCart = fakeCart;
    this.trueCart = trueCart;
    this.Data = Data;
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Ver.domain([-1.7, .2]);
    this.Hor.domain([-.1, 2.15]);
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
      return this.fakeCart.dots.filter(function(d) {
        return (d.id !== 'first') && (d.id !== 'last');
      });
    }
  });

  Ctrl.property('selected', {
    get: function() {
      return this.fakeCart.selected;
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
    controller: ['$scope', '$element', '$window', 'fakeCart', 'trueCart', 'designData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":23,"../../helpers":28}],11:[function(require,module,exports){
var Ctrl, _, der, template;

_ = require('lodash');

require('../../helpers');

template = '<div cart-der data="vm.fakeCart" max="vm.max" sample=\'vm.sample\'></div>';

Ctrl = (function() {
  function Ctrl(scope, fakeCart) {
    this.scope = scope;
    this.fakeCart = fakeCart;
    this.max = 4;
    this.sample = _.range(0, 5, .5);
  }

  Ctrl.property('max', {
    get: function() {
      return this.fakeCart.loc(4.5);
    }
  });

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {},
    restrict: 'A',
    bindToController: true,
    template: template,
    controller: ['$scope', 'fakeCart', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":28,"lodash":undefined}],12:[function(require,module,exports){
var Ctrl, _, der, template;

_ = require('lodash');

require('../../helpers');

template = '<div cart-der data="vm.trueCart" max="vm.max" sample=\'vm.sample\'></div>';

Ctrl = (function() {
  function Ctrl(scope, trueCart, fakeCart) {
    this.scope = scope;
    this.trueCart = trueCart;
    this.fakeCart = fakeCart;
    this.max = 4;
    this.sample = _.range(0, 5, .5);
  }

  Ctrl.property('max', {
    get: function() {
      return this.fakeCart.loc(4.5);
    }
  });

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {},
    restrict: 'A',
    bindToController: true,
    template: template,
    controller: ['$scope', 'trueCart', 'fakeCart', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":28,"lodash":undefined}],13:[function(require,module,exports){
var Service, d3;

d3 = require('d3');

require('../../helpers');

Service = (function() {
  function Service(rootScope) {
    this.rootScope = rootScope;
    this.t = 0;
    this.show = this.paused = false;
  }

  Service.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Service.prototype.increment = function(dt) {
    return this.t += dt;
  };

  Service.prototype.setT = function(t) {
    return this.t = t;
  };

  Service.prototype.set_show = function(v) {
    return this.show = v;
  };

  Service.prototype.play = function() {
    var last;
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    last = 0;
    console.log('asdf');
    return d3.timer((function(_this) {
      return function(elapsed) {
        var dt;
        dt = elapsed - last;
        _this.increment(dt / 1000);
        last = elapsed;
        if (_this.t > 4.5) {
          _this.setT(0);
        }
        _this.rootScope.$evalAsync();
        return _this.paused;
      };
    })(this), 1);
  };

  Service.prototype.pause = function() {
    return this.paused = true;
  };

  return Service;

})();

module.exports = ['$rootScope', Service];



},{"../../helpers":28,"d3":undefined}],14:[function(require,module,exports){
var Ctrl, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

template = '<circle class=\'dot large\'></circle>\n<circle class=\'dot small\' r=\'4\'></circle>';

Ctrl = (function() {
  function Ctrl(scope, el, fakeCart, Data) {
    var big, circ, rad, sel;
    this.scope = scope;
    this.el = el;
    this.fakeCart = fakeCart;
    this.Data = Data;
    this.mouseover = bind(this.mouseover, this);
    this.mouseout = bind(this.mouseout, this);
    rad = 7;
    sel = d3.select(this.el[0]);
    big = sel.select('circle.dot.large').attr('r', rad);
    circ = sel.select('circle.dot.small');
    big.on('mouseover', this.mouseover).on('contextmenu', function() {
      d3.event.preventDefault();
      return d3.event.stopPropagation();
    }).on('mousedown', function() {
      return big.transition('grow').duration(150).ease('cubic').attr('r', rad * 1.7);
    }).on('mouseup', function() {
      return big.transition('grow').duration(150).ease('cubic-in').attr('r', rad * 1.3);
    }).on('mouseout', this.mouseout);
    this.scope.$watch((function(_this) {
      return function() {
        return (_this.fakeCart.selected === _this.dot) && _this.Data.show;
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
    this.Data.set_show(false);
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.mouseover = function() {
    this.fakeCart.select_dot(this.dot);
    this.Data.set_show(true);
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
    controller: ['$scope', '$element', 'fakeCart', 'designData', Ctrl],
    restrict: 'A'
  };
};

module.exports = der;



},{}],15:[function(require,module,exports){
var Ctrl, Data, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

template = '<circle class=\'dot small\' r=\'4\'></circle>';

Ctrl = (function() {
  function Ctrl(scope, el, fakeCart, Data1) {
    var circ;
    this.scope = scope;
    this.el = el;
    this.fakeCart = fakeCart;
    this.Data = Data1;
    this.mouseover = bind(this.mouseover, this);
    this.mouseout = bind(this.mouseout, this);
    circ = d3.select(this.el[0]);
    circ.on('mouseover', this.mouseover).on('mouseout', this.mouseout);
    this.scope.$watch((function(_this) {
      return function() {
        return (Data.selected === _this.dot) && Data.show;
      };
    })(this), function(v, old) {
      if (v === old) {
        return;
      }
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
    this.Data.set_show(false);
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.mouseover = function() {
    this.fakeCart.select_dot(this.dot);
    this.Data.set_show(true);
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
    controller: ['$scope', '$element', 'fakeCart', 'designData', Ctrl],
    restrict: 'A'
  };
};

module.exports = der;



},{"./designData":13}],16:[function(require,module,exports){
var Dot, Service, _, d3, delT;

require('../../helpers');

_ = require('lodash');

d3 = require('d3');

delT = .1;

Dot = (function() {
  function Dot(t1, v1) {
    this.t = t1;
    this.v = v1;
    this.id = _.uniqueId('dot');
    this.dv = 0;
  }

  Dot.prototype.update = function(t, v) {
    this.t = t;
    return this.v = v;
  };

  return Dot;

})();

Service = (function() {
  function Service(Data) {
    var firstDot, lastDot;
    this.Data = Data;
    this.correct = false;
    firstDot = new Dot(0, 2);
    firstDot.id = 'first';
    this.dots = [firstDot];
    this.trajectory = _.range(0, 5, delT).map(function(t) {
      var res;
      return res = {
        t: t,
        v: 0,
        x: 0
      };
    });
    _.range(.5, 2.5, .5).forEach((function(_this) {
      return function(t) {
        return _this.dots.push(new Dot(t, 2 * Math.exp(-.8 * t)));
      };
    })(this));
    lastDot = new Dot(6, this.dots[this.dots.length - 1].v);
    lastDot.id = 'last';
    this.dots.push(lastDot);
    this.select_dot(this.dots[1]);
    this.update();
  }

  Service.prototype.select_dot = function(dot) {
    return this.selected = dot;
  };

  Service.prototype.add_dot = function(t, v) {
    var newDot;
    newDot = new Dot(t, v);
    this.dots.push(newDot);
    return this.update_dot(newDot, t, v);
  };

  Service.prototype.remove_dot = function(dot) {
    this.dots.splice(this.dots.indexOf(dot), 1);
    return this.update();
  };

  Service.prototype.loc = function(t) {
    var a, h, ref;
    a = Math.floor(t / delT);
    h = (t - this.trajectory[a].t) / delT;
    return this.trajectory[a].x * (1 - h) + h * ((ref = this.trajectory[a + 1]) != null ? ref.x : void 0);
  };

  Service.property('x', {
    get: function() {
      return this.loc(this.Data.t);
    }
  });

  Service.property('v', {
    get: function() {
      var a, h, ref, t;
      t = this.Data.t;
      a = Math.floor(t / delT);
      h = (t - this.trajectory[a].t) / delT;
      return this.trajectory[a].v * (1 - h) + h * ((ref = this.trajectory[a + 1]) != null ? ref.v : void 0);
    }
  });

  Service.property('dv', {
    get: function() {
      return this.trajectory[Math.floor(this.Data.t / delT)].dv;
    }
  });

  Service.prototype.update = function() {
    var domain, range;
    this.dots.sort(function(a, b) {
      return a.t - b.t;
    });
    domain = [];
    range = [];
    this.dots.forEach(function(dot, i, k) {
      var dt, prev;
      prev = k[i - 1];
      if (dot.id === 'last') {
        dot.v = prev.v;
        domain.push(dot.v);
        range.push(dot.v);
        return;
      }
      if (prev) {
        dt = dot.t - prev.t;
        dot.x = prev.x + dt * (dot.v + prev.v) / 2;
        return dot.dv = (dot.v - prev.v) / Math.max(dt, .001);
      } else {
        dot.x = 0;
        return dot.dv = 0;
      }
    });
    return this.dots.forEach((function(_this) {
      return function(dot, i, k) {
        var a, dv;
        a = _this.dots[i - 1];
        if (!a) {
          return;
        }
        dv = dot.dv;
        return _this.trajectory.slice(Math.floor(a.t / delT), Math.floor(dot.t / delT)).forEach(function(d) {
          var dt;
          dt = d.t - a.t;
          d.x = a.x + a.v * dt + 0.5 * dv * Math.pow(dt, 2);
          return d.v = a.v + dv * dt;
        });
      };
    })(this));
  };

  Service.prototype.update_dot = function(dot, t, v) {
    if (dot.id === 'first') {
      return;
    }
    this.select_dot(dot);
    dot.update(t, v);
    this.update();
    return this.correct = Math.abs(-.8 * dot.v + dot.dv) < 0.05;
  };

  return Service;

})();

module.exports = ['designData', Service];



},{"../../helpers":28,"d3":undefined,"lodash":undefined}],17:[function(require,module,exports){
var Data, Service, _, delT;

Data = require('./designData');

_ = require('lodash');

require('../../helpers');

delT = .1;

Service = (function() {
  function Service(Data1) {
    this.Data = Data1;
    this.trajectory = _.range(0, 4.7, delT).map(function(t) {
      return {
        t: t,
        x: 2 / .8 * (1 - Math.exp(-.8 * t)),
        v: 2 * Math.exp(-.8 * t),
        dv: -.8 * 2 * Math.exp(-.8 * t)
      };
    });
  }

  Service.prototype.loc = function(t) {
    return 2 / .8 * (1 - Math.exp(-.8 * t));
  };

  Service.property('x', {
    get: function() {
      return this.loc(this.Data.t);
    }
  });

  Service.property('v', {
    get: function() {
      return 2 * Math.exp(-.8 * this.Data.t);
    }
  });

  Service.property('dv', {
    get: function() {
      return -.8 * 2 * Math.exp(-.8 * this.Data.t);
    }
  });

  return Service;

})();

module.exports = ['designData', Service];



},{"../../helpers":28,"./designData":13,"lodash":undefined}],18:[function(require,module,exports){
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



},{}],19:[function(require,module,exports){
var der, template;

template = '<defs>\n	<clippath ng-attr-id=\'{{::vm.name}}\'>\n		<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' />\n	</clippath>\n</defs>\n<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n	<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' />\n	<g ver-axis-der width=\'vm.width\' scale=\'vm.ver\' fun=\'vm.verAxFun\'></g>\n	<g hor-axis-der height=\'vm.height\' scale=\'vm.hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n	<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.ver(0), y2: vm.ver(0)}\'/>\n	<line class=\'zero-line hor\' d3-der=\'{x1: vm.hor(0), x2: vm.hor(0), y1:0, y2: vm.height}\'/>\n	<g ng-transclude>\n	</g>\n</g>';

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
    transclude: true,
    templateNamespace: 'svg'
  };
};

module.exports = der;



},{}],20:[function(require,module,exports){
var Ctrl, PlotCtrl, _, d3, der, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

d3 = require('d3');

require('../helpers');

PlotCtrl = require('./plotCtrl');

template = '<svg ng-init=\'vm.resize()\' ng-attr-height="{{vm.svgHeight}}">\n	<defs>\n		<clippath id=\'cartSim\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' clip-path="url(#cartSim)" >\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.Hor(vm.data.loc(t)) + ",0)"}\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: vm.height}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.Hor(vm.data.x)\' top=\'vm.height\' size=\'vm.size\'></g>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.mar.top = 5;
    this.mar.bottom = 25;
    this.scope.$watch('vm.max', (function(_this) {
      return function() {
        return _this.Hor.domain([-.1, _this.max]);
      };
    })(this));
  }

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
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../helpers":28,"./plotCtrl":23,"d3":undefined,"lodash":undefined}],21:[function(require,module,exports){
var d3, der;

d3 = require('d3');

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



},{"d3":undefined}],22:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],23:[function(require,module,exports){
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
      left: 20,
      top: 10,
      right: 15,
      bottom: 30
    };
    this.Ver = d3.scale.linear();
    this.Hor = d3.scale.linear();
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).tickFormat(function(d) {
      if (Math.floor(d) !== d) {
        return;
      }
      return d;
    }).ticks(5).orient('left');
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



},{"d3":undefined}],24:[function(require,module,exports){
var d3, der;

d3 = require('d3');

der = function($parse) {
  var directive;
  return directive = {
    restrict: 'A',
    link: function(scope, el, attr) {
      var reshift, sel, tran, u;
      sel = d3.select(el[0]);
      u = 't-' + Math.random();
      tran = $parse(attr.tran)(scope);
      reshift = function(v) {
        if (tran) {
          sel.transition(u).attr('transform', "translate(" + v[0] + "," + v[1] + ")").call(tran);
        } else {
          sel.attr('transform', "translate(" + v[0] + "," + v[1] + ")");
        }
        return d3.select(el[0]);
      };
      return scope.$watch(function() {
        return $parse(attr.shifter)(scope);
      }, reshift, true);
    }
  };
};

module.exports = der;



},{"d3":undefined}],25:[function(require,module,exports){
var Ctrl, d3, der, textures;

d3 = require('d3');

textures = require('textures');

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    var t, t2;
    this.scope = scope;
    this.el = el;
    this.window = window;
    t = textures.lines().orientation("3/8", "7/8").size(4).stroke('#E6E6E6').strokeWidth(.6);
    t.id('myTexture');
    t2 = textures.lines().orientation("3/8", "7/8").size(4).stroke('white').strokeWidth(.4);
    t2.id('myTexture2');
    d3.select(this.el[0]).select('svg').call(t).call(t2);
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



},{"d3":undefined,"textures":undefined}],26:[function(require,module,exports){
var d3, der;

d3 = require('d3');

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



},{"d3":undefined}],27:[function(require,module,exports){
var d3, der;

d3 = require('d3');

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



},{"d3":undefined}],28:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZmVxL2FwcC9hcHAuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnREYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmZXEvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0T2JqZWN0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmZXEvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZmVxL2FwcC9jb21wb25lbnRzL2NhcnQvY2FydFNpbS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZmVxL2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmZXEvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlRGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZmVxL2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmZXEvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduRGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZmVxL2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kb3RBLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmZXEvYXBwL2NvbXBvbmVudHMvZGVzaWduL2RvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvY29tcG9uZW50cy9kZXNpZ24vZmFrZUNhcnQuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvY29tcG9uZW50cy9kZXNpZ24vdHJ1ZUNhcnQuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvZGlyZWN0aXZlcy9iZWhhdmlvci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZmVxL2FwcC9kaXJlY3RpdmVzL2JvaWxlcnBsYXRlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmZXEvYXBwL2RpcmVjdGl2ZXMvY2FydERlci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZmVxL2FwcC9kaXJlY3RpdmVzL2QzRGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmZXEvYXBwL2RpcmVjdGl2ZXMvZGF0dW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvZGlyZWN0aXZlcy9wbG90Q3RybC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZmVxL2FwcC9kaXJlY3RpdmVzL3NoaWZ0ZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvZGlyZWN0aXZlcy90ZXh0dXJlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmZXEvYXBwL2RpcmVjdGl2ZXMveEF4aXMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZlcS9hcHAvZGlyZWN0aXZlcy95QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZmVxL2FwcC9oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUEsSUFBQTs7QUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0FBQ0wsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsU0FBZixFQUEwQixDQUFDLFlBQUQsQ0FBMUIsQ0FDTCxDQUFDLFNBREksQ0FDTSxZQUROLEVBQ29CLE9BQUEsQ0FBUSxvQkFBUixDQURwQixDQUVMLENBQUMsU0FGSSxDQUVNLFlBRk4sRUFFb0IsT0FBQSxDQUFRLG9CQUFSLENBRnBCLENBR0wsQ0FBQyxTQUhJLENBR00sWUFITixFQUdvQixPQUFBLENBQVEsMkJBQVIsQ0FIcEIsQ0FJTCxDQUFDLFNBSkksQ0FJTSxlQUpOLEVBSXVCLE9BQUEsQ0FBUSw4QkFBUixDQUp2QixDQUtMLENBQUMsU0FMSSxDQUtNLFNBTE4sRUFLa0IsT0FBQSxDQUFRLHNCQUFSLENBTGxCLENBTUwsQ0FBQyxTQU5JLENBTU0sVUFOTixFQU1rQixPQUFBLENBQVEsdUJBQVIsQ0FObEIsQ0FPTCxDQUFDLFNBUEksQ0FPTSxTQVBOLEVBT2lCLE9BQUEsQ0FBUSwwQkFBUixDQVBqQixDQVFMLENBQUMsU0FSSSxDQVFNLFNBUk4sRUFRaUIsT0FBQSxDQUFRLDBCQUFSLENBUmpCLENBU0wsQ0FBQyxTQVRJLENBU00sT0FUTixFQVNlLE9BQUEsQ0FBUSxvQkFBUixDQVRmLENBVUwsQ0FBQyxTQVZJLENBVU0sT0FWTixFQVVlLE9BQUEsQ0FBUSxvQkFBUixDQVZmLENBV0wsQ0FBQyxTQVhJLENBV00sWUFYTixFQVdvQixPQUFBLENBQVEsNkJBQVIsQ0FYcEIsQ0FZTCxDQUFDLFNBWkksQ0FZTSxZQVpOLEVBWXFCLE9BQUEsQ0FBUSw2QkFBUixDQVpyQixDQWFMLENBQUMsU0FiSSxDQWFN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QUF5QixTQUFDLEdBQUQsRUFBTSxJQUFOO1NBQ3ZCLEVBQUUsQ0FBQyxLQUFILENBQVMsQ0FBQSxTQUFBLEtBQUE7V0FBQSxTQUFBO01BQ1IsR0FBQSxDQUFBO2FBQ0E7SUFGUTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxFQUdDLElBSEQ7QUFEdUI7O0FBT3pCLFFBQVEsQ0FBQSxTQUFFLENBQUEsUUFBVixHQUFxQixTQUFDLElBQUQsRUFBTyxJQUFQO1NBQ25CLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQUMsQ0FBQSxTQUF2QixFQUFrQyxJQUFsQyxFQUF3QyxJQUF4QztBQURtQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbmQzID0gcmVxdWlyZSAnZDMnXG5hcHAgPSBhbmd1bGFyLm1vZHVsZSAnbWFpbkFwcCcsIFsnbmdNYXRlcmlhbCddXG5cdC5kaXJlY3RpdmUgJ2hvckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveEF4aXMnXG5cdC5kaXJlY3RpdmUgJ3ZlckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveUF4aXMnXG5cdC5kaXJlY3RpdmUgJ2NhcnRTaW1EZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0U2ltJ1xuXHQuZGlyZWN0aXZlICdjYXJ0T2JqZWN0RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydE9iamVjdCdcblx0LmRpcmVjdGl2ZSAnc2hpZnRlcicgLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvc2hpZnRlcidcblx0LmRpcmVjdGl2ZSAnYmVoYXZpb3InLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvYmVoYXZpb3InXG5cdC5kaXJlY3RpdmUgJ2RvdEFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2RvdEEnXG5cdC5kaXJlY3RpdmUgJ2RvdEJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2RvdEInXG5cdC5kaXJlY3RpdmUgJ2RhdHVtJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2RhdHVtJ1xuXHQuZGlyZWN0aXZlICdkM0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kM0Rlcidcblx0LmRpcmVjdGl2ZSAnZGVzaWduQURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQSdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQkRlcicgLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkInXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUEnXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUInXG5cdC5kaXJlY3RpdmUgJ2NhcnRQbG90RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydFBsb3QnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkNhcnRBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QSdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQ2FydEJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRCJ1xuXHQuZGlyZWN0aXZlICd0ZXh0dXJlRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3RleHR1cmUnXG5cdC5kaXJlY3RpdmUgJ2JvaWxlcnBsYXRlRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JvaWxlcnBsYXRlJ1xuXHQuZGlyZWN0aXZlICdjYXJ0RGVyJyAsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9jYXJ0RGVyJ1xuXHQuc2VydmljZSAnZGVyaXZhdGl2ZURhdGEnLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlRGF0YSdcblx0LnNlcnZpY2UgJ2Zha2VDYXJ0JywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9mYWtlQ2FydCdcblx0LnNlcnZpY2UgJ3RydWVDYXJ0JywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi90cnVlQ2FydCdcblx0LnNlcnZpY2UgJ2Rlc2lnbkRhdGEnLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkRhdGEnXG5cdC5zZXJ2aWNlICdjYXJ0RGF0YScsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnREYXRhJ1xubG9vcGVyID0gLT5cbiAgICBzZXRUaW1lb3V0KCAoKS0+XG4gICAgXHRcdFx0ZDMuc2VsZWN0QWxsICdjaXJjbGUuZG90LmxhcmdlJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ2dyb3cnXG4gICAgXHRcdFx0XHQuZHVyYXRpb24gNTAwXG4gICAgXHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuICAgIFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScsICdzY2FsZSggMS4zNCknXG4gICAgXHRcdFx0XHQudHJhbnNpdGlvbiAnc2hyaW5rJ1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMCknXG4gICAgXHRcdFx0bG9vcGVyKClcbiAgICBcdFx0LCAxMDAwKVxuXG5sb29wZXIoKVxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnZGdW4gPSAodCktPjIqTWF0aC5leHAgLS44KnRcbmR2RnVuID0gKHQpLT4gLS44ICogMipNYXRoLmV4cCAtLjgqdFxueEZ1biA9ICh0KS0+IDIvLjgqKDEtTWF0aC5leHAoLS44KnQpKVxuXG5jbGFzcyBTZXJ2aWNlXG5cdGNvbnN0cnVjdG9yOiAoJHJvb3RTY29wZSktPlxuXHRcdEByb290U2NvcGUgPSAkcm9vdFNjb3BlXG5cdFx0QHNldFQgMFxuXHRcdEBwYXVzZWQgPSAgZmFsc2Vcblx0XHRAdHJhamVjdG9yeSA9IF8ucmFuZ2UgMCAsIDYgLCAxLzEwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9XG5cdFx0XHRcdFx0eDogeEZ1biB0XG5cdFx0XHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdFx0XHR2OiB2RnVuIHRcblx0XHRcdFx0XHR0OiB0XG5cdFx0QG1vdmUgMCBcblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0cGF1c2U6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblxuXHRpbmNyZW1lbnQ6KGR0KSAtPlxuXHRcdEB0ICs9IGR0XG5cdFx0QG1vdmUoQHQpXG5cblx0c2V0VDogKHQpLT5cblx0XHRAdCA9IHRcblx0XHRAbW92ZSBAdFxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0bGFzdCA9IDBcblx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuXHRcdFx0XHRkdCA9IGVsYXBzZWQgLSBsYXN0XG5cdFx0XHRcdEBpbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBAdCA+IDYgdGhlbiBAc2V0VCAwXG5cdFx0XHRcdEByb290U2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdEBwYXVzZWRcblx0XHRcdCwgMVxuXG5cdG1vdmU6ICh0KS0+XG5cdFx0QHBvaW50ID0gXG5cdFx0XHR4OiB4RnVuIHRcblx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHR2OiB2RnVuIHRcblx0XHRcdHQ6IHRcblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2aWNlIiwiY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjooQHNjb3BlKS0+XG5cblx0dHJhbnM6ICh0cmFuKS0+XG5cdFx0dHJhblxuXHRcdFx0LmR1cmF0aW9uIDQwXG5cdFx0XHQuZWFzZSAnbGluZWFyJ1xuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHNjb3BlOiBcblx0XHRcdHNpemU6ICc9J1xuXHRcdFx0bGVmdDogJz0nXG5cdFx0XHR0b3A6ICc9J1xuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJyxDdHJsXVxuXHRcdHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnQuc3ZnJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBjbGFzcz0nYm90dG9tQ2hhcnQnID5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSd2bS5uYW1lJz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nNScgeD0nLTgnIHNoaWZ0ZXI9J1t2bS53aWR0aCwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScwJyB4PSctMTUnIHNoaWZ0ZXI9J1swLCAwXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgbmctYXR0ci1jbGlwLXBhdGg9J3VybCgje3t2bS5uYW1lfX0pJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeDI6IHZtLkhvcih2bS5wb2ludC50KS0xLCB5MTogdm0uVmVyKHZtLnBvaW50LnYpLCB5Mjogdm0uVmVyKDApfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uVmVyKHZtLnBvaW50LnYvMildJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzEwMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvcigzLjUpLCB2bS5WZXIoMC40KV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kMmVeey0uOHR9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50IHYnLz5cblx0XHRcdDxyZWN0IGNsYXNzPSdleHBlcmltZW50JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3csIEBEYXRhKS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblx0XHRAbmFtZSA9ICdjYXJ0UGxvdCdcblx0XHRAVmVyLmRvbWFpbiBbLS4xLDIuM11cblx0XHRASG9yLmRvbWFpbiBbLS4xLDQuNV1cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRARGF0YS5wbGF5KClcblxuXHRtb3ZlOiA9PlxuXHRcdHQgPSBASG9yLmludmVydCBkMy5ldmVudC54IC0gZDMuZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0XHRARGF0YS5zZXRUIHRcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDotPlxuXHRcdEBEYXRhLnBvaW50XG5cblx0QHByb3BlcnR5ICd0cmlhbmdsZURhdGEnLCBnZXQ6LT5cblx0XHRAbGluZUZ1biBbe3Y6IEBwb2ludC52LCB0OiBAcG9pbnQudH0sIHt2OkBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudCsxfSwge3Y6IEBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudH1dXG5cblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuc2VsZWN0ICdyZWN0LmJhY2tncm91bmQnXG5cdFx0XHRcdC5vbiAnbW91c2VvdmVyJywtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGF1c2UoKVxuXHRcdFx0XHQub24gJ21vdXNlbW92ZScsIC0+XG5cdFx0XHRcdFx0dm0ubW92ZSgpXG5cdFx0XHRcdC5vbiAnbW91c2VvdXQnLCAtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGxheSgpXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywnY2FydERhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS5jYXJ0RGF0YS5wb2ludFwiIG1heD1cInZtLm1heFwiIHNhbXBsZT0ndm0uc2FtcGxlJz48L2Rpdj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAY2FydERhdGEpLT5cblx0XHRAc2FtcGxlID0gW11cblx0XHQjIEBjYXJ0ID0gQGNhcnREYXRhLnBvaW50XG5cdFx0QG1heCA9IDNcblxuXHQjIEBwcm9wZXJ0eSAnbWF4JywgZ2V0Oi0+XG5cdCMgXHQzXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnY2FydERhdGEnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNsYXNzPSdleHBsYWluZXInPlxuXHQgIDxkaXY+XG5cdCAgICA8cD5Ib3ZlciB0byBjaG9vc2UgYSB0aW1lLjwvcD5cblx0ICA8L2Rpdj5cblx0PC9kaXY+XG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSd0b3BDaGFydCcgPlxuXHRcdDxnIGJvaWxlcnBsYXRlLWRlciB3aWR0aD0ndm0ud2lkdGgnIGhlaWdodD0ndm0uaGVpZ2h0JyB2ZXItYXgtZnVuPSd2bS52ZXJBeEZ1bicgaG9yLWF4LWZ1bj0ndm0uaG9yQXhGdW4nIHZlcj0ndm0uVmVyJyBob3I9J3ZtLkhvcicgbWFyPSd2bS5tYXInIG5hbWU9J3ZtLm5hbWUnPlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgbmctYXR0ci1jbGlwLXBhdGg9J3VybCgje3t2bS5uYW1lfX0pJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeD0nLTE1JyB5PSctMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aCwgdm0uVmVyKDApXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGF9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeDI6IHZtLkhvcih2bS5wb2ludC50KS0xLCB5MTogdm0uVmVyKHZtLnBvaW50LnYpLCB5Mjogdm0uVmVyKCh2bS5wb2ludC52ICsgdm0ucG9pbnQuZHYpKX0nLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWyh2bS5Ib3Iodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDEuNjUpLCB2bS5WZXIoMS4zOCldJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxzaW4odCkkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGNpcmNsZSByPSczcHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLnBvaW50LnQpLCB2bS5WZXIodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQERhdGEpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXHRcdEBuYW1lID0gJ2Rlcml2YXRpdmVBJ1xuXHRcdEBWZXIuZG9tYWluIFstMS41LDEuNV1cblx0XHRASG9yLmRvbWFpbiBbMCw2XVxuXHRcdEBsaW5lRnVuXG5cdFx0XHQjIC5pbnRlcnBvbGF0ZSAnY2FyZGluYWwnXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdHNldFRpbWVvdXQgPT5cblx0XHRcdEBEYXRhLnBsYXkoKVxuXG5cdG1vdmU6ID0+XG5cdFx0dCA9IEBIb3IuaW52ZXJ0IGQzLmV2ZW50LnggLSBkMy5ldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuXHRcdEBEYXRhLnNldFQgdFxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N0aGluZycsIGdldDotPlxuXHRcdEBWZXIoQHBvaW50LmR2LzIgKyBAcG9pbnQudikgLSA3XG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDotPlxuXHRcdEBEYXRhLnBvaW50XG5cblx0QHByb3BlcnR5ICd0cmlhbmdsZURhdGEnLCBnZXQ6LT5cblx0XHRAbGluZUZ1biBbe3Y6IEBwb2ludC52LCB0OiBAcG9pbnQudH0sIHt2OkBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudCsxfSwge3Y6IEBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudH1dXG5cblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuc2VsZWN0ICdyZWN0LmJhY2tncm91bmQnXG5cdFx0XHRcdC5vbiAnbW91c2VvdmVyJywtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGF1c2UoKVxuXHRcdFx0XHQub24gJ21vdXNlbW92ZScsIC0+XG5cdFx0XHRcdFx0dm0ubW92ZSgpXG5cdFx0XHRcdC5vbiAnbW91c2VvdXQnLCAtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGxheSgpXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywnZGVyaXZhdGl2ZURhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBjbGFzcz0ndG9wQ2hhcnQnPlxuXHRcdDxnIGJvaWxlcnBsYXRlLWRlciB3aWR0aD0ndm0ud2lkdGgnIGhlaWdodD0ndm0uaGVpZ2h0JyB2ZXItYXgtZnVuPSd2bS52ZXJBeEZ1bicgaG9yLWF4LWZ1bj0ndm0uaG9yQXhGdW4nIHZlcj0ndm0uVmVyJyBob3I9J3ZtLkhvcicgbWFyPSd2bS5tYXInIG5hbWU9J3ZtLm5hbWUnPjwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgbmctYXR0ci1jbGlwLXBhdGg9XCJ1cmwoI3t7dm0ubmFtZX19KVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB4PSctMTUnIHk9Jy0yMCcgc2hpZnRlcj0nW3ZtLndpZHRoLCB2bS5WZXIoMCldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS5EYXRhLnRyYWplY3RvcnkpfScgY2xhc3M9J2Z1biBkdicgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCksIHgyOiB2bS5Ib3Iodm0ucG9pbnQudCksIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0ucG9pbnQuZHYpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uVmVyKHZtLnBvaW50LmR2Ki41KS02XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxkb3R7eX0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzEwMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvciguOSksIHZtLlZlcigxKV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXGNvcyh0KSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC5kdildJyBjbGFzcz0ncG9pbnQgZHYnLz5cblx0XHRcdDxyZWN0IGNsYXNzPSdleHBlcmltZW50JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3csIEBEYXRhKS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblx0XHRAVmVyLmRvbWFpbiBbLTEuNSwxLjVdXG5cdFx0QEhvci5kb21haW4gWzAsNl1cblx0XHRAbmFtZSA9ICdkZXJpdmF0aXZlQidcblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLmR2XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudFxuXG5cdG1vdmU6ID0+XG5cdFx0dCA9IEBIb3IuaW52ZXJ0IGQzLmV2ZW50LnggLSBkMy5ldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuXHRcdEBEYXRhLnNldFQgdFxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0QERhdGEucG9pbnRcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIsIHZtKS0+XG5cdFx0XHRkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0LnNlbGVjdCAncmVjdC5iYWNrZ3JvdW5kJ1xuXHRcdFx0XHQub24gJ21vdXNlb3ZlcicsLT5cblx0XHRcdFx0XHR2bS5EYXRhLnBhdXNlKClcblx0XHRcdFx0Lm9uICdtb3VzZW1vdmUnLCAtPlxuXHRcdFx0XHRcdHZtLm1vdmUoKVxuXHRcdFx0XHQub24gJ21vdXNlb3V0JywgLT5cblx0XHRcdFx0XHR2bS5EYXRhLnBsYXkoKVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsICdkZXJpdmF0aXZlRGF0YScsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xudkZ1biA9IE1hdGguc2luXG5kdkZ1biA9IE1hdGguY29zXG5cbmNsYXNzIFNlcnZpY2Vcblx0Y29uc3RydWN0b3I6ICgkcm9vdFNjb3BlKS0+XG5cdFx0QHJvb3RTY29wZSA9ICRyb290U2NvcGVcblx0XHRAc2V0VCAwXG5cdFx0QHBhdXNlZCA9ICBmYWxzZVxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwICwgNiAsIC4xXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXHRcdEBtb3ZlIDBcblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0cGF1c2U6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblxuXHRpbmNyZW1lbnQ6KGR0KSAtPlxuXHRcdEB0ICs9IGR0XG5cdFx0QG1vdmUoQHQpXG5cblx0c2V0VDogKHQpLT5cblx0XHRAdCA9IHRcblx0XHRAbW92ZShAdClcblxuXHRwbGF5OiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdFx0ZDMudGltZXIuZmx1c2goKVxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXHRcdGxhc3QgPSAwXG5cdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0ZHQgPSBlbGFwc2VkIC0gbGFzdFxuXHRcdFx0XHRAaW5jcmVtZW50IGR0LzEwMDBcblx0XHRcdFx0bGFzdCA9IGVsYXBzZWRcblx0XHRcdFx0aWYgQHQgPiA2IHRoZW4gQHNldFQgMFxuXHRcdFx0XHRAcm9vdFNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRAcGF1c2VkXG5cdFx0XHQsIDFcblxuXHRtb3ZlOiAodCktPlxuXHRcdEBwb2ludCA9IFxuXHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0dDogdFxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZpY2UiLCJyZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNsYXNzPSdleHBsYWluZXInPlxuXHQgIDxkaXY+XG5cdCAgICA8cD5MZWZ0LWNsaWNrIHRvIGFkZCBhIHBvaW50ICQodix0KSQuIDxicj5cblx0ICAgIFx0Q2xpY2stYW5kLWRyYWcgdG8gbW92ZSBpdDsgPGJyPlxuXHQgICAgXHRyaWdodC1jbGljayB0byBkZWxldGUgaXQuXG5cdCAgICA8L3A+XG5cdCAgPC9kaXY+XG5cdDwvZGl2PlxuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBjbGFzcz0nYm90dG9tQ2hhcnQnID5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSdcImRlc2lnbkFcIic+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzUnIHg9Jy04JyBzaGlmdGVyPSdbdm0ud2lkdGgsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMCcgeD0nLTE1JyBzaGlmdGVyPSdbMCwgMF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVzaWduQSlcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJyA+XG5cdFx0XHQ8cmVjdCBzdHlsZT0nb3BhY2l0eTowJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBiZWhhdmlvcj0ndm0uZHJhZ19yZWN0Jz48L3JlY3Q+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC50KS0xLCB4Mjogdm0uSG9yKHZtLnNlbGVjdGVkLnQpLTEsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0uc2VsZWN0ZWQudil9Jy8+XG5cdFx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGEoKX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0XHQ8bGluZSBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnQpKzEsIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCkrMSwgeTE6IHZtLlZlcih2bS5zZWxlY3RlZC52KSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC52ICsgdm0uc2VsZWN0ZWQuZHYpfScgY2xhc3M9J3RyaSBkdicgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLnRydWVDYXJ0LnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uZmFrZUNhcnQuZG90cyl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGcgbmctcmVwZWF0PSdkb3QgaW4gdm0uZG90cyB0cmFjayBieSBkb3QuaWQnIGRhdHVtPWRvdCBzaGlmdGVyPSdbdm0uSG9yKGRvdC50KSx2bS5WZXIoZG90LnYpXScgYmVoYXZpb3I9J3ZtLmRyYWcnIGRvdC1hLWRlcj1kb3QgPjwvZz5cblx0XHRcdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCcgc2hpZnRlcj0nW3ZtLkhvcigwKSx2bS5WZXIoMildJyAvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDMuNyksIHZtLlZlciguMzMpXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiQyZV57LS44dH0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGNpcmNsZSByPSc0cHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLkRhdGEudCksIHZtLlZlcih2bS5mYWtlQ2FydC52KV0nIGNsYXNzPSdwb2ludCBmYWtlJy8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0uRGF0YS50KSwgdm0uVmVyKHZtLnRydWVDYXJ0LnYpXScgY2xhc3M9J3BvaW50IHJlYWwnLz5cblx0XHRcdDxyZWN0IGNsYXNzPSdleHBlcmltZW50JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3csIEBmYWtlQ2FydCwgQHRydWVDYXJ0LCBARGF0YSktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cdFx0QFZlci5kb21haW4gWy0uMSwyLjNdXG5cdFx0QEhvci5kb21haW4gWy0uMSw0LjVdXG5cblx0XHRAdHJhbiA9ICh0cmFuKS0+XG5cdFx0XHR0cmFuLmR1cmF0aW9uIDMwXG5cdFx0XHRcdC5lYXNlICdsaW5lYXInXG5cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRAZHJhZ19yZWN0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsICgpPT5cblx0XHRcdFx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCA9PSAzXG5cdFx0XHRcdFx0cmV0dXJuIFxuXHRcdFx0XHRARGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0XHRcdHJlY3QgPSBldmVudC50b0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdFx0dCA9IEBIb3IuaW52ZXJ0IGV2ZW50LnggLSByZWN0LmxlZnRcblx0XHRcdFx0diAgPSBAVmVyLmludmVydCBldmVudC55IC0gcmVjdC50b3Bcblx0XHRcdFx0QGZha2VDYXJ0LmFkZF9kb3QgdCAsIHZcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgPT4gQG9uX2RyYWcgQHNlbGVjdGVkXG5cdFx0XHQub24gJ2RyYWdlbmQnLD0+XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0QERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG5cdFx0QGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKGRvdCk9PlxuXHRcdFx0XHRkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCA9PSAzXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdEBmYWtlQ2FydC5yZW1vdmVfZG90IGRvdFxuXHRcdFx0XHRcdEBEYXRhLnNldF9zaG93IGZhbHNlXG5cdFx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgQG9uX2RyYWdcblxuXHRcdEBEYXRhLnBsYXkoKVxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPiBcblx0XHRAZmFrZUNhcnQuZG90cy5maWx0ZXIgKGQpLT4gKGQuaWQgIT0nZmlyc3QnKSBhbmQgKGQuaWQgIT0nbGFzdCcpXG5cblx0QHByb3BlcnR5ICdzZWxlY3RlZCcsIGdldDotPiBAZmFrZUNhcnQuc2VsZWN0ZWRcblxuXHRvbl9kcmFnOiAoZG90KT0+IFxuXHRcdFx0QGZha2VDYXJ0LnVwZGF0ZV9kb3QgZG90LCBASG9yLmludmVydChkMy5ldmVudC54KSwgQFZlci5pbnZlcnQoZDMuZXZlbnQueSlcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHR0cmlhbmdsZURhdGE6LT5cblx0XHRwb2ludCA9IEBzZWxlY3RlZFxuXHRcdEBsaW5lRnVuIFt7djogcG9pbnQudiwgdDogcG9pbnQudH0sIHt2OnBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudCsxfSwge3Y6IHBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudH1dXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgJ2Zha2VDYXJ0JywgJ3RydWVDYXJ0JywgJ2Rlc2lnbkRhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwicmVxdWlyZSAnLi4vLi4vaGVscGVycydcblBsb3RDdHJsID0gcmVxdWlyZSAnLi4vLi4vZGlyZWN0aXZlcy9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgIGNsYXNzPSdib3R0b21DaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0nXCJkZXNpZ25CXCInPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PSc1JyB4PSctOCcgc2hpZnRlcj0nW3ZtLndpZHRoLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzAnIHg9Jy0xNScgc2hpZnRlcj0nWzAsIDBdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kXFxcXGRvdHt2fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI2Rlc2lnbkIpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XHRcblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLnRydWVDYXJ0LnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PGcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5zaG93fScgPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3IoMCksIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudiksIHkxOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KX0nLz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC5kdil9Jy8+XG5cdFx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS50cnVlQ2FydC50cmFqZWN0b3J5KX0nIGNsYXNzPSdmdW4gY29ycmVjdCcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5jb3JyZWN0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBzaGlmdGVyPSdbdm0uSG9yKGRvdC52KSx2bS5WZXIoZG90LmR2KV0nIGRvdC1iLWRlcj1kb3Q+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyB5PScwJyBzaGlmdGVyPSdbdm0uSG9yKC4zKSwgdm0uVmVyKC0uMSldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JHYnPS0uOHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQGZha2VDYXJ0LCBAdHJ1ZUNhcnQsIEBEYXRhKS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblxuXHRcdEBWZXIuZG9tYWluIFstMS43LCAuMl1cblx0XHRASG9yLmRvbWFpbiBbLS4xLDIuMTVdXG5cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLmR2XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudlxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPlxuXHRcdEBmYWtlQ2FydC5kb3RzLmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0JylcblxuXHRAcHJvcGVydHkgJ3NlbGVjdGVkJywgZ2V0Oi0+IEBmYWtlQ2FydC5zZWxlY3RlZFxuXHRcdFxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsICdmYWtlQ2FydCcsICd0cnVlQ2FydCcsICdkZXNpZ25EYXRhJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS5mYWtlQ2FydFwiIG1heD1cInZtLm1heFwiIHNhbXBsZT0ndm0uc2FtcGxlJz48L2Rpdj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZmFrZUNhcnQpLT5cblx0XHRAbWF4ID0gNFxuXHRcdEBzYW1wbGUgPSBfLnJhbmdlIDAsIDUgLCAuNVxuXG5cdEBwcm9wZXJ0eSAnbWF4JywgZ2V0Oi0+XG5cdFx0QGZha2VDYXJ0LmxvYyA0LjVcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICdmYWtlQ2FydCcsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PGRpdiBjYXJ0LWRlciBkYXRhPVwidm0udHJ1ZUNhcnRcIiBtYXg9XCJ2bS5tYXhcIiBzYW1wbGU9J3ZtLnNhbXBsZSc+PC9kaXY+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQHRydWVDYXJ0LCBAZmFrZUNhcnQpLT5cblx0XHRAbWF4ID0gNFxuXHRcdEBzYW1wbGUgPSBfLnJhbmdlIDAsIDUgLCAuNVxuXG5cdEBwcm9wZXJ0eSAnbWF4JywgZ2V0Oi0+XG5cdFx0QGZha2VDYXJ0LmxvYyA0LjVcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICd0cnVlQ2FydCcsICdmYWtlQ2FydCcsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjogKEByb290U2NvcGUpLT5cblx0XHRAdCA9IDBcblx0XHRAc2hvdyA9IEBwYXVzZWQgPSBmYWxzZVxuXG5cdGNsaWNrOiAtPlxuXHRcdGlmIEBwYXVzZWQgdGhlbiBAcGxheSgpIGVsc2UgQHBhdXNlKClcblxuXHRpbmNyZW1lbnQ6IChkdCktPlxuXHRcdEB0Kz1kdFxuXG5cdHNldFQ6ICh0KS0+XG5cdFx0QHQgPSB0XG5cblx0c2V0X3Nob3c6ICh2KS0+XG5cdFx0QHNob3cgPSB2XG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRsYXN0ID0gMFxuXHRcdGNvbnNvbGUubG9nICdhc2RmJ1xuXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3Rcblx0XHRcdFx0QGluY3JlbWVudCBkdC8xMDAwXG5cdFx0XHRcdGxhc3QgPSBlbGFwc2VkXG5cdFx0XHRcdGlmIEB0ID4gNC41IHRoZW4gQHNldFQgMFxuXHRcdFx0XHRAcm9vdFNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRAcGF1c2VkXG5cdFx0XHQsIDFcblxuXHRwYXVzZTogLT4gQHBhdXNlZCA9IHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBbJyRyb290U2NvcGUnLCBTZXJ2aWNlXSIsInRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBsYXJnZSc+PC9jaXJjbGU+XG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAZmFrZUNhcnQsIEBEYXRhKS0+XG5cdFx0cmFkID0gNyAjdGhlIHJhZGl1cyBvZiB0aGUgbGFyZ2UgY2lyY2xlIG5hdHVyYWxseVxuXHRcdHNlbCA9IGQzLnNlbGVjdCBAZWxbMF1cblx0XHRiaWcgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LmxhcmdlJ1xuXHRcdFx0LmF0dHIgJ3InLCByYWRcblx0XHRjaXJjID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5zbWFsbCdcblxuXHRcdGJpZy5vbiAnbW91c2VvdmVyJywgQG1vdXNlb3ZlclxuXHRcdFx0Lm9uICdjb250ZXh0bWVudScsIC0+IFxuXHRcdFx0XHRkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHQub24gJ21vdXNlZG93bicsIC0+XG5cdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0LmF0dHIgJ3InLCByYWQqMS43XG5cdFx0XHQub24gJ21vdXNldXAnLCAtPlxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuM1xuXHRcdFx0Lm9uICdtb3VzZW91dCcgLCBAbW91c2VvdXRcblxuXHRcdEBzY29wZS4kd2F0Y2ggPT5cblx0XHRcdFx0KEBmYWtlQ2FydC5zZWxlY3RlZCA9PSBAZG90KSBhbmQgKEBEYXRhLnNob3cpXG5cdFx0XHQsICh2LCBvbGQpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZCAqIDEuNVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS4zXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ3Nocmluaydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAzNTBcblx0XHRcdFx0XHRcdC5lYXNlICdib3VuY2Utb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cdFx0XHQgXG5cdG1vdXNlb3V0OiA9PlxuXHRcdEBEYXRhLnNldF9zaG93IGZhbHNlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdG1vdXNlb3ZlcjogPT5cblx0XHRAZmFrZUNhcnQuc2VsZWN0X2RvdCBAZG90XG5cdFx0QERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZTogXG5cdFx0XHRkb3Q6ICc9ZG90QURlcidcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICdmYWtlQ2FydCcsICdkZXNpZ25EYXRhJywgQ3RybF1cblx0XHRyZXN0cmljdDogJ0EnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAZmFrZUNhcnQsIEBEYXRhKS0+XG5cdFx0Y2lyYyA9IGQzLnNlbGVjdCBAZWxbMF1cblxuXHRcdGNpcmMub24gJ21vdXNlb3ZlcicsQG1vdXNlb3ZlclxuXHRcdFx0Lm9uICdtb3VzZW91dCcgLCBAbW91c2VvdXRcblxuXG5cdFx0QHNjb3BlLiR3YXRjaCA9PlxuXHRcdFx0XHQoRGF0YS5zZWxlY3RlZCA9PSBAZG90KSBhbmQgKERhdGEuc2hvdylcblx0XHRcdCwgKHYsIG9sZCktPlxuXHRcdFx0XHRpZiB2ID09IG9sZCB0aGVuIHJldHVyblxuXHRcdFx0XHRpZiB2XG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDIuNVxuXHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTAwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDEuNlxuXHRcdFx0XHRcdFx0XHRzdHJva2U6ICd3aGl0ZSdcblx0XHRcdCBcblx0bW91c2VvdXQ6ID0+XG5cdFx0QERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0bW91c2VvdmVyOiA9PlxuXHRcdEBmYWtlQ2FydC5zZWxlY3RfZG90IEBkb3Rcblx0XHRARGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGRvdDogJz1kb3RCRGVyJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJ2Zha2VDYXJ0JywgJ2Rlc2lnbkRhdGEnLCBDdHJsXVxuXHRcdHJlc3RyaWN0OiAnQSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwicmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuZGVsVCA9IC4xXG5cbmNsYXNzIERvdFxuXHRjb25zdHJ1Y3RvcjogKEB0LCBAdiktPlxuXHRcdEBpZCA9IF8udW5pcXVlSWQgJ2RvdCdcblx0XHRAZHYgPSAwXG5cblx0dXBkYXRlOiAodCx2KS0+XG5cdFx0QHQgPSB0XG5cdFx0QHYgPSB2XG5cbmNsYXNzIFNlcnZpY2Vcblx0Y29uc3RydWN0b3I6KEBEYXRhKSAtPlxuXHRcdEBjb3JyZWN0ID0gZmFsc2Vcblx0XHRmaXJzdERvdCA9IG5ldyBEb3QgMCAsIDJcblx0XHRmaXJzdERvdC5pZCA9ICdmaXJzdCdcblx0XHRAZG90cyA9IFtmaXJzdERvdF1cblx0XHRAdHJhamVjdG9yeSA9IF8ucmFuZ2UgMCwgNSAsIGRlbFRcblx0XHRcdC5tYXAgKHQpLT5cblx0XHRcdFx0cmVzID0gXG5cdFx0XHRcdFx0dDogdFxuXHRcdFx0XHRcdHY6IDBcblx0XHRcdFx0XHR4OiAwXG5cdFx0Xy5yYW5nZSAuNSwgMi41LCAuNVxuXHRcdFx0LmZvckVhY2ggKHQpPT5cblx0XHRcdFx0QGRvdHMucHVzaCBuZXcgRG90IHQsIDIqTWF0aC5leHAoLS44KnQpXG5cblx0XHRsYXN0RG90ID0gbmV3IERvdCA2ICwgQGRvdHNbQGRvdHMubGVuZ3RoIC0gMV0udlxuXHRcdGxhc3REb3QuaWQgPSAnbGFzdCdcblx0XHRAZG90cy5wdXNoIGxhc3REb3Rcblx0XHRAc2VsZWN0X2RvdCBAZG90c1sxXVxuXHRcdEB1cGRhdGUoKVxuXG5cdHNlbGVjdF9kb3Q6IChkb3QpLT5cblx0XHRAc2VsZWN0ZWQgPSBkb3RcblxuXHRhZGRfZG90OiAodCwgdiktPlxuXHRcdG5ld0RvdCA9IG5ldyBEb3QgdCx2XG5cdFx0QGRvdHMucHVzaCBuZXdEb3Rcblx0XHRAdXBkYXRlX2RvdCBuZXdEb3QsIHQsIHZcblxuXHRyZW1vdmVfZG90OiAoZG90KS0+XG5cdFx0QGRvdHMuc3BsaWNlIEBkb3RzLmluZGV4T2YoZG90KSwgMVxuXHRcdEB1cGRhdGUoKVxuXG5cdGxvYzogKHQpLT4gXG5cdFx0YSA9IE1hdGguZmxvb3IgdC9kZWxUXG5cdFx0aCA9ICh0IC0gQHRyYWplY3RvcnlbYV0udCkvZGVsVFxuXHRcdEB0cmFqZWN0b3J5W2FdLngqICgxLWgpICsgaCogQHRyYWplY3RvcnlbYSsxXT8ueFxuXG5cdEBwcm9wZXJ0eSAneCcsIGdldDogLT4gQGxvYyBARGF0YS50XG5cblx0QHByb3BlcnR5ICd2JywgZ2V0OiAtPiBcblx0XHR0ID0gQERhdGEudFxuXHRcdGEgPSBNYXRoLmZsb29yIHQvZGVsVFxuXHRcdGggPSAodCAtIEB0cmFqZWN0b3J5W2FdLnQpL2RlbFRcblx0XHRAdHJhamVjdG9yeVthXS52KiAoMS1oKSArIGgqIEB0cmFqZWN0b3J5W2ErMV0/LnZcblxuXHRAcHJvcGVydHkgJ2R2JywgZ2V0OiAtPiBAdHJhamVjdG9yeVtNYXRoLmZsb29yKEBEYXRhLnQvZGVsVCldLmR2XG5cblx0dXBkYXRlOiAtPiBcblx0XHRAZG90cy5zb3J0IChhLGIpLT4gYS50IC0gYi50XG5cdFx0ZG9tYWluID0gW11cblx0XHRyYW5nZSA9IFtdXG5cdFx0QGRvdHMuZm9yRWFjaCAoZG90LCBpLCBrKS0+XG5cdFx0XHRwcmV2ID0ga1tpLTFdXG5cdFx0XHRpZiBkb3QuaWQgPT0gJ2xhc3QnXG5cdFx0XHRcdGRvdC52ID0gcHJldi52XG5cdFx0XHRcdGRvbWFpbi5wdXNoIGRvdC52XG5cdFx0XHRcdHJhbmdlLnB1c2ggZG90LnZcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBwcmV2XG5cdFx0XHRcdGR0ID0gZG90LnQgLSBwcmV2LnRcblx0XHRcdFx0ZG90LnggPSBwcmV2LnggKyBkdCAqIChkb3QudiArIHByZXYudikvMlxuXHRcdFx0XHRkb3QuZHYgPSAoZG90LnYgLSBwcmV2LnYpL01hdGgubWF4KGR0LCAuMDAxKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkb3QueCA9IDBcblx0XHRcdFx0ZG90LmR2ID0gMFxuXG5cdFx0QGRvdHMuZm9yRWFjaCAoZG90LGksayk9PlxuXHRcdFx0XHRhID0gQGRvdHNbaS0xXVxuXHRcdFx0XHRpZiAhYSB0aGVuIHJldHVyblxuXHRcdFx0XHRkdiA9IGRvdC5kdlxuXHRcdFx0XHRAdHJhamVjdG9yeVxuXHRcdFx0XHRcdC5zbGljZShNYXRoLmZsb29yKGEudC9kZWxUKSwgTWF0aC5mbG9vcihkb3QudC9kZWxUKSlcblx0XHRcdFx0XHQuZm9yRWFjaCAoZCktPlxuXHRcdFx0XHRcdFx0ZHQgPSBkLnQgLSBhLnRcblx0XHRcdFx0XHRcdGQueCA9IGEueCArIGEudiAqIGR0ICsgMC41KmR2ICogZHQqKjJcblx0XHRcdFx0XHRcdGQudiA9IGEudiArIGR2ICogZHRcblxuXHR1cGRhdGVfZG90OiAoZG90LCB0LCB2KS0+XG5cdFx0aWYgZG90LmlkID09ICdmaXJzdCcgdGhlbiByZXR1cm5cblx0XHRAc2VsZWN0X2RvdCBkb3Rcblx0XHRkb3QudXBkYXRlIHQsdlxuXHRcdEB1cGRhdGUoKVxuXHRcdEBjb3JyZWN0ID0gTWF0aC5hYnMoIC0uOCAqIGRvdC52ICsgZG90LmR2KSA8IDAuMDVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFsnZGVzaWduRGF0YScgLCBTZXJ2aWNlXSIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbmRlbFQgPSAuMVxuXG5jbGFzcyBTZXJ2aWNlXG5cdGNvbnN0cnVjdG9yOiAoQERhdGEpLT5cblx0XHRAdHJhamVjdG9yeSA9IF8ucmFuZ2UgMCwgNC43ICwgZGVsVFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHR0OiB0XG5cdFx0XHRcdHg6IDIvLjggKiAoMS1NYXRoLmV4cCgtLjgqdCkpXG5cdFx0XHRcdHY6IDIqTWF0aC5leHAgLS44KnRcblx0XHRcdFx0ZHY6IC0uOCoyKk1hdGguZXhwIC0uOCp0XG5cblx0bG9jOiAodCktPlx0Mi8uOCAqICgxLU1hdGguZXhwKC0uOCp0KSlcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6LT4gQGxvYyBARGF0YS50XG5cblx0QHByb3BlcnR5ICd2JywgZ2V0Oi0+IDIqIE1hdGguZXhwKC0uOCpARGF0YS50KVxuXG5cdEBwcm9wZXJ0eSAnZHYnLCBnZXQ6LT4gLS44KjIqIE1hdGguZXhwKC0uOCpARGF0YS50KVxuXG5tb2R1bGUuZXhwb3J0cyA9IFsnZGVzaWduRGF0YScsIFNlcnZpY2VdIiwiZHJhZyA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSlcblx0XHRcdHNlbC5jYWxsKCRwYXJzZShhdHRyLmJlaGF2aW9yKShzY29wZSkpXG5cbm1vZHVsZS5leHBvcnRzID0gZHJhZyIsInRlbXBsYXRlID0gJycnXG5cdDxkZWZzPlxuXHRcdDxjbGlwcGF0aCBuZy1hdHRyLWlkPSd7ezo6dm0ubmFtZX19Jz5cblx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIC8+XG5cdFx0PC9jbGlwcGF0aD5cblx0PC9kZWZzPlxuXHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyAvPlxuXHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS52ZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5ob3InIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lIGhvcicgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLnZlcigwKSwgeTI6IHZtLnZlcigwKX0nLz5cblx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lIGhvcicgZDMtZGVyPSd7eDE6IHZtLmhvcigwKSwgeDI6IHZtLmhvcigwKSwgeTE6MCwgeTI6IHZtLmhlaWdodH0nLz5cblx0XHQ8ZyBuZy10cmFuc2NsdWRlPlxuXHRcdDwvZz5cblx0PC9nPlxuJycnXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgKEBzY29wZSkgLT5dXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHNjb3BlOiBcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGhlaWdodDogJz0nXG5cdFx0XHR2ZXJBeEZ1bjogJz0nXG5cdFx0XHRob3JBeEZ1bjogJz0nXG5cdFx0XHRtYXI6ICc9J1xuXHRcdFx0dmVyOiAnPSdcblx0XHRcdGhvcjogJz0nXG5cdFx0XHRuYW1lOiAnPSdcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0cmFuc2NsdWRlOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uL2hlbHBlcnMnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4vcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIG5nLWF0dHItaGVpZ2h0PVwie3t2bS5zdmdIZWlnaHR9fVwiPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdjYXJ0U2ltJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nID5cblx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBjbGFzcz0nYmFja2dyb3VuZCcvPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHgkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19JyBjbGlwLXBhdGg9XCJ1cmwoI2NhcnRTaW0pXCIgPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxnIG5nLXJlcGVhdD0ndCBpbiB2bS5zYW1wbGUnIGQzLWRlcj0ne3RyYW5zZm9ybTogXCJ0cmFuc2xhdGUoXCIgKyB2bS5Ib3Iodm0uZGF0YS5sb2ModCkpICsgXCIsMClcIn0nPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndGltZS1saW5lJyBkMy1kZXI9J3t4MTogMCwgeDI6IDAsIHkxOiAwLCB5Mjogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5Ib3Iodm0uZGF0YS54KScgdG9wPSd2bS5oZWlnaHQnIHNpemU9J3ZtLnNpemUnPjwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cdFx0XHQjIDxyZWN0IGNsYXNzPSdleHBlcmltZW50JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyAvPlxuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cdFx0IyBAbWFyLmxlZnQgPSBAbWFyLnJpZ2h0ID0gMTBcblx0XHRAbWFyLnRvcCA9IDVcblx0XHRAbWFyLmJvdHRvbSA9IDI1XG5cblx0XHRAc2NvcGUuJHdhdGNoICd2bS5tYXgnLCA9PlxuXHRcdFx0QEhvci5kb21haW4gWy0uMSwgQG1heF1cblxuXG5cdEBwcm9wZXJ0eSAnc2l6ZScsIGdldDogLT4gKEBIb3IoMC40KSAtIEBIb3IoMCkpLzgwXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiBcblx0XHRcdGRhdGE6ICc9J1xuXHRcdFx0bWF4OiAnPSdcblx0XHRcdHNhbXBsZTogJz0nXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHQjIHRyYW5zY2x1ZGU6IHRydWVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImQzID0gcmVxdWlyZSAnZDMnXG5cbmRlciA9ICgkcGFyc2UpLT4gI2dvZXMgb24gYSBzdmcgZWxlbWVudFxuXHRkaXJlY3RpdmUgPSBcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZDNEZXI6ICc9J1xuXHRcdFx0dHJhbjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHR1ID0gJ3QtJyArIE1hdGgucmFuZG9tKClcblx0XHRcdHNjb3BlLiR3YXRjaCAnZDNEZXInXG5cdFx0XHRcdCwgKHYpLT5cblx0XHRcdFx0XHRpZiBzY29wZS50cmFuXG5cdFx0XHRcdFx0XHRzZWwudHJhbnNpdGlvbiB1XG5cdFx0XHRcdFx0XHRcdC5hdHRyIHZcblx0XHRcdFx0XHRcdFx0LmNhbGwgc2NvcGUudHJhblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHNlbC5hdHRyIHZcblxuXHRcdFx0XHQsIHRydWVcbm1vZHVsZS5leHBvcnRzID0gZGVyIiwibW9kdWxlLmV4cG9ydHMgPSAoJHBhcnNlKS0+XG5cdChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRkMy5zZWxlY3QoZWxbMF0pLmRhdHVtICRwYXJzZShhdHRyLmRhdHVtKShzY29wZSkiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAyMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDE1XG5cdFx0XHRib3R0b206IDMwXG5cblx0XHRAVmVyID1kMy5zY2FsZS5saW5lYXIoKVxuXHRcdFxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tGb3JtYXQgKGQpLT5cblx0XHRcdFx0aWYgTWF0aC5mbG9vciggZCApICE9IGQgdGhlbiByZXR1cm5cblx0XHRcdFx0ZFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiA9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDdHJsIiwiZDMgPSByZXF1aXJlICdkMydcblxuZGVyID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdHUgPSAndC0nICsgTWF0aC5yYW5kb20oKVxuXHRcdFx0dHJhbiA9ICRwYXJzZShhdHRyLnRyYW4pKHNjb3BlKVxuXHRcdFx0cmVzaGlmdCA9ICh2KS0+IFxuXHRcdFx0XHRpZiB0cmFuXG5cdFx0XHRcdFx0c2VsLnRyYW5zaXRpb24gdVxuXHRcdFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScgLCBcInRyYW5zbGF0ZSgje3ZbMF19LCN7dlsxXX0pXCJcblx0XHRcdFx0XHRcdC5jYWxsIHRyYW5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNlbC5hdHRyICd0cmFuc2Zvcm0nICwgXCJ0cmFuc2xhdGUoI3t2WzBdfSwje3ZbMV19KVwiXG5cblx0XHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdFx0XG5cblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHRcdCRwYXJzZShhdHRyLnNoaWZ0ZXIpKHNjb3BlKVxuXHRcdFx0XHQsIHJlc2hpZnRcblx0XHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbnRleHR1cmVzID0gcmVxdWlyZSAndGV4dHVyZXMnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdHQgPSB0ZXh0dXJlcy5saW5lcygpXG5cdFx0XHQub3JpZW50YXRpb24gXCIzLzhcIiwgXCI3LzhcIlxuXHRcdFx0LnNpemUgNFxuXHRcdFx0LnN0cm9rZSgnI0U2RTZFNicpXG5cdFx0ICAgIC5zdHJva2VXaWR0aCAuNlxuXG5cdFx0dC5pZCAnbXlUZXh0dXJlJ1xuXG5cdFx0dDIgPSB0ZXh0dXJlcy5saW5lcygpXG5cdFx0XHQub3JpZW50YXRpb24gXCIzLzhcIiwgXCI3LzhcIlxuXHRcdFx0LnNpemUgNFxuXHRcdFx0LnN0cm9rZSgnd2hpdGUnKVxuXHRcdCAgICAuc3Ryb2tlV2lkdGggLjRcblxuXHRcdHQyLmlkICdteVRleHR1cmUyJ1xuXG5cdFx0ZDMuc2VsZWN0IEBlbFswXVxuXHRcdFx0LnNlbGVjdCAnc3ZnJ1xuXHRcdFx0LmNhbGwgdFxuXHRcdFx0LmNhbGwgdDJcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6ICc8c3ZnIGhlaWdodD1cIjBweFwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1wiIHdpZHRoPVwiMHB4XCI+PC9zdmc+J1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGhlaWdodDogJz0nXG5cdFx0XHRmdW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHRzY2FsZSA9IHZtLmZ1bi5zY2FsZSgpXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuY2xhc3NlZCAneCBheGlzJywgdHJ1ZVxuXG5cdFx0XHR1cGRhdGUgPSA9PlxuXHRcdFx0XHR2bS5mdW4udGlja1NpemUgLXZtLmhlaWdodFxuXHRcdFx0XHRzZWwuY2FsbCB2bS5mdW5cblx0XHRcdFx0XG5cdFx0XHRzY29wZS4kd2F0Y2ggLT5cblx0XHRcdFx0W3NjYWxlLmRvbWFpbigpLCBzY2FsZS5yYW5nZSgpICx2bS5oZWlnaHRdXG5cdFx0XHQsIHVwZGF0ZVxuXHRcdFx0LCB0cnVlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHNjYWxlID0gdm0uZnVuLnNjYWxlKClcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKS5jbGFzc2VkKCd5IGF4aXMnLCB0cnVlKVxuXG5cdFx0XHR1cGRhdGUgPSA9PlxuXHRcdFx0XHR2bS5mdW4udGlja1NpemUoIC12bS53aWR0aClcblx0XHRcdFx0c2VsLmNhbGwgdm0uZnVuXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHQjIGNvbnNvbGUubG9nIHNjYWxlLnJhbmdlKClcblx0XHRcdFx0W3NjYWxlLmRvbWFpbigpLCBzY2FsZS5yYW5nZSgpICx2bS53aWR0aF1cblx0XHRcdCwgdXBkYXRlXG5cdFx0XHQsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMudGltZW91dCA9IChmdW4sIHRpbWUpLT5cblx0XHRkMy50aW1lcigoKT0+XG5cdFx0XHRmdW4oKVxuXHRcdFx0dHJ1ZVxuXHRcdCx0aW1lKVxuXG5cbkZ1bmN0aW9uOjpwcm9wZXJ0eSA9IChwcm9wLCBkZXNjKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQHByb3RvdHlwZSwgcHJvcCwgZGVzYyJdfQ==
