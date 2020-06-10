const express = require('express')
const xss = require('xss')
const BookmarkService = require('../bookmark-service.js');


const bookmarkRouter = express.Router()
const jsonParser = express.json()
const apiToken = process.env.API_TOKEN;

const sanitizeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  bookmarkurl: xss(bookmark.bookmarkurl),
  description: xss(bookmark.description),
  rating: bookmark.rating
})

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');

    BookmarkService.getAllBookmarks(knexInstance)
      .then(bookmarksList => {
        res.json(bookmarksList.map(sanitizeBookmark))
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, bookmarkurl, description, rating } = req.body;
    const newBookmark = { title, bookmarkurl, description, rating}

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
          .location(`/bookmarks/${bookmark.id}`)
          .json(sanitizeBookmark(bookmark))
      })
      .catch(next)
  })

bookmarkRouter
  .route('/bookmarks/:bookmark_id')
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

module.exports = bookmarkRouter;