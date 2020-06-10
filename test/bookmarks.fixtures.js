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

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    rating: 1,
    bookmarkurl: 'https://www.2hax4u.com',
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  const expectedBookmark = {
    ...maliciousBookmark,
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousBookmark,
    expectedBookmark,
  }
}
module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark
};