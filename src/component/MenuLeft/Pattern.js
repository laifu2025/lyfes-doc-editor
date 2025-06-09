import React, { Component } from "react";
import { Menu, Dropdown } from "antd";

import Bold from "./Pattern/Bold";
import Code from "./Pattern/Code";
import Del from "./Pattern/Del";
import Italic from "./Pattern/Italic";
import Underline from "./Pattern/Underline";
import H1 from "./Pattern/H1";
import H2 from "./Pattern/H2";
import H3 from "./Pattern/H3";
import H4 from "./Pattern/H4";
import H5 from "./Pattern/H5";
import H6 from "./Pattern/H6";
import Link from "./Pattern/Link";
import Form from "./Pattern/Form";
import Image from "./Pattern/Image";
import Format from "./Pattern/Format";
import LinkToFoot from "./Pattern/LinkToFoot";
import Font from "./Pattern/Font";
import InlineCode from "./Pattern/InlineCode";
import Quote from "./Pattern/Quote";
import OrderedList from "./Pattern/OrderedList";
import UnorderedList from "./Pattern/UnorderedList";
import HorizontalRule from "./Pattern/HorizontalRule";
import Table from "./Pattern/Table";
import InlineMath from "./Pattern/InlineMath";
import MathBlock from "./Pattern/MathBlock";

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

    <Menu.Divider />

    <Menu.Item>
      <Del />
    </Menu.Item>
    <Menu.Item>
      <Bold />
    </Menu.Item>
    <Menu.Item>
      <Italic />
    </Menu.Item>
    <Menu.Item>
      <Underline />
    </Menu.Item>
    <Menu.Item>
      <Code />
    </Menu.Item>
    <Menu.Item>
      <InlineCode />
    </Menu.Item>

    <Menu.Divider />

    <Menu.Item>
      <Quote />
    </Menu.Item>
    <Menu.Item>
      <OrderedList />
    </Menu.Item>
    <Menu.Item>
      <UnorderedList />
    </Menu.Item>
    <Menu.Item>
      <HorizontalRule />
    </Menu.Item>
    <Menu.Item>
      <Table />
    </Menu.Item>

    <Menu.Divider />

    <Menu.Item>
      <InlineMath />
    </Menu.Item>
    <Menu.Item>
      <MathBlock />
    </Menu.Item>

    <Menu.Divider />

    <Menu.Item>
      <Link />
    </Menu.Item>
    <Menu.Item>
      <Form />
    </Menu.Item>
    <Menu.Item>
      <Image />
    </Menu.Item>
    <Menu.Item>
      <Font />
    </Menu.Item>

    <Menu.Divider />

    <Menu.Item>
      <LinkToFoot />
    </Menu.Item>
    <Menu.Item>
      <Format />
    </Menu.Item>
  </Menu>
);

class Pattern extends Component {
  render() {
    return (
      <Dropdown overlay={menu} trigger={["click"]} overlayClassName="nice-overlay">
        <a id="nice-menu-pattern" className="nice-menu-link" href="#">
          格式
        </a>
      </Dropdown>
    );
  }
}

export default Pattern;
