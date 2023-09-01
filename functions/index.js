const PORT = 8001

const axios = require('axios')
const cheerio = require('cheerio')
const { Router } = require('express')
const express = require('express')
const serverless = require('serverless-http')
const cors = require('cors')

const app = express()
const router = express.Router()
app.use(cors({
    origin: '*',
    methods: ['GET'],
}))

router.get('/', (req, res) => {
    res.json({
        Welcome: "to gitRepoScraper",
        Description: "to use this API you'll only need to add the username of a github account to the URL and then you'll see all the public repositories in that account",
        Example: "https://gitreposcraper-sebas-cc.netlify.app/sebas-cc"
    })
})

router.get('/:userName', (req, res) => {
    const user = req.params.userName
    axios(`https://github.com/${user}?tab=repositories`).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const repoList = []

        $('.col-10', html).each(function(){
            const title = $(this).find("[itemprop='name codeRepository']").text().replace('\n', '').replace(/\s+/g,' ').trim()
            const url = "https://github.com" + $(this).find("[itemprop='name codeRepository']").attr('href')
            const programmingLanguage = $(this).find("[itemprop='programmingLanguage']").text()
            const description = $(this).find("[itemprop='description']").text().replace('\n', '').replace(/\s+/g,' ').trim()
            repoList.push({
                title,
                url,
                programmingLanguage,
                description
            })
        })
        res.json(repoList)
    }).catch(err => console.log(err))
})

app.use('/', router)
module.exports.handler = serverless(app)

app.listen(PORT, () => console.log(`Running on PORT: ${PORT}`))