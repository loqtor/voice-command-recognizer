import React, { Component } from 'react';

interface Command {
  phrases: string[];
  callback: (results?: string[]) => void;
}

interface VoiceCommandRecognizerProps {
  onMatch?: () => void;
  onFuzzyMatch?: () => void;
  onNotMatch?: () => void;
  commands: Command[];
};

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

interface AnnyangOptions {
  autorestart: boolean;
  continuous: boolean;
  paused: boolean;
}

interface AnnyangCommands {
  [keyof: string]: (results?: string[]) => void;
}

interface Annyang {
  start: (options?: AnnyangOptions) => void;
  abort: () => void;
  addCommands: (commands: AnnyangCommands) => void;
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

export const VoiceCommandRecognizer = class VoiceCommandRecognizer extends Component<VoiceCommandRecognizerProps> {
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

      const formattedCommands = formatForAnnyang(props.commands);
      console.log('formattedCommands: ', formattedCommands);

      return;
    }
  }

  render() {
    return (
      <div className="VoiceCommandRecognizer">
        <div className="Container">
        </div>
      </div>
    );
  }
}