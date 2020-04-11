import React, { Component } from 'react';
import FuzzySet from 'fuzzyset.js';

const Status = {
  LOADING_DEPENDENCIES: 'loading-dependencies',
  AUTHORIZING: 'authorizing',
  STARTING: 'starting',
  RECOGNIZING: 'recognizing',
  FINISHED: 'finished',
  FAILED: 'failed',
  PAUSED: 'paused',
};

const Errors = {
  BROWSER_DENIAL: 'browser-denial',
  USER_DENIAL: 'user-denial',
  UNSUPPORTED: 'unsupported',
  UNEXPECTED: 'unexpected',
}

export const VoiceCommandRecognizer = class VoiceCommandRecognizer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRecognizerEnabled: true,
      status: Status.LOADING_DEPENDENCIES,
    };

    /**
     * When Speech Recognition is not supported Annyang is not initialised
     * and just set to null. This prevents exceptions from happening in those browsers
     * where SR is not supported.
     */
    if (!annyang) {
      this.state = {
        error: Errors.UNSUPPORTED,
        status: Status.FAILED,
      };
  
      return;
    }

    const { commands, keyCommand } = props;
    const formattedCommandsForFuzzy = commands.reduce((set, command) => {
      set = set.concat(command.phrases);
      return set;
    }, []);

    this.fuzzySet = FuzzySet(formattedCommandsForFuzzy);

    const annyangFormattedCommands = {};

    commands.forEach((command) => {
      const { phrases } = command;

      phrases.forEach((phrase) => {
        annyangFormattedCommands[phrase] = () => {
          const { status, isRecognizerEnabled } = this.state;

          if (keyCommand && phrase === keyCommand) {
            this.toggleIsRecognizerEnabled();
            return;
          }

          if (status !== Status.RECOGNIZING || !isRecognizerEnabled) {
            return;
          }

          command.callback();

          if (keyCommand) {
            this.toggleIsRecognizerEnabled();
          }
        };
      });
    });

    if (keyCommand) {
      annyangFormattedCommands[keyCommand] = this.toggleIsRecognizerEnabled;
    }

    annyang.addCommands(annyangFormattedCommands);

    if (keyCommand) {
      this.state = {
        ...this.state,
        isRecognizerEnabled: false,
      };
    }

    const { onPermissionBlocked, onPermissionDenied } = props;
    
    annyang.addCallback('start', this.onStart);
    annyang.addCallback('errorPermissionBlocked', onPermissionBlocked ? onPermissionBlocked : () => {});
    annyang.addCallback('errorPermissionDenied', onPermissionDenied ? onPermissionDenied : () => {});
    annyang.addCallback('resultNoMatch', this.onNotMatch);

    annyang.start({
      autoRestart: true,
    });
  }

  onStart = () => {
    const { startVoiceRecognition } = this.props;

    this.setState({
      status: startVoiceRecognition ? Status.RECOGNIZING : Status.PAUSED,
    }, () => {
      const { onStart } = this.props;

      if (!onStart) {
        return;
      }

      onStart();
    });
  }

  getFuzzyMatch = (results) => {
    const { fuzzyMatchThreshold } = this.props;

    if (!results || !results.length || !fuzzyMatchThreshold) {
      return;
    }

    let fuzzyMatch = [0, ''];
    const fuzzyMatchingResult = results.find((result) => {

      const matches = this.fuzzySet.get(result);

      if (!matches) {
        return false;
      }

      const [fuzzyMatchingPercentage] = matches[0];
      const isItAFuzzyMatch = fuzzyMatchingPercentage >= fuzzyMatchThreshold;

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
      match: fuzzyMatch,
    };
  }

  onNotMatch = (_, __, results) => {
    if (results && this.props.fuzzyMatchThreshold) {
      const fuzzyMatch = this.getFuzzyMatch(results);

      if (fuzzyMatch) {
        this.toggleIsRecognizerEnabled();

        const { onFuzzyMatch } = this.props;

        if (onFuzzyMatch) {
          onFuzzyMatch(fuzzyMatch.match[1]);
          return;
        }

        annyang.trigger(fuzzyMatch.match[1]);
        return;
      }
    }

    const { onNotMatch } = this.props;

    if (onNotMatch) {
      onNotMatch();
      return;
    }
  }

  toggleIsRecognizerEnabled = () => {
    const isRecognizerEnabled = !this.state.isRecognizerEnabled;

    this.setState({
      isRecognizerEnabled,
    }, () => {
      const { onRecognizerEnabled, onRecognizerDisabled } = this.props;
      const callback = isRecognizerEnabled ? onRecognizerEnabled : onRecognizerDisabled;

      if (callback) {
        callback();
      }
    });
  }

  componentDidMount() {
    const script = document.createElement('script');
    
    script.src = '//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.1/annyang.min.js';
    script.type = 'text/javascript';
    
    script.onload = () => this.setState({
      status: status.AUTHORIZING,
    });

    document.body.append(script);
  }

  componentDidUpdate() {
    const { startVoiceRecognition } = this.props;
    const { status } = this.state;

    if (!startVoiceRecognition) {
      /**
       * `.abort` is used here so `onStart` is triggered again 
       * for the status to be properly set when `.start` is rerun.
       */
      annyang.abort();

      if (status !== Status.PAUSED) {
        this.setState({
          status: Status.PAUSED,
        });
      }

      return;
    }

    if (!annyang.isListening() && status !== Status.LOADING_DEPENDENCIES) {
      annyang.start();
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div className="VoiceCommandRecognizer">
        {children}
      </div>
    );
  }
}