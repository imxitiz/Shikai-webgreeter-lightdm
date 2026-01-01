/**
 * @license Shikai
 * LoginWindow/index.jsx
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Draggable from "react-draggable";

import Sidebar from "./Sidebar";
import Userbar from "./Userbar";

const window_height = 500;
const window_width = 850;

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

export default class LoginWindow extends React.Component {
    constructor(props) {
        super(props);
        const availW = (typeof screen !== 'undefined' && screen.availWidth) ? screen.availWidth : (window.innerWidth || 800);
        const availH = (typeof screen !== 'undefined' && screen.availHeight) ? screen.availHeight : (window.innerHeight || 600);
        const bounds = {left: -((availW/2) - (window_width/2)), right: ((availW/2) - (window_width/2)), top: -((availH/2) - (window_height/2)), bottom: ((availH/2) - (window_height/2))};

        const saved = {x: 0, y: 0};
        try {
            const item = localStorage.getItem("LoginDrag");
            if (item) {
                const parsed = JSON.parse(item);
                saved.x = Number(parsed.x) || 0;
                saved.y = Number(parsed.y) || 0;
            }
        } catch (e) { console.warn('LoginDrag read failed, defaulting', e); }
        // Clamp into bounds to avoid off-screen state
        saved.x = clamp(saved.x, bounds.left, bounds.right);
        saved.y = clamp(saved.y, bounds.top, bounds.bottom);

        if (!localStorage.getItem("LoginDrag")) {localStorage.setItem("LoginDrag", JSON.stringify({x: saved.x, y: saved.y}))}
        this.state = {data: saved};
        this.dragEvent = this.dragEvent.bind(this);
        this.dragStop = this.dragStop.bind(this);
    }

    dragEvent(_, _data) { this.setState({data: {x: Number(_data.x), y: Number(_data.y)}}); }

    dragStop(_, data) {
        try {
            const availW = (typeof screen !== 'undefined' && screen.availWidth) ? screen.availWidth : (window.innerWidth || 800);
            const availH = (typeof screen !== 'undefined' && screen.availHeight) ? screen.availHeight : (window.innerHeight || 600);
            const left = -((availW/2) - (window_width/2));
            const right = ((availW/2) - (window_width/2));
            const top = -((availH/2) - (window_height/2));
            const bottom = ((availH/2) - (window_height/2));
            const x = clamp(Number(data.x), left, right);
            const y = clamp(Number(data.y), top, bottom);
            localStorage.setItem("LoginDrag", JSON.stringify({x, y}));
            this.setState({data: {x, y}});
        } catch (e) {
            console.warn('Failed to save LoginDrag', e);
            localStorage.setItem("LoginDrag", JSON.stringify({x: 0, y: 0}));
            this.setState({data: {x:0, y:0}});
        }
    }
    render() {
        const availW = (typeof screen !== 'undefined' && screen.availWidth) ? screen.availWidth : (window.innerWidth || 800);
        const availH = (typeof screen !== 'undefined' && screen.availHeight) ? screen.availHeight : (window.innerHeight || 600);
        const bounds = {left: -((availW/2) - (window_width/2)), right: ((availW/2) - (window_width/2)), top: -((availH/2) - (window_height/2)), bottom: ((availH/2) - (window_height/2))};
        return (<Draggable axis="both" handle="#login_handle" bounds={bounds} position={this.state.data} onDrag={this.dragEvent} onStop={this.dragStop}>
            <div id="login_drag" className="no-wall-change">
                <div style={{borderTopLeftRadius: (this.state.data.x === bounds.left || this.state.data.y === bounds.top) ? "0px" : null, borderTopRightRadius: (this.state.data.x === bounds.right || this.state.data.y === bounds.top) ? "0px" : null, borderBottomLeftRadius: (this.state.data.x === bounds.left || this.state.data.y === bounds.bottom) ? "0px" : null, borderBottomRightRadius: (this.state.data.x === bounds.right || this.state.data.y === bounds.bottom) ? "0px" : null}}>
                    <Sidebar/>
                    <Userbar action={() => {
                        document.getElementById("login_drag").style.transition = "transform 400ms";
                        this.dragEvent(null, {x: 0, y: 0}); this.dragStop(null, {x: 0, y: 0});
                        setTimeout(() => {document.getElementById("login_drag").style.transition = "";}, 400);
                    }}/>
                </div>
            </div>
        </Draggable>);
    }
}
