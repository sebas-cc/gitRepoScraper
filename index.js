const PORT = process.env.PORT || 8000

const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()

app.get('/:userName', (req, res) => {
    const user = req.params.userName
    axios(`https://github.com/${user}?tab=repositories`).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const repoList = []

        $('.col-10', html).each(function(){
            const title = $(this).find('.wb-break-all a').text().replace('\n', '')
            const url = "https://github.com" + $(this).find('a').attr('href')
            repoList.push({
                title,
                url
            })
        })
        res.json(repoList)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Running on PORT: ${PORT}`))