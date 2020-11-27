import React, { Component } from "react";
import SharedSteamGames from "./SharedSteamGames"
import "bootstrap/dist/css/bootstrap.min.css"

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userInput: false,
            user1: "",
            user2: ""
        }
        this.buttonClickHandle = this.buttonClickHandle.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    buttonClickHandle() {
        this.setState({
            userInput: true
        })
        this.render()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const { userInput, user1, user2 } = this.state;
        if (userInput === false) {
            return (
                <div class="container text-center p-2">
                    <div class="row">
                        <div class="col p-1">
                            <label class="p-3">User 1</label>
                            <input required type="text" name="user1" value={user1} onChange={this.handleChange}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col p-1">
                            <label class="p-3">User 2</label>
                            <input required type="text" name="user2" value={user2} onChange={this.handleChange}></input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <button class="btn btn-primary" onClick={this.buttonClickHandle}>Enter</button>
                        </div>
                    </div>
                </div>
            )
        }
        if (userInput === true) {
            return (
                <SharedSteamGames api1={user1} api2={user2} />
            )
        }
    }
}

export default App;