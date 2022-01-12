import {Action, Store} from "../redux";

export const reduxPromise: (store: Store) => any = (store) => {
    return (next: any) => {
        return (action: Action) => {
            const newDispatch = (action: Action | Promise<any>) => {

                if (action instanceof Promise) {
                    action.then((payload) => {
                        newDispatch(payload)
                    })
                } else {
                   return next(action)
                }
            }
           return  newDispatch(action)

        }
    }
}