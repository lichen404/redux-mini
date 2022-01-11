import React, {createContext, FC, useContext, useEffect, useState} from "react";

export type Action<T = any> = {
    type: string, payload: Partial<T>
}

type Reducer<T = any> = (state: T, action: Action<T>) => T


export type Store<T = any> = {
    state?: T,
    setState: (newState: T) => void,
    listeners: ((arg: any) => void)[],
    subscribe: (fn: (arg: any) => void) => () => void,
    reducer?: Reducer<T>,
    dispatch: ((action: Action<T>) => void)
}


type Props<T = any> = {
    dispatch: (action: Action<T>) => void,
    state: T,
    [key: string]: any
}


const changed = (oldState: any, newState: any) => {
    let changed = false;
    for (let key in oldState) {
        if (oldState[key] !== newState[key]) {
            changed = true;
            return changed;
        }
    }
    return changed;
}

const appContext = createContext<any>(null);


export const Provider = ({store, children}: any) => {
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}

let store: Store = {
    setState(newState) {
        store.state = newState;
        store.listeners.map(fn => fn(store.state));
    },
    dispatch: (action) => {
        store.setState(store.reducer && store.reducer(store.state, action))
    },
    listeners: [],
    subscribe(fn) {
        store.listeners.push(fn);
        return () => {
            const index = store.listeners.indexOf(fn);
            store.listeners.splice(index, 1);
        };
    },

};

export const connect: <T = any>(selector?: (state: T) => Partial<T>, mapDispatchToProps?: (dispatch: any) => any) => (Component: FC<Props<Partial<T>>>) => FC<any> = (selector, mapDispatchToProps) => (Component) => {
    return (props) => {
        const [, update] = useState({});

        useEffect(() => {
            return store.subscribe(() => {
                const newData = selector ? selector(store.state as any) : {state: store.state}
                if (changed(data, newData)) {
                    console.log('changed')
                    update({});
                }
            });
        }, [selector]);
        const data = selector ? selector(store.state) : {state: store.state}
        const dispatcher = mapDispatchToProps ? mapDispatchToProps(store.dispatch) : {dispatch: store.dispatch}
        return <Component {...dispatcher} {...data} {...props}/>;
    };
};


export const createStore: <T>(reducer: Reducer<T>, initState: T, storeWithMiddleware?: Store<T>) => Store<T> = (reducer, initState, storeWithMiddleware) => {
    store.state = initState;
    store.reducer = reducer;
    store = storeWithMiddleware ? {
        ...store,
        ...storeWithMiddleware
    } : store
    return storeWithMiddleware || store;
}

export const applyMiddleware = (middlewares: any[]) => {
    // 越往后的模块越先执行，所以要调换顺序
    middlewares = middlewares.slice()
    middlewares.reverse()
    let dispatch = store.dispatch
    middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))
    return Object.assign({}, store, {dispatch})
}


