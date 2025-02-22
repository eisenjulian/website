/**
 * Copyright 2021 Google LLC
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

/**
 * Component for rendering a block.
 */

import React from "react";

import { NamedTypedPlace } from "../shared/types";
import { randDomId } from "../shared/util";
import { BarTile } from "./bar_tile";
import { BivariateTile } from "./bivariate_tile";
import { DEFAULT_PAGE_PLACE_TYPE } from "./constants";
import { HighlightTile } from "./highlight_tile";
import { LineTile } from "./line_tile";
import { MapTile } from "./map_tile";
import { RankingTile } from "./ranking_tile";
import { ScatterTile } from "./scatter_tile";
import { StatVarProvider } from "./stat_var_provider";
import { TileConfig } from "./topic_config";

export interface BlockPropType {
  id: string;
  place: NamedTypedPlace;
  enclosedPlaceType: string;
  title?: string;
  description: string;
  leftTiles: TileConfig[];
  rightTiles: TileConfig[];
  statVarProvider: StatVarProvider;
}

export function Block(props: BlockPropType): JSX.Element {
  return (
    <section
      className={`block subtopic ${props.title ? "" : "notitle"}`}
      id={props.id}
    >
      {props.title && <h3>{props.title}</h3>}
      {props.description && <p className="block-desc">{props.description}</p>}
      <div className="block-body row">
        {props.leftTiles && (
          <div className="left-tiles col-6">
            {renderTiles(props.leftTiles, props)}
          </div>
        )}
        {props.rightTiles && (
          <div className="right-tiles col-6">
            {renderTiles(props.rightTiles, props)}
          </div>
        )}
      </div>
    </section>
  );
}

function renderTiles(tiles: TileConfig[], props: BlockPropType): JSX.Element {
  const tilesJsx = tiles.map((tile) => {
    const id = randDomId();
    const placeType =
      props.place && props.place.types
        ? props.place.types[0]
        : DEFAULT_PAGE_PLACE_TYPE;
    const enclosedPlaceType =
      tile.containedPlaceTypes && tile.containedPlaceTypes[placeType]
        ? tile.containedPlaceTypes[placeType]
        : props.enclosedPlaceType;
    switch (tile.type) {
      case "HIGHLIGHT":
        return (
          <HighlightTile
            key={id}
            description={tile.description}
            place={props.place}
            statVarMetadata={props.statVarProvider.getMetadata(
              tile.statVarKey[0]
            )}
          />
        );
      case "MAP":
        return (
          <MapTile
            key={id}
            id={id}
            title={tile.title}
            place={props.place}
            enclosedPlaceType={enclosedPlaceType}
            statVarMetadata={props.statVarProvider.getMetadata(
              tile.statVarKey[0]
            )}
          />
        );
      case "LINE":
        return (
          <LineTile
            key={id}
            id={id}
            title={tile.title}
            place={props.place}
            statVarMetadata={props.statVarProvider.getMetadataList(
              tile.statVarKey
            )}
          />
        );
      case "RANKING":
        return (
          <RankingTile
            key={id}
            id={id}
            title={tile.title}
            place={props.place}
            enclosedPlaceType={enclosedPlaceType}
            statVarMetadata={props.statVarProvider.getMetadataList(
              tile.statVarKey
            )}
            rankingMetadata={tile.rankingMetadata}
          />
        );
      case "BAR":
        return (
          <BarTile
            key={id}
            id={id}
            title={tile.title}
            place={props.place}
            enclosedPlaceType={enclosedPlaceType}
            statVarMetadata={props.statVarProvider.getMetadataList(
              tile.statVarKey
            )}
          />
        );
      case "SCATTER":
        return (
          <ScatterTile
            key={id}
            id={id}
            title={tile.title}
            place={props.place}
            enclosedPlaceType={enclosedPlaceType}
            statVarMetadata={props.statVarProvider.getMetadataList(
              tile.statVarKey
            )}
          />
        );
      case "BIVARIATE":
        return (
          <BivariateTile
            key={id}
            id={id}
            title={tile.title}
            place={props.place}
            enclosedPlaceType={enclosedPlaceType}
            statVarMetadata={props.statVarProvider.getMetadataList(
              tile.statVarKey
            )}
          />
        );
      case "DESCRIPTION":
        return (
          <p key={id} className="description-tile">
            {tile.description}
          </p>
        );
      default:
        console.log("Tile type not supported:" + tile.type);
    }
  });
  return <>{tilesJsx}</>;
}
