import {Action, Store} from "../redux";

export const reduxThunk: (store: Store) => any = (store) => {
    return (next: any) => {
        return (action: Action) => {
            const newDispatch = (action: any) => {

                if (action instanceof Function) {
                    action(newDispatch)
                }
                else  {
                    return next(action)
                }
            }

            return  newDispatch(action)
        }
    }
}