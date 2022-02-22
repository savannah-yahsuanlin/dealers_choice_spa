const express = require('express')
const path = require('path')
const {Sequelize, STRING, ENUM, VIRTUAL, INTEGER} = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/spa')

const app = express()


const youTubeChannels = sequelize.define('channels', {
	name: {
		type: STRING,
		unique: true
	},
	category: {
		type: ENUM('education', 'news'),
		defaultValue: 'news'
	},
	subscription: {
		type: INTEGER
	},
	isPopular: {
		type: VIRTUAL,
		get: function() {
			return this.subscription > 1000
		}
	}
})


app.use('/src', express.static(path.join(__dirname, 'src')))
app.use(express.urlencoded({extended: false}))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))



app.get('/api/channels', async(req, res, next) => {
	try {
		res.send(await youTubeChannels.findAll())
	} catch (error) {
		next(error)
	}
})

app.delete('/api/channels/:id', async(req, res, next) => {
	try {
		const channel = await youTubeChannels.findByPk(req.params.id)
		await channel.destroy()
		res.sendStatus(204)
	} catch (error) {
		next(error)
	}
})

const setUp = async() => {
	try {
		await sequelize.sync({force: true})

		await youTubeChannels.create({name: 'fullstack', category: 'education', subscription: 4000})
		await youTubeChannels.create({name: 'bbc', category: 'news', subscription: 500})
		await youTubeChannels.create({name: 'cnn', category: 'news', subscription: 100})
	
		const port = process.env.PORT || 3000
		app.listen(port, ()=> {console.log(`Listening on port ${port}`)})

	} catch (error) {
		console.log(error)
	}
}

setUp()