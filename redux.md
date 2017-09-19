# Action
## Action
1. action是一个对象，必须有一个字符串类型的type字段来表示将要执行的动作
2. 尽量减少在action中传递的数据
## Action创建函数
1. 生成action的方法，只是简单的返回了一个action
``` javascript
function addTodo(text){
    return {
        type: ADD_TODO,
        text
    }
}
```

2. 调用创建函数，把结果传给dispatch()，实现一次dispatch过程
``` javascript
dispatch( addTodo(text) );
dispatch( completeTodo(index) )
```
或者创建一个`被绑定的action创建函数`来自动dispatch
``` javascript
const boundAddTodo = (text) => dispatch( addTodo(text) )
const boundCompleteTodo = (index) => dispatch( completeTodo(index) )
//然后直接调用
boundAddTodo(text);
boundCompleteTodo(index);
```

3. store里面能直接通过 `store.dispatch()`调用`dispatch()`方法，但是使用react-redux可以用`connect()`帮助器来调用。`bindActionCreators()`可以自动把多个action创建函数绑定到`dispatch()`方法上。

## 单文件action.js
``` javascript
//action 类型
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

//其他常量
export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
}

//action创建函数
export function addTodo(text){
    return {type: ADD_TODO, text}
}
export function toggleTodo(index){
    return {type:TOGGLE_TODO, index}
}
export function setVisibilityFilter(filter){
    return {type:SET_VISIBILITY_FILTER, filter}
}
```

# Reducer
## State结构
1. 所有的state都被保存在一个单一对象中。要以最简的形式把应用的state用对象描述出来
2. UI相关的state尽量与数据的state分开
``` javascript 
{
    visibilityFilter: 'SHOW_ALL',
    todo: [
        {
            text: 'Consider using Redux',
            completed: true
        },
        {
            text: 'Keep all state in a single tree',
            completed:false
        }
    ]
}
```
3. state规范化，尽量不存在嵌套，每个数据以ID为主键，不同实体或列表间通过ID相互引用数据。（可以把state想像成数据库）
[normalizr文档](https://github.com/paularmstrong/normalizr)
## Action
### reducer
1. reducer将被传递给`Array.prototype.reduce(reducer, ?initialValue)`方法。
2. 保持reducer纯净，永远不要在reducer里做这些操作：
    - 修改传入参数；
    - 执行有副作用的操作，如API请求和路由跳转；
    - 调用非纯函数，如`Date.now()`或`Math().random()`
3. 只要传入参数相同，返回计算得到的下一个state就一定相同。没有特殊情况、没有副作用、没有API请求、没有变量修改，单纯执行计算。
``` javascript
import { VisibilityFilters } from './actions'
const initialState = {
    visibilityFilter: VisibilityFilters.SHOW_ALL,
    todos: []
}
function todoApp(state = initialState,action){
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            //这里不要直接修改state，通过新创建返回
            return Object.assign({},state,{
                visibilityFilter:action.filter
            });
        case ADD_TODO:
            return Object.assign({}, state, {
                todo: [
                    ...state.todos,
                    {
                        text: action.text,
                        completed: false
                    }
                ]
            })
        default:
            return state
    }
}
```
## 拆分Reducer
- 只把需要更新的一部分state传给函数，函数自己确定如何更新这部分数据。
- 主reducer并不需要设置初始化时完整的state。
- 每个reducer只负责管理自己负责的一部分。每个reducer的state参数都不同，分别对应它管理的那部分state数据。
```javascript
//todo相关的reducer
function todos(state = [],action){
    switch (action.type){
        case ADD_TODO:
            return [
                ...state,
                {
                    text:action.text,
                    completed: false
                }
            ];
        case TOGGLE_TODO:
            return state.map((todo,index) => {
                if(index ===action.index){
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    })
                }
                return todo
            });
        default:
            return state
    }
}
//显示todo相关的reducer
function visibilityFilter(state = SHOW_ALL, action){
    switch (action.type){
        case SET_VISIBILITY_FILTER:
            return aciton.filter
        default:
            return state
    }
}
//主reducer
function todoApp(state = {}, action){
    return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: todos(state.todos, action)
    }
}

```
### Redux提供`combineReducers()`来代替todoApp
```javascript
import { combineReducers } from 'redux';
const todoApp = combineReducers({
    visibilityFilter,
    todos
});
export default todoApp;
```

# Store
## Store使用
1. 维持应用的state
2. `getState()`获取state
3. `dispatch(action)`更新state
4. `subscribe(listener)`注册监听
5. `subscribe(listener)`返回的函数注销监听
```javascript
//开始监听
let unsubscribe = store.subscribe(
    ()=> console.log(store.getState());
)
//停止监听
unsubscribe();
```

# Redux生命周期
1. `store.dispatch(action)`
2. `Redux store`调用传入的`reducer`函数
> Store会把`当前的state树`和`action`传入reducer,去生成新的state

3. 主reducer应该把多个子reducer输出合并成一个单一的state树
4. Redux store 保存了主reducer返回的完整state树