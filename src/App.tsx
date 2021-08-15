import React from 'react';
import {useState, useContext, createContext, FC} from 'react';

const appContext = createContext<any>(null);

const FirstChild: FC = () => <section>大儿子<User/></section>;

const SecondChild: FC = () => <section>二儿子<UserModifier/></section>;

const ThirdChild: FC = () => <section>三儿子</section>;

const UserModifier: FC = () => {
    const contextValue = useContext(appContext);
    return <div>
        <input type="text" value={contextValue.appState.user.name} onChange={(e) => {
            contextValue.appState.user.name = e.target.value;
            contextValue.setAppState({...contextValue.appState});
        }}/>
    </div>;
};

const User: FC = () => {
    const contextValue = useContext<any>(appContext);
    return <div>User:{contextValue.appState.user.name}</div>;
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
