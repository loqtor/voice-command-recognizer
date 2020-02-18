import React, { Component } from 'react';
import { VoiceCommandRecognizer } from '../components/voice-command-recognizer';

interface HomeState {
  counter: number;
  enabled: boolean;
  recognizing: boolean;
}

export class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      counter: 0,
      enabled: false,
      recognizing: true,
    }; 
  }

  toggleRecognition = () => {
    this.setState({
      recognizing: !this.state.recognizing,
    });
  }

  toggleIsEnabled = () => {
    this.setState({
      enabled: !this.state.enabled,
    });
  }

  render() {
    const { counter, enabled, recognizing } = this.state;

    return (
      <>
        <VoiceCommandRecognizer
          startVoiceRecognition={recognizing}
          commands={[
            {
              phrases: ['search', 'look for', 'find'],
              callback: () => {
                const { counter } = this.state;

                this.setState({
                  counter: counter + 1,
                });
              },
            }
          ]}
          keyCommand='hey computer'
          fuzzyMatchThreshold={0.9}
          onRecognizerEnabled={this.toggleIsEnabled}
          onRecognizerDisabled={this.toggleIsEnabled}
        >
          <p>Children test</p>
          <p>Commands recognized: {counter}</p>
          <p>Speech recognizer is {enabled ? 'listening' : 'waiting for keyphrase'}</p>
        </VoiceCommandRecognizer>
        <button onClick={this.toggleRecognition}>{recognizing ? 'Pause' : 'Start recognition'}</button>
      </>
    );
  }
}
