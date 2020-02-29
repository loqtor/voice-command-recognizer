"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VoiceCommandRecognizer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _fuzzyset = _interopRequireDefault(require("fuzzyset.js"));

var _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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

var Status;

(function (Status) {
  Status["AUTHORIZING"] = "authorizing";
  Status["STARTING"] = "starting";
  Status["RECOGNIZING"] = "recognizing";
  Status["FINISHED"] = "finished";
  Status["FAILED"] = "failed";
  Status["PAUSED"] = "paused";
})(Status || (Status = {}));

;
var Errors;

(function (Errors) {
  Errors["BROWSER_DENIAL"] = "browser-denial";
  Errors["USER_DENIAL"] = "user-denial";
  Errors["UNSUPPORTED"] = "unsupported";
  Errors["UNEXPECTED"] = "unexpected";
})(Errors || (Errors = {}));

;
var VoiceCommandRecognizer = (_temp =
/*#__PURE__*/
function (_Component) {
  _inherits(VoiceCommandRecognizer, _Component);

  function VoiceCommandRecognizer(props) {
    var _this;

    _classCallCheck(this, VoiceCommandRecognizer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VoiceCommandRecognizer).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "fuzzySet", void 0);

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
      status: Status.AUTHORIZING
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
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var startVoiceRecognition = this.props.startVoiceRecognition;

      if (!startVoiceRecognition) {
        /**
         * `.abort` is used here so `onStart` is triggered again 
         * for the status to be properly set when `.start` is rerun.
         */
        annyang.abort();
        var status = this.state.status;

        if (status !== Status.PAUSED) {
          this.setState({
            status: Status.PAUSED
          });
        }

        return;
      }

      if (!annyang.isListening()) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50c3giXSwibmFtZXMiOlsiU3RhdHVzIiwiRXJyb3JzIiwiVm9pY2VDb21tYW5kUmVjb2duaXplciIsInByb3BzIiwic3RhcnRWb2ljZVJlY29nbml0aW9uIiwic2V0U3RhdGUiLCJzdGF0dXMiLCJSRUNPR05JWklORyIsIlBBVVNFRCIsIm9uU3RhcnQiLCJyZXN1bHRzIiwiZnV6enlNYXRjaFRocmVzaG9sZCIsImxlbmd0aCIsImZ1enp5TWF0Y2giLCJmdXp6eU1hdGNoaW5nUmVzdWx0IiwiZmluZCIsInJlc3VsdCIsIm1hdGNoZXMiLCJmdXp6eVNldCIsImdldCIsImZ1enp5TWF0Y2hpbmdQZXJjZW50YWdlIiwiaXNJdEFGdXp6eU1hdGNoIiwidHJpbSIsIm1hdGNoIiwiXyIsIl9fIiwiZ2V0RnV6enlNYXRjaCIsInRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQiLCJvbkZ1enp5TWF0Y2giLCJhbm55YW5nIiwidHJpZ2dlciIsIm9uTm90TWF0Y2giLCJpc1JlY29nbml6ZXJFbmFibGVkIiwic3RhdGUiLCJvblJlY29nbml6ZXJFbmFibGVkIiwib25SZWNvZ25pemVyRGlzYWJsZWQiLCJjYWxsYmFjayIsIkFVVEhPUklaSU5HIiwiZXJyb3IiLCJVTlNVUFBPUlRFRCIsIkZBSUxFRCIsImNvbW1hbmRzIiwia2V5Q29tbWFuZCIsImZvcm1hdHRlZENvbW1hbmRzRm9yRnV6enkiLCJyZWR1Y2UiLCJzZXQiLCJjb21tYW5kIiwiY29uY2F0IiwicGhyYXNlcyIsImFubnlhbmdGb3JtYXR0ZWRDb21tYW5kcyIsImZvckVhY2giLCJwaHJhc2UiLCJhZGRDb21tYW5kcyIsIm9uUGVybWlzc2lvbkJsb2NrZWQiLCJvblBlcm1pc3Npb25EZW5pZWQiLCJhZGRDYWxsYmFjayIsInN0YXJ0IiwiYXV0b1Jlc3RhcnQiLCJhYm9ydCIsImlzTGlzdGVuaW5nIiwiY2hpbGRyZW4iLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFD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O0FBRUQ7QUFDRDs7QUFFRCxVQUFJLENBQUNxQixPQUFPLENBQUM4QixXQUFSLEVBQUwsRUFBNEI7QUFDMUI5QixRQUFBQSxPQUFPLENBQUMyQixLQUFSO0FBQ0Q7QUFDRjtBQS9NZ0M7QUFBQTtBQUFBLDZCQWlOeEI7QUFBQSxVQUNDSSxRQURELEdBQ2MsS0FBS3pELEtBRG5CLENBQ0N5RCxRQUREO0FBR1AsYUFDRTtBQUFLLFFBQUEsU0FBUyxFQUFDO0FBQWYsU0FDR0EsUUFESCxDQURGO0FBS0Q7QUF6TmdDOztBQUFBO0FBQUEsRUFBd0NDLGdCQUF4QyxTQUE1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRnV6enlTZXQgZnJvbSAnZnV6enlzZXQuanMnO1xuaW1wb3J0IHsgQW5ueWFuZywgQ29tbWFuZE9wdGlvbiB9IGZyb20gJ2FubnlhbmcnO1xuXG5lbnVtIFN0YXR1cyB7XG4gIEFVVEhPUklaSU5HID0gJ2F1dGhvcml6aW5nJyxcbiAgU1RBUlRJTkcgPSAnc3RhcnRpbmcnLFxuICBSRUNPR05JWklORyA9ICdyZWNvZ25pemluZycsXG4gIEZJTklTSEVEID0gJ2ZpbmlzaGVkJyxcbiAgRkFJTEVEID0gJ2ZhaWxlZCcsXG4gIFBBVVNFRCA9ICdwYXVzZWQnLFxufTtcblxuZW51bSBFcnJvcnMge1xuICBCUk9XU0VSX0RFTklBTCA9ICdicm93c2VyLWRlbmlhbCcsXG4gIFVTRVJfREVOSUFMID0gJ3VzZXItZGVuaWFsJyxcbiAgVU5TVVBQT1JURUQgPSAndW5zdXBwb3J0ZWQnLFxuICBVTkVYUEVDVEVEID0gJ3VuZXhwZWN0ZWQnLFxufVxuXG5pbnRlcmZhY2UgQ29tbWFuZCB7XG4gIHBocmFzZXM6IHN0cmluZ1tdO1xuICBjYWxsYmFjazogKHJlc3VsdHM/OiBzdHJpbmdbXSkgPT4gdm9pZDtcbn1cblxuaW50ZXJmYWNlIFZvaWNlQ29tbWFuZFJlY29nbml6ZXJQcm9wcyB7XG4gIGNvbW1hbmRzOiBDb21tYW5kW107XG4gIGZ1enp5TWF0Y2hUaHJlc2hvbGQ/OiBudW1iZXI7XG4gIGtleUNvbW1hbmQ/OiBzdHJpbmc7XG4gIHN0YXJ0Vm9pY2VSZWNvZ25pdGlvbj86IGJvb2xlYW47XG4gIG9uRnV6enlNYXRjaD86IChtYXRjaDogc3RyaW5nKSA9PiB2b2lkO1xuICBvbk5vdE1hdGNoPzogKHJlc3VsdHM/OiBzdHJpbmdbXSkgPT4gdm9pZDtcbiAgb25TdGFydD86ICgpID0+IHZvaWQ7XG4gIG9uUGVybWlzc2lvbkJsb2NrZWQ/OiAoKSA9PiB2b2lkO1xuICBvblBlcm1pc3Npb25EZW5pZWQ/OiAoKSA9PiB2b2lkO1xuICBvblJlY29nbml6ZXJEaXNhYmxlZD86ICgpID0+IHZvaWQ7XG4gIG9uUmVjb2duaXplckVuYWJsZWQ/OiAoKSA9PiB2b2lkO1xufTtcblxuaW50ZXJmYWNlIFZvaWNlQ29tbWFuZFJlY29nbml6ZXJTdGF0ZSB7XG4gIGVycm9yPzogc3RyaW5nLFxuICBzdGF0dXM6IFN0YXR1cztcbiAgZnV6enlNYXRjaFRocmVzaG9sZD86IG51bWJlcjtcbiAgaXNSZWNvZ25pemVyRW5hYmxlZD86IGJvb2xlYW47XG59XG5cbmRlY2xhcmUgdmFyIGFubnlhbmc6IEFubnlhbmc7XG5cbmV4cG9ydCBjb25zdCBWb2ljZUNvbW1hbmRSZWNvZ25pemVyID0gY2xhc3MgVm9pY2VDb21tYW5kUmVjb2duaXplciBleHRlbmRzIENvbXBvbmVudDxWb2ljZUNvbW1hbmRSZWNvZ25pemVyUHJvcHMsIFZvaWNlQ29tbWFuZFJlY29nbml6ZXJTdGF0ZT4ge1xuICBmdXp6eVNldDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBWb2ljZUNvbW1hbmRSZWNvZ25pemVyUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNSZWNvZ25pemVyRW5hYmxlZDogdHJ1ZSxcbiAgICAgIHN0YXR1czogU3RhdHVzLkFVVEhPUklaSU5HLFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIFNwZWVjaCBSZWNvZ25pdGlvbiBpcyBub3Qgc3VwcG9ydGVkIEFubnlhbmcgaXMgbm90IGluaXRpYWxpc2VkXG4gICAgICogYW5kIGp1c3Qgc2V0IHRvIG51bGwuIFRoaXMgcHJldmVudHMgZXhjZXB0aW9ucyBmcm9tIGhhcHBlbmluZyBpbiB0aG9zZSBicm93c2Vyc1xuICAgICAqIHdoZXJlIFNSIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgICovXG4gICAgaWYgKCFhbm55YW5nKSB7XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICBlcnJvcjogRXJyb3JzLlVOU1VQUE9SVEVELFxuICAgICAgICBzdGF0dXM6IFN0YXR1cy5GQUlMRUQsXG4gICAgICB9O1xuICBcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGNvbW1hbmRzLCBrZXlDb21tYW5kIH0gPSBwcm9wcztcbiAgICBjb25zdCBmb3JtYXR0ZWRDb21tYW5kc0ZvckZ1enp5ID0gY29tbWFuZHMucmVkdWNlKChzZXQ6IHN0cmluZ1tdLCBjb21tYW5kOiBDb21tYW5kKSA9PiB7XG4gICAgICBzZXQgPSBzZXQuY29uY2F0KGNvbW1hbmQucGhyYXNlcyk7XG4gICAgICByZXR1cm4gc2V0O1xuICAgIH0sIFtdIGFzIHN0cmluZ1tdKTtcblxuICAgIHRoaXMuZnV6enlTZXQgPSBGdXp6eVNldChmb3JtYXR0ZWRDb21tYW5kc0ZvckZ1enp5KTtcblxuICAgIGNvbnN0IGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kczogQ29tbWFuZE9wdGlvbiA9IHt9O1xuXG4gICAgY29tbWFuZHMuZm9yRWFjaCgoY29tbWFuZDogQ29tbWFuZCkgPT4ge1xuICAgICAgY29uc3QgeyBwaHJhc2VzIH0gPSBjb21tYW5kO1xuXG4gICAgICBwaHJhc2VzLmZvckVhY2goKHBocmFzZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kc1twaHJhc2VdID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBpc1JlY29nbml6ZXJFbmFibGVkIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgICAgICAgaWYgKGtleUNvbW1hbmQgJiYgcGhyYXNlID09PSBrZXlDb21tYW5kKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3RhdHVzICE9PSBTdGF0dXMuUkVDT0dOSVpJTkcgfHwgIWlzUmVjb2duaXplckVuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb21tYW5kLmNhbGxiYWNrKCk7XG5cbiAgICAgICAgICBpZiAoa2V5Q29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAoa2V5Q29tbWFuZCkge1xuICAgICAgYW5ueWFuZ0Zvcm1hdHRlZENvbW1hbmRzW2tleUNvbW1hbmRdID0gdGhpcy50b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkO1xuICAgIH1cblxuICAgIGFubnlhbmcuYWRkQ29tbWFuZHMoYW5ueWFuZ0Zvcm1hdHRlZENvbW1hbmRzKTtcblxuICAgIGlmIChrZXlDb21tYW5kKSB7XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAuLi50aGlzLnN0YXRlLFxuICAgICAgICBpc1JlY29nbml6ZXJFbmFibGVkOiBmYWxzZSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgeyBvblBlcm1pc3Npb25CbG9ja2VkLCBvblBlcm1pc3Npb25EZW5pZWQgfSA9IHByb3BzO1xuICAgIFxuICAgIGFubnlhbmcuYWRkQ2FsbGJhY2soJ3N0YXJ0JywgdGhpcy5vblN0YXJ0KTtcbiAgICBhbm55YW5nLmFkZENhbGxiYWNrKCdlcnJvclBlcm1pc3Npb25CbG9ja2VkJywgb25QZXJtaXNzaW9uQmxvY2tlZCA/IG9uUGVybWlzc2lvbkJsb2NrZWQgOiAoKSA9PiB7fSk7XG4gICAgYW5ueWFuZy5hZGRDYWxsYmFjaygnZXJyb3JQZXJtaXNzaW9uRGVuaWVkJywgb25QZXJtaXNzaW9uRGVuaWVkID8gb25QZXJtaXNzaW9uRGVuaWVkIDogKCkgPT4ge30pO1xuICAgIGFubnlhbmcuYWRkQ2FsbGJhY2soJ3Jlc3VsdE5vTWF0Y2gnLCB0aGlzLm9uTm90TWF0Y2gpO1xuXG4gICAgYW5ueWFuZy5zdGFydCh7XG4gICAgICBhdXRvUmVzdGFydDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBzdGFydFZvaWNlUmVjb2duaXRpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXR1czogc3RhcnRWb2ljZVJlY29nbml0aW9uID8gU3RhdHVzLlJFQ09HTklaSU5HIDogU3RhdHVzLlBBVVNFRCxcbiAgICB9LCAoKSA9PiB7XG4gICAgICBjb25zdCB7IG9uU3RhcnQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIGlmICghb25TdGFydCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9uU3RhcnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEZ1enp5TWF0Y2ggPSAocmVzdWx0czogc3RyaW5nW10pID0+IHtcbiAgICBjb25zdCB7IGZ1enp5TWF0Y2hUaHJlc2hvbGQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIXJlc3VsdHMgfHwgIXJlc3VsdHMubGVuZ3RoIHx8ICFmdXp6eU1hdGNoVGhyZXNob2xkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGZ1enp5TWF0Y2g6IFtudW1iZXIsIHN0cmluZ10gPSBbMCwgJyddO1xuICAgIGNvbnN0IGZ1enp5TWF0Y2hpbmdSZXN1bHQgPSByZXN1bHRzLmZpbmQoKHJlc3VsdDogc3RyaW5nKSA9PiB7XG5cbiAgICAgIGNvbnN0IG1hdGNoZXMgPSB0aGlzLmZ1enp5U2V0LmdldChyZXN1bHQpO1xuXG4gICAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBbZnV6enlNYXRjaGluZ1BlcmNlbnRhZ2VdID0gbWF0Y2hlc1swXTtcbiAgICAgIGNvbnN0IGlzSXRBRnV6enlNYXRjaCA9IGZ1enp5TWF0Y2hpbmdQZXJjZW50YWdlID49IGZ1enp5TWF0Y2hUaHJlc2hvbGQ7XG5cbiAgICAgIGlmIChpc0l0QUZ1enp5TWF0Y2gpIHtcbiAgICAgICAgZnV6enlNYXRjaCA9IG1hdGNoZXNbMF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc0l0QUZ1enp5TWF0Y2g7XG4gICAgfSk7XG5cbiAgICBpZiAoIWZ1enp5TWF0Y2hpbmdSZXN1bHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTUiBhdCB0aW1lcyByZXR1cm5zIHRoZSByZXN1bHRzIHdpdGggYSBzdGFydGluZyBzcGFjZS5cbiAgICAgKiBUaGlzIGVuc3VyZXMgaXMganVzdCB0aGUgd29yZHMgdGhlIHVzZXIgc2FpZCB0aGF0IGFyZSB0YWtlbiBpbnRvIGFjY291bnQuXG4gICAgICovXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdDogZnV6enlNYXRjaGluZ1Jlc3VsdC50cmltKCksXG4gICAgICBtYXRjaDogZnV6enlNYXRjaCxcbiAgICB9O1xuICB9XG5cbiAgb25Ob3RNYXRjaCA9IChfOiBzdHJpbmcgfCB1bmRlZmluZWQsIF9fOiBzdHJpbmcgfCB1bmRlZmluZWQsIHJlc3VsdHM/OiBzdHJpbmdbXSB8IHVuZGVmaW5lZCkgPT4ge1xuICAgIGlmIChyZXN1bHRzICYmIHRoaXMucHJvcHMuZnV6enlNYXRjaFRocmVzaG9sZCkge1xuICAgICAgY29uc3QgZnV6enlNYXRjaCA9IHRoaXMuZ2V0RnV6enlNYXRjaChyZXN1bHRzKTtcblxuICAgICAgaWYgKGZ1enp5TWF0Y2gpIHtcbiAgICAgICAgdGhpcy50b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkKCk7XG5cbiAgICAgICAgY29uc3QgeyBvbkZ1enp5TWF0Y2ggfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgaWYgKG9uRnV6enlNYXRjaCkge1xuICAgICAgICAgIG9uRnV6enlNYXRjaChmdXp6eU1hdGNoLm1hdGNoWzFdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhbm55YW5nLnRyaWdnZXIoZnV6enlNYXRjaC5tYXRjaFsxXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IG9uTm90TWF0Y2ggfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAob25Ob3RNYXRjaCkge1xuICAgICAgb25Ob3RNYXRjaCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQgPSAoKSA9PiB7XG4gICAgY29uc3QgaXNSZWNvZ25pemVyRW5hYmxlZCA9ICF0aGlzLnN0YXRlLmlzUmVjb2duaXplckVuYWJsZWQ7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzUmVjb2duaXplckVuYWJsZWQsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvblJlY29nbml6ZXJFbmFibGVkLCBvblJlY29nbml6ZXJEaXNhYmxlZCB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gaXNSZWNvZ25pemVyRW5hYmxlZCA/IG9uUmVjb2duaXplckVuYWJsZWQgOiBvblJlY29nbml6ZXJEaXNhYmxlZDtcblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgY29uc3QgeyBzdGFydFZvaWNlUmVjb2duaXRpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIXN0YXJ0Vm9pY2VSZWNvZ25pdGlvbikge1xuICAgICAgLyoqXG4gICAgICAgKiBgLmFib3J0YCBpcyB1c2VkIGhlcmUgc28gYG9uU3RhcnRgIGlzIHRyaWdnZXJlZCBhZ2FpbiBcbiAgICAgICAqIGZvciB0aGUgc3RhdHVzIHRvIGJlIHByb3Blcmx5IHNldCB3aGVuIGAuc3RhcnRgIGlzIHJlcnVuLlxuICAgICAgICovXG4gICAgICBhbm55YW5nLmFib3J0KCk7XG5cbiAgICAgIGNvbnN0IHsgc3RhdHVzIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgICBpZiAoc3RhdHVzICE9PSBTdGF0dXMuUEFVU0VEKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHN0YXR1czogU3RhdHVzLlBBVVNFRCxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWFubnlhbmcuaXNMaXN0ZW5pbmcoKSkge1xuICAgICAgYW5ueWFuZy5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiVm9pY2VDb21tYW5kUmVjb2duaXplclwiPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59Il19