import { Location, Path } from 'history';
import { IHistoryEntry } from './AddressBar';


/**
 * Converts URLSearchParams to object
 *
 * @param searchParams
 */
export function searchParamsToObject<T>(searchParams: URLSearchParams): T {
    return Object.fromEntries(searchParams.entries()) as any;
}

/**
 * Converts history Location to IHistoryEntry
 *
 * @param location
 */
export function locationToEntry<S>(location: Location): IHistoryEntry {
    return {
        pathname: location.pathname,
        search: searchParamsToObject<S>(new URLSearchParams(location.search)),
        hash: location.hash,
        state: location.state,
        key: location.key,
    }
}

/**
 * Converts IHistoryEntry to history Path
 *
 * @param entry
 * @param searchToMerge
 */
export function entryToPath(
    entry: Partial<IHistoryEntry>,
    searchToMerge?: IHistoryEntry['search'],
): Partial<Path> {

    const { pathname, search, hash } = entry;
    const path: Partial<Path> = {};

    if (pathname) {
        path.pathname = pathname
    }

    if (search) {
        const newSearch = new URLSearchParams(search);

        // merges one level deep so far
        if (searchToMerge) {
            for(const key in searchToMerge) {
                newSearch.append(key, searchToMerge[key]);
            }
        }

        newSearch.sort();
        path.search = newSearch.toString();
    }

    if (hash) {
        path.hash = hash
    }

    return path;
}
