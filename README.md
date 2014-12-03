# angular-ice

AngularJS input form directives

## Installation

### bower

```shell
bower install angular-ice
```

p.s. --save-dev if you only need the iceUnitTester and/or the IceBasePage (not the directives, services, etc.)

## Setup to use ice directives

Add a `<script>` to your `index.html`:

```html
<script src="bower_components/angular-ice/angular-ice.js"></script>
```

Then add `ice.forms` as a dependency for your app:

```javascript
angular.module('myApp', ['ice.forms']);
```

## Setup to use the iceUnitTester

See [iceUnitTester - Installation](http://bverbist.github.io/angular-ice/#/unitTester)

## Documentation

See the [examples](http://bverbist.github.io/angular-ice/)

## License

The MIT License
