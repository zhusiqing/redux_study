import React, { Component, PropTypes } from 'react'

class Todo extends Component {
  render() {
    return (
      <li
        onClick={this.props.onClick}
        style={{
          textDecoration: this.props.completed ? 'line-through' : 'none',
          cursor: this.props.completed ? 'default' : 'pointer'
        }}>
        {this.props.text}
      </li>
    )
  }
}

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired
}


export default class TodoList extends Component {
    render() {
      return (
        <ul>
          {this.props.todos.map((todo, index) =>
            <Todo {...todo}
                  key={index}
                  onClick={() => this.props.onTodoClick(index)} />
          )}
        </ul>
      )
    }
  }
  
  TodoList.propTypes = {
    onTodoClick: PropTypes.func.isRequired,
    todos: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    }).isRequired).isRequired
  }