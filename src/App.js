import React, { Component } from "react";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      items2: [],
      isLoaded2: false,
      combArray: []
    }
  }

  componentDidMount() {
    const api = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=391C66AEE33C44E3C36C283651E05BEA&steamid=76561198040298609&include_appinfo=1&format=json"
    const api2 = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=391C66AEE33C44E3C36C283651E05BEA&steamid=76561198054970492&include_appinfo=1&format=json"
    const cors = "https://cors-anywhere.herokuapp.com/"
    
    fetch(cors + api)
    .then(res => res.json())
    .then((json) => {
      this.setState({
        isLoaded: true,
        items: json.response.games
      })
    })
    fetch(cors + api2)
    .then(res => res.json())
    .then((json) => {
      this.setState({
        isLoaded2: true,
        items2: json.response.games
      })
    })
  }

  render() {
    const { isLoaded, isLoaded2, items, items2 } = this.state;
    if (!isLoaded && !isLoaded2) {
      return <div>Loading...</div>
    }
    else {
      console.log(items)
      console.log(items2)
      let newCombArray = []
      items.forEach( (item) => {
        items2.forEach((item2) => {
          if (item2.appid === item.appid) {
            item.playtime_forever = (item.playtime_forever + item2.playtime_forever)/2
            newCombArray.push(item)
          }
        })
      })
      newCombArray.sort(function(a,b) {
        return b.playtime_forever - a.playtime_forever;
      })
      console.log(newCombArray)
      return (
        <div className="App">
            <ul>
              {newCombArray.map(item => (
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