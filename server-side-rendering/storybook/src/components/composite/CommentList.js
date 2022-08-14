import React from "react"

// Mock Datasource
const DataSource = {
    getComments() {
        return [
            { id: 1, name: '111' },
            { id: 2, name: '222' },
        ]
    },
    addChangeListener(fn) {
        return;
    },
    removeChangeListener(fn) {
        return;
    }
}

class CommentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: DataSource.getComments()
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange() {
        this.setState({
            comments: DataSource.getComments()
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.comments.map((comment) => (
                        <Comment commnet={comment} key={comment.id} />
                    ))
                }
            </div>
        )
    }
}