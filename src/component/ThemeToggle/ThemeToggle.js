import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Tooltip } from "antd";
import classnames from "classnames";
import "./ThemeToggle.css";

@inject("view")
@observer
class ThemeToggle extends Component {
    handleToggleTheme = () => {
        const { view } = this.props;
        view.setDarkTheme(!view.isDarkTheme);
    };

    render() {
        const { view } = this.props;
        const { isDarkTheme } = view;

        return (
            <div className="theme-toggle">
                <Tooltip
                    title={isDarkTheme ? "切换到亮色模式" : "切换到暗色模式"}
                    placement="bottom"
                >
                    <div
                        className={classnames("theme-toggle-button", { "dark": isDarkTheme })}
                        onClick={this.handleToggleTheme}
                    >
                        <div className="theme-icon">
                            {isDarkTheme ? (
                                // 月亮图标
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z"
                                        fill="currentColor"
                                    />
                                </svg>
                            ) : (
                                // 太阳图标
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                                    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
                                    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
                                    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
                                    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            )}
                        </div>
                    </div>
                </Tooltip>
            </div>
        );
    }
}

export default ThemeToggle; 