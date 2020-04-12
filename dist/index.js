"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VoiceCommandRecognizer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _fuzzyset = _interopRequireDefault(require("fuzzyset.js"));

var _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Status = {
  LOADING_DEPENDENCIES: 'loading-dependencies',
  AUTHORIZING: 'authorizing',
  STARTING: 'starting',
  RECOGNIZING: 'recognizing',
  FINISHED: 'finished',
  FAILED: 'failed',
  PAUSED: 'paused'
};
var Errors = {
  BROWSER_DENIAL: 'browser-denial',
  USER_DENIAL: 'user-denial',
  UNSUPPORTED: 'unsupported',
  UNEXPECTED: 'unexpected'
};
var VoiceCommandRecognizer = (_temp = /*#__PURE__*/function (_Component) {
  _inherits(VoiceCommandRecognizer, _Component);

  function VoiceCommandRecognizer(props) {
    var _this;

    _classCallCheck(this, VoiceCommandRecognizer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VoiceCommandRecognizer).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onStart", function () {
      var startVoiceRecognition = _this.props.startVoiceRecognition;

      _this.setState({
        status: startVoiceRecognition ? Status.RECOGNIZING : Status.PAUSED
      }, function () {
        var onStart = _this.props.onStart;

        if (!onStart) {
          return;
        }

        onStart();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getFuzzyMatch", function (results) {
      var fuzzyMatchThreshold = _this.props.fuzzyMatchThreshold;

      if (!results || !results.length || !fuzzyMatchThreshold) {
        return;
      }

      var fuzzyMatch = [0, ''];
      var fuzzyMatchingResult = results.find(function (result) {
        var matches = _this.fuzzySet.get(result);

        if (!matches) {
          return false;
        }

        var _matches$ = _slicedToArray(matches[0], 1),
            fuzzyMatchingPercentage = _matches$[0];

        var isItAFuzzyMatch = fuzzyMatchingPercentage >= fuzzyMatchThreshold;

        if (isItAFuzzyMatch) {
          fuzzyMatch = matches[0];
        }

        return isItAFuzzyMatch;
      });

      if (!fuzzyMatchingResult) {
        return;
      }
      /**
       * SR at times returns the results with a starting space.
       * This ensures is just the words the user said that are taken into account.
       */


      return {
        result: fuzzyMatchingResult.trim(),
        match: fuzzyMatch
      };
    });

    _defineProperty(_assertThisInitialized(_this), "onNotMatch", function (_, __, results) {
      if (results && _this.props.fuzzyMatchThreshold) {
        var fuzzyMatch = _this.getFuzzyMatch(results);

        if (fuzzyMatch) {
          _this.toggleIsRecognizerEnabled();

          var onFuzzyMatch = _this.props.onFuzzyMatch;

          if (onFuzzyMatch) {
            onFuzzyMatch(fuzzyMatch.match[1]);
            return;
          }

          annyang.trigger(fuzzyMatch.match[1]);
          return;
        }
      }

      var onNotMatch = _this.props.onNotMatch;

      if (onNotMatch) {
        onNotMatch();
        return;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "toggleIsRecognizerEnabled", function () {
      var isRecognizerEnabled = !_this.state.isRecognizerEnabled;

      _this.setState({
        isRecognizerEnabled: isRecognizerEnabled
      }, function () {
        var _this$props = _this.props,
            onRecognizerEnabled = _this$props.onRecognizerEnabled,
            onRecognizerDisabled = _this$props.onRecognizerDisabled;
        var callback = isRecognizerEnabled ? onRecognizerEnabled : onRecognizerDisabled;

        if (callback) {
          callback();
        }
      });
    });

    _this.state = {
      isRecognizerEnabled: true,
      status: Status.LOADING_DEPENDENCIES
    };
    return _this;
  }

  _createClass(VoiceCommandRecognizer, [{
    key: "prepareRecognition",
    value: function prepareRecognition() {
      var _this2 = this;

      var _this$props2 = this.props,
          commands = _this$props2.commands,
          keyCommand = _this$props2.keyCommand;
      var formattedCommandsForFuzzy = commands.reduce(function (set, command) {
        set = set.concat(command.phrases);
        return set;
      }, []);
      this.fuzzySet = (0, _fuzzyset["default"])(formattedCommandsForFuzzy);
      var annyangFormattedCommands = {};
      commands.forEach(function (command) {
        var phrases = command.phrases;
        phrases.forEach(function (phrase) {
          annyangFormattedCommands[phrase] = function () {
            var _this2$state = _this2.state,
                status = _this2$state.status,
                isRecognizerEnabled = _this2$state.isRecognizerEnabled;

            if (keyCommand && phrase === keyCommand) {
              _this2.toggleIsRecognizerEnabled();

              return;
            }

            if (status !== Status.RECOGNIZING || !isRecognizerEnabled) {
              return;
            }

            command.callback();

            if (keyCommand) {
              _this2.toggleIsRecognizerEnabled();
            }
          };
        });
      });

      if (keyCommand) {
        annyangFormattedCommands[keyCommand] = this.toggleIsRecognizerEnabled;
      }

      annyang.addCommands(annyangFormattedCommands);

      if (keyCommand) {
        this.state = _objectSpread({}, this.state, {
          isRecognizerEnabled: false
        });
      }

      var _this$props3 = this.props,
          onPermissionBlocked = _this$props3.onPermissionBlocked,
          onPermissionDenied = _this$props3.onPermissionDenied;
      annyang.addCallback('start', this.onStart);
      annyang.addCallback('errorPermissionBlocked', onPermissionBlocked ? onPermissionBlocked : function () {});
      annyang.addCallback('errorPermissionDenied', onPermissionDenied ? onPermissionDenied : function () {});
      annyang.addCallback('resultNoMatch', this.onNotMatch);
      annyang.start({
        autoRestart: true
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      var script = document.createElement('script');
      script.src = '//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.1/annyang.min.js';
      script.type = 'text/javascript';
      /**
       * This loads the main library for voice command recognition.
       * The reason that it's imported like this it's because in spite of being available as a node
       * module, I couldn't find a way to make it work nicely if it wasn't included in the 
       * index as a script tag. #sorrynotsorry
       */

      script.onload = function () {
        _this3.prepareRecognition();

        _this3.setState({
          status: status.AUTHORIZING
        });
      };
      /**
       * When Speech Recognition is not supported Annyang is not initialised
       * and just set to null. This prevents exceptions from happening in those browsers
       * where SR is not supported.
       */


      script.onerror = function () {
        return _this3.setState({
          error: Errors.UNSUPPORTED,
          status: Status.FAILED
        });
      };

      document.body.append(script);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var startVoiceRecognition = this.props.startVoiceRecognition;
      var status = this.state.status;

      if (!startVoiceRecognition) {
        /**
         * `.abort` is used here so `onStart` is triggered again 
         * for the status to be properly set when `.start` is rerun.
         */
        annyang.abort();

        if (status !== Status.PAUSED) {
          this.setState({
            status: Status.PAUSED
          });
        }

        return;
      }

      if (!annyang.isListening() && status !== Status.LOADING_DEPENDENCIES) {
        annyang.start();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return _react["default"].createElement("div", {
        className: "VoiceCommandRecognizer"
      }, children(this.props, this.state));
    }
  }]);

  return VoiceCommandRecognizer;
}(_react.Component), _temp);
exports.VoiceCommandRecognizer = VoiceCommandRecognizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qc3giXSwibmFtZXMiOlsiU3RhdHVzIiwiTE9BRElOR19ERVBFTkRFTkNJRVMiLCJBVVRIT1JJWklORyIsIlNUQVJUSU5HIiwiUkVDT0dOSVpJTkciLCJGSU5JU0hFRCIsIkZBSUxFRCIsIlBBVVNFRCIsIkVycm9ycyIsIkJST1dTRVJfREVOSUFMIiwiVVNFUl9ERU5JQUwiLCJVTlNVUFBPUlRFRCIsIlVORVhQRUNURUQiLCJWb2ljZUNvbW1hbmRSZWNvZ25pemVyIiwicHJvcHMiLCJzdGFydFZvaWNlUmVjb2duaXRpb24iLCJzZXRTdGF0ZSIsInN0YXR1cyIsIm9uU3RhcnQiLCJyZXN1bHRzIiwiZnV6enlNYXRjaFRocmVzaG9sZCIsImxlbmd0aCIsImZ1enp5TWF0Y2giLCJmdXp6eU1hdGNoaW5nUmVzdWx0IiwiZmluZCIsInJlc3VsdCIsIm1hdGNoZXMiLCJmdXp6eVNldCIsImdldCIsImZ1enp5TWF0Y2hpbmdQZXJjZW50YWdlIiwiaXNJdEFGdXp6eU1hdGNoIiwidHJpbSIsIm1hdGNoIiwiXyIsIl9fIiwiZ2V0RnV6enlNYXRjaCIsInRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQiLCJvbkZ1enp5TWF0Y2giLCJhbm55YW5nIiwidHJpZ2dlciIsIm9uTm90TWF0Y2giLCJpc1JlY29nbml6ZXJFbmFibGVkIiwic3RhdGUiLCJvblJlY29nbml6ZXJFbmFibGVkIiwib25SZWNvZ25pemVyRGlzYWJsZWQiLCJjYWxsYmFjayIsImNvbW1hbmRzIiwia2V5Q29tbWFuZCIsImZvcm1hdHRlZENvbW1hbmRzRm9yRnV6enkiLCJyZWR1Y2UiLCJzZXQiLCJjb21tYW5kIiwiY29uY2F0IiwicGhyYXNlcyIsImFubnlhbmdGb3JtYXR0ZWRDb21tYW5kcyIsImZvckVhY2giLCJwaHJhc2UiLCJhZGRDb21tYW5kcyIsIm9uUGVybWlzc2lvbkJsb2NrZWQiLCJvblBlcm1pc3Npb25EZW5pZWQiLCJhZGRDYWxsYmFjayIsInN0YXJ0IiwiYXV0b1Jlc3RhcnQiLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJ0eXBlIiwib25sb2FkIiwicHJlcGFyZVJlY29nbml0aW9uIiwib25lcnJvciIsImVycm9yIiwiYm9keSIsImFwcGVuZCIsImFib3J0IiwiaXNMaXN0ZW5pbmciLCJjaGlsZHJlbiIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBRFQ7QUFFYkMsRUFBQUEsV0FBVyxFQUFFLGFBRkE7QUFHYkMsRUFBQUEsUUFBUSxFQUFFLFVBSEc7QUFJYkMsRUFBQUEsV0FBVyxFQUFFLGFBSkE7QUFLYkMsRUFBQUEsUUFBUSxFQUFFLFVBTEc7QUFNYkMsRUFBQUEsTUFBTSxFQUFFLFFBTks7QUFPYkMsRUFBQUEsTUFBTSxFQUFFO0FBUEssQ0FBZjtBQVVBLElBQU1DLE1BQU0sR0FBRztBQUNiQyxFQUFBQSxjQUFjLEVBQUUsZ0JBREg7QUFFYkMsRUFBQUEsV0FBVyxFQUFFLGFBRkE7QUFHYkMsRUFBQUEsV0FBVyxFQUFFLGFBSEE7QUFJYkMsRUFBQUEsVUFBVSxFQUFFO0FBSkMsQ0FBZjtBQU9PLElBQU1DLHNCQUFzQjtBQUFBOztBQUNqQyxrQ0FBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBOztBQUNqQixnR0FBTUEsS0FBTjs7QUFEaUIsOERBc0VULFlBQU07QUFBQSxVQUNOQyxxQkFETSxHQUNvQixNQUFLRCxLQUR6QixDQUNOQyxxQkFETTs7QUFHZCxZQUFLQyxRQUFMLENBQWM7QUFDWkMsUUFBQUEsTUFBTSxFQUFFRixxQkFBcUIsR0FBR2YsTUFBTSxDQUFDSSxXQUFWLEdBQXdCSixNQUFNLENBQUNPO0FBRGhELE9BQWQsRUFFRyxZQUFNO0FBQUEsWUFDQ1csT0FERCxHQUNhLE1BQUtKLEtBRGxCLENBQ0NJLE9BREQ7O0FBR1AsWUFB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QSxVQUNDZSxRQURELEdBQ2MsS0FBSzlELEtBRG5CLENBQ0M4RCxRQUREO0FBR1AsYUFDRTtBQUFLLFFBQUEsU0FBUyxFQUFDO0FBQWYsU0FDR0EsUUFBUSxDQUFDLEtBQUs5RCxLQUFOLEVBQWEsS0FBSzRCLEtBQWxCLENBRFgsQ0FERjtBQUtEO0FBM09nQzs7QUFBQTtBQUFBLEVBQXdDbUMsZ0JBQXhDLFNBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGdXp6eVNldCBmcm9tICdmdXp6eXNldC5qcyc7XG5cbmNvbnN0IFN0YXR1cyA9IHtcbiAgTE9BRElOR19ERVBFTkRFTkNJRVM6ICdsb2FkaW5nLWRlcGVuZGVuY2llcycsXG4gIEFVVEhPUklaSU5HOiAnYXV0aG9yaXppbmcnLFxuICBTVEFSVElORzogJ3N0YXJ0aW5nJyxcbiAgUkVDT0dOSVpJTkc6ICdyZWNvZ25pemluZycsXG4gIEZJTklTSEVEOiAnZmluaXNoZWQnLFxuICBGQUlMRUQ6ICdmYWlsZWQnLFxuICBQQVVTRUQ6ICdwYXVzZWQnLFxufTtcblxuY29uc3QgRXJyb3JzID0ge1xuICBCUk9XU0VSX0RFTklBTDogJ2Jyb3dzZXItZGVuaWFsJyxcbiAgVVNFUl9ERU5JQUw6ICd1c2VyLWRlbmlhbCcsXG4gIFVOU1VQUE9SVEVEOiAndW5zdXBwb3J0ZWQnLFxuICBVTkVYUEVDVEVEOiAndW5leHBlY3RlZCcsXG59XG5cbmV4cG9ydCBjb25zdCBWb2ljZUNvbW1hbmRSZWNvZ25pemVyID0gY2xhc3MgVm9pY2VDb21tYW5kUmVjb2duaXplciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzUmVjb2duaXplckVuYWJsZWQ6IHRydWUsXG4gICAgICBzdGF0dXM6IFN0YXR1cy5MT0FESU5HX0RFUEVOREVOQ0lFUyxcbiAgICB9O1xuICB9XG5cbiAgcHJlcGFyZVJlY29nbml0aW9uKCkge1xuICAgIGNvbnN0IHsgY29tbWFuZHMsIGtleUNvbW1hbmQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZm9ybWF0dGVkQ29tbWFuZHNGb3JGdXp6eSA9IGNvbW1hbmRzLnJlZHVjZSgoc2V0LCBjb21tYW5kKSA9PiB7XG4gICAgICBzZXQgPSBzZXQuY29uY2F0KGNvbW1hbmQucGhyYXNlcyk7XG4gICAgICByZXR1cm4gc2V0O1xuICAgIH0sIFtdKTtcblxuICAgIHRoaXMuZnV6enlTZXQgPSBGdXp6eVNldChmb3JtYXR0ZWRDb21tYW5kc0ZvckZ1enp5KTtcblxuICAgIGNvbnN0IGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kcyA9IHt9O1xuXG4gICAgY29tbWFuZHMuZm9yRWFjaCgoY29tbWFuZCkgPT4ge1xuICAgICAgY29uc3QgeyBwaHJhc2VzIH0gPSBjb21tYW5kO1xuXG4gICAgICBwaHJhc2VzLmZvckVhY2goKHBocmFzZSkgPT4ge1xuICAgICAgICBhbm55YW5nRm9ybWF0dGVkQ29tbWFuZHNbcGhyYXNlXSA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCB7IHN0YXR1cywgaXNSZWNvZ25pemVyRW5hYmxlZCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICAgIGlmIChrZXlDb21tYW5kICYmIHBocmFzZSA9PT0ga2V5Q29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN0YXR1cyAhPT0gU3RhdHVzLlJFQ09HTklaSU5HIHx8ICFpc1JlY29nbml6ZXJFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29tbWFuZC5jYWxsYmFjaygpO1xuXG4gICAgICAgICAgaWYgKGtleUNvbW1hbmQpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKGtleUNvbW1hbmQpIHtcbiAgICAgIGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kc1trZXlDb21tYW5kXSA9IHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZDtcbiAgICB9XG5cbiAgICBhbm55YW5nLmFkZENvbW1hbmRzKGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kcyk7XG5cbiAgICBpZiAoa2V5Q29tbWFuZCkge1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgLi4udGhpcy5zdGF0ZSxcbiAgICAgICAgaXNSZWNvZ25pemVyRW5hYmxlZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHsgb25QZXJtaXNzaW9uQmxvY2tlZCwgb25QZXJtaXNzaW9uRGVuaWVkIH0gPSB0aGlzLnByb3BzO1xuICAgIFxuICAgIGFubnlhbmcuYWRkQ2FsbGJhY2soJ3N0YXJ0JywgdGhpcy5vblN0YXJ0KTtcbiAgICBhbm55YW5nLmFkZENhbGxiYWNrKCdlcnJvclBlcm1pc3Npb25CbG9ja2VkJywgb25QZXJtaXNzaW9uQmxvY2tlZCA/IG9uUGVybWlzc2lvbkJsb2NrZWQgOiAoKSA9PiB7fSk7XG4gICAgYW5ueWFuZy5hZGRDYWxsYmFjaygnZXJyb3JQZXJtaXNzaW9uRGVuaWVkJywgb25QZXJtaXNzaW9uRGVuaWVkID8gb25QZXJtaXNzaW9uRGVuaWVkIDogKCkgPT4ge30pO1xuICAgIGFubnlhbmcuYWRkQ2FsbGJhY2soJ3Jlc3VsdE5vTWF0Y2gnLCB0aGlzLm9uTm90TWF0Y2gpO1xuXG4gICAgYW5ueWFuZy5zdGFydCh7XG4gICAgICBhdXRvUmVzdGFydDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFydFZvaWNlUmVjb2duaXRpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXR1czogc3RhcnRWb2ljZVJlY29nbml0aW9uID8gU3RhdHVzLlJFQ09HTklaSU5HIDogU3RhdHVzLlBBVVNFRCxcbiAgICB9LCAoKSA9PiB7XG4gICAgICBjb25zdCB7IG9uU3RhcnQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIGlmICghb25TdGFydCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9uU3RhcnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEZ1enp5TWF0Y2ggPSAocmVzdWx0cykgPT4ge1xuICAgIGNvbnN0IHsgZnV6enlNYXRjaFRocmVzaG9sZCB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghcmVzdWx0cyB8fCAhcmVzdWx0cy5sZW5ndGggfHwgIWZ1enp5TWF0Y2hUaHJlc2hvbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZnV6enlNYXRjaCA9IFswLCAnJ107XG4gICAgY29uc3QgZnV6enlNYXRjaGluZ1Jlc3VsdCA9IHJlc3VsdHMuZmluZCgocmVzdWx0KSA9PiB7XG5cbiAgICAgIGNvbnN0IG1hdGNoZXMgPSB0aGlzLmZ1enp5U2V0LmdldChyZXN1bHQpO1xuXG4gICAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBbZnV6enlNYXRjaGluZ1BlcmNlbnRhZ2VdID0gbWF0Y2hlc1swXTtcbiAgICAgIGNvbnN0IGlzSXRBRnV6enlNYXRjaCA9IGZ1enp5TWF0Y2hpbmdQZXJjZW50YWdlID49IGZ1enp5TWF0Y2hUaHJlc2hvbGQ7XG5cbiAgICAgIGlmIChpc0l0QUZ1enp5TWF0Y2gpIHtcbiAgICAgICAgZnV6enlNYXRjaCA9IG1hdGNoZXNbMF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc0l0QUZ1enp5TWF0Y2g7XG4gICAgfSk7XG5cbiAgICBpZiAoIWZ1enp5TWF0Y2hpbmdSZXN1bHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTUiBhdCB0aW1lcyByZXR1cm5zIHRoZSByZXN1bHRzIHdpdGggYSBzdGFydGluZyBzcGFjZS5cbiAgICAgKiBUaGlzIGVuc3VyZXMgaXMganVzdCB0aGUgd29yZHMgdGhlIHVzZXIgc2FpZCB0aGF0IGFyZSB0YWtlbiBpbnRvIGFjY291bnQuXG4gICAgICovXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdDogZnV6enlNYXRjaGluZ1Jlc3VsdC50cmltKCksXG4gICAgICBtYXRjaDogZnV6enlNYXRjaCxcbiAgICB9O1xuICB9XG5cbiAgb25Ob3RNYXRjaCA9IChfLCBfXywgcmVzdWx0cykgPT4ge1xuICAgIGlmIChyZXN1bHRzICYmIHRoaXMucHJvcHMuZnV6enlNYXRjaFRocmVzaG9sZCkge1xuICAgICAgY29uc3QgZnV6enlNYXRjaCA9IHRoaXMuZ2V0RnV6enlNYXRjaChyZXN1bHRzKTtcblxuICAgICAgaWYgKGZ1enp5TWF0Y2gpIHtcbiAgICAgICAgdGhpcy50b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkKCk7XG5cbiAgICAgICAgY29uc3QgeyBvbkZ1enp5TWF0Y2ggfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgaWYgKG9uRnV6enlNYXRjaCkge1xuICAgICAgICAgIG9uRnV6enlNYXRjaChmdXp6eU1hdGNoLm1hdGNoWzFdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhbm55YW5nLnRyaWdnZXIoZnV6enlNYXRjaC5tYXRjaFsxXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IG9uTm90TWF0Y2ggfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAob25Ob3RNYXRjaCkge1xuICAgICAgb25Ob3RNYXRjaCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQgPSAoKSA9PiB7XG4gICAgY29uc3QgaXNSZWNvZ25pemVyRW5hYmxlZCA9ICF0aGlzLnN0YXRlLmlzUmVjb2duaXplckVuYWJsZWQ7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzUmVjb2duaXplckVuYWJsZWQsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvblJlY29nbml6ZXJFbmFibGVkLCBvblJlY29nbml6ZXJEaXNhYmxlZCB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gaXNSZWNvZ25pemVyRW5hYmxlZCA/IG9uUmVjb2duaXplckVuYWJsZWQgOiBvblJlY29nbml6ZXJEaXNhYmxlZDtcblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICBcbiAgICBzY3JpcHQuc3JjID0gJy8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2FubnlhbmcvMi42LjEvYW5ueWFuZy5taW4uanMnO1xuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgXG4gICAgLyoqXG4gICAgICogVGhpcyBsb2FkcyB0aGUgbWFpbiBsaWJyYXJ5IGZvciB2b2ljZSBjb21tYW5kIHJlY29nbml0aW9uLlxuICAgICAqIFRoZSByZWFzb24gdGhhdCBpdCdzIGltcG9ydGVkIGxpa2UgdGhpcyBpdCdzIGJlY2F1c2UgaW4gc3BpdGUgb2YgYmVpbmcgYXZhaWxhYmxlIGFzIGEgbm9kZVxuICAgICAqIG1vZHVsZSwgSSBjb3VsZG4ndCBmaW5kIGEgd2F5IHRvIG1ha2UgaXQgd29yayBuaWNlbHkgaWYgaXQgd2Fzbid0IGluY2x1ZGVkIGluIHRoZSBcbiAgICAgKiBpbmRleCBhcyBhIHNjcmlwdCB0YWcuICNzb3JyeW5vdHNvcnJ5XG4gICAgICovXG4gICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIHRoaXMucHJlcGFyZVJlY29nbml0aW9uKCk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzdGF0dXM6IHN0YXR1cy5BVVRIT1JJWklORyxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIFNwZWVjaCBSZWNvZ25pdGlvbiBpcyBub3Qgc3VwcG9ydGVkIEFubnlhbmcgaXMgbm90IGluaXRpYWxpc2VkXG4gICAgICogYW5kIGp1c3Qgc2V0IHRvIG51bGwuIFRoaXMgcHJldmVudHMgZXhjZXB0aW9ucyBmcm9tIGhhcHBlbmluZyBpbiB0aG9zZSBicm93c2Vyc1xuICAgICAqIHdoZXJlIFNSIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgICovXG4gICAgc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVycm9yOiBFcnJvcnMuVU5TVVBQT1JURUQsXG4gICAgICBzdGF0dXM6IFN0YXR1cy5GQUlMRUQsXG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChzY3JpcHQpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIGNvbnN0IHsgc3RhcnRWb2ljZVJlY29nbml0aW9uIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgc3RhdHVzIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKCFzdGFydFZvaWNlUmVjb2duaXRpb24pIHtcbiAgICAgIC8qKlxuICAgICAgICogYC5hYm9ydGAgaXMgdXNlZCBoZXJlIHNvIGBvblN0YXJ0YCBpcyB0cmlnZ2VyZWQgYWdhaW4gXG4gICAgICAgKiBmb3IgdGhlIHN0YXR1cyB0byBiZSBwcm9wZXJseSBzZXQgd2hlbiBgLnN0YXJ0YCBpcyByZXJ1bi5cbiAgICAgICAqL1xuICAgICAgYW5ueWFuZy5hYm9ydCgpO1xuXG4gICAgICBpZiAoc3RhdHVzICE9PSBTdGF0dXMuUEFVU0VEKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHN0YXR1czogU3RhdHVzLlBBVVNFRCxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWFubnlhbmcuaXNMaXN0ZW5pbmcoKSAmJiBzdGF0dXMgIT09IFN0YXR1cy5MT0FESU5HX0RFUEVOREVOQ0lFUykge1xuICAgICAgYW5ueWFuZy5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiVm9pY2VDb21tYW5kUmVjb2duaXplclwiPlxuICAgICAgICB7Y2hpbGRyZW4odGhpcy5wcm9wcywgdGhpcy5zdGF0ZSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59Il19