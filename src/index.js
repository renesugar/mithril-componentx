import merge from "lodash/merge";
import clone from "lodash/clone";
import isObject from "lodash/isObject";
import isFunction from "lodash/isFunction";
import classNames from "classnames";
import {getVnode, getAttrs, validateComponent} from "./helpers.js";

let base = {
    getDefaultAttrs () {
        return {
            dom: {
                tagName: "div"
            }
        };
    },
    getClassList (attrs) {
        return [];
    },
    validateAttrs (attrs) {}
};

export default (struct) => {
    let component = merge(clone(struct.base || base), struct);
    validateComponent(component);

    let originalView = component.view.originalView || component.view;

    let ctrlReturn = {};
    if (component.onremove) {
        ctrlReturn.onunload = component.onremove.bind(component);
    }

    component.controller = function (attrs, ...children) {
        let vnode = getVnode(attrs, children, component);
        if (component.oninit) {
            component.oninit(vnode);
        }
        return ctrlReturn;
    };

    component.view = function (ctrl, attrs, ...children) {
        let vnode = getVnode(attrs, children, component);

        this.validateAttrs(vnode.attrs);

        return originalView.call(component, vnode);
    };

  component.view.originalView = originalView;

    return component;
};
