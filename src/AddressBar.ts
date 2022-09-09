import { Action, History } from 'history';
import { locationToEntry, entryToPath } from './helpers';

class AddressBar {

    /**
     * @param window
     * @param history
     */
    public constructor(
        private readonly window: Window,
        private readonly history: History
    ) {
    }

    /**
     * Gets current location state
     */
    public current = (): IHistoryEntry => locationToEntry(this.history.location);

    /**
     * Pushes new history entry
     *
     * @param entry
     * @param options
     */
    public historyPush = (
        entry: Partial<IHistoryEntry>,
        options: Partial<IHistoryActionOptions> = {},
    ) => {
        this.update(Action.Push, entry, options);
    }

    /**
     * Replaces current history entry
     *
     * @param entry
     * @param options
     */
    public historyReplace = (
        entry: Partial<IHistoryEntry>,
        options: Partial<IHistoryActionOptions> = {},
    ) => {
        this.update(Action.Replace, entry, options);
    }

    public historyBack = this.history.back;

    public historyForward = this.history.forward;

    public historyGo = this.history.go;

    /**
     * Prevents changes to the history stack until unblocked
     *
     * This is useful when you want to prevent the user navigating away from the current page,
     * for example when they have some unsaved data on the current page.
     *
     * @param blocker
     */
    public historyBlock = <S>(blocker: THistoryBlocker) => {
        return this.history.block(({location, action, retry}) => {
            blocker(locationToEntry<S>(location), action, retry);
        });
    };

    /**
     * Listens to history changes
     *
     * @param listener
     */
    public historyListen = <S>(listener: THistoryListener) => {
        return this.history.listen(({location, action}) => {
            listener(locationToEntry<S>(location), action);
        });
    }

    /**
     * Builds a URL string from an entry
     *
     * @param entry
     */
    public buildUrl = (entry: Partial<IHistoryEntry>) => {
        let {pathname, search, hash} = entry;
        const searchString = search ? new URLSearchParams(search).toString() : '';

        return this.history.createHref({pathname, search: searchString as string, hash});
    }

    /**
     * Replaces the URL with page reload
     *
     * @param entry
     */
    public locationReplace = (entry: Partial<IHistoryEntry>) => {
        this.window.location.replace(this.buildUrl(entry));
    }

    /**
     * Reloads the browser page
     */
    public locationReload = () => {
        this.window.location.reload();
    }

    /**
     * @param action
     * @param entry
     * @param options
     * @private
     */
    private update(
        action: Action.Push | Action.Replace,
        entry: Partial<IHistoryEntry>,
        options: Partial<IHistoryActionOptions>,
    ) {
        let searchToMerge;
        if (options.mergeSearch) {
            searchToMerge = this.current().search;
        }

        this.history[action.toLowerCase()](entryToPath(entry, searchToMerge), entry.state);
    }
}

export type THistoryAction = Action;
export type THistoryListener = (entry: IHistoryEntry, action: Action) => void;
export type THistoryBlocker = (entry: IHistoryEntry, action: Action, retry: () => void) => void;

export interface IHistoryEntry {
    pathname: string;
    search: { [key: string]: any };
    hash: string;
    key: string;
    state?: any;
}

export interface IHistoryActionOptions {
    mergeSearch: boolean;
}

export default AddressBar;
