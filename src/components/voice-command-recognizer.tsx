import React, { Component } from 'react';
import FuzzySet from 'fuzzyset.js';

enum Status {
  AUTHORIZING = 'authorizing',
  STARTING = 'starting',
  RECOGNIZING = 'recognizing',
  FINISHED = 'finished',
  FAILED = 'failed',
  PAUSED = 'paused',
};

enum Errors {
  BROWSER_DENIAL = 'browser-denial',
  USER_DENIAL = 'user-denial',
  UNSUPPORTED = 'unsupported',
  UNEXPECTED = 'unexpected',
}

interface Command {
  phrases: string[];
  callback: (results?: string[]) => void;
}

interface VoiceCommandRecognizerProps {
  commands: Command[];
  fuzzyMatchThreshold?: number;
  keyCommand?: string;
  startVoiceRecognition?: boolean;
  onFuzzyMatch?: (match: string) => void;
  onNotMatch?: (results?: string[]) => void;
  onStart?: () => void;
  onPermissionBlocked?: () => void;
  onPermissionDenied?: () => void;
  onRecognizerDisabled?: () => void;
  onRecognizerEnabled?: () => void;
};

interface VoiceCommandRecognizerState {
  error?: string,
  status: Status;
  fuzzyMatchThreshold?: number;
  isRecognizerEnabled?: boolean;
}

interface AnnyangOptions {
  autorestart?: boolean;
  continuous?: boolean;
  paused?: boolean;
}

interface AnnyangCommands {
  [keyof: string]: (results?: string[]) => void;
}

interface Annyang {
  abort: () => void;
  addCallback: (event: string, callback: () => void) => void;
  addCommands: (commands: AnnyangCommands) => void;
  isListening: () => boolean;
  pause: () => void;
  removeCommands: (command: string) => void;
  removeCallback: (type: string, callback?: () => {}) => void;
  start: (options?: AnnyangOptions) => void;
  trigger: (command: string) => void;
}

declare var annyang: Annyang;

export const VoiceCommandRecognizer = class VoiceCommandRecognizer extends Component<VoiceCommandRecognizerProps, VoiceCommandRecognizerState> {
  fuzzySet: any;

  constructor(props: VoiceCommandRecognizerProps) {
    super(props);

    this.state = {
      isRecognizerEnabled: true,
      status: Status.AUTHORIZING,
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
    const formattedCommandsForFuzzy = commands.reduce((set: string[], command: Command) => {
      set = set.concat(command.phrases);
      return set;
    }, [] as string[]);

    this.fuzzySet = FuzzySet(formattedCommandsForFuzzy);

    const annyangFormattedCommands: AnnyangCommands = {};

    commands.forEach((command: Command) => {
      const { phrases } = command;

      phrases.forEach((phrase: string) => {
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

    const { onPermissionBlocked, onPermissionDenied, startVoiceRecognition } = props;

    annyang.addCallback('start', this.onStart);
    annyang.addCallback('errorPermissionBlocked', onPermissionBlocked ? onPermissionBlocked : () => {});
    annyang.addCallback('errorPermissionDenied', onPermissionDenied ? onPermissionDenied : () => {});
    annyang.addCallback('resultNoMatch', this.onNotMatch);

    if (!startVoiceRecognition) {
      annyang.start({ paused: true });
    } else {
      annyang.start();
    }
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

  getFuzzyMatch = (results: string[]) => {
    const { fuzzyMatchThreshold } = this.props;

    if (!results || !results.length || !fuzzyMatchThreshold) {
      return;
    }

    let fuzzyMatch: [number, string] = [0, ''];
    const fuzzyMatchingResult = results.find((result: string) => {

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

  onNotMatch = (results?: string[]) => {
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

  componentDidUpdate() {
    const { startVoiceRecognition } = this.props;

    if (!startVoiceRecognition) {
      /**
       * `.abort` is used here so `onStart` is triggered again 
       * for the status to be properly set when `.start` is rerun.
       */
      annyang.abort();

      const { status } = this.state;

      if (status !== Status.PAUSED) {
        this.setState({
          status: Status.PAUSED,
        });
      }

      return;
    }

    if (!annyang.isListening() || startVoiceRecognition) {
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