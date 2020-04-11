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
      }, children);
    }
  }]);

  return VoiceCommandRecognizer;
}(_react.Component), _temp);
exports.VoiceCommandRecognizer = VoiceCommandRecognizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qc3giXSwibmFtZXMiOlsiU3RhdHVzIiwiTE9BRElOR19ERVBFTkRFTkNJRVMiLCJBVVRIT1JJWklORyIsIlNUQVJUSU5HIiwiUkVDT0dOSVpJTkciLCJGSU5JU0hFRCIsIkZBSUxFRCIsIlBBVVNFRCIsIkVycm9ycyIsIkJST1dTRVJfREVOSUFMIiwiVVNFUl9ERU5JQUwiLCJVTlNVUFBPUlRFRCIsIlVORVhQRUNURUQiLCJWb2ljZUNvbW1hbmRSZWNvZ25pemVyIiwicHJvcHMiLCJzdGFydFZvaWNlUmVjb2duaXRpb24iLCJzZXRTdGF0ZSIsInN0YXR1cyIsIm9uU3RhcnQiLCJyZXN1bHRzIiwiZnV6enlNYXRjaFRocmVzaG9sZCIsImxlbmd0aCIsImZ1enp5TWF0Y2giLCJmdXp6eU1hdGNoaW5nUmVzdWx0IiwiZmluZCIsInJlc3VsdCIsIm1hdGNoZXMiLCJmdXp6eVNldCIsImdldCIsImZ1enp5TWF0Y2hpbmdQZXJjZW50YWdlIiwiaXNJdEFGdXp6eU1hdGNoIiwidHJpbSIsIm1hdGNoIiwiXyIsIl9fIiwiZ2V0RnV6enlNYXRjaCIsInRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQiLCJvbkZ1enp5TWF0Y2giLCJhbm55YW5nIiwidHJpZ2dlciIsIm9uTm90TWF0Y2giLCJpc1JlY29nbml6ZXJFbmFibGVkIiwic3RhdGUiLCJvblJlY29nbml6ZXJFbmFibGVkIiwib25SZWNvZ25pemVyRGlzYWJsZWQiLCJjYWxsYmFjayIsImNvbW1hbmRzIiwia2V5Q29tbWFuZCIsImZvcm1hdHRlZENvbW1hbmRzRm9yRnV6enkiLCJyZWR1Y2UiLCJzZXQiLCJjb21tYW5kIiwiY29uY2F0IiwicGhyYXNlcyIsImFubnlhbmdGb3JtYXR0ZWRDb21tYW5kcyIsImZvckVhY2giLCJwaHJhc2UiLCJhZGRDb21tYW5kcyIsIm9uUGVybWlzc2lvbkJsb2NrZWQiLCJvblBlcm1pc3Npb25EZW5pZWQiLCJhZGRDYWxsYmFjayIsInN0YXJ0IiwiYXV0b1Jlc3RhcnQiLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJ0eXBlIiwib25sb2FkIiwicHJlcGFyZVJlY29nbml0aW9uIiwib25lcnJvciIsImVycm9yIiwiYm9keSIsImFwcGVuZCIsImFib3J0IiwiaXNMaXN0ZW5pbmciLCJjaGlsZHJlbiIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBRFQ7QUFFYkMsRUFBQUEsV0FBVyxFQUFFLGFBRkE7QUFHYkMsRUFBQUEsUUFBUSxFQUFFLFVBSEc7QUFJYkMsRUFBQUEsV0FBVyxFQUFFLGFBSkE7QUFLYkMsRUFBQUEsUUFBUSxFQUFFLFVBTEc7QUFNYkMsRUFBQUEsTUFBTSxFQUFFLFFBTks7QUFPYkMsRUFBQUEsTUFBTSxFQUFFO0FBUEssQ0FBZjtBQVVBLElBQU1DLE1BQU0sR0FBRztBQUNiQyxFQUFBQSxjQUFjLEVBQUUsZ0JBREg7QUFFYkMsRUFBQUEsV0FBVyxFQUFFLGFBRkE7QUFHYkMsRUFBQUEsV0FBVyxFQUFFLGFBSEE7QUFJYkMsRUFBQUEsVUFBVSxFQUFFO0FBSkMsQ0FBZjtBQU9PLElBQU1DLHNCQUFzQjtBQUFBOztBQUNqQyxrQ0FBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBOztBQUNqQixnR0FBTUEsS0FBTjs7QUFEaUIsOERBc0VULFlBQU07QUFBQSxVQUNOQyxxQkFETSxHQUNvQixNQUFLRCxLQUR6QixDQUNOQyxxQkFETTs7QUFHZCxZQUFLQyxRQUFMLENBQWM7QUFDWkMsUUFBQUEsTUFBTSxFQUFFRixxQkFBcUIsR0FBR2YsTUFBTSxDQUFDSSxXQUFWLEdBQXdCSixNQUFNLENBQUNPO0FBRGhELE9BQWQsRUFFRyxZQUFNO0FBQUEsWUFDQ1csT0FERCxHQUNhLE1BQUtKLEtBRGxCLENBQ0NJLE9BREQ7O0FBR1AsWUFB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QSxVQUNDZSxRQURELEdBQ2MsS0FBSzlELEtBRG5CLENBQ0M4RCxRQUREO0FBR1AsYUFDRTtBQUFLLFFBQUEsU0FBUyxFQUFDO0FBQWYsU0FDR0EsUUFESCxDQURGO0FBS0Q7QUEzT2dDOztBQUFBO0FBQUEsRUFBd0NDLGdCQUF4QyxTQUE1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRnV6enlTZXQgZnJvbSAnZnV6enlzZXQuanMnO1xuXG5jb25zdCBTdGF0dXMgPSB7XG4gIExPQURJTkdfREVQRU5ERU5DSUVTOiAnbG9hZGluZy1kZXBlbmRlbmNpZXMnLFxuICBBVVRIT1JJWklORzogJ2F1dGhvcml6aW5nJyxcbiAgU1RBUlRJTkc6ICdzdGFydGluZycsXG4gIFJFQ09HTklaSU5HOiAncmVjb2duaXppbmcnLFxuICBGSU5JU0hFRDogJ2ZpbmlzaGVkJyxcbiAgRkFJTEVEOiAnZmFpbGVkJyxcbiAgUEFVU0VEOiAncGF1c2VkJyxcbn07XG5cbmNvbnN0IEVycm9ycyA9IHtcbiAgQlJPV1NFUl9ERU5JQUw6ICdicm93c2VyLWRlbmlhbCcsXG4gIFVTRVJfREVOSUFMOiAndXNlci1kZW5pYWwnLFxuICBVTlNVUFBPUlRFRDogJ3Vuc3VwcG9ydGVkJyxcbiAgVU5FWFBFQ1RFRDogJ3VuZXhwZWN0ZWQnLFxufVxuXG5leHBvcnQgY29uc3QgVm9pY2VDb21tYW5kUmVjb2duaXplciA9IGNsYXNzIFZvaWNlQ29tbWFuZFJlY29nbml6ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc1JlY29nbml6ZXJFbmFibGVkOiB0cnVlLFxuICAgICAgc3RhdHVzOiBTdGF0dXMuTE9BRElOR19ERVBFTkRFTkNJRVMsXG4gICAgfTtcbiAgfVxuXG4gIHByZXBhcmVSZWNvZ25pdGlvbigpIHtcbiAgICBjb25zdCB7IGNvbW1hbmRzLCBrZXlDb21tYW5kIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGZvcm1hdHRlZENvbW1hbmRzRm9yRnV6enkgPSBjb21tYW5kcy5yZWR1Y2UoKHNldCwgY29tbWFuZCkgPT4ge1xuICAgICAgc2V0ID0gc2V0LmNvbmNhdChjb21tYW5kLnBocmFzZXMpO1xuICAgICAgcmV0dXJuIHNldDtcbiAgICB9LCBbXSk7XG5cbiAgICB0aGlzLmZ1enp5U2V0ID0gRnV6enlTZXQoZm9ybWF0dGVkQ29tbWFuZHNGb3JGdXp6eSk7XG5cbiAgICBjb25zdCBhbm55YW5nRm9ybWF0dGVkQ29tbWFuZHMgPSB7fTtcblxuICAgIGNvbW1hbmRzLmZvckVhY2goKGNvbW1hbmQpID0+IHtcbiAgICAgIGNvbnN0IHsgcGhyYXNlcyB9ID0gY29tbWFuZDtcblxuICAgICAgcGhyYXNlcy5mb3JFYWNoKChwaHJhc2UpID0+IHtcbiAgICAgICAgYW5ueWFuZ0Zvcm1hdHRlZENvbW1hbmRzW3BocmFzZV0gPSAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGlzUmVjb2duaXplckVuYWJsZWQgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgICAgICBpZiAoa2V5Q29tbWFuZCAmJiBwaHJhc2UgPT09IGtleUNvbW1hbmQpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdGF0dXMgIT09IFN0YXR1cy5SRUNPR05JWklORyB8fCAhaXNSZWNvZ25pemVyRW5hYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbW1hbmQuY2FsbGJhY2soKTtcblxuICAgICAgICAgIGlmIChrZXlDb21tYW5kKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmIChrZXlDb21tYW5kKSB7XG4gICAgICBhbm55YW5nRm9ybWF0dGVkQ29tbWFuZHNba2V5Q29tbWFuZF0gPSB0aGlzLnRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQ7XG4gICAgfVxuXG4gICAgYW5ueWFuZy5hZGRDb21tYW5kcyhhbm55YW5nRm9ybWF0dGVkQ29tbWFuZHMpO1xuXG4gICAgaWYgKGtleUNvbW1hbmQpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIC4uLnRoaXMuc3RhdGUsXG4gICAgICAgIGlzUmVjb2duaXplckVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCB7IG9uUGVybWlzc2lvbkJsb2NrZWQsIG9uUGVybWlzc2lvbkRlbmllZCB9ID0gdGhpcy5wcm9wcztcbiAgICBcbiAgICBhbm55YW5nLmFkZENhbGxiYWNrKCdzdGFydCcsIHRoaXMub25TdGFydCk7XG4gICAgYW5ueWFuZy5hZGRDYWxsYmFjaygnZXJyb3JQZXJtaXNzaW9uQmxvY2tlZCcsIG9uUGVybWlzc2lvbkJsb2NrZWQgPyBvblBlcm1pc3Npb25CbG9ja2VkIDogKCkgPT4ge30pO1xuICAgIGFubnlhbmcuYWRkQ2FsbGJhY2soJ2Vycm9yUGVybWlzc2lvbkRlbmllZCcsIG9uUGVybWlzc2lvbkRlbmllZCA/IG9uUGVybWlzc2lvbkRlbmllZCA6ICgpID0+IHt9KTtcbiAgICBhbm55YW5nLmFkZENhbGxiYWNrKCdyZXN1bHROb01hdGNoJywgdGhpcy5vbk5vdE1hdGNoKTtcblxuICAgIGFubnlhbmcuc3RhcnQoe1xuICAgICAgYXV0b1Jlc3RhcnQ6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICBvblN0YXJ0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhcnRWb2ljZVJlY29nbml0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGF0dXM6IHN0YXJ0Vm9pY2VSZWNvZ25pdGlvbiA/IFN0YXR1cy5SRUNPR05JWklORyA6IFN0YXR1cy5QQVVTRUQsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvblN0YXJ0IH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBpZiAoIW9uU3RhcnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvblN0YXJ0KCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRGdXp6eU1hdGNoID0gKHJlc3VsdHMpID0+IHtcbiAgICBjb25zdCB7IGZ1enp5TWF0Y2hUaHJlc2hvbGQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIXJlc3VsdHMgfHwgIXJlc3VsdHMubGVuZ3RoIHx8ICFmdXp6eU1hdGNoVGhyZXNob2xkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGZ1enp5TWF0Y2ggPSBbMCwgJyddO1xuICAgIGNvbnN0IGZ1enp5TWF0Y2hpbmdSZXN1bHQgPSByZXN1bHRzLmZpbmQoKHJlc3VsdCkgPT4ge1xuXG4gICAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5mdXp6eVNldC5nZXQocmVzdWx0KTtcblxuICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgW2Z1enp5TWF0Y2hpbmdQZXJjZW50YWdlXSA9IG1hdGNoZXNbMF07XG4gICAgICBjb25zdCBpc0l0QUZ1enp5TWF0Y2ggPSBmdXp6eU1hdGNoaW5nUGVyY2VudGFnZSA+PSBmdXp6eU1hdGNoVGhyZXNob2xkO1xuXG4gICAgICBpZiAoaXNJdEFGdXp6eU1hdGNoKSB7XG4gICAgICAgIGZ1enp5TWF0Y2ggPSBtYXRjaGVzWzBdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNJdEFGdXp6eU1hdGNoO1xuICAgIH0pO1xuXG4gICAgaWYgKCFmdXp6eU1hdGNoaW5nUmVzdWx0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU1IgYXQgdGltZXMgcmV0dXJucyB0aGUgcmVzdWx0cyB3aXRoIGEgc3RhcnRpbmcgc3BhY2UuXG4gICAgICogVGhpcyBlbnN1cmVzIGlzIGp1c3QgdGhlIHdvcmRzIHRoZSB1c2VyIHNhaWQgdGhhdCBhcmUgdGFrZW4gaW50byBhY2NvdW50LlxuICAgICAqL1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IGZ1enp5TWF0Y2hpbmdSZXN1bHQudHJpbSgpLFxuICAgICAgbWF0Y2g6IGZ1enp5TWF0Y2gsXG4gICAgfTtcbiAgfVxuXG4gIG9uTm90TWF0Y2ggPSAoXywgX18sIHJlc3VsdHMpID0+IHtcbiAgICBpZiAocmVzdWx0cyAmJiB0aGlzLnByb3BzLmZ1enp5TWF0Y2hUaHJlc2hvbGQpIHtcbiAgICAgIGNvbnN0IGZ1enp5TWF0Y2ggPSB0aGlzLmdldEZ1enp5TWF0Y2gocmVzdWx0cyk7XG5cbiAgICAgIGlmIChmdXp6eU1hdGNoKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZCgpO1xuXG4gICAgICAgIGNvbnN0IHsgb25GdXp6eU1hdGNoIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIGlmIChvbkZ1enp5TWF0Y2gpIHtcbiAgICAgICAgICBvbkZ1enp5TWF0Y2goZnV6enlNYXRjaC5tYXRjaFsxXSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5ueWFuZy50cmlnZ2VyKGZ1enp5TWF0Y2gubWF0Y2hbMV0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBvbk5vdE1hdGNoIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKG9uTm90TWF0Y2gpIHtcbiAgICAgIG9uTm90TWF0Y2goKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkID0gKCkgPT4ge1xuICAgIGNvbnN0IGlzUmVjb2duaXplckVuYWJsZWQgPSAhdGhpcy5zdGF0ZS5pc1JlY29nbml6ZXJFbmFibGVkO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc1JlY29nbml6ZXJFbmFibGVkLFxuICAgIH0sICgpID0+IHtcbiAgICAgIGNvbnN0IHsgb25SZWNvZ25pemVyRW5hYmxlZCwgb25SZWNvZ25pemVyRGlzYWJsZWQgfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGlzUmVjb2duaXplckVuYWJsZWQgPyBvblJlY29nbml6ZXJFbmFibGVkIDogb25SZWNvZ25pemVyRGlzYWJsZWQ7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgXG4gICAgc2NyaXB0LnNyYyA9ICcvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9hbm55YW5nLzIuNi4xL2FubnlhbmcubWluLmpzJztcbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgIFxuICAgIC8qKlxuICAgICAqIFRoaXMgbG9hZHMgdGhlIG1haW4gbGlicmFyeSBmb3Igdm9pY2UgY29tbWFuZCByZWNvZ25pdGlvbi5cbiAgICAgKiBUaGUgcmVhc29uIHRoYXQgaXQncyBpbXBvcnRlZCBsaWtlIHRoaXMgaXQncyBiZWNhdXNlIGluIHNwaXRlIG9mIGJlaW5nIGF2YWlsYWJsZSBhcyBhIG5vZGVcbiAgICAgKiBtb2R1bGUsIEkgY291bGRuJ3QgZmluZCBhIHdheSB0byBtYWtlIGl0IHdvcmsgbmljZWx5IGlmIGl0IHdhc24ndCBpbmNsdWRlZCBpbiB0aGUgXG4gICAgICogaW5kZXggYXMgYSBzY3JpcHQgdGFnLiAjc29ycnlub3Rzb3JyeVxuICAgICAqL1xuICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnByZXBhcmVSZWNvZ25pdGlvbigpO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc3RhdHVzOiBzdGF0dXMuQVVUSE9SSVpJTkcsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV2hlbiBTcGVlY2ggUmVjb2duaXRpb24gaXMgbm90IHN1cHBvcnRlZCBBbm55YW5nIGlzIG5vdCBpbml0aWFsaXNlZFxuICAgICAqIGFuZCBqdXN0IHNldCB0byBudWxsLiBUaGlzIHByZXZlbnRzIGV4Y2VwdGlvbnMgZnJvbSBoYXBwZW5pbmcgaW4gdGhvc2UgYnJvd3NlcnNcbiAgICAgKiB3aGVyZSBTUiBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAqL1xuICAgIHNjcmlwdC5vbmVycm9yID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlcnJvcjogRXJyb3JzLlVOU1VQUE9SVEVELFxuICAgICAgc3RhdHVzOiBTdGF0dXMuRkFJTEVELFxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQoc2NyaXB0KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBjb25zdCB7IHN0YXJ0Vm9pY2VSZWNvZ25pdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHN0YXR1cyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmICghc3RhcnRWb2ljZVJlY29nbml0aW9uKSB7XG4gICAgICAvKipcbiAgICAgICAqIGAuYWJvcnRgIGlzIHVzZWQgaGVyZSBzbyBgb25TdGFydGAgaXMgdHJpZ2dlcmVkIGFnYWluIFxuICAgICAgICogZm9yIHRoZSBzdGF0dXMgdG8gYmUgcHJvcGVybHkgc2V0IHdoZW4gYC5zdGFydGAgaXMgcmVydW4uXG4gICAgICAgKi9cbiAgICAgIGFubnlhbmcuYWJvcnQoKTtcblxuICAgICAgaWYgKHN0YXR1cyAhPT0gU3RhdHVzLlBBVVNFRCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdGF0dXM6IFN0YXR1cy5QQVVTRUQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFhbm55YW5nLmlzTGlzdGVuaW5nKCkgJiYgc3RhdHVzICE9PSBTdGF0dXMuTE9BRElOR19ERVBFTkRFTkNJRVMpIHtcbiAgICAgIGFubnlhbmcuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlZvaWNlQ29tbWFuZFJlY29nbml6ZXJcIj5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSJdfQ==