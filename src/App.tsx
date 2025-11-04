import React from 'react'
import { Cloudinary } from '@cloudinary/url-gen'
import { auto } from '@cloudinary/url-gen/actions/resize'
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity'
import { AdvancedImage } from '@cloudinary/react'

const App = () => {
	const cld = React.useMemo(() => new Cloudinary({ cloud: { cloudName: 'dx83p4455' } }), [])

	const img = React.useMemo(
		() =>
			cld
				.image('cld-sample-5')
				.format('auto')
				.quality('auto')
				.resize(auto().gravity(autoGravity()).width(500).height(500)),
		[cld],
	)

	return <AdvancedImage cldImg={img} />
}

export default App
