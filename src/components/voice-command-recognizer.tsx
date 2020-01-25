import React, { Component } from 'react';

enum Status {
  AUTHORIZING = 'authorizing',
  STARTING = 'starting',
  RECOGNIZING = 'recognizing',
  FINISHED = 'finished',
  FAILED = 'failed',
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
  start: (options?: AnnyangOptions) => void;
  abort: () => void;
  addCommands: (commands: AnnyangCommands) => void;
  pause: () => void;
  removeCommands: (command: string) => void;
  removeCallback: (type: string, callback?: () => {}) => void;
  addCallback: (event: string, callback: () => void) => void;
  isListening: () => boolean;
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

    if (props.commands) {
      const formattedCommands = formatForAnnyang(props.commands);
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

  onNotMatch = (results?: string[]) => {
    console.log('results: ', results);
  }

  componentDidUpdate() {
    const { startVoiceRecognition } = this.props;

    if (!startVoiceRecognition) {
      annyang.pause();
    } else if (!annyang.isListening()) {
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