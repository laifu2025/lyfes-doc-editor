import React, { Component } from "react";
import { Menu, Dropdown } from "antd";

import H1 from "./Pattern/H1";
import H2 from "./Pattern/H2";
import H3 from "./Pattern/H3";
import H4 from "./Pattern/H4";
import H5 from "./Pattern/H5";
import H6 from "./Pattern/H6";

import "./common.css";

const menu = (
  <Menu>
    <Menu.Item>
      <H1 />
    </Menu.Item>
    <Menu.Item>
      <H2 />
    </Menu.Item>
    <Menu.Item>
      <H3 />
    </Menu.Item>
    <Menu.Item>
      <H4 />
    </Menu.Item>
    <Menu.Item>
      <H5 />
    </Menu.Item>
    <Menu.Item>
      <H6 />
    </Menu.Item>
  </Menu>
);

class Paragraph extends Component {
  render() {
    return (
      <Dropdown overlay={menu} trigger={["click"]} overlayClassName="nice-overlay">
        <a className="nice-menu-link" href="#">
          标题
        </a>
      </Dropdown>
    );
  }
}

export default Paragraph;
