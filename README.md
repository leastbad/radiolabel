<h1 align="center">Radiolabel</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/radiolabel" rel="nofollow">
    <img src="https://badge.fury.io/js/radiolabel.svg" alt="npm version">
  </a>
</p>

<p align="center">
  <b>Mutation indicator overlays for CableReady operations</b></br>
  <sub>Tiny at &lt;100 LOC </sub>
</p>

<br />

- **Simple**: this is a drop-in, code-free solution
- **Styled**: zero CSS, use any design framework
- **Backend Agnostic**: works with or without [StimulusReflex](https://docs.stimulusreflex.com)
- **Turbolinks**: compatible with Turbolinks by design
- **MIT Licensed**: free for personal and commercial use

## Built for CableReady

This [Stimulus](https://stimulusjs.org/) controller intercepts CableReady `after-` DOM events. When it detects an operation that mutates an element, it will create a titled overlay which briefly announces when an element is modified.

Morph operations will be orange, while all others are green.

If an operation was initiated by [StimulusReflex](https://docs.stimulusreflex.com), additional information will be presented about the Reflex action in the title.

## Setup

First, add Radiolabel to your `package.json`:

`yarn add radiolabel`

Then, just add Radiolabel to your main JS entry point or Stimulus controllers root folder:

```js
import { Application } from 'stimulus'
import Radiolabel from 'radiolabel'

import { definitionsFromContext } from 'stimulus/webpack-helpers'
const application = Application.start()
const context = require.context('../controllers', true, /\.js$/)
application.load(definitionsFromContext(context))

// Manually register Radiolabel as a Stimulus controller
application.register('radiolabel', Radiolabel)
```

Optionally, you can restrict the import to your `development` environment:

```js
import { Application } from 'stimulus'

import { definitionsFromContext } from 'stimulus/webpack-helpers'
const application = Application.start()
const context = require.context('../controllers', true, /\.js$/)
application.load(definitionsFromContext(context))

if (process.env.RAILS_ENV === 'development') {
  import('radiolabel').then(Radiolabel =>
    application.register('radiolabel', Radiolabel.default)
  )
}
```

If Stimulus can't locate a controller at runtime, the `data-controller` attribute is ignored, meaning your template can reference `radiolabel` in the `production` environment and nothing will happen.

## HTML Markup

```html
<body data-controller="radiolabel"></body>
```
<tiny>Yes, that's really it.</tiny>

## Contributing

Bug reports and pull requests are welcome.

## License

This package is available as open source under the terms of the MIT License.
