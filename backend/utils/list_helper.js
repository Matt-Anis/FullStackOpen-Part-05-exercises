const _ = require('lodash')

const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null
    }

    return blogs.reduce((favorite, blog) => {
        return blog.likes > favorite.likes ? blog : favorite
    }, blogs[0])
}

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return null
    }
    const authors = _.countBy(blogs, 'author')
    const maxAuthor = _.maxBy(_.keys(authors), author => authors[author])
    return {
        author: maxAuthor,
        blogs: authors[maxAuthor]
    }
}

const mostLikes = blogs => {
    if (blogs.length === 0) {
        return null
    }

    const likesByAuthor = _.groupBy(blogs, 'author')
    const totalLikesByAuthor = _.mapValues(likesByAuthor, authorBlogs => {
        return authorBlogs.reduce((sum, blog) => sum + blog.likes, 0)
    })
    
    const maxAuthor = _.maxBy(_.keys(totalLikesByAuthor), author => totalLikesByAuthor[author])
    return {
        author: maxAuthor,
        likes: totalLikesByAuthor[maxAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}