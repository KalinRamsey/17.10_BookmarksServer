const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
// const { bookmarks } = require('../../test/bookmarks.fixtures')
const BookmarkService = require('../bookmark-service.js');


const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');

    BookmarkService.getAllBookmarks(knexInstance)
      .then(bookmarksList => {
        res.json(bookmarksList)
      })
      .catch(next);
  })
  /*
  .post(bodyParser, (req, res) => {
    const { title, url, rating=1 } = req.body;

    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }
    if (!url) {
      logger.error('URL is required');
      return res
        .status(400)
        .send('URL is required');
    }
    
    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      rating
    }

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark);
  })
  */

bookmarkRouter
  .route('/bookmarks/:bookmark_id')
  .get((req, res, next) => {
    const { id } = req.params;
    // const bookmark = bookmarks.find(b => b.id == id);

    const knexInstance = req.app.get('db');

    BookmarkService.getById(knexInstance, req.params.bookmark_id)
      .then(bookmark => {
        if(!bookmark){
          logger.error(`Bookmark with id ${id} not found`);
          return res
            .status(404)
            .json({
              error: { message: `Bookmark doesn't exist` }
            });
        }
        res.json(bookmark);
      })
      .catch(next);
  })
  /*
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

    if (bookmarkIndex === -1){
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);

    res
      .status(204)
      .end();
  })
  */

module.exports = bookmarkRouter;