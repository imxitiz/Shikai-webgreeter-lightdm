/**
 * @license Shikai
 * Sectionbar/index.jsx
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import {connect} from "react-redux";

import Drag from "../../../../assets/drag.svg";
import Image from "../../../../assets/close.svg";

import {data} from "../../../../lang";

class Sectionbar extends React.Component {
    render() {
        return (<div className="sectionbar">
            <button type="button" id="settings_handle" onDoubleClick={() => {this.props.reset()}} aria-label="Recenter settings">
                <Drag/>
            </button>
            <button type="button" className="text button" onClick={this.props.action}>{data.get(this.props.lang, "settings.behaviour.name")}</button>
            <button type="button" className="text button" onClick={() => this.props.action("style")}>{data.get(this.props.lang, "settings.style.name")}</button>
            <button type="button" className="text button" onClick={() => this.props.action("themes")}>{data.get(this.props.lang, "settings.themes.name")}</button>
            <button type="button" className="button" onClick={this.props.callback} aria-label="Close settings">
                <Image/>
            </button>
        </div>);
    }
}

export default connect((state) => {return {lang: state.settings.behaviour.language};})(Sectionbar);