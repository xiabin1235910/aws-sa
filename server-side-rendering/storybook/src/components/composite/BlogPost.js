import React from "react"

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

class BlogPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blogPost: DataSource.getBlogPost()
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange() {
        this.setState({
            blogPost: DataSource.getBlogPost()
        })
    }

    render() {
        return (
            <TextBlock text={this.state.blogPost} />
        )
    }
}