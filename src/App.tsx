import React from 'react';
import {useState, useContext, createContext, FC} from 'react';

type Action<T = any> = {
    type: string, payload: Partial<T>
}

type Reducer<T = any> = (state: T, action: Action<T>) => T

type User = {
    name: string,
    age: number
}

const User: FC = () => {
    const contextValue = useContext<any>(appContext);
    return <div>User:{contextValue.appState.user.name}</div>;
};

const appContext = createContext<any>(null);

const FirstChild: FC = () => <section>大儿子<User/></section>;

const SecondChild: FC = () => <section>二儿子<Wrapper/></section>;

const ThirdChild: FC = () => <section>三儿子</section>;


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

const Wrapper = () => {
    const {appState, setAppState} = useContext(appContext);
    const dispatch = (action: Action<User>) => {
        setAppState(reducer(appState, action));
    };
    return <UserModifier dispatch={dispatch} state={appState}/>;
};
type Props<T> = {
    dispatch: (action: Action<T>) => void,
    state: T
}
const UserModifier: FC<Props<User>> = ({dispatch, state}) => {
    return (<div>
        <input type="text" value={state.name} onChange={(e) => {
            dispatch({
                type: 'updateUser',
                payload: {name: e.target.value}
            })
            ;
        }}/>
    </div>);
};


function App() {
    const [appState, setAppState] = useState({
        user: {name: 'frank', age: 18}
    });
    const contextValue = {appState, setAppState};
    return (
        <appContext.Provider value={contextValue}>
            <FirstChild/>
            <SecondChild/>
            <ThirdChild/>
        </appContext.Provider>

    );
}

export default App;
