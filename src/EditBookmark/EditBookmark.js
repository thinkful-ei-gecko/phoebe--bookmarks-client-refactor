import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import './EditBookmark.css';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {

  static propTypes = {
    match: PropTypes.shape({
      prarams: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '', 
    url: '', 
    description: '', 
    rating: '',
  }

  handleChangeTitle = e => {
    this.setState({ title: e.target.value })
  }

  handleChangeUrl = e => {
    this.setState({ url: e.target.value })
  }

  handleChangeDescription = e => {
    this.setState({ description: e.target.value })
  }

  handleChangeRating = e => {
    this.setState({ rating: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()

    const { title, url, description, rating } = this.state;
    const bookmark = { title, url, description, rating }
    this.setState({ error: null })

    fetch(config.API_ENDPOINT, {
      method: 'PATCH', 
      body: JSON.stringify(bookmark), 
      headers: {
        'contentType': 'application/json', 
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
        return res.json()
      })
      .then(responseData => {
        this.context.updateBookmark(responseData)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  }

  componentDidMount() {
    const { bookmarkId } = this.props.match.params;
    console.log(bookmarkId)
    
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => Promise.reject(error))
      }
      return res.json()
    })
    .then(responseData => {
      console.log(responseData);
      this.setState({
        id: responseData.id,
        title: responseData.title,
        url: responseData.url, 
        description: responseData.description, 
        rating: responseData.rating
      })
    })
    .catch(error => {
      console.error(error)
      this.setState({ error })
    })
  }

  render() {
    const { error, title, url, description, rating } = this.state;
    console.log(title);
    return(
      <section className='EditBookmark'>
        <h2>Edit bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>

          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input 
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              value={title}
              onChange={this.handleChangeTitle}
              required
            />
          </div>

          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              title='url'
              placeholder='https://www.great-website.com/'
              value={url}
              onChange={this.handleChangeUrl}
              required
            />
          </div>

          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={description}
              onChange={this.handleChangeDescription}
            />
          </div>

          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
            </label>
            <input
              type='number'
              title='rating'
              id='rating'
              defaultValue={rating}
              onChange={this.handleChangeRating}
              min='1'
              max='5'
              required
            />
          </div>

          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    )
  }
};

export default EditBookmark;