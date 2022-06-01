import React, { Component } from 'react';

export default class TestComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            version: null,
        };
    }

    componentDidMount() {
        fetch("http://localhost:4040/")
            .then(res => res.json())
            .then((result) => {
                    this.setState({
                        isLoaded: true,
                        version: result.version
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, version } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>
                    Connected with : {version}
                </ul>
            );
        }
    }
}