# tolkam/lib-browser-address-bar

An abstraction over the browser History API.

## Usage

````ts
import { createAddressBar } from '@tolkam/lib-browser-address-bar';

const addressBar = createAddressBar({historyType: 'browser'});

// subscribe to navigation changes
addressBar.historyListen((v) => {
    console.log(v);
});

// push some
addressBar.historyPush({
    search: {x: 'y'},
    state: {some: 'state'},
});

// ...and more
setTimeout(() => {
    addressBar.historyReplace(
        {search: {x2: 'y2'}}, 
        {mergeSearch: true}
    );
}, 1000);

// go back
setTimeout(() => {
    addressBar.historyBack();
}, 2000);
````

## Documentation

The code is rather self-explanatory and API is intended to be as simple as possible. Please, read the sources/Docblock if you have any questions. See [Usage](#usage) for quick start.

## TODO
- [ ] Add custom search query serializers
- [ ] Deep merge for search query?
- [ ] Make use of `URL()` interface?
- [ ] Add more helpers for common operations

## License

Proprietary / Unlicensed 🤷
