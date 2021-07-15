import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: '',
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const graphqlCommand = {
      query: `
      query PostQuery($postId: String!) {
        post(id: $postId ) {          
          title
          creator {
            name
          }
          content
          createdAt
          imageUrl
        }
      }      
      `,
      variables: {
        postId: postId,
      },
    };
    fetch('http://localhost:8080/graphql', {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(graphqlCommand),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData.data.post.imageUrl);
        if (resData.errors && resData.errors[0].status === 404) {
          throw new Error('Could not find the post');
        }

        if (resData.errors) {
          throw new Error('Issue occured while retrieving the post');
        }

        this.setState({
          title: resData.data.post.title,
          author: resData.data.post.creator.name,
          image: 'http://localhost:8080/' + resData.data.post.imageUrl,
          date: new Date(resData.data.post.createdAt).toLocaleDateString(
            'en-US'
          ),
          content: resData.data.post.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
