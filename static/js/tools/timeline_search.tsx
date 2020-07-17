/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from "react";
import axios from "axios";
import { updateUrlPlace } from "./timeline_util";

let ac: google.maps.places.Autocomplete;

interface ChipPropType {
  placeName: string;
  placeId: string;
  deleteChip: (placeName: string, placeString: string) => void;
}

class Chip extends Component<ChipPropType, {}> {
  render() {
    return (
      <span className="mdl-chip mdl-chip--deletable">
        <span className="mdl-chip__text">{this.props.placeName}</span>
        <button
          className="mdl-chip__action"
          onClick={() =>
            this.props.deleteChip(this.props.placeName, this.props.placeId)
          }
        >
          <i className="material-icons">cancel</i>
        </button>
      </span>
    );
  }
}

interface SearchBarStateType {
  placeList: string[][];
}

class SearchBar extends Component<{}, SearchBarStateType> {
  constructor(props) {
    super(props);
    this.getPlaceAndRender = this.getPlaceAndRender.bind(this);
    this.deleteChip = this.deleteChip.bind(this);
    this.state = {
      placeList: [],
    };
  }
  componentDidMount() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    const options = {
      types: ["(regions)"],
      fields: ["place_id", "name", "types"],
    };
    const acElem = document.getElementById("ac") as HTMLInputElement;
    ac = new google.maps.places.Autocomplete(acElem, options);
    ac.addListener("place_changed", this.getPlaceAndRender);
  }

  getPlaceAndRender() {
    // Get the place details from the autocomplete object.
    const place = ac.getPlace();
    axios
      .get(`/api/placeid2dcid/${place.place_id}`)
      .then((resp) => {
        if (updateUrlPlace(resp.data, true)) {
          this.state.placeList.push([place.name.split(",")[0], resp.data]);
        }
      })
      .catch(() => {
        alert("Sorry, but we don't have any data about " + name);
      });
    const acElem = document.getElementById("ac") as HTMLInputElement;
    acElem.value = "";
    acElem.setAttribute("placeholder", "Search for another place");
  }

  deleteChip(placeName, placeId) {
    updateUrlPlace(placeId, false);
    this.state.placeList.splice(
      this.state.placeList.indexOf([placeName, placeId]),
      1
    );
  }

  render() {
    return (
      <div id="location-field">
        <div id="search-icon"></div>
        <span id="place-list">
          {this.state.placeList.map((place) => (
            <Chip
              placeName={place[0]}
              placeId={place[1]}
              key={place[0]}
              deleteChip={this.deleteChip}
            ></Chip>
          ))}
          <input
            id="ac"
            placeholder="Enter a country, state, county or city to get started"
            type="text"
          />
        </span>
      </div>
    );
  }
}
export { SearchBar };