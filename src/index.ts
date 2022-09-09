import AddressBar from './AddressBar';
import { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';

/**
 * AddressBar factory
 *
 * @param options
 */
function createAddressBar(options: Partial<IFactoryOptions> = {}) {
    const o: Partial<IFactoryOptions> = {
        ...{historyType: 'browser', window: window},
        ...options
    };

    const map = {
        browser: createBrowserHistory,
        hash: createHashHistory,
        memory: createMemoryHistory,
    }

    if(!map.hasOwnProperty(o.historyType!)) {
        throw new Error(`Unknown history type ${o.historyType}`);
    }

    return new AddressBar(o.window!, map[o.historyType!]());
}

interface IFactoryOptions {
    window: Window;
    historyType: 'browser'|'hash'|'memory';
}

export { createAddressBar };
export * from './AddressBar';
