
const placeholder = document.getElementById('placeholder')

const renderChannels = async(channels) => {

	const html = channels.map(channel => `
		<li data-id="${channel.id}">${channel.name} 
			<ul>
				<li>Category: ${channel.category}</li>
				<li>Subscription: ${channel.subscription}</li>
			</ul>
		</li>
	`).join('')	
	
	placeholder.innerHTML = html
}

placeholder.addEventListener('click', async(e)=> {
	const target = e.target
	if(target.tagName === 'LI') {
		const channel = target.getAttribute('data-id')
		await axios.delete(`/api/channels/${channel}`)
	}
})


const init = async() => {
	try {
		const channels = (await axios.get('/api/channels')).data
		renderChannels(channels)
		
	} catch (error) {
		console.log(error)
	}
}

init()