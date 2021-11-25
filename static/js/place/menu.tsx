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

import React from "react";

import { PageChart } from "../chart/types";
import { intl, LocalizedLink } from "../i18n/i18n";

interface MenuCategoryPropsType {
  dcid: string;
  selectCategory: string;
  category: string;
  items: string[];
  categoryDisplayStr: string;
}

class MenuCategory extends React.Component<MenuCategoryPropsType> {
  render(): JSX.Element {
    const dcid = this.props.dcid;
    const selectCategory = this.props.selectCategory;
    const category = this.props.category;
    const items = this.props.items;
    const hrefString =
      category === "Overview"
        ? `/place/${dcid}`
        : `/place/${dcid}?category=${category}`;

    return (
      <li className="nav-item">
        <LocalizedLink
          href={hrefString}
          className={`nav-link ${selectCategory === category ? "active" : ""}`}
          text={this.props.categoryDisplayStr}
        />
        <ul
          className={
            "nav flex-column " + (category !== selectCategory ? "collapse" : "")
          }
          data-parent="#nav-topics"
        >
          <div className="d-block">
            {items.map((topic: string) => {
              return (
                <li className="nav-item" key={topic}>
                  <LocalizedLink
                    href={`${hrefString}#${topic.replace(/ /g, "-")}`}
                    className="nav-link"
                    text={topic}
                  />
                </li>
              );
            })}
          </div>
        </ul>
      </li>
    );
  }
}

interface MenuPropsType {
  categories: { string: string };
  dcid: string;
  pageChart: PageChart;
  selectCategory: string;
}

class Menu extends React.Component<MenuPropsType> {
  render(): JSX.Element {
    const dcid = this.props.dcid;
    const selectCategory = this.props.selectCategory;
    const categories = Object.keys(this.props.pageChart);
    const showOverviewSubmenu = categories.length === 1;
    return (
      <ul id="nav-topics" className="nav flex-column accordion">
        {showOverviewSubmenu ? null : (
          <li className="nav-item">
            <LocalizedLink
              href={`/place/${dcid}`}
              className={`nav-link ${!selectCategory ? "active" : ""}`}
              text={intl.formatMessage({
                id: "header-overview",
                defaultMessage: "Overview",
                description:
                  "Text for header or subheader of Overview charts on place pages.",
              })}
            />
          </li>
        )}
        {categories.map((category: string) => {
          let items: string[] = [];
          if (category === "Overview") {
            items = Object.keys(this.props.pageChart[category]).map(
              (t) => this.props.categories[t]
            );
          } else {
            const topics = Object.keys(this.props.pageChart[category]);
            topics.sort();
            for (const topic of topics) {
              items.push(
                ...this.props.pageChart[category][topic].map((c) => c.title)
              );
            }
          }
          const categoryDisplayStr = this.props.categories[category];
          if (showOverviewSubmenu || category !== "Overview") {
            return (
              <MenuCategory
                key={category}
                dcid={dcid}
                selectCategory={selectCategory}
                category={category}
                items={items}
                categoryDisplayStr={categoryDisplayStr}
              />
            );
          }
        })}
      </ul>
    );
  }
}

export { Menu };