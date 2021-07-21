import { React, useState, Fragment } from 'react'
import { gql, useMutation } from '@apollo/client'

export default function UploadFile(props) {
	const { name, inputRef, value, handleOnChange, callback } = props

	const [mediaId, setMediaId] = useState(value)

	const UPLOAD = gql`
		mutation($file: Upload!) {
			addMedia(file: $file) {
				id,
				path,
				filename, 
				filename_original,
				mimetype
			}
		}
	`

	const [mutate, { loading, error }] = useMutation(UPLOAD, {
		onCompleted: (data) => {
			callback({ success: true, ...data.addMedia })
			setMediaId(data.addMedia.id)
			handleOnChange(data.addMedia.id)
		},
		onError: (error) => {
			console.log(error)
		}
	});
	
	const onChange = ({
		target: {
			validity,
			files: [file]
		}
	}) => {
		if(file && file.size > 5242880){
			callback({ success: false, message: `Arquivo ${file.name} ultrapassou o tamanho máximo de 5MB permitido` })
		} else {
			if(validity.valid)
				mutate({ variables: { file } })
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{JSON.stringify(error, null, 2)}</div>;

	return (
		<Fragment>
			<input 
			  type="file" 
			  onChange={onChange} 
			  className="btn-upload" />
			<input 
				type="hidden" 
				ref={inputRef}
				name={name} 
				value={mediaId} />
		</Fragment>
	)
}