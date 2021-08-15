import React, {useEffect} from 'react';
import {useState, useContext, createContext, FC} from 'react';

type Action<T = any> = {
    type: string, payload: Partial<T>
}

type Reducer<T = any> = (state: T, action: Action<T>) => T

type User = {
    name: string,
    age: number
}
type Store<T = any> = {
    state: T,
    setState: (newState: T) => void,
    listeners: ((arg: any) => void)[],
    subscribe: (fn: (arg: any) => void) => () => void
}

const connect: <T = any>(Component: FC<Props<T>>) => FC<any> = (Component) => {
    return (props) => {
        const [, update] = useState({});
        useEffect(() => {
            store.subscribe(() => {
                update({});
            });
        }, []);
        const {state, setState} = useContext(appContext);
        const dispatch = (action: Action<User>) => {
            setState(reducer(state, action));
            update({});
        };
        return <Component dispatch={dispatch} state={state} {...props}/>;
    };
};

const User: FC = connect<User>(({state}) => {
    return <div>User:{state.name}</div>;
});

const appContext = createContext<any>(null);


const store: Store<User> = {
    state: {name: 'frank', age: 18},
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
    }
};

const reducer: Reducer<User> = (state, {type, payload}) => {
    if (type === 'updateUser') {
        return {
            ...state,
            ...payload
        };
    } else {
        return state;
    }
};
type Props<T = any> = {
    dispatch: (action: Action<T>) => void,
    state: T,
    [key: string]: any
}



const UserModifier = connect<User>(({dispatch, state}) => {
    return (<div>
        <input type="text" value={state.name || ''} onChange={(e) => {
            dispatch({
                type: 'updateUser',
                payload: {name: e.target.value}
            })
            ;
        }}/>
    </div>);
});

const FirstChild: FC = () => {
    console.log('大儿子执行了');
    return <section>大儿子<User/></section>;
};

const SecondChild: FC = () => {
    console.log('二儿子执行了');
    return <section>二儿子<UserModifier/></section>;
};

const ThirdChild: FC = () => {
    console.log('三儿子执行了');
    return <section>三儿子</section>;
};

function App() {
    return (
        <appContext.Provider value={store}>
            <FirstChild/>
            <SecondChild/>
            <ThirdChild/>
        </appContext.Provider>

    );
}

export default App;
