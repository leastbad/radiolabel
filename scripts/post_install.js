console.log(
  'Registering a Stimulus controller for use is easy!\n\n' +
    '1. Open index.js in your controllers folder.\n' +
    '2. Add the following import:\n' +
    "  import Radiolabel from 'radiolabel'\n" +
    '3. Register the radiolabel controller at the bottom:\n' +
    "  application.register('radiolabel', Radiolabel)\n\n" +
    'You can also set up Radiolabel for conditional import:\n\n' +
    "if (process.env.RAILS_ENV === 'development') {\n" +
    "  import('radiolabel').then(Radiolabel =>\n" +
    "    application.register('radiolabel', Radiolabel.default)\n" +
    '  )\n' +
    '}\n\n'
)
