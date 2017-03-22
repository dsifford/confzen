# confzen
> A command line utility for creating and maintaining configuration files for javascript and typescript projects.

## Why?
Trying to remember the options that are available for the various compilers and linters is hard. This project assumes that responsibility.

## Example

[![asciicast](https://asciinema.org/a/23ftzqfwqu77hhbgihxovjcgn.png)](https://asciinema.org/a/23ftzqfwqu77hhbgihxovjcgn)

## Installation

`npm`
```
npm install -g confzen
```

`yarn`
```
yarn global add confzen
```

## Usage

```sh
$ confzen [path/to/config]
```

If a path is passed as a parameter, the path is checked to see if a configuration file of that type exists. If the file does, exist, it opens it for modification but only writes back to it if you explicitly ask it to when exiting.

If no file is found in the path provided, a new file is created.

If no path is given, the current directory is used as default.

### Keybindings

> **TL;DR** All the expected vim bindings are enabled.

Action | Key
--- | ---
Navigation | Arrow keys **OR** <kbd>h</kbd> <kbd>j</kbd> <kbd>k</kbd> <kbd>l</kbd>
Select Option | <kbd>Enter</kbd>
Search downward | <kbd>/</kbd> then `search term` then <kbd>Enter</kbd>
Search upward | <kbd>?</kbd> then `search term` then <kbd>Enter</kbd>
Toggle focus between JSON preview and configuration list | <kbd>Tab</kbd>
Quit | <kbd>Q</kbd>
