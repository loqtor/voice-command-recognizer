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
    /**
     * When Speech Recognition is not supported Annyang is not initialised
     * and just set to null. This prevents exceptions from happening in those browsers
     * where SR is not supported.
     */

    if (!annyang) {
      _this.state = {
        error: Errors.UNSUPPORTED,
        status: Status.FAILED
      };
      return _possibleConstructorReturn(_this);
    }

    var commands = props.commands,
        keyCommand = props.keyCommand;
    var formattedCommandsForFuzzy = commands.reduce(function (set, command) {
      set = set.concat(command.phrases);
      return set;
    }, []);
    _this.fuzzySet = (0, _fuzzyset["default"])(formattedCommandsForFuzzy);
    var annyangFormattedCommands = {};
    commands.forEach(function (command) {
      var phrases = command.phrases;
      phrases.forEach(function (phrase) {
        annyangFormattedCommands[phrase] = function () {
          var _this$state = _this.state,
              status = _this$state.status,
              isRecognizerEnabled = _this$state.isRecognizerEnabled;

          if (keyCommand && phrase === keyCommand) {
            _this.toggleIsRecognizerEnabled();

            return;
          }

          if (status !== Status.RECOGNIZING || !isRecognizerEnabled) {
            return;
          }

          command.callback();

          if (keyCommand) {
            _this.toggleIsRecognizerEnabled();
          }
        };
      });
    });

    if (keyCommand) {
      annyangFormattedCommands[keyCommand] = _this.toggleIsRecognizerEnabled;
    }

    annyang.addCommands(annyangFormattedCommands);

    if (keyCommand) {
      _this.state = _objectSpread({}, _this.state, {
        isRecognizerEnabled: false
      });
    }

    var onPermissionBlocked = props.onPermissionBlocked,
        onPermissionDenied = props.onPermissionDenied;
    annyang.addCallback('start', _this.onStart);
    annyang.addCallback('errorPermissionBlocked', onPermissionBlocked ? onPermissionBlocked : function () {});
    annyang.addCallback('errorPermissionDenied', onPermissionDenied ? onPermissionDenied : function () {});
    annyang.addCallback('resultNoMatch', _this.onNotMatch);
    annyang.start({
      autoRestart: true
    });
    return _this;
  }

  _createClass(VoiceCommandRecognizer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var script = document.createElement('script');
      script.src = '//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.1/annyang.min.js';
      script.type = 'text/javascript';

      script.onload = function () {
        return _this2.setState({
          status: status.AUTHORIZING
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qc3giXSwibmFtZXMiOlsiU3RhdHVzIiwiTE9BRElOR19ERVBFTkRFTkNJRVMiLCJBVVRIT1JJWklORyIsIlNUQVJUSU5HIiwiUkVDT0dOSVpJTkciLCJGSU5JU0hFRCIsIkZBSUxFRCIsIlBBVVNFRCIsIkVycm9ycyIsIkJST1dTRVJfREVOSUFMIiwiVVNFUl9ERU5JQUwiLCJVTlNVUFBPUlRFRCIsIlVORVhQRUNURUQiLCJWb2ljZUNvbW1hbmRSZWNvZ25pemVyIiwicHJvcHMiLCJzdGFydFZvaWNlUmVjb2duaXRpb24iLCJzZXRTdGF0ZSIsInN0YXR1cyIsIm9uU3RhcnQiLCJyZXN1bHRzIiwiZnV6enlNYXRjaFRocmVzaG9sZCIsImxlbmd0aCIsImZ1enp5TWF0Y2giLCJmdXp6eU1hdGNoaW5nUmVzdWx0IiwiZmluZCIsInJlc3VsdCIsIm1hdGNoZXMiLCJmdXp6eVNldCIsImdldCIsImZ1enp5TWF0Y2hpbmdQZXJjZW50YWdlIiwiaXNJdEFGdXp6eU1hdGNoIiwidHJpbSIsIm1hdGNoIiwiXyIsIl9fIiwiZ2V0RnV6enlNYXRjaCIsInRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQiLCJvbkZ1enp5TWF0Y2giLCJhbm55YW5nIiwidHJpZ2dlciIsIm9uTm90TWF0Y2giLCJpc1JlY29nbml6ZXJFbmFibGVkIiwic3RhdGUiLCJvblJlY29nbml6ZXJFbmFibGVkIiwib25SZWNvZ25pemVyRGlzYWJsZWQiLCJjYWxsYmFjayIsImVycm9yIiwiY29tbWFuZHMiLCJrZXlDb21tYW5kIiwiZm9ybWF0dGVkQ29tbWFuZHNGb3JGdXp6eSIsInJlZHVjZSIsInNldCIsImNvbW1hbmQiLCJjb25jYXQiLCJwaHJhc2VzIiwiYW5ueWFuZ0Zvcm1hdHRlZENvbW1hbmRzIiwiZm9yRWFjaCIsInBocmFzZSIsImFkZENvbW1hbmRzIiwib25QZXJtaXNzaW9uQmxvY2tlZCIsIm9uUGVybWlzc2lvbkRlbmllZCIsImFkZENhbGxiYWNrIiwic3RhcnQiLCJhdXRvUmVzdGFydCIsInNjcmlwdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNyYyIsInR5cGUiLCJvbmxvYWQiLCJib2R5IiwiYXBwZW5kIiwiYWJvcnQiLCJpc0xpc3RlbmluZyIsImNoaWxkcmVuIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLE1BQU0sR0FBRztBQUNiQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFEVDtBQUViQyxFQUFBQSxXQUFXLEVBQUUsYUFGQTtBQUdiQyxFQUFBQSxRQUFRLEVBQUUsVUFIRztBQUliQyxFQUFBQSxXQUFXLEVBQUUsYUFKQTtBQUtiQyxFQUFBQSxRQUFRLEVBQUUsVUFMRztBQU1iQyxFQUFBQSxNQUFNLEVBQUUsUUFOSztBQU9iQyxFQUFBQSxNQUFNLEVBQUU7QUFQSyxDQUFmO0FBVUEsSUFBTUMsTUFBTSxHQUFHO0FBQ2JDLEVBQUFBLGNBQWMsRUFBRSxnQkFESDtBQUViQyxFQUFBQSxXQUFXLEVBQUUsYUFGQTtBQUdiQyxFQUFBQSxXQUFXLEVBQUUsYUFIQTtBQUliQyxFQUFBQSxVQUFVLEVBQUU7QUFKQyxDQUFmO0FBT08sSUFBTUMsc0JBQXNCO0FBQUE7O0FBQ2pDLGtDQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBQ2pCLGdHQUFNQSxLQUFOOztBQURpQiw4REFrRlQsWUFBTTtBQUFBLFVBQ05DLHFCQURNLEdBQ29CLE1BQUtELEtBRHpCLENBQ05DLHFCQURNOztBQUdkLFlBQUtDLFFBQUwsQ0FBYztBQUNaQyxRQUFBQSxNQUFNLEVBQUVGLHFCQUFxQixHQUFHZixNQUFNLENBQUNJLFdBQVYsR0FBd0JKLE1BQU0sQ0FBQ087QUFEaEQsT0FBZCxFQUVHLFlBQU07QUFBQSxZQUNDVyxPQURELEdBQ2EsTUFBS0osS0FEbEIsQ0FDQ0ksT0FERDs7QUFHUCxZQUFJLENBQUNBLE9BQUwsRUFBYztBQUNaO0FBQ0Q7O0FBRURBLFFBQUFBLE9BQU87QUFDUixPQVZEO0FBV0QsS0FoR2tCOztBQUFBLG9FQWtHSCxVQUFDQyxPQUFELEVBQWE7QUFBQSxVQUNuQkMsbUJBRG1CLEdBQ0ssTUFBS04sS0FEVixDQUNuQk0sbUJBRG1COztBQUczQixVQUFJLENBQUNELE9BQUQsSUFBWSxDQUFDQSxPQUFPLENBQUNFLE1BQXJCLElBQStCLENBQUNELG1CQUFwQyxFQUF5RDtBQUN2RDtBQUNEOztBQUVELFVBQUlFLFVBQVUsR0FBRyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpCO0FBQ0EsVUFBTUMsbUJBQW1CLEdBQUdKLE9BQU8sQ0FBQ0ssSUFBUixDQUFhLFVBQUNDLE1BQUQsRUFBWTtBQUVuRCxZQUFNQyxPQUFPLEdBQUcsTUFBS0MsUUFBTCxDQUFjQyxHQUFkLENBQWtCSCxNQUFsQixDQUFoQjs7QUFFQSxZQUFJLENBQUNDLE9BQUwsRUFBYztBQUNaLGlCQUFPLEtBQVA7QUFDRDs7QUFOa0QsdUNBUWpCQSxPQUFPLENBQUMsQ0FBRCxDQVJVO0FBQUEsWUFRNUNHLHVCQVI0Qzs7QUFTbkQsWUFBTUMsZUFBZSxHQUFHRCx1QkFBdUIsSUFBSVQsbUJBQW5EOztBQUVBLFlBQUlVLGVBQUosRUFBcUI7QUFDbkJSLFVBQUFBLFVBQVUsR0FBR0ksT0FBTyxDQUFDLENBQUQsQ0FBcEI7QUFDRDs7QUFFRCxlQUFPSSxlQUFQO0FBQ0QsT0FoQjJCLENBQTVCOztBQWtCQSxVQUFJLENBQUNQLG1CQUFMLEVBQTBCO0FBQ3hCO0FBQ0Q7QUFFRDs7Ozs7O0FBSUEsYUFBTztBQUNMRSxRQUFBQSxNQUFNLEVBQUVGLG1CQUFtQixDQUFDUSxJQUFwQixFQURIO0FBRUxDLFFBQUFBLEtBQUssRUFBRVY7QUFGRixPQUFQO0FBSUQsS0F4SWtCOztBQUFBLGlFQTBJTixVQUFDVyxDQUFELEVBQUlDLEVBQUosRUFBUWYsT0FBUixFQUFvQjtBQUMvQixVQUFJQSxPQUFPLElBQUksTUFBS0wsS0FBTCxDQUFXTSxtQkFBMUIsRUFBK0M7QUFDN0MsWUFBTUUsVUFBVSxHQUFHLE1BQUthLGFBQUwsQ0FBbUJoQixPQUFuQixDQUFuQjs7QUFFQSxZQUFJRyxVQUFKLEVBQWdCO0FBQ2QsZ0JBQUtjLHlCQUFMOztBQURjLGNBR05DLFlBSE0sR0FHVyxNQUFLdkIsS0FIaEIsQ0FHTnVCLFlBSE07O0FBS2QsY0FBSUEsWUFBSixFQUFrQjtBQUNoQkEsWUFBQUEsWUFBWSxDQUFDZixVQUFVLENBQUNVLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBRCxDQUFaO0FBQ0E7QUFDRDs7QUFFRE0sVUFBQUEsT0FBTyxDQUFDQyxPQUFSLENBQWdCakIsVUFBVSxDQUFDVSxLQUFYLENBQWlCLENBQWpCLENBQWhCO0FBQ0E7QUFDRDtBQUNGOztBQWpCOEIsVUFtQnZCUSxVQW5CdUIsR0FtQlIsTUFBSzFCLEtBbkJHLENBbUJ2QjBCLFVBbkJ1Qjs7QUFxQi9CLFVBQUlBLFVBQUosRUFBZ0I7QUFDZEEsUUFBQUEsVUFBVTtBQUNWO0FBQ0Q7QUFDRixLQW5La0I7O0FBQUEsZ0ZBcUtTLFlBQU07QUFDaEMsVUFBTUMsbUJBQW1CLEdBQUcsQ0FBQyxNQUFLQyxLQUFMLENBQVdELG1CQUF4Qzs7QUFFQSxZQUFLekIsUUFBTCxDQUFjO0FBQ1p5QixRQUFBQSxtQkFBbUIsRUFBbkJBO0FBRFksT0FBZCxFQUVHLFlBQU07QUFBQSwwQkFDK0MsTUFBSzNCLEtBRHBEO0FBQUEsWUFDQzZCLG1CQURELGVBQ0NBLG1CQUREO0FBQUEsWUFDc0JDLG9CQUR0QixlQUNzQkEsb0JBRHRCO0FBRVAsWUFBTUMsUUFBUSxHQUFHSixtQkFBbUIsR0FBR0UsbUJBQUgsR0FBeUJDLG9CQUE3RDs7QUFFQSxZQUFJQyxRQUFKLEVBQWM7QUFDWkEsVUFBQUEsUUFBUTtBQUNUO0FBQ0YsT0FURDtBQVVELEtBbExrQjs7QUFHakIsVUFBS0gsS0FBTCxHQUFhO0FBQ1hELE1BQUFBLG1CQUFtQixFQUFFLElBRFY7QUFFWHhCLE1BQUFBLE1BQU0sRUFBRWpCLE1BQU0sQ0FBQ0M7QUFGSixLQUFiO0FBS0E7Ozs7OztBQUtBLFFBQUksQ0FBQ3FDLE9BQUwsRUFBYztBQUNaLFlBQUtJLEtBQUwsR0FBYTtBQUNYSSxRQUFBQSxLQUFLLEVBQUV0QyxNQUFNLENBQUNHLFdBREg7QUFFWE0sUUFBQUEsTUFBTSxFQUFFakIsTUFBTSxDQUFDTTtBQUZKLE9BQWI7QUFLQTtBQUNEOztBQXBCZ0IsUUFzQlR5QyxRQXRCUyxHQXNCZ0JqQyxLQXRCaEIsQ0FzQlRpQyxRQXRCUztBQUFBLFFBc0JDQyxVQXRCRCxHQXNCZ0JsQyxLQXRCaEIsQ0FzQkNrQyxVQXRCRDtBQXVCakIsUUFBTUMseUJBQXlCLEdBQUdGLFFBQVEsQ0FBQ0csTUFBVCxDQUFnQixVQUFDQyxHQUFELEVBQU1DLE9BQU4sRUFBa0I7QUFDbEVELE1BQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDRSxNQUFKLENBQVdELE9BQU8sQ0FBQ0UsT0FBbkIsQ0FBTjtBQUNBLGFBQU9ILEdBQVA7QUFDRCxLQUhpQyxFQUcvQixFQUgrQixDQUFsQztBQUtBLFVBQUt4QixRQUFMLEdBQWdCLDBCQUFTc0IseUJBQVQsQ0FBaEI7QUFFQSxRQUFNTSx3QkFBd0IsR0FBRyxFQUFqQztBQUVBUixJQUFBQSxRQUFRLENBQUNTLE9BQVQsQ0FBaUIsVUFBQ0osT0FBRCxFQUFhO0FBQUEsVUFDcEJFLE9BRG9CLEdBQ1JGLE9BRFEsQ0FDcEJFLE9BRG9CO0FBRzVCQSxNQUFBQSxPQUFPLENBQUNFLE9BQVIsQ0FBZ0IsVUFBQ0MsTUFBRCxFQUFZO0FBQzFCRixRQUFBQSx3QkFBd0IsQ0FBQ0UsTUFBRCxDQUF4QixHQUFtQyxZQUFNO0FBQUEsNEJBQ0MsTUFBS2YsS0FETjtBQUFBLGNBQy9CekIsTUFEK0IsZUFDL0JBLE1BRCtCO0FBQUEsY0FDdkJ3QixtQkFEdUIsZUFDdkJBLG1CQUR1Qjs7QUFHdkMsY0FBSU8sVUFBVSxJQUFJUyxNQUFNLEtBQUtULFVBQTdCLEVBQXlDO0FBQ3ZDLGtCQUFLWix5QkFBTDs7QUFDQTtBQUNEOztBQUVELGNBQUluQixNQUFNLEtBQUtqQixNQUFNLENBQUNJLFdBQWxCLElBQWlDLENBQUNxQyxtQkFBdEMsRUFBMkQ7QUFDekQ7QUFDRDs7QUFFRFcsVUFBQUEsT0FBTyxDQUFDUCxRQUFSOztBQUVBLGNBQUlHLFVBQUosRUFBZ0I7QUFDZCxrQkFBS1oseUJBQUw7QUFDRDtBQUNGLFNBakJEO0FBa0JELE9BbkJEO0FBb0JELEtBdkJEOztBQXlCQSxRQUFJWSxVQUFKLEVBQWdCO0FBQ2RPLE1BQUFBLHdCQUF3QixDQUFDUCxVQUFELENBQXhCLEdBQXVDLE1BQUtaLHlCQUE1QztBQUNEOztBQUVERSxJQUFBQSxPQUFPLENBQUNvQixXQUFSLENBQW9CSCx3QkFBcEI7O0FBRUEsUUFBSVAsVUFBSixFQUFnQjtBQUNkLFlBQUtOLEtBQUwscUJBQ0ssTUFBS0EsS0FEVjtBQUVFRCxRQUFBQSxtQkFBbUIsRUFBRTtBQUZ2QjtBQUlEOztBQXBFZ0IsUUFzRVRrQixtQkF0RVMsR0FzRW1DN0MsS0F0RW5DLENBc0VUNkMsbUJBdEVTO0FBQUEsUUFzRVlDLGtCQXRFWixHQXNFbUM5QyxLQXRFbkMsQ0FzRVk4QyxrQkF0RVo7QUF3RWpCdEIsSUFBQUEsT0FBTyxDQUFDdUIsV0FBUixDQUFvQixPQUFwQixFQUE2QixNQUFLM0MsT0FBbEM7QUFDQW9CLElBQUFBLE9BQU8sQ0FBQ3VCLFdBQVIsQ0FBb0Isd0JBQXBCLEVBQThDRixtQkFBbUIsR0FBR0EsbUJBQUgsR0FBeUIsWUFBTSxDQUFFLENBQWxHO0FBQ0FyQixJQUFBQSxPQUFPLENBQUN1QixXQUFSLENBQW9CLHVCQUFwQixFQUE2Q0Qsa0JBQWtCLEdBQUdBLGtCQUFILEdBQXdCLFlBQU0sQ0FBRSxDQUEvRjtBQUNBdEIsSUFBQUEsT0FBTyxDQUFDdUIsV0FBUixDQUFvQixlQUFwQixFQUFxQyxNQUFLckIsVUFBMUM7QUFFQUYsSUFBQUEsT0FBTyxDQUFDd0IsS0FBUixDQUFjO0FBQ1pDLE1BQUFBLFdBQVcsRUFBRTtBQURELEtBQWQ7QUE3RWlCO0FBZ0ZsQjs7QUFqRmdDO0FBQUE7QUFBQSx3Q0FxTGI7QUFBQTs7QUFDbEIsVUFBTUMsTUFBTSxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjtBQUVBRixNQUFBQSxNQUFNLENBQUNHLEdBQVAsR0FBYSwrREFBYjtBQUNBSCxNQUFBQSxNQUFNLENBQUNJLElBQVAsR0FBYyxpQkFBZDs7QUFFQUosTUFBQUEsTUFBTSxDQUFDSyxNQUFQLEdBQWdCO0FBQUEsZUFBTSxNQUFJLENBQUNyRCxRQUFMLENBQWM7QUFDbENDLFVBQUFBLE1BQU0sRUFBRUEsTUFBTSxDQUFDZjtBQURtQixTQUFkLENBQU47QUFBQSxPQUFoQjs7QUFJQStELE1BQUFBLFFBQVEsQ0FBQ0ssSUFBVCxDQUFjQyxNQUFkLENBQXFCUCxNQUFyQjtBQUNEO0FBaE1nQztBQUFBO0FBQUEseUNBa01aO0FBQUEsVUFDWGpELHFCQURXLEdBQ2UsS0FBS0QsS0FEcEIsQ0FDWEMscUJBRFc7QUFBQSxVQUVYRSxNQUZXLEdBRUEsS0FBS3lCLEtBRkwsQ0FFWHpCLE1BRlc7O0FBSW5CLFVBQUksQ0FBQ0YscUJBQUwsRUFBNEI7QUFDMUI7Ozs7QUFJQXVCLFFBQUFBLE9BQU8sQ0FBQ2tDLEtBQVI7O0FBRUEsWUFBSXZELE1BQU0sS0FBS2pCLE1BQU0sQ0FBQ08sTUFBdEIsRUFBOEI7QUFDNUIsZUFBS1MsUUFBTCxDQUFjO0FBQ1pDLFlBQUFBLE1BQU0sRUFBRWpCLE1BQU0sQ0FBQ087QUFESCxXQUFkO0FBR0Q7O0FBRUQ7QUFDRDs7QUFFRCxVQUFJLENBQUMrQixPQUFPLENBQUNtQyxXQUFSLEVBQUQsSUFBMEJ4RCxNQUFNLEtBQUtqQixNQUFNLENBQUNDLG9CQUFoRCxFQUFzRTtBQUNwRXFDLFFBQUFBLE9BQU8sQ0FBQ3dCLEtBQVI7QUFDRDtBQUNGO0FBek5nQztBQUFBO0FBQUEsNkJBMk54QjtBQUFBLFVBQ0NZLFFBREQsR0FDYyxLQUFLNUQsS0FEbkIsQ0FDQzRELFFBREQ7QUFHUCxhQUNFO0FBQUssUUFBQSxTQUFTLEVBQUM7QUFBZixTQUNHQSxRQURILENBREY7QUFLRDtBQW5PZ0M7O0FBQUE7QUFBQSxFQUF3Q0MsZ0JBQXhDLFNBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGdXp6eVNldCBmcm9tICdmdXp6eXNldC5qcyc7XG5cbmNvbnN0IFN0YXR1cyA9IHtcbiAgTE9BRElOR19ERVBFTkRFTkNJRVM6ICdsb2FkaW5nLWRlcGVuZGVuY2llcycsXG4gIEFVVEhPUklaSU5HOiAnYXV0aG9yaXppbmcnLFxuICBTVEFSVElORzogJ3N0YXJ0aW5nJyxcbiAgUkVDT0dOSVpJTkc6ICdyZWNvZ25pemluZycsXG4gIEZJTklTSEVEOiAnZmluaXNoZWQnLFxuICBGQUlMRUQ6ICdmYWlsZWQnLFxuICBQQVVTRUQ6ICdwYXVzZWQnLFxufTtcblxuY29uc3QgRXJyb3JzID0ge1xuICBCUk9XU0VSX0RFTklBTDogJ2Jyb3dzZXItZGVuaWFsJyxcbiAgVVNFUl9ERU5JQUw6ICd1c2VyLWRlbmlhbCcsXG4gIFVOU1VQUE9SVEVEOiAndW5zdXBwb3J0ZWQnLFxuICBVTkVYUEVDVEVEOiAndW5leHBlY3RlZCcsXG59XG5cbmV4cG9ydCBjb25zdCBWb2ljZUNvbW1hbmRSZWNvZ25pemVyID0gY2xhc3MgVm9pY2VDb21tYW5kUmVjb2duaXplciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzUmVjb2duaXplckVuYWJsZWQ6IHRydWUsXG4gICAgICBzdGF0dXM6IFN0YXR1cy5MT0FESU5HX0RFUEVOREVOQ0lFUyxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV2hlbiBTcGVlY2ggUmVjb2duaXRpb24gaXMgbm90IHN1cHBvcnRlZCBBbm55YW5nIGlzIG5vdCBpbml0aWFsaXNlZFxuICAgICAqIGFuZCBqdXN0IHNldCB0byBudWxsLiBUaGlzIHByZXZlbnRzIGV4Y2VwdGlvbnMgZnJvbSBoYXBwZW5pbmcgaW4gdGhvc2UgYnJvd3NlcnNcbiAgICAgKiB3aGVyZSBTUiBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAqL1xuICAgIGlmICghYW5ueWFuZykge1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgZXJyb3I6IEVycm9ycy5VTlNVUFBPUlRFRCxcbiAgICAgICAgc3RhdHVzOiBTdGF0dXMuRkFJTEVELFxuICAgICAgfTtcbiAgXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBjb21tYW5kcywga2V5Q29tbWFuZCB9ID0gcHJvcHM7XG4gICAgY29uc3QgZm9ybWF0dGVkQ29tbWFuZHNGb3JGdXp6eSA9IGNvbW1hbmRzLnJlZHVjZSgoc2V0LCBjb21tYW5kKSA9PiB7XG4gICAgICBzZXQgPSBzZXQuY29uY2F0KGNvbW1hbmQucGhyYXNlcyk7XG4gICAgICByZXR1cm4gc2V0O1xuICAgIH0sIFtdKTtcblxuICAgIHRoaXMuZnV6enlTZXQgPSBGdXp6eVNldChmb3JtYXR0ZWRDb21tYW5kc0ZvckZ1enp5KTtcblxuICAgIGNvbnN0IGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kcyA9IHt9O1xuXG4gICAgY29tbWFuZHMuZm9yRWFjaCgoY29tbWFuZCkgPT4ge1xuICAgICAgY29uc3QgeyBwaHJhc2VzIH0gPSBjb21tYW5kO1xuXG4gICAgICBwaHJhc2VzLmZvckVhY2goKHBocmFzZSkgPT4ge1xuICAgICAgICBhbm55YW5nRm9ybWF0dGVkQ29tbWFuZHNbcGhyYXNlXSA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCB7IHN0YXR1cywgaXNSZWNvZ25pemVyRW5hYmxlZCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICAgIGlmIChrZXlDb21tYW5kICYmIHBocmFzZSA9PT0ga2V5Q29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN0YXR1cyAhPT0gU3RhdHVzLlJFQ09HTklaSU5HIHx8ICFpc1JlY29nbml6ZXJFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29tbWFuZC5jYWxsYmFjaygpO1xuXG4gICAgICAgICAgaWYgKGtleUNvbW1hbmQpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKGtleUNvbW1hbmQpIHtcbiAgICAgIGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kc1trZXlDb21tYW5kXSA9IHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZDtcbiAgICB9XG5cbiAgICBhbm55YW5nLmFkZENvbW1hbmRzKGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kcyk7XG5cbiAgICBpZiAoa2V5Q29tbWFuZCkge1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgLi4udGhpcy5zdGF0ZSxcbiAgICAgICAgaXNSZWNvZ25pemVyRW5hYmxlZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHsgb25QZXJtaXNzaW9uQmxvY2tlZCwgb25QZXJtaXNzaW9uRGVuaWVkIH0gPSBwcm9wcztcbiAgICBcbiAgICBhbm55YW5nLmFkZENhbGxiYWNrKCdzdGFydCcsIHRoaXMub25TdGFydCk7XG4gICAgYW5ueWFuZy5hZGRDYWxsYmFjaygnZXJyb3JQZXJtaXNzaW9uQmxvY2tlZCcsIG9uUGVybWlzc2lvbkJsb2NrZWQgPyBvblBlcm1pc3Npb25CbG9ja2VkIDogKCkgPT4ge30pO1xuICAgIGFubnlhbmcuYWRkQ2FsbGJhY2soJ2Vycm9yUGVybWlzc2lvbkRlbmllZCcsIG9uUGVybWlzc2lvbkRlbmllZCA/IG9uUGVybWlzc2lvbkRlbmllZCA6ICgpID0+IHt9KTtcbiAgICBhbm55YW5nLmFkZENhbGxiYWNrKCdyZXN1bHROb01hdGNoJywgdGhpcy5vbk5vdE1hdGNoKTtcblxuICAgIGFubnlhbmcuc3RhcnQoe1xuICAgICAgYXV0b1Jlc3RhcnQ6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICBvblN0YXJ0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhcnRWb2ljZVJlY29nbml0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGF0dXM6IHN0YXJ0Vm9pY2VSZWNvZ25pdGlvbiA/IFN0YXR1cy5SRUNPR05JWklORyA6IFN0YXR1cy5QQVVTRUQsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvblN0YXJ0IH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBpZiAoIW9uU3RhcnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvblN0YXJ0KCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRGdXp6eU1hdGNoID0gKHJlc3VsdHMpID0+IHtcbiAgICBjb25zdCB7IGZ1enp5TWF0Y2hUaHJlc2hvbGQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIXJlc3VsdHMgfHwgIXJlc3VsdHMubGVuZ3RoIHx8ICFmdXp6eU1hdGNoVGhyZXNob2xkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGZ1enp5TWF0Y2ggPSBbMCwgJyddO1xuICAgIGNvbnN0IGZ1enp5TWF0Y2hpbmdSZXN1bHQgPSByZXN1bHRzLmZpbmQoKHJlc3VsdCkgPT4ge1xuXG4gICAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5mdXp6eVNldC5nZXQocmVzdWx0KTtcblxuICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgW2Z1enp5TWF0Y2hpbmdQZXJjZW50YWdlXSA9IG1hdGNoZXNbMF07XG4gICAgICBjb25zdCBpc0l0QUZ1enp5TWF0Y2ggPSBmdXp6eU1hdGNoaW5nUGVyY2VudGFnZSA+PSBmdXp6eU1hdGNoVGhyZXNob2xkO1xuXG4gICAgICBpZiAoaXNJdEFGdXp6eU1hdGNoKSB7XG4gICAgICAgIGZ1enp5TWF0Y2ggPSBtYXRjaGVzWzBdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNJdEFGdXp6eU1hdGNoO1xuICAgIH0pO1xuXG4gICAgaWYgKCFmdXp6eU1hdGNoaW5nUmVzdWx0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU1IgYXQgdGltZXMgcmV0dXJucyB0aGUgcmVzdWx0cyB3aXRoIGEgc3RhcnRpbmcgc3BhY2UuXG4gICAgICogVGhpcyBlbnN1cmVzIGlzIGp1c3QgdGhlIHdvcmRzIHRoZSB1c2VyIHNhaWQgdGhhdCBhcmUgdGFrZW4gaW50byBhY2NvdW50LlxuICAgICAqL1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IGZ1enp5TWF0Y2hpbmdSZXN1bHQudHJpbSgpLFxuICAgICAgbWF0Y2g6IGZ1enp5TWF0Y2gsXG4gICAgfTtcbiAgfVxuXG4gIG9uTm90TWF0Y2ggPSAoXywgX18sIHJlc3VsdHMpID0+IHtcbiAgICBpZiAocmVzdWx0cyAmJiB0aGlzLnByb3BzLmZ1enp5TWF0Y2hUaHJlc2hvbGQpIHtcbiAgICAgIGNvbnN0IGZ1enp5TWF0Y2ggPSB0aGlzLmdldEZ1enp5TWF0Y2gocmVzdWx0cyk7XG5cbiAgICAgIGlmIChmdXp6eU1hdGNoKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZCgpO1xuXG4gICAgICAgIGNvbnN0IHsgb25GdXp6eU1hdGNoIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIGlmIChvbkZ1enp5TWF0Y2gpIHtcbiAgICAgICAgICBvbkZ1enp5TWF0Y2goZnV6enlNYXRjaC5tYXRjaFsxXSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5ueWFuZy50cmlnZ2VyKGZ1enp5TWF0Y2gubWF0Y2hbMV0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBvbk5vdE1hdGNoIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKG9uTm90TWF0Y2gpIHtcbiAgICAgIG9uTm90TWF0Y2goKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkID0gKCkgPT4ge1xuICAgIGNvbnN0IGlzUmVjb2duaXplckVuYWJsZWQgPSAhdGhpcy5zdGF0ZS5pc1JlY29nbml6ZXJFbmFibGVkO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc1JlY29nbml6ZXJFbmFibGVkLFxuICAgIH0sICgpID0+IHtcbiAgICAgIGNvbnN0IHsgb25SZWNvZ25pemVyRW5hYmxlZCwgb25SZWNvZ25pemVyRGlzYWJsZWQgfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGlzUmVjb2duaXplckVuYWJsZWQgPyBvblJlY29nbml6ZXJFbmFibGVkIDogb25SZWNvZ25pemVyRGlzYWJsZWQ7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgXG4gICAgc2NyaXB0LnNyYyA9ICcvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9hbm55YW5nLzIuNi4xL2FubnlhbmcubWluLmpzJztcbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgIFxuICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXR1czogc3RhdHVzLkFVVEhPUklaSU5HLFxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQoc2NyaXB0KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBjb25zdCB7IHN0YXJ0Vm9pY2VSZWNvZ25pdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHN0YXR1cyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmICghc3RhcnRWb2ljZVJlY29nbml0aW9uKSB7XG4gICAgICAvKipcbiAgICAgICAqIGAuYWJvcnRgIGlzIHVzZWQgaGVyZSBzbyBgb25TdGFydGAgaXMgdHJpZ2dlcmVkIGFnYWluIFxuICAgICAgICogZm9yIHRoZSBzdGF0dXMgdG8gYmUgcHJvcGVybHkgc2V0IHdoZW4gYC5zdGFydGAgaXMgcmVydW4uXG4gICAgICAgKi9cbiAgICAgIGFubnlhbmcuYWJvcnQoKTtcblxuICAgICAgaWYgKHN0YXR1cyAhPT0gU3RhdHVzLlBBVVNFRCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdGF0dXM6IFN0YXR1cy5QQVVTRUQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFhbm55YW5nLmlzTGlzdGVuaW5nKCkgJiYgc3RhdHVzICE9PSBTdGF0dXMuTE9BRElOR19ERVBFTkRFTkNJRVMpIHtcbiAgICAgIGFubnlhbmcuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlZvaWNlQ29tbWFuZFJlY29nbml6ZXJcIj5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSJdfQ==