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

import { PlaceInfo } from "../map/context";
import { shouldShowBoundary } from "./chart";

test("shouldShowBoundary", () => {
  const basePlaceInfo: PlaceInfo = {
    enclosedPlaceType: "County",
    enclosedPlaces: [],
    enclosingPlace: {
      dcid: "country/USA",
      name: "United States of America",
    },
    parentPlaces: [],
    selectedPlace: {
      dcid: "country/USA",
      name: "United States of America",
      types: ["Country"],
    },
  };
  expect(shouldShowBoundary(basePlaceInfo)).toEqual(false);
  const placeInfoWithBoundary = {
    ...basePlaceInfo,
    enclosedPlaceType: "State",
  };
  expect(shouldShowBoundary(placeInfoWithBoundary)).toEqual(true);
});