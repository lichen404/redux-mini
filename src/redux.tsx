import React, {createContext, FC, useContext, useEffect, useState} from "react";

type Action<T = any> = {
    type: string, payload: Partial<T>
}

type Reducer<T = any> = (state: T, action: Action<T>) => T

type User = {
    name: string,
    age: number
}

type Store<T = any> = {
    state?: T,
    setState: (newState: T) => void,
    listeners: ((arg: any) => void)[],
    subscribe: (fn: (arg: any) => void) => () => void,
    reducer?: Reducer<T>
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


export const Provider = ({store,children}:any)=>{
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}

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
        const {state, setState} = useContext(appContext);
        const dispatch = (action: Action<User>) => {
            setState(store.reducer && store.reducer(state, action));
            update({});
        };
        const data = selector ? selector(state) : {state}
        const dispatcher = mapDispatchToProps ? mapDispatchToProps(dispatch) : {dispatch}
        return <Component {...dispatcher} {...data} {...props}/>;
    };
};

const store: Store = {
    setState(newState) {
        store.state = newState;
        store.listeners.map(fn => fn(store.state));
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

export const createStore:<T>(reducer:Reducer<T>,initState:T)=>Store<T> = (reducer, initState) => {
    store.state = initState;
    store.reducer = reducer;
    return store;
}


