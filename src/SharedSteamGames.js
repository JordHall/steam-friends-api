import React, { Component } from "react";
import App from "./App"
import "bootstrap/dist/css/bootstrap.min.css"

class SharedSteamGames extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      items2: [],
      isLoaded2: false,
      combArray: [],
      api1: "",
      api2: "",
      hasError: false,
      errorMsg: "",
      username1: "",
      username2: ""
    }

    this.handleAPIUrl = this.handleAPIUrl.bind(this);
  }

  handleAPIUrl(vanity, cors) {
    this.getSteamUserID(vanity, cors)
    const { username }  = this.state
    console.log(username)
    if (username.success === 1) {
      return username.steamid
    }
    else {
      return vanity
    }
  }

  componentDidMount() {
    const cors = "https://cors-anywhere.herokuapp.com/"
    const apiUrl = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=391C66AEE33C44E3C36C283651E05BEA&steamid="
    const vanityApiUrl = "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=391C66AEE33C44E3C36C283651E05BEA&vanityurl="

    fetch(cors + vanityApiUrl + this.props.api1, {credentials: "omit"})
    .then(res => res.json()).then((json) => {
      this.setState({
        username1: json.response
      })
    })

    fetch(cors + vanityApiUrl + this.props.api1, {credentials: "omit"})
    .then(res => res.json()).then((json) => {
      this.setState({
        username2: json.response
      })
    })

    fetch(cors + apiUrl + this.props.username1 + "&include_appinfo=1&format=json", {credentials: "omit"})
      .then(res => res.json())
      .then((json) => {
        this.setState({
          isLoaded: true,
          items: json.response.games
        });
      }).catch((error) => {
        console.log(error);
        this.setState({
          errorMsg: "Could not connect to API",
          hasError: true
        })
      });

    fetch(cors + apiUrl + + this.props.username2 + "&include_appinfo=1&format=json", {credentials: "omit"})
      .then(res => res.json())
      .then((json) => {
        this.setState({
          isLoaded2: true,
          items2: json.response.games
        });
      }).catch((error) => {
        console.log(error);
        this.setState({
          errorMsg: "Could not connect to API",
          hasError: true
        })
      });
  }

  createSteamImage(id, hash) {
    return "https://media.steampowered.com/steamcommunity/public/images/apps/" + id + "/" + hash + ".jpg"
  }

  getProgWidth(min, max) {
    return ((min / max) * 100).toString() + "%"
  }

  render() {
    const { isLoaded, isLoaded2, items, items2, hasError, errorMsg } = this.state;
    if (hasError) {
      return <App errorMsg={errorMsg} />
    }
    if (!isLoaded && !isLoaded2) {
      return <div class="text-center">Loading...</div>
    }
    else {
      console.log(items)
      console.log(items2)
      let newCombArray = []
      items.forEach((item) => {
        items2.forEach((item2) => {
          if (item2.appid === item.appid) {
            item.avg = Math.round(((item.playtime_forever + item2.playtime_forever) / 2) / 60)
            item.playtime1 = Math.round(item.playtime_forever/ 60)
            item.playtime2 = Math.round(item2.playtime_forever / 60)
            newCombArray.push(item)
          }
        })
      })
      newCombArray.sort(function (a, b) {
        return b.avg - a.avg;
      })
      console.log(newCombArray)
      let maxHours = newCombArray[0]
      return (
        <div class="container">
          <div class="col m-auto">
            {newCombArray.map(item => (
              <div class="row m-2" key={item.appid}>
                <img src={this.createSteamImage(item.appid, item.img_logo_url)} class="img rounded h-50 center" alt="Logo"></img>
                <div class="col">
                  <h2>{item.name}</h2>
                </div>
                <div class="col-2">
                  <span class="badge badge-primary">{item.playtime1} hrs</span>
                  <span class="badge badge-danger"> {item.playtime2} hrs</span>
                  <div class="progress position-relative">
                    <div class="progress-bar bg-info" style={{ width: this.getProgWidth(item.avg,maxHours.avg) }}></div>
                    <span class="justify-content-center d-flex position-absolute w-100 mt-2 font-weight-bold text-secondary">{item.avg}</span>
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

export default SharedSteamGames;