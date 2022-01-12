import React, {FC, useEffect} from 'react';
import {applyMiddleware, connect, createStore, Provider} from "./redux";
import {reduxPromise} from "./middlewares/redux-promise";
import {reduxThunk} from "./middlewares/redux-thunk";
import {reduxLog} from "./middlewares/redux-log";

type User = {
    name: string,
    age: number
}
const store = createStore<User>((state, {type, payload}) => {
    if (type === 'updateUser') {
        return {
            ...state,
            ...payload
        };
    } else {
        return state;
    }
}, {
    name: "lichen",
    age: 18

}, applyMiddleware([reduxPromise, reduxThunk,reduxLog]))

const User: FC = connect<User>()(({state}) => {
    return <div>User:{state.name}</div>;
});

const userSelector = (state: User) => {
    return {
        name: state.name,
        age: state.age
    }
}
const userAgeSelector = (state: User) => {
    return {
        age: state.age
    }
}


const userDispatcher = (dispatch: any) => {
    return {
        updateName(payload: any) {

            dispatch(new Promise((resolve => {
                setTimeout(
                    () => {
                        resolve({type: 'updateUser', payload})
                    }
                    , 1000)
            })))
        },
        updateAge(payload: any) {
            dispatch((dispatch: any) => {
                setTimeout(() => {
                    dispatch({type: 'updateUser', payload})
                }, 1000)
            })
        }
    }
}
// 一个可以复用的高阶函数，把读写接口传给需要的组件
const connectToUser = connect<User>(userSelector, userDispatcher)


const UserModifier = connectToUser
(({updateName, name, age, updateAge}) => {
    return (<div>
        <input type="text" value={name || ''} onChange={(e) => {
            updateName(
                {name: e.target.value}
            );
        }}/>
        <input type="text" value={age || ''} onChange={(e) => {
            updateAge(
                {age: e.target.value}
            );
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

const ThirdChild: FC = connect<User>(userAgeSelector)(({age}) => {
    console.log('三儿子执行了');
    return <section>三儿子{age}岁</section>;
});

function App() {
    return (
        <Provider
            store={store}>
            <FirstChild/>
            <SecondChild/>
            <ThirdChild/>
        </Provider>

    );
}

export default App;
