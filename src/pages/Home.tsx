import React, { Component } from 'react';
import { VoiceCommandRecognizer } from '../components/voice-command-recognizer';

interface HomeState {
  counter: number;
  recognizing: boolean;
}

export class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      counter: 0,
      recognizing: true,
    };
  }

  toggleRecognition = () => {
    this.setState({
      recognizing: !this.state.recognizing,
    });
  }

  render() {
    const { counter, recognizing } = this.state;

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
        >
          <p>Children test</p>
          <p>Commands recognized: {counter}</p>
        </VoiceCommandRecognizer>
        <button onClick={this.toggleRecognition}>Toggle recognition</button>
      </>
    );
  }
}
