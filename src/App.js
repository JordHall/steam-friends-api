import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css"

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
    const api2 = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=391C66AEE33C44E3C36C283651E05BEA&steamid=76561198165907050&include_appinfo=1&format=json"
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

  createSteamImage(id, hash) {
    return "http://media.steampowered.com/steamcommunity/public/images/apps/" + id + "/" + hash +".jpg"
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
      items.forEach((item) => {
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
      let maxHours = newCombArray[0]
      console.log(newCombArray)
      return (
        <div class="container">
          <div class="col text-center">
            <h1>Shared steam games</h1>
            <h4>By average playtime</h4>
          </div>
          <div class="col m-auto">
              {newCombArray.map(item => (
                <div class="row m-2" key={item.appid}>
                  <img src={this.createSteamImage(item.appid,item.img_logo_url)} class="img rounded h-50 center" alt="Logo"></img>
                  <div class="col">
                    <h2>{item.name}</h2>
                  </div>
                  <div class="col-2">
                    <span class="badge badge-info">{Math.round(item.playtime_forever/60)} hrs</span>
                    <div class="progress">
                      <div class="progress-bar" style={{width:((item.playtime_forever/maxHours.playtime_forever)*100)}}></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )
    }
  }
}

export default App;