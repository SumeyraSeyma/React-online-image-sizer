import React,{useState,useEffect,useRef} from 'react'
import './Uploader.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaDownload } from 'react-icons/fa';
import { FaUpload } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { useDropzone } from 'react-dropzone';


function Uploader() {
    const [image,setImage] = useState(null)
    const [fileName,setFileName] = useState('No selected file')
    const [Nwidth,setNwidth] = useState('')
    const [Nheight,setNheight] = useState('')
    const [isDisabled,setIsDisabled] = useState(false)
    const [isDownDisabled,setIsDownDisabled] = useState(false)
    const [isShaking, setIsShaking] = useState(false);

    const canvasRef = useRef(null); // Canvas referansı oluşturuldu

    // Resim yüklendiğinde canvas'a çizme işlemini gerçekleştiren useEffect
    useEffect(() => {
        if (image) {
            const canvas = canvasRef.current;
            if (canvas) {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = image;

            img.onload = () => {
            // Orijinal resim boyutları
            const originalWidth = img.width;
            const originalHeight = img.height;
            console.log(`Previous Size : ${originalWidth} x ${originalHeight}`);
            
            //orijiinal resim
            canvas.width = originalWidth;
            canvas.height = originalHeight;
            ctx.drawImage(img, 0, 0, originalWidth, originalHeight);

            };
        }
    }
        
    }, [image]);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if(file){
            if(file.type.startsWith('image/')){
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImage(e.target.result);
                    setFileName(file.name);
                    setIsDisabled(true);
                    setIsDownDisabled(true);

                    toast.success('Image uploaded successfully!', {
                        position: 'bottom-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                };
                reader.readAsDataURL(file);
            }else{
                toast.error('Invalid file type. Please select an image file.', {
                    position: 'bottom-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setFileName('No selected file');
                setIsDisabled(false);
                setImage(null);
            }
        }
    };

    const {getRootProps, getInputProps} = useDropzone({onDrop});    


    const handleDelete = () => {
        if (image) {
            setIsShaking(true); // Sınıfı ekle

            setTimeout(() => {
            setIsShaking(false); // Sınıfı kaldır
        }, 500);

            setImage(null);
            setFileName('No selected file');
            setIsDisabled(false);
            setIsDownDisabled(false);

            // Canvas'ı temizlemek için
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                toast.warn('Image deleted successfully!', {
                    position: 'bottom-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } else {
            setIsDisabled(true);
            toast.error('No file selected to delete', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const downloadImage = () => {
        const canvas = canvasRef.current; 
        if (canvas && canvas.Nwidth > 0 && canvas.Nheight > 0) {
            console.log(`Next Size : ${canvas.Nwidth} x ${canvas.Nheight}`);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${fileName}-resized.png`;
            link.click();

            toast.success('Image downloaded successfully!', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,}); 
        } else{
            setIsDownDisabled(true);
            toast.error('No image available to download', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const resizeFunc = () => {
        if (image) {
            if (Nwidth > 0 && Nheight > 0) {
                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    img.src = image;

                    img.onload = () => {

                        // Canvas boyutlarını ayarla
                        canvas.width = Nwidth;
                        canvas.height = Nheight;
            
                        // Resmi canvas'a çiz
                        ctx.drawImage(img, 0, 0, Nwidth, Nheight) ;
                        console.log(`Next Size : ${Nwidth} x ${Nheight}`);

                        toast.success('Image resized successfully!', {
                            position: 'bottom-right',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    };
                        
                }
                
            }
        }
    };

    const resetFunc = (e) => {
        setNheight("");
        setNwidth("");
        e.preventDefault();
    };



  return (
    <main className="flex flex-col items-center">
        <div {...getRootProps()} className='dropzone'>
            <input {...getInputProps()} />        
        {image ?(
        <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        ):(
        <>
            <FaUpload className='upload'  size={60}/>
            <p className='droppp'>Drop file or click select file</p>
        </>
        )}

        </div>

        <section className='uploaded-row'>
            <>
            <input type = 'number' 
            className='input-width'
            value={Nwidth} 
            placeholder='Width' 
            onChange={(e) => setNwidth(e.target.value) }/>
            <input type = 'number' 
            className='input-height'
            value={Nheight} 
            placeholder='Height' 
            onChange={(e) => setNheight(e.target.value)} />
            </>
            <button className='resize-button' onClick={resizeFunc}>Resize</button>
            <button className='reset-button'onClick={resetFunc} >Reset</button>


        <FaDownload style={{cursor: !isDownDisabled ? 'not-allowed' : 'pointer',}} 
            onClick={downloadImage} size={25} disabled={!image} className="download-button"/>
            
            <span className='upload-content'>
            <>
            <FaFileImage className='fileimage' size={30}/>
            </>
                {fileName}
                <FaTrash
                className={`delete-button ${isShaking ? 'shake' : ''}`}
                id='delete-button'
                size={25}
                style={{cursor: !isDisabled ? 'not-allowed' : 'pointer',}}
                onClick={()=>handleDelete()}
                    
                />
            </span>
        </section>



    </main>
  );
}

export default Uploader