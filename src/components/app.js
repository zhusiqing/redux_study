import React,{Component,PropTypes} from 'react'
import {connect} from 'react-redux'
import {addTodo, completeTodo, setVisibilityFilter, VisibilityFilters} from '../actions'
import AddTodo from './Addtodo'
import TodoList from './TodoList'
import Footer from './Footer'

class App extends Component {
    render (){
        const {dispatch , Todos, TodosFilter} = this.props;
        return (
            <div>
                <AddTodo onAddClick = {text=>dispatch(addTodo(text))}></AddTodo>
                <TodoList todos = {Todos} onTodoClick = {index=>dispatch(completeTodo(index))}></TodoList>
                <Footer filter = {TodosFilter} onFilterChange = {nextFilter=>dispatch(setVisibilityFilter(nextFilter))}></Footer>
            </div>
        )
    }
}
App.PropTypes = {
    Todos: PropTypes.arrayOf(PropTypes.shape({
        text:PropTypes.string.isRequired,
        completed:PropTypes.bool.isRequired
    }).isRequired).isRequired,
    TodosFilter:PropTypes.oneOf([
        'SHOW_ALL',
        'SHOW_COMPLETED',
        'SHOW_ACTIVE'
    ]).isRequired
}

function selectTodos(todos,filter){
    switch(filter){
        case VisibilityFilters.SHOW_ALL:
            return todos;
        case VisibilityFilters.SHOW_COMPLETED:
            return todos.filter(todo => todo.completed);
        case VisibilityFilters.SHOW_ACTIVE:
            return todos.filter(todo => !todo.completed);
    }
}

function select(state){
    return {
        Todos:selectTodos(state.todos,state.visibilityFilter),
        TodosFilter:state.visibilityFilter
    }
}
export default connect(select)(App);