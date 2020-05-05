(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('stimulus')) :
  typeof define === 'function' && define.amd ? define(['stimulus'], factory) :
  (global = global || self, global['stimulus-image-grid'] = factory(global.Stimulus));
}(this, (function (stimulus) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function () {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  let _default = /*#__PURE__*/function (_Controller) {
    _inherits(_default, _Controller);

    var _super = _createSuper(_default);

    function _default() {
      _classCallCheck(this, _default);

      return _super.apply(this, arguments);
    }

    _createClass(_default, [{
      key: "initialize",
      value: function initialize() {
        this.element['imageGrid'] = this;
        Array.prototype.filter.call(this.element.childNodes, node => node.nodeType == 3 && !/\S/.test(node.nodeValue)).forEach(node => node.remove());
        if (!this.hasPaddingValue) this.paddingValue = 10;
        if (!this.hasTargetHeightValue) this.targetHeightValue = 300;
        if (!this.hasDisplayValue) this.displayValue = 'inline-block';
        this.resizeObserver = new ResizeObserver(this.observed.bind(this));
      }
    }, {
      key: "observed",
      value: function observed(elements) {
        this.albumWidth = elements[0].contentRect.width;
        this.processImages();
      }
    }, {
      key: "connect",
      value: function connect() {
        this.resizeObserver.observe(this.element);
      }
    }, {
      key: "disconnect",
      value: function disconnect() {
        this.resizeObserver.unobserve(this.element);
      }
    }, {
      key: "processImages",
      value: function processImages() {
        let row = 0;
        this.elements = [];
        this.images = Array.from(this.element.children);
        this.images.forEach((ele, index) => {
          const image = ele.nodeName === 'IMG' ? ele : ele.querySelector('img');
          let width, height;

          if ('width' in image.dataset && 'height' in image.dataset) {
            width = image.dataset.width;
            height = image.dataset.height;
          } else {
            const comp = window.getComputedStyle(image);
            width = parseFloat(comp.getPropertyValue('width').slice(0, -2));
            height = parseFloat(comp.getPropertyValue('height').slice(0, -2));
            image.dataset.width = width;
            image.dataset.height = height;
          }

          const idealW = Math.ceil(width / height * this.targetHeightValue);
          const idealH = Math.ceil(this.targetHeightValue);
          this.elements.push([ele, idealW, idealH]);
          row += idealW + this.paddingValue;

          if (row > this.albumWidth && this.elements.length) {
            this.resizeRow(row - this.paddingValue);
            row = 0;
            this.elements = [];
          }

          if (this.images.length - 1 == index && this.elements.length) {
            this.resizeRow(row);
            row = 0;
            this.elements = [];
          }
        }, this);
      }
    }, {
      key: "resizeRow",
      value: function resizeRow(row) {
        const imageExtras = this.paddingValue * (this.elements.length - 1);
        const albumWidthAdjusted = this.albumWidth - imageExtras;
        const overPercent = albumWidthAdjusted / (row - imageExtras);
        let trackWidth = imageExtras;
        this.elements.forEach((element, index) => {
          const [ele, idealW, idealH] = element;
          let fw = Math.floor(idealW * overPercent);
          let fh = Math.floor(idealH * overPercent);
          const isNotLast = index < this.elements.length - 1;
          trackWidth += fw;
          if (!isNotLast && trackWidth < this.albumWidth) fw += this.albumWidth - trackWidth;
          fw--;
          const image = ele.nodeName === 'IMG' ? ele : ele.querySelector('img');
          image.style.width = fw + 'px';
          image.style.height = fh + 'px';
          ele.style.marginBottom = this.paddingValue + 'px';
          ele.style.marginRight = isNotLast ? this.paddingValue + 'px' : 0;
          ele.style.display = this.displayValue;
          ele.style.verticalAlign = 'bottom';
        }, this);
      }
    }]);

    return _default;
  }(stimulus.Controller);

  _defineProperty(_default, "values", {
    padding: Number,
    targetHeight: Number,
    display: String
  });

  return _default;

})));
//# sourceMappingURL=index.umd.js.map
