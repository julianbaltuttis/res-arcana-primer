# Res Arcana Primer
Randomize your starting places of power.
A support app for Res Arcana by [Tom Lehmann](https://sites.google.com/site/ptlehmann/) published by [Sand Castle Games](http://www.sandcastle-games.com).

This app supports query strings for its url, eg 

```
http://res-arcana-primer.herokuapp.com/en?base=false&lux=true&pearl=true&countBackwards=false&coloredLabels=true&playerCount=3
```

## Query String Meanings

| Key            | Meaning                                                      | Example values  |
| -------------- | ------------------------------------------------------------ | --------------- |
| base           | Use core set only if set to `true`                           | `true`, `false` |
| lux            | Use Lux et Tenebrae expansion for places of power  if set to `true` | `true`, `false` |
| pearl          | Use Perlae Imperii expansion for places of power if set to `true` | `true`, `false` |
| countBackwards | If set to `true` monuments counter displays how many cards to remove from entire selection | `true`, `false` |
| coloredLabels  | If set to `true` color the places of power labels according to their current side. | `true`, `false` |
| playerCount    | Sets the number of current players. Does not work if core set only rules apply. | 1, 2, 3, 4, 5   |



## Current Version 1.4

- Added locale support for Spanish and Czech.
- Support for query strings. 
- Automatically changes the url using query strings for the current settings. Change the app to any setting and then bookmark the url.



## Version 1.3:

- Generated places of power can now be flipped to their backside by clicking on them.
- Option to colorize place of power titles.
- Option to count Monuments backwards and display how many you need to remove for your current player count.
- Featuring a custom new Favicon.
- Fixed Scaling issue on Monuments Counter in smart phone views.



## Version 1.2:

* Locale support for French and Hungarian
* Menagerie Promo support for Locales that only feature core set
* Automatic color sort for Places of Power
* Expansion options are loaded in a sidebar
* Missing locale GUI elements added
* Dropdown menu for language switching.
* Fixes bug where Monument Counter showed wrong numbers
* Expansion settings are now maintained when switching locales.
* Updates credits in About Page.

## Version 1.1:

* About Page with credits and some legal info.
* Monument counter now works properly and scales according to player count.
* Choosing `Core Set Rules Only` hides the player # slider and sets default values for generating setups accordingly.

## Version 1.0:

* Randomizes places of power for core set and all expansions.
* Language switching with locale support for English and German.
* Slider to adjust number of players.
* Switch logic for choosing either expansions or core set only.
* Responsive design for all screen sizes.
* Material design and custom graphic design to improve usability and user experience.

## Roadmap

* Improved color contrast for generated places of power.
* Design places of power icons.
* Create footer using places of power icons.
* Incorporate places of power icons into generated list.
