import React, { Component } from 'react';
import { VoiceCommandRecognizer } from '../components/voice-command-recognizer';

interface HomeState {
  counter: number;
}

export class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      counter: 0,
    };
  }

  render() {
    const { counter } = this.state;

    return (
      <>
        <VoiceCommandRecognizer
          startVoiceRecognition={true}
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
      </>
    );
  }
}
