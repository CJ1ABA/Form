import React, { useRef, useState } from 'react'
import styles from './form.module.sass'
import clip from '../img/clip.png'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import LoadingButton from '@mui/lab/LoadingButton'

export function Form() {
	const formData = new FormData()
	const refTextInput = useRef()
	const refMultiInput = useRef()
	const refSingleInput = useRef()
	const [loading, setLoading] = useState(false)
	const [formFilled, setFormFilled] = useState(false)
	const [objectName, setObjectName] = useState(null)
	const [fileName, setFileName] = useState(null)
	const [filesName, setFilesName] = useState([])
	const [readFiles, setReadFiles] = useState(null)
	const [readFile, setReadFile] = useState(null)

	function checkInputs() {
		(refMultiInput.current?.value || refSingleInput.current?.value || refTextInput.current?.value)
			?
			setFormFilled(true)
			:
			setFormFilled(false)
	}

	function setFile(e) {
		if (e.target.files.length) {
			const downloadedFile = []
			const file = e.target.files
			const reader = new FileReader()
			reader.readAsDataURL(file.item(0))
			reader.onload = async function () {
				downloadedFile.push({
					data: file.item(0),
					name: file.item(0).name,
					type: file.item(0).type
				})
			}
			reader.onerror = function () {
				console.log(reader.error)
			}
			setFileName(e.target.files[0].name)
			setReadFile(downloadedFile)
			checkInputs()
		}
	}

	function setFiles(e) {
		if (e.target.files.length) {
			const downloadedFiles = []
			const files = e.target.files
			for (let i = 0; i < e.target.files.length; i++) {
				const reader = new FileReader()
				reader.readAsDataURL(files.item(i))
				reader.onload = function () {
					downloadedFiles.push({
						data: files.item(0),
						name: files.item(i).name,
						type: files.item(i).type
					})
				}
				reader.onerror = function () {
					console.log(reader.error)
				}
				setFilesName(prevState => {
					return [...prevState, files.item(i).name]
				})
			}
			setReadFiles(downloadedFiles)
			checkInputs()
		}
	}

	function clearInput() {
		refSingleInput.current.value = ''
		setFileName(null)
		setReadFile(null)
		checkInputs()
	}

	function deleteName(number) {

		setReadFiles(prevState => {
			const tempArr = [...prevState]
			tempArr.splice(number, 1)
			return tempArr
		})
		const listNames = [...filesName]
		listNames.splice(number, 1)
		setFilesName(listNames)
		refMultiInput.current.value = listNames.length ? refMultiInput.current.value : ''
		checkInputs()
	}

	function downloadFile(e) {
		e.target.href = readFile[0].data
		e.target.download = readFile[0].name
	}

	function downloadFiles(e, key) {
		e.target.href = readFiles[key].data
		e.target.download = readFiles[key].name
	}

	async function handleClick() {
		if (objectName) {
			setLoading(true)
			formData.append('objectName', objectName)
		}
		if (readFile) {
			setLoading(true)
			formData.append('singleFile', readFile[0].data, readFile[0].name)
		}
		if (readFiles) {
			setLoading(true)
			for (let i = 0; i < readFiles.length; i++) {
				formData.append(`singleFile_${i + 1}`, readFiles[i].data, readFiles[i].name)
			}
		}
		if (formFilled) {
			let response = await fetch('http://localhost:3001/upload', {
				method: 'POST',
				mode: 'cors',
				body: formData
			})
			if (response.ok) {
				setLoading(false)
				clearForm()
			}
		}
	}

	function clearForm() {
		refTextInput.current.value = ''
		refMultiInput.current.value = ''
		refSingleInput.current.value = ''
		setLoading(false)
		setFormFilled(false)
		setObjectName(null)
		setFileName(null)
		setFilesName([])
		setReadFiles(null)
		setReadFile(null)
	}

	return (
		<div className={styles.FormBox}>
			<label className={styles.InputLabel} onChange={(e) => {
				setObjectName(e.target.value);
				setFormFilled(true)
			}}>Введите название карточки
				<input ref={refTextInput} type='text' className={styles.NameField} />
			</label>
			<div className={styles.InputsBox}>
				<div className={styles.ContentTop} style={{ justifyContent: 'center' }}>
					<div>
						{!fileName && <p className={styles.PlaceHolder}>Нажмите на скрепку, для выбора файла</p>}
						<a href='#' className={styles.SingleName} onClick={(e) => downloadFile(e)}>{fileName}</a>
						{fileName && <span className={styles.Crest} onClick={() => clearInput()}>x</span>}
					</div>
					<Tooltip title='Предполагается добавление одного файла' TransitionComponent={Zoom} placement="right">
						<label className={styles.FileLabel} onChange={(e) => setFile(e)}>
							<img src={clip} alt='clip' className={styles.Clip} />
							<input ref={refSingleInput} name='singleFile' type='file' className={styles.FileInput} />
						</label>
					</Tooltip>
				</div>
				<div className={styles.ContentBottom}>
					<ul className={styles.NamesList}>
						{!filesName.length &&
							<li className={styles.PlaceHolder} style={{ margin: '24px 0 0 0' }}>Нажмите на скрепку, для выбора файлов</li>}
						{filesName.map((item, i) =>
							<li key={i}>
								<div>
									<a href='#' className={styles.SingleName} onClick={(e) => { downloadFiles(e, i) }}>{item}
										{i !== filesName.length - 1 && <span className={styles.Symbol}>;</span>}</a>
									<span className={styles.Crest} onClick={() => deleteName(i)}>x</span>
								</div>
							</li>
						)}
					</ul>
					<Tooltip title='Предполагается добавление нескольких файлов' TransitionComponent={Zoom} placement="right">
						<label className={styles.FileLabel} onChange={(e) => setFiles(e)}>
							<img src={clip} alt='clip' className={styles.Clip} />
							<input ref={refMultiInput} name='multiFile' type='file' multiple className={styles.FileInput} />
						</label>
					</Tooltip>
				</div>
				<LoadingButton
					onClick={handleClick}
					loading={loading}
					loadingIndicator="Loading…"
					variant="contained"
					disabled={!formFilled}
				>
					Загрузить данные
				</LoadingButton>
			</div>
		</div>
	)
}
