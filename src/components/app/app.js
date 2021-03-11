import React, {Component} from 'react'
import TodoList from '../todo-list'
import SearchPanel from '../search-panel'
import AppHeader from '../app-header'
import ItemAddForm from '../item-add-form'
import './app.css'
import ItemStatusFilter from '../item-status-filter'

 

export default class App extends Component {

    maxId = 100;

    state ={
        todoDate : [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Make Awesome App'),
            this.createTodoItem('Have a lunch')
        ],
        term: '',
        filter: 'all' //active, all, done
    }

    createTodoItem(label) {
        return{
            label,
            important: false,
            done: false,
            id: this.maxId++
        }
    }
    
    deleteItem = (id) => {
        this.setState(({todoDate}) => {
            const idx = todoDate.findIndex((el) => el.id===id)

            const newArray = [
                ... todoDate.slice(0,idx),
                ... todoDate.slice(idx+1)
            ]
            return {
                todoDate: newArray
            }
        })
    }

    addItem = (text) => {
            const newItem = this.createTodoItem(text);

            this.setState(({todoDate})=> {
                const newArr = [
                    ...todoDate,
                    newItem
                ]
            return {
                todoDate: newArr
            }
            })
    }

    toggleProperty (arr, id, propName) {

        const idx = arr.findIndex((el) => el.id===id);
            const oldItem = arr[idx]
            const newItem ={ ...oldItem, [propName]: !oldItem[propName]};

            return [
                ... arr.slice(0,idx),
                newItem,
                ... arr.slice(idx + 1)
            ];

    }
    
    onToggleImportant = (id) => {
        this.setState(({todoDate})=>{
            return {
                todoDate: this.toggleProperty(todoDate, id, 'important')
            }
        })      
    }

    onToggleDone = (id) => {        
        this.setState(({todoDate})=>{
            return {
                todoDate: this.toggleProperty(todoDate, id, 'done')
            }
        })       
    }

    search(items, term) {
        if (term=== 0) {
            return items
        }
        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
        })
    }

    onSearchChange =(term) => {
        this.setState({term})
    }

    filter (items, filter) {
        switch(filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done)
            case 'done':
                return items.filter((item) => item.done)
            default :
                return items
        }
    }

    onFilterChange =(filter) => {
        this.setState({filter})
    }    

    render () {   
        const {todoDate, term, filter} = this.state
        const visibleItems = this.filter(this.search(todoDate, term), filter)
        const doneCount = todoDate.filter((el) => el.done).length
        const todoCount = todoDate.length-doneCount;

        return (
            <div className="app">
                <AppHeader  toDo={todoCount} done={doneCount}/>
                <div className="top-panel d-flex">
                    <SearchPanel
                    onSearchChange = {this.onSearchChange} 
                />
                    <ItemStatusFilter 
                        filter={filter}
                        onFilterChange = {this.onFilterChange}
                    />
                </div>
                
                <TodoList 
                    todos = {visibleItems} 
                    onDeleted={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleDone={this.onToggleDone}
                    
                />

                <ItemAddForm
                    onItemAdded={this.addItem} />
            </div>
        )
    }
}