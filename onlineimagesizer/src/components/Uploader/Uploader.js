import React,{useState} from 'react'
import './Uploader.css'
import { MdCloudUpload,MdDelete } from 'react-icons/md'
import {AiFillFileImage} from 'react-icons/ai'

function Uploader() {
    const [image,setImage] = useState(null)
    const [fileName,setFileName] = useState('No selected file')

  return (
    <main>
        <form
        onClick={()=>document.querySelector('.input-field').click()}
        >
        <input type='file'
        accept='image/*' 
        className='input-field' 
        hidden
        onChange={({target:{files}})=>{
            if (files && files[0]) {
                setFileName(files[0].name);
                setImage(URL.createObjectURL(files[0]));
            }
        }}
        />
        
        {image ?(
        <img 
        src={image} 
        style={{ maxWidth: "100%", 
            maxHeight: "100%", 
            objectFit: "contain" }}  
            alt={fileName}
            />
        ):(
        <>
        <MdCloudUpload color='#1475cf' size={60}/>
        <p>Browse Files to upload</p>
        </>
        )}

        </form>

        <section className='uploaded-row'>
            <AiFillFileImage color='#1475cf' size={30}/>
            <span className='upload-content'>
                {fileName}
                <MdDelete
                size={30}
                onClick={()=>{
                    setImage(null)
                    setFileName('No selected file')
                }}
                />
            </span>
        </section>

    </main>
  );
}

export default Uploader