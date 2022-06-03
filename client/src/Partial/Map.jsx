/* global app */
import React from 'react';

export default class extends React.Component {
  routeHandler = null;

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.routeHandler = app.getModule('maps').module.route(this.mapRef.current);
  }

  componentDidUpdate() {
    this.routeHandler.update();
  }

  componentWillUnmount() {
    this.unbindScroll();
  }

  unbindScroll() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  render() {
    const {
      className = 'route mapRoute',
      route,
    } = this.props;

    return (
      <>
        <div
          id="route-map"
          className={className}
          ref={this.mapRef}
          data-route={route}
        >
        </div>
      </>
    );
  }
}
