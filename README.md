# voice-command-recognizer
React component to recognize voice commands relying on the Web Speech API (`SpeechRecognizer`).

# Current status

It already listens and works on what comes to offer the ability to listen to commands and run specific callbacks in the components from where it can be invoked.

This repository is an app that has the component itself, being used in a basic example app, just incrementing a counter each time a command is detected.

# Dependencies

It relies on [`annyang`](https://github.com/TalAter/annyang) (Speech Recognition library by [TalAlter](https://twitter.com/TalAter)) for command matching.

It enhances the command recognition by adding a `fuzzyMatchThreshold` feature. This prop allows to specify a certain tolerance for what the user says to be considered as correct.

The string comparison is using [`fuzzyset.js`](https://glench.github.io/fuzzyset.js/) by [@Glench](https://twitter.com/Glench) with its default config.

# Example?

