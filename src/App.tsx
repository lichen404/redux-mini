import React from 'react';
import {useState, useContext, createContext, FC} from 'react';


type Reducer<T> = (state: T, action: { type: string, payload: Partial<T> }) => T

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

const SecondChild: FC = () => <section>二儿子<UserModifier/></section>;

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
const UserModifier: FC = () => {
    const {appState, setAppState} = useContext(appContext);
    return (<div>
        <input type="text" value={appState.user.name} onChange={(e) => {
            const newState = reducer(appState, {
                    type: 'updateUser',
                    payload: {name: e.target.value}
                }
            );
            setAppState(newState)
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
