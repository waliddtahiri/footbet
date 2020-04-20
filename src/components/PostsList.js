import React, { Component } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditPost from './EditPost';


class PostsList extends Component {

    constructor(props) {
        super(props);
        this.state = { editPostShow: false, match: '' };
        this.updatePost = this.updatePost.bind(this);
    }

    updatePost(posts, post) {
        this.props.updateMatch(posts, post);
    }

    render() {
        console.log(this.props);
        let editPostClose = () => { this.setState({ editPostShow: false }) };
        const { posts, deleteMatch } = this.props;
        const matchsList = posts.map(post => {
            return (
                <div className="list" key={post._id}>
                    <p>
                        {post.homeTeam} {post.homeScore} - {post.awayScore} {post.awayTeam}
                        <span>
                            <FontAwesomeIcon className="faiconsTrash" icon='trash'
                                onClick={() => { deleteMatch(posts, post._id) }} />
                            <FontAwesomeIcon className="faiconsPen" icon='pen'
                                onClick={() => this.setState({ editPostShow: true, match: post })} />
                        </span>
                    </p>
                    <EditPost post={this.state.match} show={this.state.editPostShow}
                        onClose={(match) => this.updatePost(posts, match)} onHide={editPostClose} />
                </div>
            )
        })
        return (
            <div> {matchsList} </div>
        )
    }
}


export default PostsList;