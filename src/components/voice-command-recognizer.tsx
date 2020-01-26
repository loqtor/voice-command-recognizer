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
  startVoiceRecognition?: boolean;
  onFuzzyMatch?: (results?: string[]) => void;
  onNotMatch?: (results?: string[]) => void;
  onStart?: () => void;
  onPermissionBlocked?: () => void;
  onPermissionDenied?: () => void;
  commands?: Command[];
  fuzzyMatchThreshold?: number;
};

interface VoiceCommandRecognizerState {
  error?: string,
  status: Status;
  fuzzyMatchThreshold?: number;
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

const formatForAnnyang = (commands: Command[]) => {
  const annyangFormattedCommands: AnnyangCommands = {};

  commands.forEach((command: Command) => {
    const { phrases } = command;

    phrases.forEach((phrase: string) => {
      annyangFormattedCommands[phrase] = command.callback;
    });
  });

  return annyangFormattedCommands;
}

export const VoiceCommandRecognizer = class VoiceCommandRecognizer extends Component<VoiceCommandRecognizerProps, VoiceCommandRecognizerState> {
  fuzzySet: any;

  constructor(props: VoiceCommandRecognizerProps) {
    super(props);

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

    const { commands } = props;

    if (commands) {
      const formattedCommandsForFuzzy = commands.reduce((set: string[], command: Command) => {
        set.concat(command.phrases);
        return set;
      }, [] as string[]);

      this.fuzzySet = FuzzySet(formattedCommandsForFuzzy);

      const formattedCommands = formatForAnnyang(commands);
      annyang.addCommands(formattedCommands);
    }

    const { onPermissionBlocked, onPermissionDenied, startVoiceRecognition } = props;

    annyang.addCallback('start', this.onStart);
    annyang.addCallback('errorPermissionBlocked', onPermissionBlocked ? onPermissionBlocked : () => {});
    annyang.addCallback('errorPermissionDenied', onPermissionDenied ? onPermissionDenied : () => {});
    annyang.addCallback('resultNoMatch', this.onNotMatch);
    
    this.state = {
      status: Status.AUTHORIZING,
    };

    if (!startVoiceRecognition) {
      annyang.start({ paused: true });
    } else {
      annyang.start();
    }
  }

  onStart = () => {
    this.setState({
      status: Status.RECOGNIZING,
    }, () => {
      const { onStart } = this.props;

      if (!onStart) {
        return;
      }

      onStart();
    });
  }

  getFuzzyMatch = (results: string[]) => {
    const { fuzzyMatchThreshold } = this.state;

    if (!results || !results.length || !fuzzyMatchThreshold) {
      return;
    }

    let fuzzyMatch: [number, string] = [0, ''];
    const fuzzyMatchingResult = results.find((result: string) => {
      const matches = this.fuzzySet.get(result);

      if (!matches) {
        return false;
      }

      const currentResultMatch = matches.find((match: [number, string]) => result === match[1]);
      const isItAFuzzyMatch = currentResultMatch && currentResultMatch[0] >= fuzzyMatchThreshold;

      if (isItAFuzzyMatch) {
        fuzzyMatch = currentResultMatch;
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
    debugger;
    if (results && this.state.fuzzyMatchThreshold) {
      const fuzzyMatch = this.getFuzzyMatch(results);
  
      if (fuzzyMatch) {
        annyang.trigger(fuzzyMatch.match[1]);
      }
    }

    const { onNotMatch } = this.props;

    if (onNotMatch) {
      onNotMatch();
      return;
    }
  }

  componentDidUpdate() {
    const { startVoiceRecognition } = this.props;

    if (!startVoiceRecognition) {
      annyang.pause();

      const { status } = this.state;

      if (status !== Status.PAUSED) {
        this.setState({
          status: Status.PAUSED,
        });
      }

      return;
    }
    
    if (!annyang.isListening()) {
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