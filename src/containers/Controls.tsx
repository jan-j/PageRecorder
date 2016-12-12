import * as React from "react";
import { connect } from "react-redux";
import { start, stop } from "../actions/index";

const mapStateToProps = function (state) {
    return {
        prop1: "val1"
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        start: () => dispatch(start()),
        stop: () => dispatch(stop()),
    };
};

const Controls = () => (
    <div className="controls">
        <button className="button button-record" title="Start recording" onClick={ start } />
        <button className="button button-stop" title="Stop recording" onClick={ stop } />
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Controls);