import { gql } from "@apollo/client";
import { getData } from "../helpers/Storage";

export default class UploadAdapter {
	constructor(props) {
		this.loader = props;
		this.storage = getData();
		this.url = `${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API_PATH}`;
		this.public_url = `${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API_PATH_PUBLIC}`
		this.query = gql`
			mutation($file: Upload!) {
				addMedia(file: $file) {
				id
				path
				filename
				filename_original
				mimetype
				}
			}
		`;
	}

	upload() {
		return new Promise((resolve, reject) => {
			this._initRequest();
			this._initListeners(resolve, reject);
			this._sendRequest();
		});
	}

	abort() {
		if (this.xhr) {
			this.xhr.abort();
		}
	}

	_initRequest() {
		const xhr = (this.xhr = new XMLHttpRequest());

		xhr.open("POST", this.url, true);
		xhr.responseType = "json";
		// xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Authorization", this.storage && this.storage.token ? `Bearer ${this.storage.token}` : "");
	}

	_initListeners(resolve, reject) {
		const xhr = this.xhr;
		const loader = this.loader;
		const genericErrorText = `Couldn't upload file: ${loader.file.name}.`;

		xhr.addEventListener("error", () => reject(genericErrorText));
		xhr.addEventListener("abort", () => reject());
		xhr.addEventListener("load", () => {
			const response = xhr.response;
			if (!response || response.error) {
				return reject(
					response && response.error ? response.error.message : genericErrorText
				);
			}

			resolve({
				default: `${this.public_url}/${response.data.addMedia.filename}`,
			});
		});

		if (xhr.upload) {
			xhr.upload.addEventListener("progress", (evt) => {
				if (evt.lengthComputable) {
					loader.uploadTotal = evt.total;
					loader.uploaded = evt.loaded;
				}
			});
		}
	}

	_sendRequest() {
		const data = new FormData();

		this.loader.file.then((result) => {
			data.append("operations", JSON.stringify({"query":"mutation addMedia($file:Upload!) {\n  addMedia(file: $file) { id, path, filename, filename_original, mimetype } \n}"}));
			data.append("map", JSON.stringify({"0": ["variables.file"]}));
			data.append("0", result);
			
			this.xhr.send(data);
		});
	}
}
