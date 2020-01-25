import React from 'react';
import { VoiceCommandRecognizer } from '../components/voice-command-recognizer';

const search = (results?: string[]) => {
  console.log('This is the search: ', results);
  return;
};

export const Home = () => {
  const onMatch = (results?: string[]) => {
    console.log('results: ', results);
  };

  return (
    <>
      <VoiceCommandRecognizer
        onMatch={onMatch}
        commands={[
          {
            phrases: ['search', 'look for', 'find'],
            callback: search,
          }
        ]}
      />
    </>
  );
};