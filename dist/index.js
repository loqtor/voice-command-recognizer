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
var VoiceCommandRecognizer = (_temp = /*#__PURE__*/function (_Component) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50c3giXSwibmFtZXMiOlsiU3RhdHVzIiwiRXJyb3JzIiwiVm9pY2VDb21tYW5kUmVjb2duaXplciIsInByb3BzIiwic3RhcnRWb2ljZVJlY29nbml0aW9uIiwic2V0U3RhdGUiLCJzdGF0dXMiLCJSRUNPR05JWklORyIsIlBBVVNFRCIsIm9uU3RhcnQiLCJyZXN1bHRzIiwiZnV6enlNYXRjaFRocmVzaG9sZCIsImxlbmd0aCIsImZ1enp5TWF0Y2giLCJmdXp6eU1hdGNoaW5nUmVzdWx0IiwiZmluZCIsInJlc3VsdCIsIm1hdGNoZXMiLCJmdXp6eVNldCIsImdldCIsImZ1enp5TWF0Y2hpbmdQZXJjZW50YWdlIiwiaXNJdEFGdXp6eU1hdGNoIiwidHJpbSIsIm1hdGNoIiwiXyIsIl9fIiwiZ2V0RnV6enlNYXRjaCIsInRvZ2dsZUlzUmVjb2duaXplckVuYWJsZWQiLCJvbkZ1enp5TWF0Y2giLCJhbm55YW5nIiwidHJpZ2dlciIsIm9uTm90TWF0Y2giLCJpc1JlY29nbml6ZXJFbmFibGVkIiwic3RhdGUiLCJvblJlY29nbml6ZXJFbmFibGVkIiwib25SZWNvZ25pemVyRGlzYWJsZWQiLCJjYWxsYmFjayIsIkFVVEhPUklaSU5HIiwiZXJyb3IiLCJVTlNVUFBPUlRFRCIsIkZBSUxFRCIsImNvbW1hbmRzIiwia2V5Q29tbWFuZCIsImZvcm1hdHRlZENvbW1hbmRzRm9yRnV6enkiLCJyZWR1Y2UiLCJzZXQiLCJjb21tYW5kIiwiY29uY2F0IiwicGhyYXNlcyIsImFubnlhbmdGb3JtYXR0ZWRDb21tYW5kcyIsImZvckVhY2giLCJwaHJhc2UiLCJhZGRDb21tYW5kcyIsIm9uUGVybWlzc2lvbkJsb2NrZWQiLCJvblBlcm1pc3Npb25EZW5pZWQiLCJhZGRDYWxsYmFjayIsInN0YXJ0IiwiYXV0b1Jlc3RhcnQiLCJhYm9ydCIsImlzTGlzdGVuaW5nIiwiY2hpbGRyZW4iLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFD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Q0Q7O0FBRUQsVUFBSSxDQUFDcUIsT0FBTyxDQUFDOEIsV0FBUixFQUFMLEVBQTRCO0FBQzFCOUIsUUFBQUEsT0FBTyxDQUFDMkIsS0FBUjtBQUNEO0FBQ0Y7QUEvTWdDO0FBQUE7QUFBQSw2QkFpTnhCO0FBQUEsVUFDQ0ksUUFERCxHQUNjLEtBQUt6RCxLQURuQixDQUNDeUQsUUFERDtBQUdQLGFBQ0U7QUFBSyxRQUFBLFNBQVMsRUFBQztBQUFmLFNBQ0dBLFFBREgsQ0FERjtBQUtEO0FBek5nQzs7QUFBQTtBQUFBLEVBQXdDQyxnQkFBeEMsU0FBNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEZ1enp5U2V0IGZyb20gJ2Z1enp5c2V0LmpzJztcbmltcG9ydCB7IEFubnlhbmcsIENvbW1hbmRPcHRpb24gfSBmcm9tICdhbm55YW5nJztcblxuZW51bSBTdGF0dXMge1xuICBBVVRIT1JJWklORyA9ICdhdXRob3JpemluZycsXG4gIFNUQVJUSU5HID0gJ3N0YXJ0aW5nJyxcbiAgUkVDT0dOSVpJTkcgPSAncmVjb2duaXppbmcnLFxuICBGSU5JU0hFRCA9ICdmaW5pc2hlZCcsXG4gIEZBSUxFRCA9ICdmYWlsZWQnLFxuICBQQVVTRUQgPSAncGF1c2VkJyxcbn07XG5cbmVudW0gRXJyb3JzIHtcbiAgQlJPV1NFUl9ERU5JQUwgPSAnYnJvd3Nlci1kZW5pYWwnLFxuICBVU0VSX0RFTklBTCA9ICd1c2VyLWRlbmlhbCcsXG4gIFVOU1VQUE9SVEVEID0gJ3Vuc3VwcG9ydGVkJyxcbiAgVU5FWFBFQ1RFRCA9ICd1bmV4cGVjdGVkJyxcbn1cblxuaW50ZXJmYWNlIENvbW1hbmQge1xuICBwaHJhc2VzOiBzdHJpbmdbXTtcbiAgY2FsbGJhY2s6IChyZXN1bHRzPzogc3RyaW5nW10pID0+IHZvaWQ7XG59XG5cbmludGVyZmFjZSBWb2ljZUNvbW1hbmRSZWNvZ25pemVyUHJvcHMge1xuICBjb21tYW5kczogQ29tbWFuZFtdO1xuICBmdXp6eU1hdGNoVGhyZXNob2xkPzogbnVtYmVyO1xuICBrZXlDb21tYW5kPzogc3RyaW5nO1xuICBzdGFydFZvaWNlUmVjb2duaXRpb24/OiBib29sZWFuO1xuICBvbkZ1enp5TWF0Y2g/OiAobWF0Y2g6IHN0cmluZykgPT4gdm9pZDtcbiAgb25Ob3RNYXRjaD86IChyZXN1bHRzPzogc3RyaW5nW10pID0+IHZvaWQ7XG4gIG9uU3RhcnQ/OiAoKSA9PiB2b2lkO1xuICBvblBlcm1pc3Npb25CbG9ja2VkPzogKCkgPT4gdm9pZDtcbiAgb25QZXJtaXNzaW9uRGVuaWVkPzogKCkgPT4gdm9pZDtcbiAgb25SZWNvZ25pemVyRGlzYWJsZWQ/OiAoKSA9PiB2b2lkO1xuICBvblJlY29nbml6ZXJFbmFibGVkPzogKCkgPT4gdm9pZDtcbn07XG5cbmludGVyZmFjZSBWb2ljZUNvbW1hbmRSZWNvZ25pemVyU3RhdGUge1xuICBlcnJvcj86IHN0cmluZyxcbiAgc3RhdHVzOiBTdGF0dXM7XG4gIGZ1enp5TWF0Y2hUaHJlc2hvbGQ/OiBudW1iZXI7XG4gIGlzUmVjb2duaXplckVuYWJsZWQ/OiBib29sZWFuO1xufVxuXG5kZWNsYXJlIHZhciBhbm55YW5nOiBBbm55YW5nO1xuXG5leHBvcnQgY29uc3QgVm9pY2VDb21tYW5kUmVjb2duaXplciA9IGNsYXNzIFZvaWNlQ29tbWFuZFJlY29nbml6ZXIgZXh0ZW5kcyBDb21wb25lbnQ8Vm9pY2VDb21tYW5kUmVjb2duaXplclByb3BzLCBWb2ljZUNvbW1hbmRSZWNvZ25pemVyU3RhdGU+IHtcbiAgZnV6enlTZXQ6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogVm9pY2VDb21tYW5kUmVjb2duaXplclByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzUmVjb2duaXplckVuYWJsZWQ6IHRydWUsXG4gICAgICBzdGF0dXM6IFN0YXR1cy5BVVRIT1JJWklORyxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV2hlbiBTcGVlY2ggUmVjb2duaXRpb24gaXMgbm90IHN1cHBvcnRlZCBBbm55YW5nIGlzIG5vdCBpbml0aWFsaXNlZFxuICAgICAqIGFuZCBqdXN0IHNldCB0byBudWxsLiBUaGlzIHByZXZlbnRzIGV4Y2VwdGlvbnMgZnJvbSBoYXBwZW5pbmcgaW4gdGhvc2UgYnJvd3NlcnNcbiAgICAgKiB3aGVyZSBTUiBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAqL1xuICAgIGlmICghYW5ueWFuZykge1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgZXJyb3I6IEVycm9ycy5VTlNVUFBPUlRFRCxcbiAgICAgICAgc3RhdHVzOiBTdGF0dXMuRkFJTEVELFxuICAgICAgfTtcbiAgXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBjb21tYW5kcywga2V5Q29tbWFuZCB9ID0gcHJvcHM7XG4gICAgY29uc3QgZm9ybWF0dGVkQ29tbWFuZHNGb3JGdXp6eSA9IGNvbW1hbmRzLnJlZHVjZSgoc2V0OiBzdHJpbmdbXSwgY29tbWFuZDogQ29tbWFuZCkgPT4ge1xuICAgICAgc2V0ID0gc2V0LmNvbmNhdChjb21tYW5kLnBocmFzZXMpO1xuICAgICAgcmV0dXJuIHNldDtcbiAgICB9LCBbXSBhcyBzdHJpbmdbXSk7XG5cbiAgICB0aGlzLmZ1enp5U2V0ID0gRnV6enlTZXQoZm9ybWF0dGVkQ29tbWFuZHNGb3JGdXp6eSk7XG5cbiAgICBjb25zdCBhbm55YW5nRm9ybWF0dGVkQ29tbWFuZHM6IENvbW1hbmRPcHRpb24gPSB7fTtcblxuICAgIGNvbW1hbmRzLmZvckVhY2goKGNvbW1hbmQ6IENvbW1hbmQpID0+IHtcbiAgICAgIGNvbnN0IHsgcGhyYXNlcyB9ID0gY29tbWFuZDtcblxuICAgICAgcGhyYXNlcy5mb3JFYWNoKChwaHJhc2U6IHN0cmluZykgPT4ge1xuICAgICAgICBhbm55YW5nRm9ybWF0dGVkQ29tbWFuZHNbcGhyYXNlXSA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCB7IHN0YXR1cywgaXNSZWNvZ25pemVyRW5hYmxlZCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICAgIGlmIChrZXlDb21tYW5kICYmIHBocmFzZSA9PT0ga2V5Q29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN0YXR1cyAhPT0gU3RhdHVzLlJFQ09HTklaSU5HIHx8ICFpc1JlY29nbml6ZXJFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29tbWFuZC5jYWxsYmFjaygpO1xuXG4gICAgICAgICAgaWYgKGtleUNvbW1hbmQpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKGtleUNvbW1hbmQpIHtcbiAgICAgIGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kc1trZXlDb21tYW5kXSA9IHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZDtcbiAgICB9XG5cbiAgICBhbm55YW5nLmFkZENvbW1hbmRzKGFubnlhbmdGb3JtYXR0ZWRDb21tYW5kcyk7XG5cbiAgICBpZiAoa2V5Q29tbWFuZCkge1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgLi4udGhpcy5zdGF0ZSxcbiAgICAgICAgaXNSZWNvZ25pemVyRW5hYmxlZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHsgb25QZXJtaXNzaW9uQmxvY2tlZCwgb25QZXJtaXNzaW9uRGVuaWVkIH0gPSBwcm9wcztcbiAgICBcbiAgICBhbm55YW5nLmFkZENhbGxiYWNrKCdzdGFydCcsIHRoaXMub25TdGFydCk7XG4gICAgYW5ueWFuZy5hZGRDYWxsYmFjaygnZXJyb3JQZXJtaXNzaW9uQmxvY2tlZCcsIG9uUGVybWlzc2lvbkJsb2NrZWQgPyBvblBlcm1pc3Npb25CbG9ja2VkIDogKCkgPT4ge30pO1xuICAgIGFubnlhbmcuYWRkQ2FsbGJhY2soJ2Vycm9yUGVybWlzc2lvbkRlbmllZCcsIG9uUGVybWlzc2lvbkRlbmllZCA/IG9uUGVybWlzc2lvbkRlbmllZCA6ICgpID0+IHt9KTtcbiAgICBhbm55YW5nLmFkZENhbGxiYWNrKCdyZXN1bHROb01hdGNoJywgdGhpcy5vbk5vdE1hdGNoKTtcblxuICAgIGFubnlhbmcuc3RhcnQoe1xuICAgICAgYXV0b1Jlc3RhcnQ6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICBvblN0YXJ0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgc3RhcnRWb2ljZVJlY29nbml0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGF0dXM6IHN0YXJ0Vm9pY2VSZWNvZ25pdGlvbiA/IFN0YXR1cy5SRUNPR05JWklORyA6IFN0YXR1cy5QQVVTRUQsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvblN0YXJ0IH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBpZiAoIW9uU3RhcnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvblN0YXJ0KCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRGdXp6eU1hdGNoID0gKHJlc3VsdHM6IHN0cmluZ1tdKSA9PiB7XG4gICAgY29uc3QgeyBmdXp6eU1hdGNoVGhyZXNob2xkIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKCFyZXN1bHRzIHx8ICFyZXN1bHRzLmxlbmd0aCB8fCAhZnV6enlNYXRjaFRocmVzaG9sZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmdXp6eU1hdGNoOiBbbnVtYmVyLCBzdHJpbmddID0gWzAsICcnXTtcbiAgICBjb25zdCBmdXp6eU1hdGNoaW5nUmVzdWx0ID0gcmVzdWx0cy5maW5kKChyZXN1bHQ6IHN0cmluZykgPT4ge1xuXG4gICAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5mdXp6eVNldC5nZXQocmVzdWx0KTtcblxuICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgW2Z1enp5TWF0Y2hpbmdQZXJjZW50YWdlXSA9IG1hdGNoZXNbMF07XG4gICAgICBjb25zdCBpc0l0QUZ1enp5TWF0Y2ggPSBmdXp6eU1hdGNoaW5nUGVyY2VudGFnZSA+PSBmdXp6eU1hdGNoVGhyZXNob2xkO1xuXG4gICAgICBpZiAoaXNJdEFGdXp6eU1hdGNoKSB7XG4gICAgICAgIGZ1enp5TWF0Y2ggPSBtYXRjaGVzWzBdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNJdEFGdXp6eU1hdGNoO1xuICAgIH0pO1xuXG4gICAgaWYgKCFmdXp6eU1hdGNoaW5nUmVzdWx0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU1IgYXQgdGltZXMgcmV0dXJucyB0aGUgcmVzdWx0cyB3aXRoIGEgc3RhcnRpbmcgc3BhY2UuXG4gICAgICogVGhpcyBlbnN1cmVzIGlzIGp1c3QgdGhlIHdvcmRzIHRoZSB1c2VyIHNhaWQgdGhhdCBhcmUgdGFrZW4gaW50byBhY2NvdW50LlxuICAgICAqL1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IGZ1enp5TWF0Y2hpbmdSZXN1bHQudHJpbSgpLFxuICAgICAgbWF0Y2g6IGZ1enp5TWF0Y2gsXG4gICAgfTtcbiAgfVxuXG4gIG9uTm90TWF0Y2ggPSAoXzogc3RyaW5nIHwgdW5kZWZpbmVkLCBfXzogc3RyaW5nIHwgdW5kZWZpbmVkLCByZXN1bHRzPzogc3RyaW5nW10gfCB1bmRlZmluZWQpID0+IHtcbiAgICBpZiAocmVzdWx0cyAmJiB0aGlzLnByb3BzLmZ1enp5TWF0Y2hUaHJlc2hvbGQpIHtcbiAgICAgIGNvbnN0IGZ1enp5TWF0Y2ggPSB0aGlzLmdldEZ1enp5TWF0Y2gocmVzdWx0cyk7XG5cbiAgICAgIGlmIChmdXp6eU1hdGNoKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlSXNSZWNvZ25pemVyRW5hYmxlZCgpO1xuXG4gICAgICAgIGNvbnN0IHsgb25GdXp6eU1hdGNoIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIGlmIChvbkZ1enp5TWF0Y2gpIHtcbiAgICAgICAgICBvbkZ1enp5TWF0Y2goZnV6enlNYXRjaC5tYXRjaFsxXSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5ueWFuZy50cmlnZ2VyKGZ1enp5TWF0Y2gubWF0Y2hbMV0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBvbk5vdE1hdGNoIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKG9uTm90TWF0Y2gpIHtcbiAgICAgIG9uTm90TWF0Y2goKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVJc1JlY29nbml6ZXJFbmFibGVkID0gKCkgPT4ge1xuICAgIGNvbnN0IGlzUmVjb2duaXplckVuYWJsZWQgPSAhdGhpcy5zdGF0ZS5pc1JlY29nbml6ZXJFbmFibGVkO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc1JlY29nbml6ZXJFbmFibGVkLFxuICAgIH0sICgpID0+IHtcbiAgICAgIGNvbnN0IHsgb25SZWNvZ25pemVyRW5hYmxlZCwgb25SZWNvZ25pemVyRGlzYWJsZWQgfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGlzUmVjb2duaXplckVuYWJsZWQgPyBvblJlY29nbml6ZXJFbmFibGVkIDogb25SZWNvZ25pemVyRGlzYWJsZWQ7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIGNvbnN0IHsgc3RhcnRWb2ljZVJlY29nbml0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKCFzdGFydFZvaWNlUmVjb2duaXRpb24pIHtcbiAgICAgIC8qKlxuICAgICAgICogYC5hYm9ydGAgaXMgdXNlZCBoZXJlIHNvIGBvblN0YXJ0YCBpcyB0cmlnZ2VyZWQgYWdhaW4gXG4gICAgICAgKiBmb3IgdGhlIHN0YXR1cyB0byBiZSBwcm9wZXJseSBzZXQgd2hlbiBgLnN0YXJ0YCBpcyByZXJ1bi5cbiAgICAgICAqL1xuICAgICAgYW5ueWFuZy5hYm9ydCgpO1xuXG4gICAgICBjb25zdCB7IHN0YXR1cyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgICAgaWYgKHN0YXR1cyAhPT0gU3RhdHVzLlBBVVNFRCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdGF0dXM6IFN0YXR1cy5QQVVTRUQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFhbm55YW5nLmlzTGlzdGVuaW5nKCkpIHtcbiAgICAgIGFubnlhbmcuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlZvaWNlQ29tbWFuZFJlY29nbml6ZXJcIj5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSJdfQ==