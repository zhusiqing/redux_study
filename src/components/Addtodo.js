import React , { Component, PropTypes } from 'react'

export default class AddTodo extends Component{
    render(){
        return (
            <div>
                    <input ref='input' type="text"/>
                    <button onClick = {e=>this.handleClick(e)}>Addtodo</button>
            </div>
        )
    }
    handleClick(e){
        const node = this.refs.input;
        const text = node.value.trim();
        this.props.onAddClick(text);
        node.value = '';
    }
    
}
AddTodo.PropTypes = {
    onAddClick:PropTypes.func.isRequired
}