import {Action, Store} from "../redux";

export const reduxLog: (store: Store) => any = (store) => {
    return (next: any) => {
        return (action: Action) => {
            console.log('dispatching', action)
            next(action)
            console.log('next  state', store.getState())
        }
    }
}