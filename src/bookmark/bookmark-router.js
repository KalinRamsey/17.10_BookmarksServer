const path = require('path');
const express = require('express')
const xss = require('xss')
const BookmarkService = require('../bookmark-service.js');


const bookmarkRouter = express.Router()
const jsonParser = express.json()
const apiToken = process.env.API_TOKEN;

const sanitizeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: xss(bookmark.url),
  description: xss(bookmark.description),
  rating: bookmark.rating
})

bookmarkRouter
  .route('/api/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');

    BookmarkService.getAllBookmarks(knexInstance)
      .then(bookmarksList => {
        res.json(bookmarksList.map(sanitizeBookmark))
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const newBookmark = { title, url, description, rating}

    for (const [key, value] of Object.entries(newBookmark))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    
    BookmarkService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl,`/${bookmark.id}`))
          .json(sanitizeBookmark(bookmark))
      })
      .catch(next)
  })

bookmarkRouter
  .route('/api/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    BookmarkService.getById(
      req.app.get('db'),
      req.params.bookmark_id
    )
      .then(bookmark => {
        if (!bookmark) {
          return res
            .status(404)
            .json({
              error: { message: `Bookmark doesn't exist` }
            })
        }
        res.bookmark = bookmark
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(sanitizeBookmark(res.bookmark))
  })
  .delete((req, res, next) => {
    BookmarkService.deleteBookmark(
      req.app.get('db'),
      req.params.bookmark_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, description, url, rating } = req.body;
    const bookmarkToUpdate = { title, description, url, rating }

    const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length;
    if (numberOfValues === 0){
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'url', 'rating' or 'description'`
        }
      })
    }

    BookmarkService.updateBookmark(
      req.app.get('db'),
      req.params.bookmark_id,
      bookmarkToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = bookmarkRouter;