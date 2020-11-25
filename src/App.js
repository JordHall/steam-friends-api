import React, { Component } from "react";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    const api = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=391C66AEE33C44E3C36C283651E05BEA&steamid=76561198040298609&include_appinfo=1&format=json"
    const cors = "https://cors-anywhere.herokuapp.com/"
    fetch(cors + api)
    .then(res => res.json())
    .then((json) => {
      this.setState({
        isLoaded: true,
        items: json.response.games
      })
    })
  }

  render() {
    const { isLoaded, items } = this.state;

    if (!isLoaded) {
      return <div>Loading...</div>
    }
    else {
      items.sort(function(a,b) {
        return b.playtime_forever - a.playtime_forever;
      })
      return (
        <div className="App">
            <ul>
              {items.map(item => (
                <li key={item.appid}>
                  {item.name} | Playtime: {Math.round(item.playtime_forever/60)} hours
                </li>
              ))}
            </ul>
        </div>
      )
    }
  }
}

export default App;