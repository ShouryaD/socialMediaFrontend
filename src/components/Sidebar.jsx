import React, { memo, useState } from 'react';
import { Button, ConfigProvider, Modal } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { set } from '@cloudinary/url-gen/actions/variable';
import '../App.css'

const Sidebar = (props) => {
    let endpoint = import.meta.env.VITE_DEPLOYMENT == 'PRODUCTION' ? import.meta.env.VITE_ENDPOINT :'http://127.0.0.1:3000'
    let [details, setDetails] = useState({
        title: '',
        description: '',
        files: ''
    })

    let [loading, setLoading] = useState(false)

    let token = useSelector((state) => state.user.token)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setDetails({
            title: '',
            description: '',
            files:''
        })
        setIsModalOpen(false);
    };



    let inputChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value })
    }

    let fileChange = async (e) => {
        let files = e.target.files
        let filesArr = [...files]
        console.log(filesArr)
        setDetails({ ...details, files: filesArr })
    }

    let handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        //method 2 using formdata and cloudinary
        let allFilesUpload = details.files && details.files.map((ele) => {
            let formData = new FormData()
            formData.append('file', ele)
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
            let res = axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, formData)
            return res
        })

        let complete = allFilesUpload ? await Promise.all(allFilesUpload) : []
        console.log(complete)
        let FinalObj = {
            ...details, files: complete
        }

        complete.forEach((ele) => {
            FinalObj[ele.data.resource_type] = ele.data.secure_url
        })
        console.log(FinalObj)

        let res1 = await axios.post(endpoint + '/posts/create', FinalObj, {
            headers: {
                'Authorization': token
            }
        })
        
        let data = res1.data
        console.log(data)
        setDetails({
            title: '',
            description: '',
            files: ''
        })
        setLoading(false)
        setIsModalOpen(false);
        props.getAll()
    }

    return (
        <div className='bg-cyan-900 h-screen p-4 mt-16'>
            <Button type="primary" onClick={showModal}>
                Create Post
            </Button>
            <Modal open={isModalOpen} onOk={handleOk} cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }} onCancel={handleCancel} className='custom-modal'>
                {loading == false ?
                    <form action="POST" className='flex flex-col bg-cyan-900'>
                        <label htmlFor="title" className='my-2 text-neutral-300'>Title</label>
                        <input type="text" name="title" id="title" className='py-2 bg-neutral-300 px-4 border rounded' value={details.title} onChange={inputChange} />
                        <label htmlFor='description' className='my-2 text-neutral-300'>Description</label>
                        <textarea name="description" id="description" className='py-2 bg-neutral-300 px-4 border rounded resize-none overflow-visible' onChange={inputChange} value={details.description}></textarea>
                        <div className='my-4 flex justify-around'>
                            <label htmlFor="files" name="files" className='my-2 p-2 w-40 text-center cursor-pointer rounded bg-blue-600 text-neutral-300 hover:bg-blue-500'>Image/Video</label>
                            <input type="file" name='files' multiple id='files' hidden onChange={fileChange} />
                            {/* <label htmlFor="video" className='my-2 p-2 w-40 text-center border cursor-pointer rounded bg-black text-white'>Upload Video</label>
                            <input type="file" name='video' id='video' hidden onChange={fileChange} /> */}
                        </div>
                        {details.files && <div className='flex gap-4 justify-center'>
                            {details.files.map((ele, key) => (
                                ele.type.split('/')[0] === 'image' ? <img className='w-40 h-40' key={key} src={URL.createObjectURL(ele)} alt='' /> : <video src={URL.createObjectURL(ele)} key={key} controls autoPlay className='w-40 h-40'></video>
                            ))}
                        </div>}
                        <button className='bg-blue-600 text-neutral-300 py-2 w-40 ms-auto rounded hover:bg-blue-500' onClick={handleSubmit}>Submit</button>
                    </form> : <img src='https://cdn.dribbble.com/users/1415337/screenshots/10781083/media/0466184625e53796cfeb7d5c5918dec8.gif' />}
            </Modal>
        </div>
    )
}

export default memo(Sidebar)