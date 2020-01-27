# voice-command-recognizer
React component to recognize voice commands based on the Web Speech API (`SpeechRecognizer`).

## Current status

This repository consists of an app proving the concept of what I intend to do with its main component (`VoiceCommandRecognizer`).

The app is based on `create-react-app` and is basically a home page invoking the component for testing.

## Dependencies

It relies on [`annyang`](https://github.com/TalAter/annyang) (Speech Recognition library by [TalAlter](https://twitter.com/TalAter)) for command matching.

It enhances the command recognition by adding a `fuzzyMatchThreshold` feature. This prop allows to specify a certain tolerance for what the user says to be considered as correct.

The string comparison is using [`fuzzyset.js`](https://glench.github.io/fuzzyset.js/) by [@Glench](https://twitter.com/Glench) with its default config.

## How the component works

It's currently an HOC and you are capable of just conditionally rendering things inside it, based on its state (as with any other HOC).

You can either set the component to be listening to everything or only enable listening once the user says a certain `keyphrase` that you can define through the component `props` (saying the `keyphrase` again _toggles listening_).

You can also define a percentage of accuracy for what the user says and either run a custom action when that threshold is reached or just consider that as correct. It's useful for those cases when the user might not be a native english speaker and you'd like to be a bit more forgiving on pronunciation. :)

### Props:

- `commands`: The commands to be accepted and the function to be run for each. Different formats are accepted, see the _Commands_ section below.
- `keyCommand`: The command that would enable the component to listen. When said again, it would make the component stop listening.
- `startVoiceRecognition`: Flag that allows to start/pause the recognition.
- `onPermissionBlocked`: The function to be run if the browser denies access to the microphone.
- `onPermissionDenied`: The function to be run if the user denies access to the microphone.
- `fuzzyMatchThreshold`: A number (from 0 to 1) that determines how exact what the user says need to be.
- `onFuzzyMatch`: Action to be ran when what the user is at least `fuzzyMatchThreshold`. If there's not an action provided, the component will trigger the command that's closes to what the user said.
- `onNotMatch`: Action to be run when there's not a full match neither a fuzzy match with any of the available commands.
- `onStart`: It's triggered when `SpeechRecognizer` triggers its `onstart` event. It's a way to update your application once the speech recognition is started (i.e.: the browser can hear you).

#### `commands` prop

The format expected for the command would be as follows:

```
{
  phrases: ['search', 'look for', 'find'],
  callback: () => {
    const { counter } = this.state;

    this.setState({
      counter: counter + 1,
    });
  },
}
```

`phrases` are basically the commands that when said would trigger the function that's in `callback` attribute.

They don't need to be specific words, but you can make it more general and use either regexes or spats.

This is supported through Annyang. Have a look at their [doc's](https://github.com/TalAter/annyang/tree/master/docs#good-to-know) for how the commands can be defined.

## Next steps

- [ ] See how Annyang can be shipped as part of the component in an elegant way.
- [ ] Convert the component to an `npm` package.
- [ ] Integrate it in an actual app (migrate [Guess the Movie](https://github.com/loqtor/guess-the-movie) from its current implementation to use this component).