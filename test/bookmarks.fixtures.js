function makeBookmarksArray(){
  return [
    {
      id: 1,
      title: "Google",
      bookmarkurl: "http://www.google.com",
      description: "Google Bookmark Description",
      rating: 5
    },
    {
      id: 2,
      title: "Thinkful",
      bookmarkurl: "http://www.thinkful.com",
      description: "Thinkful Bookmark Description",
      rating: 5
    },
    {
      id: 3,
      title: "Facebook",
      bookmarkurl: "http://www.facebook.com",
      description: "Facebook Bookmark Description",
      rating: 3
    }
  ]
}
module.exports = {
  makeBookmarksArray
};