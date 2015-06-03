(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartObjectDer', require('./components/cart/cartObject')).directive('shifter', require('./directives/shifter')).directive('behavior', require('./directives/behavior')).directive('dotADer', require('./components/design/dotA')).directive('dotBDer', require('./components/design/dotB')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designADer', require('./components/design/designA')).directive('designBDer', require('./components/design/designB')).directive('derivativeADer', require('./components/derivative/derivativeA')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('boilerplateDer', require('./directives/boilerplate')).directive('cartDer', require('./directives/cartDer')).service('derivativeData', require('./components/derivative/derivativeData')).service('fakeCart', require('./components/design/fakeCart')).service('trueCart', require('./components/design/trueCart')).service('designData', require('./components/design/designData')).service('cartData', require('./components/cart/cartData'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartData":2,"./components/cart/cartObject":3,"./components/cart/cartPlot":4,"./components/cart/cartSim":5,"./components/derivative/derivativeA":6,"./components/derivative/derivativeB":7,"./components/derivative/derivativeData":8,"./components/design/designA":9,"./components/design/designB":10,"./components/design/designCartA":11,"./components/design/designCartB":12,"./components/design/designData":13,"./components/design/dotA":14,"./components/design/dotB":15,"./components/design/fakeCart":16,"./components/design/trueCart":17,"./directives/behavior":18,"./directives/boilerplate":19,"./directives/cartDer":20,"./directives/d3Der":21,"./directives/datum":22,"./directives/shifter":24,"./directives/texture":25,"./directives/xAxis":26,"./directives/yAxis":27,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
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
var Ctrl, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

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



},{"../../directives/plotCtrl":23,"../../helpers":28,"angular":undefined,"d3":undefined,"lodash":undefined}],5:[function(require,module,exports){
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
var Ctrl, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

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



},{"../../directives/plotCtrl":23,"../../helpers":28,"angular":undefined,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

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



},{"../../directives/plotCtrl":23,"../../helpers":28,"angular":undefined,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
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
var Service, angular, d3;

angular = require('angular');

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



},{"../../helpers":28,"angular":undefined,"d3":undefined}],14:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],22:[function(require,module,exports){
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
var Ctrl, angular, d3, der, textures;

angular = require('angular');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydERhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0T2JqZWN0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydFBsb3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0U2ltLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVEYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkRhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2RvdEEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2RvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Zha2VDYXJ0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi90cnVlQ2FydC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9iZWhhdmlvci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9ib2lsZXJwbGF0ZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9jYXJ0RGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2QzRGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RhdHVtLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3Bsb3RDdHJsLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3NoaWZ0ZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvdGV4dHVyZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy94QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy95QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvaGVscGVycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBOztBQUFBLE9BQ0EsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxHQUdBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmLEVBQTBCLENBQUMsT0FBQSxDQUFRLGtCQUFSLENBQUQsQ0FBMUIsQ0FDTCxDQUFDLFNBREksQ0FDTSxZQUROLEVBQ29CLE9BQUEsQ0FBUSxvQkFBUixDQURwQixDQUVMLENBQUMsU0FGSSxDQUVNLFlBRk4sRUFFb0IsT0FBQSxDQUFRLG9CQUFSLENBRnBCLENBR0wsQ0FBQyxTQUhJLENBR00sWUFITixFQUdvQixPQUFBLENBQVEsMkJBQVIsQ0FIcEIsQ0FJTCxDQUFDLFNBSkksQ0FJTSxlQUpOLEVBSXVCLE9BQUEsQ0FBUSw4QkFBUixDQUp2QixDQUtMLENBQUMsU0FMSSxDQUtNLFNBTE4sRUFLa0IsT0FBQSxDQUFRLHNCQUFSLENBTGxCLENBTUwsQ0FBQyxTQU5JLENBTU0sVUFOTixFQU1rQixPQUFBLENBQVEsdUJBQVIsQ0FObEIsQ0FPTCxDQUFDLFNBUEksQ0FPTSxTQVBOLEVBT2lCLE9BQUEsQ0FBUSwwQkFBUixDQVBqQixDQVFMLENBQUMsU0FSSSxDQVFNLFNBUk4sRUFRaUIsT0FBQSxDQUFRLDBCQUFSLENBUmpCLENBU0wsQ0FBQyxTQVRJLENBU00sT0FUTixFQVNlLE9B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LCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5hcHAgPSBhbmd1bGFyLm1vZHVsZSAnbWFpbkFwcCcsIFtyZXF1aXJlICdhbmd1bGFyLW1hdGVyaWFsJ11cblx0LmRpcmVjdGl2ZSAnaG9yQXhpc0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy94QXhpcydcblx0LmRpcmVjdGl2ZSAndmVyQXhpc0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy95QXhpcydcblx0LmRpcmVjdGl2ZSAnY2FydFNpbURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0nXG5cdC5kaXJlY3RpdmUgJ2NhcnRPYmplY3REZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0T2JqZWN0J1xuXHQuZGlyZWN0aXZlICdzaGlmdGVyJyAsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9zaGlmdGVyJ1xuXHQuZGlyZWN0aXZlICdiZWhhdmlvcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9iZWhhdmlvcidcblx0LmRpcmVjdGl2ZSAnZG90QURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZG90QSdcblx0LmRpcmVjdGl2ZSAnZG90QkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZG90Qidcblx0LmRpcmVjdGl2ZSAnZGF0dW0nLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZGF0dW0nXG5cdC5kaXJlY3RpdmUgJ2QzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2QzRGVyJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25BRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25CRGVyJyAsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQidcblx0LmRpcmVjdGl2ZSAnZGVyaXZhdGl2ZUFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQSdcblx0LmRpcmVjdGl2ZSAnZGVyaXZhdGl2ZUJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQidcblx0LmRpcmVjdGl2ZSAnY2FydFBsb3REZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdCdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQ2FydEFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRBJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25DYXJ0QkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEInXG5cdC5kaXJlY3RpdmUgJ3RleHR1cmVEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvdGV4dHVyZSdcblx0LmRpcmVjdGl2ZSAnYm9pbGVycGxhdGVEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvYm9pbGVycGxhdGUnXG5cdC5kaXJlY3RpdmUgJ2NhcnREZXInICwgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2NhcnREZXInXG5cdC5zZXJ2aWNlICdkZXJpdmF0aXZlRGF0YScsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVEYXRhJ1xuXHQuc2VydmljZSAnZmFrZUNhcnQnLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Zha2VDYXJ0J1xuXHQuc2VydmljZSAndHJ1ZUNhcnQnLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL3RydWVDYXJ0J1xuXHQuc2VydmljZSAnZGVzaWduRGF0YScsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduRGF0YSdcblx0LnNlcnZpY2UgJ2NhcnREYXRhJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydERhdGEnXG5sb29wZXIgPSAtPlxuICAgIHNldFRpbWVvdXQoICgpLT5cbiAgICBcdFx0XHRkMy5zZWxlY3RBbGwgJ2NpcmNsZS5kb3QubGFyZ2UnXG4gICAgXHRcdFx0XHQudHJhbnNpdGlvbiAnZ3JvdydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjM0KSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdzaHJpbmsnXG4gICAgXHRcdFx0XHQuZHVyYXRpb24gNTAwXG4gICAgXHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuICAgIFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScsICdzY2FsZSggMS4wKSdcbiAgICBcdFx0XHRsb29wZXIoKVxuICAgIFx0XHQsIDEwMDApXG5cbmxvb3BlcigpXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xudkZ1biA9ICh0KS0+MipNYXRoLmV4cCAtLjgqdFxuZHZGdW4gPSAodCktPiAtLjggKiAyKk1hdGguZXhwIC0uOCp0XG54RnVuID0gKHQpLT4gMi8uOCooMS1NYXRoLmV4cCgtLjgqdCkpXG5cbmNsYXNzIFNlcnZpY2Vcblx0Y29uc3RydWN0b3I6ICgkcm9vdFNjb3BlKS0+XG5cdFx0QHJvb3RTY29wZSA9ICRyb290U2NvcGVcblx0XHRAc2V0VCAwXG5cdFx0QHBhdXNlZCA9ICBmYWxzZVxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwICwgNiAsIDEvMTBcblx0XHRcdC5tYXAgKHQpLT5cblx0XHRcdFx0cmVzID1cblx0XHRcdFx0XHR4OiB4RnVuIHRcblx0XHRcdFx0XHRkdjogZHZGdW4gdFxuXHRcdFx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0XHRcdHQ6IHRcblx0XHRAbW92ZSAwIFxuXG5cdGNsaWNrOiAtPlxuXHRcdGlmIEBwYXVzZWQgdGhlbiBAcGxheSgpIGVsc2UgQHBhdXNlKClcblxuXHRwYXVzZTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXG5cdGluY3JlbWVudDooZHQpIC0+XG5cdFx0QHQgKz0gZHRcblx0XHRAbW92ZShAdClcblxuXHRzZXRUOiAodCktPlxuXHRcdEB0ID0gdFxuXHRcdEBtb3ZlIEB0XG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRsYXN0ID0gMFxuXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3Rcblx0XHRcdFx0QGluY3JlbWVudCBkdC8xMDAwXG5cdFx0XHRcdGxhc3QgPSBlbGFwc2VkXG5cdFx0XHRcdGlmIEB0ID4gNiB0aGVuIEBzZXRUIDBcblx0XHRcdFx0QHJvb3RTY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0QHBhdXNlZFxuXHRcdFx0LCAxXG5cblx0bW92ZTogKHQpLT5cblx0XHRAcG9pbnQgPSBcblx0XHRcdHg6IHhGdW4gdFxuXHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0dDogdFxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZpY2UiLCJjbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOihAc2NvcGUpLT5cblxuXHR0cmFuczogKHRyYW4pLT5cblx0XHR0cmFuXG5cdFx0XHQuZHVyYXRpb24gNDBcblx0XHRcdC5lYXNlICdsaW5lYXInXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2l6ZTogJz0nXG5cdFx0XHRsZWZ0OiAnPSdcblx0XHRcdHRvcDogJz0nXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLEN0cmxdXG5cdFx0dGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL2NhcnQvY2FydC5zdmcnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblBsb3RDdHJsID0gcmVxdWlyZSAnLi4vLi4vZGlyZWN0aXZlcy9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgY2xhc3M9J2JvdHRvbUNoYXJ0JyA+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0ndm0ubmFtZSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzUnIHg9Jy04JyBzaGlmdGVyPSdbdm0ud2lkdGgsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMCcgeD0nLTE1JyBzaGlmdGVyPSdbMCwgMF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIG5nLWF0dHItY2xpcC1wYXRoPSd1cmwoI3t7dm0ubmFtZX19KScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEudHJhamVjdG9yeSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHgyOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeTE6IHZtLlZlcih2bS5wb2ludC52KSwgeTI6IHZtLlZlcigwKX0nLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWyh2bS5Ib3Iodm0ucG9pbnQudCkgLSAxNiksIHZtLlZlcih2bS5wb2ludC52LzIpXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMy41KSwgdm0uVmVyKDAuNCldJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nZXhwZXJpbWVudCcgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmwgZXh0ZW5kcyBQbG90Q3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93LCBARGF0YSktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cdFx0QG5hbWUgPSAnY2FydFBsb3QnXG5cdFx0QFZlci5kb21haW4gWy0uMSwyLjNdXG5cdFx0QEhvci5kb21haW4gWy0uMSw0LjVdXG5cdFx0QGxpbmVGdW5cblx0XHRcdC55IChkKT0+IEBWZXIgZC52XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudFxuXG5cdFx0QERhdGEucGxheSgpXG5cblx0bW92ZTogPT5cblx0XHR0ID0gQEhvci5pbnZlcnQgZDMuZXZlbnQueCAtIGQzLmV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0QERhdGEuc2V0VCB0XG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAncG9pbnQnLCBnZXQ6LT5cblx0XHRARGF0YS5wb2ludFxuXG5cdEBwcm9wZXJ0eSAndHJpYW5nbGVEYXRhJywgZ2V0Oi0+XG5cdFx0QGxpbmVGdW4gW3t2OiBAcG9pbnQudiwgdDogQHBvaW50LnR9LCB7djpAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnQrMX0sIHt2OiBAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnR9XVxuXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHRkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0LnNlbGVjdCAncmVjdC5iYWNrZ3JvdW5kJ1xuXHRcdFx0XHQub24gJ21vdXNlb3ZlcicsLT5cblx0XHRcdFx0XHR2bS5EYXRhLnBhdXNlKClcblx0XHRcdFx0Lm9uICdtb3VzZW1vdmUnLCAtPlxuXHRcdFx0XHRcdHZtLm1vdmUoKVxuXHRcdFx0XHQub24gJ21vdXNlb3V0JywgLT5cblx0XHRcdFx0XHR2bS5EYXRhLnBsYXkoKVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsJ2NhcnREYXRhJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PGRpdiBjYXJ0LWRlciBkYXRhPVwidm0uY2FydERhdGEucG9pbnRcIiBtYXg9XCJ2bS5tYXhcIiBzYW1wbGU9J3ZtLnNhbXBsZSc+PC9kaXY+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGNhcnREYXRhKS0+XG5cdFx0QHNhbXBsZSA9IFtdXG5cdFx0IyBAY2FydCA9IEBjYXJ0RGF0YS5wb2ludFxuXHRcdEBtYXggPSAzXG5cblx0IyBAcHJvcGVydHkgJ21heCcsIGdldDotPlxuXHQjIFx0M1xuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ2NhcnREYXRhJywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNsYXNzPSdleHBsYWluZXInPlxuXHQgIDxkaXY+XG5cdCAgICA8cD5Ib3ZlciB0byBjaG9vc2UgYSB0aW1lLjwvcD5cblx0ICA8L2Rpdj5cblx0PC9kaXY+XG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSd0b3BDaGFydCcgPlxuXHRcdDxnIGJvaWxlcnBsYXRlLWRlciB3aWR0aD0ndm0ud2lkdGgnIGhlaWdodD0ndm0uaGVpZ2h0JyB2ZXItYXgtZnVuPSd2bS52ZXJBeEZ1bicgaG9yLWF4LWZ1bj0ndm0uaG9yQXhGdW4nIHZlcj0ndm0uVmVyJyBob3I9J3ZtLkhvcicgbWFyPSd2bS5tYXInIG5hbWU9J3ZtLm5hbWUnPlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgbmctYXR0ci1jbGlwLXBhdGg9J3VybCgje3t2bS5uYW1lfX0pJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeD0nLTE1JyB5PSctMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aCwgdm0uVmVyKDApXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGF9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeDI6IHZtLkhvcih2bS5wb2ludC50KS0xLCB5MTogdm0uVmVyKHZtLnBvaW50LnYpLCB5Mjogdm0uVmVyKCh2bS5wb2ludC52ICsgdm0ucG9pbnQuZHYpKX0nLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWyh2bS5Ib3Iodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDEuNjUpLCB2bS5WZXIoMS4zOCldJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxzaW4odCkkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGNpcmNsZSByPSczcHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLnBvaW50LnQpLCB2bS5WZXIodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQERhdGEpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXHRcdEBuYW1lID0gJ2Rlcml2YXRpdmVBJ1xuXHRcdEBWZXIuZG9tYWluIFstMS41LDEuNV1cblx0XHRASG9yLmRvbWFpbiBbMCw2XVxuXHRcdEBsaW5lRnVuXG5cdFx0XHQjIC5pbnRlcnBvbGF0ZSAnY2FyZGluYWwnXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdHNldFRpbWVvdXQgPT5cblx0XHRcdEBEYXRhLnBsYXkoKVxuXG5cdG1vdmU6ID0+XG5cdFx0dCA9IEBIb3IuaW52ZXJ0IGQzLmV2ZW50LnggLSBkMy5ldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuXHRcdEBEYXRhLnNldFQgdFxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N0aGluZycsIGdldDotPlxuXHRcdEBWZXIoQHBvaW50LmR2LzIgKyBAcG9pbnQudikgLSA3XG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDotPlxuXHRcdEBEYXRhLnBvaW50XG5cblx0QHByb3BlcnR5ICd0cmlhbmdsZURhdGEnLCBnZXQ6LT5cblx0XHRAbGluZUZ1biBbe3Y6IEBwb2ludC52LCB0OiBAcG9pbnQudH0sIHt2OkBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudCsxfSwge3Y6IEBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudH1dXG5cblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuc2VsZWN0ICdyZWN0LmJhY2tncm91bmQnXG5cdFx0XHRcdC5vbiAnbW91c2VvdmVyJywtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGF1c2UoKVxuXHRcdFx0XHQub24gJ21vdXNlbW92ZScsIC0+XG5cdFx0XHRcdFx0dm0ubW92ZSgpXG5cdFx0XHRcdC5vbiAnbW91c2VvdXQnLCAtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGxheSgpXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywnZGVyaXZhdGl2ZURhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4uLy4uL2RpcmVjdGl2ZXMvcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0ndm0ubmFtZSc+PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBuZy1hdHRyLWNsaXAtcGF0aD1cInVybCgje3t2bS5uYW1lfX0pXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHg9Jy0xNScgeT0nLTIwJyBzaGlmdGVyPSdbdm0ud2lkdGgsIHZtLlZlcigwKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLkRhdGEudHJhamVjdG9yeSl9JyBjbGFzcz0nZnVuIGR2JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KSwgeDI6IHZtLkhvcih2bS5wb2ludC50KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5wb2ludC5kdil9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5WZXIodm0ucG9pbnQuZHYqLjUpLTZdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKC45KSwgdm0uVmVyKDEpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiRcXFxcY29zKHQpJDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LmR2KV0nIGNsYXNzPSdwb2ludCBkdicvPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQERhdGEpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXHRcdEBWZXIuZG9tYWluIFstMS41LDEuNV1cblx0XHRASG9yLmRvbWFpbiBbMCw2XVxuXHRcdEBuYW1lID0gJ2Rlcml2YXRpdmVCJ1xuXHRcdEBsaW5lRnVuXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQuZHZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0bW92ZTogPT5cblx0XHR0ID0gQEhvci5pbnZlcnQgZDMuZXZlbnQueCAtIGQzLmV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0QERhdGEuc2V0VCB0XG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAncG9pbnQnLCBnZXQ6LT5cblx0XHRARGF0YS5wb2ludFxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciwgdm0pLT5cblx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuc2VsZWN0ICdyZWN0LmJhY2tncm91bmQnXG5cdFx0XHRcdC5vbiAnbW91c2VvdmVyJywtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGF1c2UoKVxuXHRcdFx0XHQub24gJ21vdXNlbW92ZScsIC0+XG5cdFx0XHRcdFx0dm0ubW92ZSgpXG5cdFx0XHRcdC5vbiAnbW91c2VvdXQnLCAtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGxheSgpXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgJ2Rlcml2YXRpdmVEYXRhJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG52RnVuID0gTWF0aC5zaW5cbmR2RnVuID0gTWF0aC5jb3NcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjogKCRyb290U2NvcGUpLT5cblx0XHRAcm9vdFNjb3BlID0gJHJvb3RTY29wZVxuXHRcdEBzZXRUIDBcblx0XHRAcGF1c2VkID0gIGZhbHNlXG5cdFx0QHRyYWplY3RvcnkgPSBfLnJhbmdlIDAgLCA2ICwgLjFcblx0XHRcdC5tYXAgKHQpLT5cblx0XHRcdFx0cmVzID0gXG5cdFx0XHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdFx0XHR2OiB2RnVuIHRcblx0XHRcdFx0XHR0OiB0XG5cdFx0QG1vdmUgMFxuXG5cdGNsaWNrOiAtPlxuXHRcdGlmIEBwYXVzZWQgdGhlbiBAcGxheSgpIGVsc2UgQHBhdXNlKClcblxuXHRwYXVzZTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXG5cdGluY3JlbWVudDooZHQpIC0+XG5cdFx0QHQgKz0gZHRcblx0XHRAbW92ZShAdClcblxuXHRzZXRUOiAodCktPlxuXHRcdEB0ID0gdFxuXHRcdEBtb3ZlKEB0KVxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0bGFzdCA9IDBcblx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuXHRcdFx0XHRkdCA9IGVsYXBzZWQgLSBsYXN0XG5cdFx0XHRcdEBpbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBAdCA+IDYgdGhlbiBAc2V0VCAwXG5cdFx0XHRcdEByb290U2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdEBwYXVzZWRcblx0XHRcdCwgMVxuXG5cdG1vdmU6ICh0KS0+XG5cdFx0QHBvaW50ID0gXG5cdFx0XHRkdjogZHZGdW4gdFxuXHRcdFx0djogdkZ1biB0XG5cdFx0XHR0OiB0XG5cbm1vZHVsZS5leHBvcnRzID0gU2VydmljZSIsInJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4uLy4uL2RpcmVjdGl2ZXMvcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxkaXYgY2xhc3M9J2V4cGxhaW5lcic+XG5cdCAgPGRpdj5cblx0ICAgIDxwPkxlZnQtY2xpY2sgdG8gYWRkIGEgcG9pbnQgJCh2LHQpJC4gPGJyPlxuXHQgICAgXHRDbGljay1hbmQtZHJhZyB0byBtb3ZlIGl0OyA8YnI+XG5cdCAgICBcdHJpZ2h0LWNsaWNrIHRvIGRlbGV0ZSBpdC5cblx0ICAgIDwvcD5cblx0ICA8L2Rpdj5cblx0PC9kaXY+XG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSdib3R0b21DaGFydCcgPlxuXHRcdDxnIGJvaWxlcnBsYXRlLWRlciB3aWR0aD0ndm0ud2lkdGgnIGhlaWdodD0ndm0uaGVpZ2h0JyB2ZXItYXgtZnVuPSd2bS52ZXJBeEZ1bicgaG9yLWF4LWZ1bj0ndm0uaG9yQXhGdW4nIHZlcj0ndm0uVmVyJyBob3I9J3ZtLkhvcicgbWFyPSd2bS5tYXInIG5hbWU9J1wiZGVzaWduQVwiJz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nNScgeD0nLTgnIHNoaWZ0ZXI9J1t2bS53aWR0aCwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScwJyB4PSctMTUnIHNoaWZ0ZXI9J1swLCAwXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXNpZ25BKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nID5cblx0XHRcdDxyZWN0IHN0eWxlPSdvcGFjaXR5OjAnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIGJlaGF2aW9yPSd2bS5kcmFnX3JlY3QnPjwvcmVjdD5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnQpLTEsIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCktMSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC52KX0nLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YSgpfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHRcdDxsaW5lIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCkrMSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC50KSsxLCB5MTogdm0uVmVyKHZtLnNlbGVjdGVkLnYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLnYgKyB2bS5zZWxlY3RlZC5kdil9JyBjbGFzcz0ndHJpIGR2JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0udHJ1ZUNhcnQudHJhamVjdG9yeSl9fScgY2xhc3M9J2Z1biB0YXJnZXQnIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5mYWtlQ2FydC5kb3RzKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgZGF0dW09ZG90IHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnQpLHZtLlZlcihkb3QudildJyBiZWhhdmlvcj0ndm0uZHJhZycgZG90LWEtZGVyPWRvdCA+PC9nPlxuXHRcdFx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0JyBzaGlmdGVyPSdbdm0uSG9yKDApLHZtLlZlcigyKV0nIC8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nNzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMy43KSwgdm0uVmVyKC4zMyldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0uRGF0YS50KSwgdm0uVmVyKHZtLmZha2VDYXJ0LnYpXScgY2xhc3M9J3BvaW50IGZha2UnLz5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5EYXRhLnQpLCB2bS5WZXIodm0udHJ1ZUNhcnQudildJyBjbGFzcz0ncG9pbnQgcmVhbCcvPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQGZha2VDYXJ0LCBAdHJ1ZUNhcnQsIEBEYXRhKS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblx0XHRAVmVyLmRvbWFpbiBbLS4xLDIuM11cblx0XHRASG9yLmRvbWFpbiBbLS4xLDQuNV1cblxuXHRcdEB0cmFuID0gKHRyYW4pLT5cblx0XHRcdHRyYW4uZHVyYXRpb24gMzBcblx0XHRcdFx0LmVhc2UgJ2xpbmVhcidcblxuXHRcdEBsaW5lRnVuXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdEBkcmFnX3JlY3QgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKCk9PlxuXHRcdFx0XHRkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoID09IDNcblx0XHRcdFx0XHRyZXR1cm4gXG5cdFx0XHRcdEBEYXRhLnNldF9zaG93IHRydWVcblx0XHRcdFx0cmVjdCA9IGV2ZW50LnRvRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdFx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0XHR2ICA9IEBWZXIuaW52ZXJ0IGV2ZW50LnkgLSByZWN0LnRvcFxuXHRcdFx0XHRAZmFrZUNhcnQuYWRkX2RvdCB0ICwgdlxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCA9PiBAb25fZHJhZyBAc2VsZWN0ZWRcblx0XHRcdC5vbiAnZHJhZ2VuZCcsPT5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRARGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cblx0XHRAZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuXHRcdFx0Lm9uICdkcmFnc3RhcnQnLCAoZG90KT0+XG5cdFx0XHRcdGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoID09IDNcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0QGZha2VDYXJ0LnJlbW92ZV9kb3QgZG90XG5cdFx0XHRcdFx0QERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCBAb25fZHJhZ1xuXG5cdFx0QERhdGEucGxheSgpXG5cblx0QHByb3BlcnR5ICdkb3RzJywgZ2V0Oi0+IFxuXHRcdEBmYWtlQ2FydC5kb3RzLmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0JylcblxuXHRAcHJvcGVydHkgJ3NlbGVjdGVkJywgZ2V0Oi0+IEBmYWtlQ2FydC5zZWxlY3RlZFxuXG5cdG9uX2RyYWc6IChkb3QpPT4gXG5cdFx0XHRAZmFrZUNhcnQudXBkYXRlX2RvdCBkb3QsIEBIb3IuaW52ZXJ0KGQzLmV2ZW50LngpLCBAVmVyLmludmVydChkMy5ldmVudC55KVxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdHRyaWFuZ2xlRGF0YTotPlxuXHRcdHBvaW50ID0gQHNlbGVjdGVkXG5cdFx0QGxpbmVGdW4gW3t2OiBwb2ludC52LCB0OiBwb2ludC50fSwge3Y6cG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50KzF9LCB7djogcG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50fV1cblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCAnZmFrZUNhcnQnLCAndHJ1ZUNhcnQnLCAnZGVzaWduRGF0YScsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJyZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyAgY2xhc3M9J2JvdHRvbUNoYXJ0Jz5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSdcImRlc2lnbkJcIic+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzUnIHg9Jy04JyBzaGlmdGVyPSdbdm0ud2lkdGgsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMCcgeD0nLTE1JyBzaGlmdGVyPSdbMCwgMF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiRcXFxcZG90e3Z9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVzaWduQilcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cdFxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0udHJ1ZUNhcnQudHJhamVjdG9yeSl9fScgY2xhc3M9J2Z1biB0YXJnZXQnIC8+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeTE6IHZtLlZlcih2bS5zZWxlY3RlZC5kdiksIHkyOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpfScvPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIGR2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnYpLCB4Mjogdm0uSG9yKHZtLnNlbGVjdGVkLnYpLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KX0nLz5cblx0XHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLnRydWVDYXJ0LnRyYWplY3RvcnkpfScgY2xhc3M9J2Z1biBjb3JyZWN0JyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLmNvcnJlY3R9JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PGcgbmctcmVwZWF0PSdkb3QgaW4gdm0uZG90cyB0cmFjayBieSBkb3QuaWQnIHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnYpLHZtLlZlcihkb3QuZHYpXScgZG90LWItZGVyPWRvdD48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nNzAnIGhlaWdodD0nMzAnIHk9JzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoLjMpLCB2bS5WZXIoLS4xKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kdic9LS44diQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nZXhwZXJpbWVudCcgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmwgZXh0ZW5kcyBQbG90Q3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93LCBAZmFrZUNhcnQsIEB0cnVlQ2FydCwgQERhdGEpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXG5cdFx0QFZlci5kb21haW4gWy0xLjcsIC4yXVxuXHRcdEBIb3IuZG9tYWluIFstLjEsMi4xNV1cblxuXHRcdEBsaW5lRnVuXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQuZHZcblx0XHRcdC54IChkKT0+IEBIb3IgZC52XG5cblx0QHByb3BlcnR5ICdkb3RzJywgZ2V0Oi0+XG5cdFx0QGZha2VDYXJ0LmRvdHMuZmlsdGVyIChkKS0+IChkLmlkICE9J2ZpcnN0JykgYW5kIChkLmlkICE9J2xhc3QnKVxuXG5cdEBwcm9wZXJ0eSAnc2VsZWN0ZWQnLCBnZXQ6LT4gQGZha2VDYXJ0LnNlbGVjdGVkXG5cdFx0XG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgJ2Zha2VDYXJ0JywgJ3RydWVDYXJ0JywgJ2Rlc2lnbkRhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxkaXYgY2FydC1kZXIgZGF0YT1cInZtLmZha2VDYXJ0XCIgbWF4PVwidm0ubWF4XCIgc2FtcGxlPSd2bS5zYW1wbGUnPjwvZGl2PlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBmYWtlQ2FydCktPlxuXHRcdEBtYXggPSA0XG5cdFx0QHNhbXBsZSA9IF8ucmFuZ2UgMCwgNSAsIC41XG5cblx0QHByb3BlcnR5ICdtYXgnLCBnZXQ6LT5cblx0XHRAZmFrZUNhcnQubG9jIDQuNVxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ2Zha2VDYXJ0JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS50cnVlQ2FydFwiIG1heD1cInZtLm1heFwiIHNhbXBsZT0ndm0uc2FtcGxlJz48L2Rpdj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAdHJ1ZUNhcnQsIEBmYWtlQ2FydCktPlxuXHRcdEBtYXggPSA0XG5cdFx0QHNhbXBsZSA9IF8ucmFuZ2UgMCwgNSAsIC41XG5cblx0QHByb3BlcnR5ICdtYXgnLCBnZXQ6LT5cblx0XHRAZmFrZUNhcnQubG9jIDQuNVxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ3RydWVDYXJ0JywgJ2Zha2VDYXJ0JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbmNsYXNzIFNlcnZpY2Vcblx0Y29uc3RydWN0b3I6IChAcm9vdFNjb3BlKS0+XG5cdFx0QHQgPSAwXG5cdFx0QHNob3cgPSBAcGF1c2VkID0gZmFsc2VcblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCs9ZHRcblxuXHRzZXRUOiAodCktPlxuXHRcdEB0ID0gdFxuXG5cdHNldF9zaG93OiAodiktPlxuXHRcdEBzaG93ID0gdlxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0bGFzdCA9IDBcblx0XHRjb25zb2xlLmxvZyAnYXNkZidcblx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuXHRcdFx0XHRkdCA9IGVsYXBzZWQgLSBsYXN0XG5cdFx0XHRcdEBpbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBAdCA+IDQuNSB0aGVuIEBzZXRUIDBcblx0XHRcdFx0QHJvb3RTY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0QHBhdXNlZFxuXHRcdFx0LCAxXG5cblx0cGF1c2U6IC0+IEBwYXVzZWQgPSB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gWyckcm9vdFNjb3BlJywgU2VydmljZV0iLCJ0ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3QgbGFyZ2UnPjwvY2lyY2xlPlxuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQGZha2VDYXJ0LCBARGF0YSktPlxuXHRcdHJhZCA9IDcgI3RoZSByYWRpdXMgb2YgdGhlIGxhcmdlIGNpcmNsZSBuYXR1cmFsbHlcblx0XHRzZWwgPSBkMy5zZWxlY3QgQGVsWzBdXG5cdFx0YmlnID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5sYXJnZSdcblx0XHRcdC5hdHRyICdyJywgcmFkXG5cdFx0Y2lyYyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3Quc21hbGwnXG5cblx0XHRiaWcub24gJ21vdXNlb3ZlcicsIEBtb3VzZW92ZXJcblx0XHRcdC5vbiAnY29udGV4dG1lbnUnLCAtPiBcblx0XHRcdFx0ZDMuZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0Lm9uICdtb3VzZWRvd24nLCAtPlxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuN1xuXHRcdFx0Lm9uICdtb3VzZXVwJywgLT5cblx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYy1pbidcblx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjNcblx0XHRcdC5vbiAnbW91c2VvdXQnICwgQG1vdXNlb3V0XG5cblx0XHRAc2NvcGUuJHdhdGNoID0+XG5cdFx0XHRcdChAZmFrZUNhcnQuc2VsZWN0ZWQgPT0gQGRvdCkgYW5kIChARGF0YS5zaG93KVxuXHRcdFx0LCAodiwgb2xkKS0+XG5cdFx0XHRcdGlmIHZcblx0XHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjVcblx0XHRcdFx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1pbidcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZCAqIDEuM1xuXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDIuNVxuXHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdzaHJpbmsnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMzUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnYm91bmNlLW91dCdcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZFxuXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXHRcdFx0IFxuXHRtb3VzZW91dDogPT5cblx0XHRARGF0YS5zZXRfc2hvdyBmYWxzZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRtb3VzZW92ZXI6ID0+XG5cdFx0QGZha2VDYXJ0LnNlbGVjdF9kb3QgQGRvdFxuXHRcdEBEYXRhLnNldF9zaG93IHRydWVcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZG90OiAnPWRvdEFEZXInXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnZmFrZUNhcnQnLCAnZGVzaWduRGF0YScsIEN0cmxdXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQGZha2VDYXJ0LCBARGF0YSktPlxuXHRcdGNpcmMgPSBkMy5zZWxlY3QgQGVsWzBdXG5cblx0XHRjaXJjLm9uICdtb3VzZW92ZXInLEBtb3VzZW92ZXJcblx0XHRcdC5vbiAnbW91c2VvdXQnICwgQG1vdXNlb3V0XG5cblxuXHRcdEBzY29wZS4kd2F0Y2ggPT5cblx0XHRcdFx0KERhdGEuc2VsZWN0ZWQgPT0gQGRvdCkgYW5kIChEYXRhLnNob3cpXG5cdFx0XHQsICh2LCBvbGQpLT5cblx0XHRcdFx0aWYgdiA9PSBvbGQgdGhlbiByZXR1cm5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cdFx0XHQgXG5cdG1vdXNlb3V0OiA9PlxuXHRcdEBEYXRhLnNldF9zaG93IGZhbHNlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdG1vdXNlb3ZlcjogPT5cblx0XHRAZmFrZUNhcnQuc2VsZWN0X2RvdCBAZG90XG5cdFx0QERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZTogXG5cdFx0XHRkb3Q6ICc9ZG90QkRlcidcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICdmYWtlQ2FydCcsICdkZXNpZ25EYXRhJywgQ3RybF1cblx0XHRyZXN0cmljdDogJ0EnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsInJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDMgPSByZXF1aXJlICdkMydcbmRlbFQgPSAuMVxuXG5jbGFzcyBEb3Rcblx0Y29uc3RydWN0b3I6IChAdCwgQHYpLT5cblx0XHRAaWQgPSBfLnVuaXF1ZUlkICdkb3QnXG5cdFx0QGR2ID0gMFxuXG5cdHVwZGF0ZTogKHQsdiktPlxuXHRcdEB0ID0gdFxuXHRcdEB2ID0gdlxuXG5jbGFzcyBTZXJ2aWNlXG5cdGNvbnN0cnVjdG9yOihARGF0YSkgLT5cblx0XHRAY29ycmVjdCA9IGZhbHNlXG5cdFx0Zmlyc3REb3QgPSBuZXcgRG90IDAgLCAyXG5cdFx0Zmlyc3REb3QuaWQgPSAnZmlyc3QnXG5cdFx0QGRvdHMgPSBbZmlyc3REb3RdXG5cdFx0QHRyYWplY3RvcnkgPSBfLnJhbmdlIDAsIDUgLCBkZWxUXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHQ6IHRcblx0XHRcdFx0XHR2OiAwXG5cdFx0XHRcdFx0eDogMFxuXHRcdF8ucmFuZ2UgLjUsIDIuNSwgLjVcblx0XHRcdC5mb3JFYWNoICh0KT0+XG5cdFx0XHRcdEBkb3RzLnB1c2ggbmV3IERvdCB0LCAyKk1hdGguZXhwKC0uOCp0KVxuXG5cdFx0bGFzdERvdCA9IG5ldyBEb3QgNiAsIEBkb3RzW0Bkb3RzLmxlbmd0aCAtIDFdLnZcblx0XHRsYXN0RG90LmlkID0gJ2xhc3QnXG5cdFx0QGRvdHMucHVzaCBsYXN0RG90XG5cdFx0QHNlbGVjdF9kb3QgQGRvdHNbMV1cblx0XHRAdXBkYXRlKClcblxuXHRzZWxlY3RfZG90OiAoZG90KS0+XG5cdFx0QHNlbGVjdGVkID0gZG90XG5cblx0YWRkX2RvdDogKHQsIHYpLT5cblx0XHRuZXdEb3QgPSBuZXcgRG90IHQsdlxuXHRcdEBkb3RzLnB1c2ggbmV3RG90XG5cdFx0QHVwZGF0ZV9kb3QgbmV3RG90LCB0LCB2XG5cblx0cmVtb3ZlX2RvdDogKGRvdCktPlxuXHRcdEBkb3RzLnNwbGljZSBAZG90cy5pbmRleE9mKGRvdCksIDFcblx0XHRAdXBkYXRlKClcblxuXHRsb2M6ICh0KS0+IFxuXHRcdGEgPSBNYXRoLmZsb29yIHQvZGVsVFxuXHRcdGggPSAodCAtIEB0cmFqZWN0b3J5W2FdLnQpL2RlbFRcblx0XHRAdHJhamVjdG9yeVthXS54KiAoMS1oKSArIGgqIEB0cmFqZWN0b3J5W2ErMV0/LnhcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6IC0+IEBsb2MgQERhdGEudFxuXG5cdEBwcm9wZXJ0eSAndicsIGdldDogLT4gXG5cdFx0dCA9IEBEYXRhLnRcblx0XHRhID0gTWF0aC5mbG9vciB0L2RlbFRcblx0XHRoID0gKHQgLSBAdHJhamVjdG9yeVthXS50KS9kZWxUXG5cdFx0QHRyYWplY3RvcnlbYV0udiogKDEtaCkgKyBoKiBAdHJhamVjdG9yeVthKzFdPy52XG5cblx0QHByb3BlcnR5ICdkdicsIGdldDogLT4gQHRyYWplY3RvcnlbTWF0aC5mbG9vcihARGF0YS50L2RlbFQpXS5kdlxuXG5cdHVwZGF0ZTogLT4gXG5cdFx0QGRvdHMuc29ydCAoYSxiKS0+IGEudCAtIGIudFxuXHRcdGRvbWFpbiA9IFtdXG5cdFx0cmFuZ2UgPSBbXVxuXHRcdEBkb3RzLmZvckVhY2ggKGRvdCwgaSwgayktPlxuXHRcdFx0cHJldiA9IGtbaS0xXVxuXHRcdFx0aWYgZG90LmlkID09ICdsYXN0J1xuXHRcdFx0XHRkb3QudiA9IHByZXYudlxuXHRcdFx0XHRkb21haW4ucHVzaCBkb3QudlxuXHRcdFx0XHRyYW5nZS5wdXNoIGRvdC52XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgcHJldlxuXHRcdFx0XHRkdCA9IGRvdC50IC0gcHJldi50XG5cdFx0XHRcdGRvdC54ID0gcHJldi54ICsgZHQgKiAoZG90LnYgKyBwcmV2LnYpLzJcblx0XHRcdFx0ZG90LmR2ID0gKGRvdC52IC0gcHJldi52KS9NYXRoLm1heChkdCwgLjAwMSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZG90LnggPSAwXG5cdFx0XHRcdGRvdC5kdiA9IDBcblxuXHRcdEBkb3RzLmZvckVhY2ggKGRvdCxpLGspPT5cblx0XHRcdFx0YSA9IEBkb3RzW2ktMV1cblx0XHRcdFx0aWYgIWEgdGhlbiByZXR1cm5cblx0XHRcdFx0ZHYgPSBkb3QuZHZcblx0XHRcdFx0QHRyYWplY3Rvcnlcblx0XHRcdFx0XHQuc2xpY2UoTWF0aC5mbG9vcihhLnQvZGVsVCksIE1hdGguZmxvb3IoZG90LnQvZGVsVCkpXG5cdFx0XHRcdFx0LmZvckVhY2ggKGQpLT5cblx0XHRcdFx0XHRcdGR0ID0gZC50IC0gYS50XG5cdFx0XHRcdFx0XHRkLnggPSBhLnggKyBhLnYgKiBkdCArIDAuNSpkdiAqIGR0KioyXG5cdFx0XHRcdFx0XHRkLnYgPSBhLnYgKyBkdiAqIGR0XG5cblx0dXBkYXRlX2RvdDogKGRvdCwgdCwgdiktPlxuXHRcdGlmIGRvdC5pZCA9PSAnZmlyc3QnIHRoZW4gcmV0dXJuXG5cdFx0QHNlbGVjdF9kb3QgZG90XG5cdFx0ZG90LnVwZGF0ZSB0LHZcblx0XHRAdXBkYXRlKClcblx0XHRAY29ycmVjdCA9IE1hdGguYWJzKCAtLjggKiBkb3QudiArIGRvdC5kdikgPCAwLjA1XG5cblxubW9kdWxlLmV4cG9ydHMgPSBbJ2Rlc2lnbkRhdGEnICwgU2VydmljZV0iLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5kZWxUID0gLjFcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjogKEBEYXRhKS0+XG5cdFx0QHRyYWplY3RvcnkgPSBfLnJhbmdlIDAsIDQuNyAsIGRlbFRcblx0XHRcdC5tYXAgKHQpLT5cblx0XHRcdFx0dDogdFxuXHRcdFx0XHR4OiAyLy44ICogKDEtTWF0aC5leHAoLS44KnQpKVxuXHRcdFx0XHR2OiAyKk1hdGguZXhwIC0uOCp0XG5cdFx0XHRcdGR2OiAtLjgqMipNYXRoLmV4cCAtLjgqdFxuXG5cdGxvYzogKHQpLT5cdDIvLjggKiAoMS1NYXRoLmV4cCgtLjgqdCkpXG5cblx0QHByb3BlcnR5ICd4JywgZ2V0Oi0+IEBsb2MgQERhdGEudFxuXG5cdEBwcm9wZXJ0eSAndicsIGdldDotPiAyKiBNYXRoLmV4cCgtLjgqQERhdGEudClcblxuXHRAcHJvcGVydHkgJ2R2JywgZ2V0Oi0+IC0uOCoyKiBNYXRoLmV4cCgtLjgqQERhdGEudClcblxubW9kdWxlLmV4cG9ydHMgPSBbJ2Rlc2lnbkRhdGEnLCBTZXJ2aWNlXSIsImRyYWcgPSAoJHBhcnNlKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGxpbms6IChzY29wZSxlbCxhdHRyKS0+XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QoZWxbMF0pXG5cdFx0XHRzZWwuY2FsbCgkcGFyc2UoYXR0ci5iZWhhdmlvcikoc2NvcGUpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRyYWciLCJ0ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGVmcz5cblx0XHQ8Y2xpcHBhdGggbmctYXR0ci1pZD0ne3s6OnZtLm5hbWV9fSc+XG5cdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyAvPlxuXHRcdDwvY2xpcHBhdGg+XG5cdDwvZGVmcz5cblx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19Jz5cblx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgLz5cblx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0udmVyJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uaG9yJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS52ZXIoMCksIHkyOiB2bS52ZXIoMCl9Jy8+XG5cdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiB2bS5ob3IoMCksIHgyOiB2bS5ob3IoMCksIHkxOjAsIHkyOiB2bS5oZWlnaHR9Jy8+XG5cdFx0PGcgbmctdHJhbnNjbHVkZT5cblx0XHQ8L2c+XG5cdDwvZz5cbicnJ1xuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsIChAc2NvcGUpIC0+XVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRzY29wZTogXG5cdFx0XHR3aWR0aDogJz0nXG5cdFx0XHRoZWlnaHQ6ICc9J1xuXHRcdFx0dmVyQXhGdW46ICc9J1xuXHRcdFx0aG9yQXhGdW46ICc9J1xuXHRcdFx0bWFyOiAnPSdcblx0XHRcdHZlcjogJz0nXG5cdFx0XHRob3I6ICc9J1xuXHRcdFx0bmFtZTogJz0nXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi9oZWxwZXJzJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBuZy1hdHRyLWhlaWdodD1cInt7dm0uc3ZnSGVpZ2h0fX1cIj5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0nY2FydFNpbSc+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19JyA+XG5cdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgY2xhc3M9J2JhY2tncm91bmQnLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR4JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgY2xpcC1wYXRoPVwidXJsKCNjYXJ0U2ltKVwiID5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J3QgaW4gdm0uc2FtcGxlJyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uSG9yKHZtLmRhdGEubG9jKHQpKSArIFwiLDApXCJ9Jz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RpbWUtbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiAwLCB5MTogMCwgeTI6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBjYXJ0LW9iamVjdC1kZXIgbGVmdD0ndm0uSG9yKHZtLmRhdGEueCknIHRvcD0ndm0uaGVpZ2h0JyBzaXplPSd2bS5zaXplJz48L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXHRcdFx0IyA8cmVjdCBjbGFzcz0nZXhwZXJpbWVudCcgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgLz5cblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXHRcdCMgQG1hci5sZWZ0ID0gQG1hci5yaWdodCA9IDEwXG5cdFx0QG1hci50b3AgPSA1XG5cdFx0QG1hci5ib3R0b20gPSAyNVxuXG5cdFx0QHNjb3BlLiR3YXRjaCAndm0ubWF4JywgPT5cblx0XHRcdEBIb3IuZG9tYWluIFstLjEsIEBtYXhdXG5cblxuXHRAcHJvcGVydHkgJ3NpemUnLCBnZXQ6IC0+IChASG9yKDAuNCkgLSBASG9yKDApKS84MFxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZTogXG5cdFx0XHRkYXRhOiAnPSdcblx0XHRcdG1heDogJz0nXG5cdFx0XHRzYW1wbGU6ICc9J1xuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0IyB0cmFuc2NsdWRlOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkcGFyc2UpLT4gI2dvZXMgb24gYSBzdmcgZWxlbWVudFxuXHRkaXJlY3RpdmUgPSBcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZDNEZXI6ICc9J1xuXHRcdFx0dHJhbjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHR1ID0gJ3QtJyArIE1hdGgucmFuZG9tKClcblx0XHRcdHNjb3BlLiR3YXRjaCAnZDNEZXInXG5cdFx0XHRcdCwgKHYpLT5cblx0XHRcdFx0XHRpZiBzY29wZS50cmFuXG5cdFx0XHRcdFx0XHRzZWwudHJhbnNpdGlvbiB1XG5cdFx0XHRcdFx0XHRcdC5hdHRyIHZcblx0XHRcdFx0XHRcdFx0LmNhbGwgc2NvcGUudHJhblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHNlbC5hdHRyIHZcblxuXHRcdFx0XHQsIHRydWVcbm1vZHVsZS5leHBvcnRzID0gZGVyIiwibW9kdWxlLmV4cG9ydHMgPSAoJHBhcnNlKS0+XG5cdChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRkMy5zZWxlY3QoZWxbMF0pLmRhdHVtICRwYXJzZShhdHRyLmRhdHVtKShzY29wZSkiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAyMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDE1XG5cdFx0XHRib3R0b206IDMwXG5cblx0XHRAVmVyID1kMy5zY2FsZS5saW5lYXIoKVxuXHRcdFxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tGb3JtYXQgKGQpLT5cblx0XHRcdFx0aWYgTWF0aC5mbG9vciggZCApICE9IGQgdGhlbiByZXR1cm5cblx0XHRcdFx0ZFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiA9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDdHJsIiwiZDMgPSByZXF1aXJlICdkMydcblxuZGVyID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdHUgPSAndC0nICsgTWF0aC5yYW5kb20oKVxuXHRcdFx0dHJhbiA9ICRwYXJzZShhdHRyLnRyYW4pKHNjb3BlKVxuXHRcdFx0cmVzaGlmdCA9ICh2KS0+IFxuXHRcdFx0XHRpZiB0cmFuXG5cdFx0XHRcdFx0c2VsLnRyYW5zaXRpb24gdVxuXHRcdFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScgLCBcInRyYW5zbGF0ZSgje3ZbMF19LCN7dlsxXX0pXCJcblx0XHRcdFx0XHRcdC5jYWxsIHRyYW5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNlbC5hdHRyICd0cmFuc2Zvcm0nICwgXCJ0cmFuc2xhdGUoI3t2WzBdfSwje3ZbMV19KVwiXG5cblx0XHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdFx0XG5cblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHRcdCRwYXJzZShhdHRyLnNoaWZ0ZXIpKHNjb3BlKVxuXHRcdFx0XHQsIHJlc2hpZnRcblx0XHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xudGV4dHVyZXMgPSByZXF1aXJlICd0ZXh0dXJlcydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0dCA9IHRleHR1cmVzLmxpbmVzKClcblx0XHRcdC5vcmllbnRhdGlvbiBcIjMvOFwiLCBcIjcvOFwiXG5cdFx0XHQuc2l6ZSA0XG5cdFx0XHQuc3Ryb2tlKCcjRTZFNkU2Jylcblx0XHQgICAgLnN0cm9rZVdpZHRoIC42XG5cblx0XHR0LmlkICdteVRleHR1cmUnXG5cblx0XHR0MiA9IHRleHR1cmVzLmxpbmVzKClcblx0XHRcdC5vcmllbnRhdGlvbiBcIjMvOFwiLCBcIjcvOFwiXG5cdFx0XHQuc2l6ZSA0XG5cdFx0XHQuc3Ryb2tlKCd3aGl0ZScpXG5cdFx0ICAgIC5zdHJva2VXaWR0aCAuNFxuXG5cdFx0dDIuaWQgJ215VGV4dHVyZTInXG5cblx0XHRkMy5zZWxlY3QgQGVsWzBdXG5cdFx0XHQuc2VsZWN0ICdzdmcnXG5cdFx0XHQuY2FsbCB0XG5cdFx0XHQuY2FsbCB0MlxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogJzxzdmcgaGVpZ2h0PVwiMHB4XCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7XCIgd2lkdGg9XCIwcHhcIj48L3N2Zz4nXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImQzID0gcmVxdWlyZSAnZDMnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCR3aW5kb3cpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlcjogYW5ndWxhci5ub29wXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRzY29wZTogXG5cdFx0XHRoZWlnaHQ6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0c2NhbGUgPSB2bS5mdW4uc2NhbGUoKVxuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0LmNsYXNzZWQgJ3ggYXhpcycsIHRydWVcblxuXHRcdFx0dXBkYXRlID0gPT5cblx0XHRcdFx0dm0uZnVuLnRpY2tTaXplIC12bS5oZWlnaHRcblx0XHRcdFx0c2VsLmNhbGwgdm0uZnVuXG5cdFx0XHRcdFxuXHRcdFx0c2NvcGUuJHdhdGNoIC0+XG5cdFx0XHRcdFtzY2FsZS5kb21haW4oKSwgc2NhbGUucmFuZ2UoKSAsdm0uaGVpZ2h0XVxuXHRcdFx0LCB1cGRhdGVcblx0XHRcdCwgdHJ1ZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHNjYWxlID0gdm0uZnVuLnNjYWxlKClcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKS5jbGFzc2VkKCd5IGF4aXMnLCB0cnVlKVxuXG5cdFx0XHR1cGRhdGUgPSA9PlxuXHRcdFx0XHR2bS5mdW4udGlja1NpemUoIC12bS53aWR0aClcblx0XHRcdFx0c2VsLmNhbGwgdm0uZnVuXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHQjIGNvbnNvbGUubG9nIHNjYWxlLnJhbmdlKClcblx0XHRcdFx0W3NjYWxlLmRvbWFpbigpLCBzY2FsZS5yYW5nZSgpICx2bS53aWR0aF1cblx0XHRcdCwgdXBkYXRlXG5cdFx0XHQsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMudGltZW91dCA9IChmdW4sIHRpbWUpLT5cblx0XHRkMy50aW1lcigoKT0+XG5cdFx0XHRmdW4oKVxuXHRcdFx0dHJ1ZVxuXHRcdCx0aW1lKVxuXG5cbkZ1bmN0aW9uOjpwcm9wZXJ0eSA9IChwcm9wLCBkZXNjKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQHByb3RvdHlwZSwgcHJvcCwgZGVzYyJdfQ==
