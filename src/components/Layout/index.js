/* eslint-disable */
import { Component } from 'react';
import PropTypes from 'prop-types';
import DOM from './layout';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.view = DOM;
    }

    render() {
        return this.view(this.props);
    }
}

Layout.defaultProps = {
    type: 'normal'
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    type: PropTypes.string,
};

export default Layout;
