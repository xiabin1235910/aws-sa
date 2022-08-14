import React from "react";
import hoiseNonReactStatic from "hoist-non-react-statics";

// Mock Datasource
const DataSource = {
    getComments() {
        return [
            { id: 1, name: '111' },
            { id: 2, name: '222' },
        ]
    },
    getBlogPost() {
        return 'blogpost'
    },
    addChangeListener(fn) {
        return;
    },
    removeChangeListener(fn) {
        return;
    }
}

export default function withSubscription(WrappedComponent, selectData) {

    class WithSubs extends React.Component {
        constructor(props) {
            super(props)
            this.handleChange = this.handleChange.bind(this)
            this.state = {
                data: selectData()
            }
        }

        componentDidMount() {
            DataSource.addChangeListener(this.handleChange)
        }

        componentWillUnmount() {
            DataSource.removeChangeListener(this.handleChange)
        }

        handleChange() {
            this.setState({
                data: DataSource[selectData]()
            })
        }

        render() {
            return <WrappedComponent data={this.state.data} {...this.props} />
        }
    }

    hoiseNonReactStatic(WithSubs, WrappedComponent)

    return WithSubs;
}